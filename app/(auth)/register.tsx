import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { supabase } from '@/services/supabase';
import { useAuthStore } from '@/stores/authStore';
import { storage } from '@/services/storage';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { t } from '@/constants/i18n';
import { Colors } from '@/constants/colors';

function AppleIcon() {
  return <Text style={styles.appleIcon}></Text>;
}

function GoogleIcon() {
  return <Text style={styles.googleIcon}>G</Text>;
}

function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function Register() {
  const router = useRouter();
  const setSession = useAuthStore((s) => s.setSession);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [cityName, setCityName] = useState('');

  useEffect(() => {
    storage.getSelectedCity().then((slug) => {
      if (slug) {
        const names: Record<string, string> = {
          barcelona: 'Barcelona',
          nassau: 'Nassau',
          athens: 'Athens',
          yokohama: 'Yokohama',
          rio: 'Rio de Janeiro',
        };
        setCityName(names[slug] ?? slug);
      }
    });
  }, []);

  async function handleCreateAccount() {
    setError('');
    if (!validateEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    try {
      const { data, error: signUpError } = await supabase.auth.signUp({ email, password });
      if (signUpError) {
        setError(signUpError.message);
        return;
      }
      if (data.session) {
        setSession(data.session);
      }
      router.replace('/(onboarding)/success');
    } catch {
      setError(t('common.error'));
    } finally {
      setLoading(false);
    }
  }

  async function handleApple() {
    const { data, error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: 'apple',
      options: { redirectTo: 'bonvivant://callback', skipBrowserRedirect: true },
    });
    if (oauthError) { setError(oauthError.message); return; }
    if (data.url) await Linking.openURL(data.url);
  }

  async function handleGoogle() {
    const { data, error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: 'bonvivant://callback', skipBrowserRedirect: true },
    });
    if (oauthError) { setError(oauthError.message); return; }
    if (data.url) await Linking.openURL(data.url);
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.container}>
            <Text style={styles.title}>{t('onboarding.register.title')}</Text>
            <Text style={styles.subtitle}>
              {t('onboarding.register.subtitle', { city: cityName })}
            </Text>

            <View style={styles.spacer} />

            <Button
              label={t('onboarding.register.continueApple')}
              onPress={handleApple}
              variant="primary"
              icon={<AppleIcon />}
              style={styles.socialButton}
            />
            <Button
              label={t('onboarding.register.continueGoogle')}
              onPress={handleGoogle}
              variant="secondary"
              icon={<GoogleIcon />}
              style={styles.socialButton}
            />

            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>{t('onboarding.register.or')}</Text>
              <View style={styles.dividerLine} />
            </View>

            <Input
              placeholder={t('onboarding.register.emailPlaceholder')}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              style={styles.input}
            />
            <Input
              placeholder={t('onboarding.register.passwordPlaceholder')}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              style={styles.input}
            />

            {error !== '' && <Text style={styles.error}>{error}</Text>}

            <Button
              label={t('onboarding.register.cta')}
              onPress={handleCreateAccount}
              variant="primary"
              loading={loading}
              style={styles.submitButton}
            />

            <View style={styles.loginRow}>
              <Text style={styles.loginText}>{t('onboarding.register.hasAccount')} </Text>
              <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
                <Text style={styles.loginLink}>{t('onboarding.register.login')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>

        <TouchableOpacity
          style={styles.skipWrapper}
          onPress={() => router.replace('/(app)')}
        >
          <Text style={styles.skipText}>{t('onboarding.register.skip')}</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  flex: {
    flex: 1,
  },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  container: {
    flex: 1,
    paddingTop: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  spacer: {
    height: 28,
  },
  socialButton: {
    marginBottom: 12,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.border,
  },
  dividerText: {
    marginHorizontal: 12,
    fontSize: 14,
    color: Colors.textSecondary,
  },
  input: {
    marginBottom: 12,
  },
  error: {
    fontSize: 13,
    color: Colors.error,
    marginBottom: 12,
    marginTop: -4,
  },
  submitButton: {
    marginTop: 4,
    marginBottom: 20,
  },
  loginRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  loginLink: {
    fontSize: 14,
    color: Colors.text,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  skipWrapper: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  skipText: {
    fontSize: 13,
    color: Colors.textTertiary,
    textAlign: 'center',
  },
  appleIcon: {
    color: '#FFFFFF',
    fontSize: 18,
    lineHeight: 22,
  },
  googleIcon: {
    color: '#4285F4',
    fontSize: 18,
    fontWeight: '700',
  },
});
