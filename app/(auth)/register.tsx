import React, { useEffect, useRef, useState } from 'react';
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
import { Feather } from '@expo/vector-icons';
import { supabase } from '@/services/supabase';
import { storage } from '@/services/storage';
import { useAuthStore } from '@/stores/authStore';
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

function getMappedError(message: string): string {
  if (message.includes('already registered') || message.includes('already exists')) {
    return t('auth.errors.generic');
  }
  if (message.includes('password') && message.includes('weak')) {
    return t('auth.errors.passwordWeak');
  }
  if (message.includes('rate limit') || message.includes('too many')) {
    return t('auth.errors.rateLimit');
  }
  if (message.includes('network') || message.includes('fetch')) {
    return t('auth.errors.network');
  }
  return t('auth.errors.generic');
}

export default function Register() {
  const router = useRouter();
  const setGuest = useAuthStore((s) => s.setGuest);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [cityName, setCityName] = useState('');
  const lastAttemptTime = useRef<number>(0);

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

  useEffect(() => {
    return () => {
      setError('');
    };
  }, []);

  function validateForm(): string | null {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim().toLowerCase())) {
      return t('auth.errors.invalidEmail');
    }
    if (password.length < 8) {
      return t('auth.errors.passwordTooShort');
    }
    if (password.length > 128) {
      return t('auth.errors.passwordTooLong');
    }
    return null;
  }

  async function handleRegister() {
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    const now = Date.now();
    if (now - lastAttemptTime.current < 2000) return;
    lastAttemptTime.current = now;

    setLoading(true);
    setError('');

    const { data, error: signUpError } = await supabase.auth.signUp({
      email: email.trim().toLowerCase(),
      password,
    });

    setLoading(false);

    if (signUpError) {
      setError(getMappedError(signUpError.message));
      return;
    }

    if (data.session) {
      await storage.clearGuestMode();
      setGuest(false);
      router.replace('/(app)');
      return;
    }

    // No session = email confirmation pending
    setError(t('auth.errors.confirmEmail'));
  }

  async function handleApple() {
    const { data, error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: 'apple',
      options: { redirectTo: 'bonvivant://callback', skipBrowserRedirect: true },
    });
    if (oauthError) { setError(getMappedError(oauthError.message)); return; }
    if (data.url) await Linking.openURL(data.url);
  }

  async function handleGoogle() {
    const { data, error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: 'bonvivant://callback', skipBrowserRedirect: true },
    });
    if (oauthError) { setError(getMappedError(oauthError.message)); return; }
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
            <View style={styles.passwordWrapper}>
              <Input
                placeholder={t('onboarding.register.passwordPlaceholder')}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                style={styles.passwordInput}
              />
              <TouchableOpacity
                style={styles.eyeToggle}
                onPress={() => setShowPassword((v) => !v)}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Feather
                  name={showPassword ? 'eye-off' : 'eye'}
                  size={20}
                  color={Colors.textTertiary}
                />
              </TouchableOpacity>
            </View>

            {error !== '' && <Text style={styles.error}>{error}</Text>}

            <Button
              label={t('onboarding.register.cta')}
              onPress={handleRegister}
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
          onPress={async () => {
            await storage.setGuestMode();
            setGuest(true);
            router.replace('/(app)');
          }}
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
  passwordWrapper: {
    position: 'relative',
    marginBottom: 12,
  },
  passwordInput: {
    paddingRight: 48,
  },
  eyeToggle: {
    position: 'absolute',
    right: 16,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
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
