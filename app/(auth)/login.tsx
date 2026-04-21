import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { supabase } from '@/services/supabase';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { t } from '@/constants/i18n';
import { Colors } from '@/constants/colors';

function getMappedError(message: string): string {
  if (
    message.includes('Invalid login') ||
    message.includes('invalid credentials') ||
    message.includes('Email not confirmed') ||
    message.includes('User not found')
  ) {
    // All map to same message — prevents user enumeration
    return t('auth.errors.invalidCredentials');
  }
  if (message.includes('rate limit') || message.includes('too many')) {
    return t('auth.errors.rateLimit');
  }
  if (message.includes('network') || message.includes('fetch')) {
    return t('auth.errors.network');
  }
  return t('auth.errors.generic');
}

export default function Login() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const lastAttemptTime = useRef<number>(0);

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

  async function handleLogin() {
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

    const { error: loginError } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });

    setLoading(false);

    if (loginError) {
      setError(getMappedError(loginError.message));
      return;
    }

    router.replace('/(app)');
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
            <Text style={styles.title}>{t('auth.login.title')}</Text>
            <Text style={styles.subtitle}>{t('auth.login.subtitle')}</Text>

            <View style={styles.spacer} />

            <Input
              placeholder={t('auth.login.emailPlaceholder')}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              style={styles.input}
            />
            <View style={styles.passwordWrapper}>
              <Input
                placeholder={t('auth.login.passwordPlaceholder')}
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

            <TouchableOpacity
              style={styles.forgotPassword}
              onPress={() => router.push('/(auth)/forgot-password')}
            >
              <Text style={styles.forgotPasswordText}>{t('auth.login.forgotPassword')}</Text>
            </TouchableOpacity>

            {error !== '' && <Text style={styles.error}>{error}</Text>}

            <Button
              label={t('auth.login.cta')}
              onPress={handleLogin}
              variant="primary"
              loading={loading}
              style={styles.submitButton}
            />

            <View style={styles.registerRow}>
              <Text style={styles.registerText}>{t('auth.login.noAccount')} </Text>
              <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
                <Text style={styles.registerLink}>{t('auth.login.register')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
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
  input: {
    marginBottom: 12,
  },
  passwordWrapper: {
    position: 'relative',
    marginBottom: 8,
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
  forgotPassword: {
    alignSelf: 'flex-end',
    marginTop: 4,
    marginBottom: 16,
  },
  forgotPasswordText: {
    fontSize: 13,
    color: Colors.textSecondary,
    textDecorationLine: 'underline',
  },
  error: {
    fontSize: 13,
    color: Colors.error,
    marginBottom: 12,
  },
  submitButton: {
    marginTop: 4,
    marginBottom: 20,
  },
  registerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  registerText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  registerLink: {
    fontSize: 14,
    color: Colors.text,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});
