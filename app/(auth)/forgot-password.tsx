import React, { useRef, useState } from 'react';
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
import { supabase } from '@/services/supabase';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { t } from '@/constants/i18n';
import { Colors } from '@/constants/colors';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ForgotPassword() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const lastAttemptTime = useRef<number>(0);

  async function handleReset() {
    if (!emailRegex.test(email.trim().toLowerCase())) {
      setError(t('auth.errors.invalidEmail'));
      return;
    }

    const now = Date.now();
    if (now - lastAttemptTime.current < 3000) return;
    lastAttemptTime.current = now;

    setLoading(true);
    setError('');

    // Fire and forget — never expose whether user exists
    await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase());

    setLoading(false);
    // Always show success — never show error
    setSuccess(true);
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
            <Text style={styles.title}>{t('auth.forgotPassword.title')}</Text>
            <Text style={styles.subtitle}>{t('auth.forgotPassword.subtitle')}</Text>

            <View style={styles.spacer} />

            {success ? (
              <View style={styles.successBox}>
                <Text style={styles.successText}>{t('auth.errors.resetSent')}</Text>
              </View>
            ) : (
              <>
                <Input
                  placeholder={t('auth.forgotPassword.emailPlaceholder')}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  style={styles.input}
                />
                {error !== '' && <Text style={styles.error}>{error}</Text>}
                <Button
                  label={t('auth.forgotPassword.cta')}
                  onPress={handleReset}
                  variant="primary"
                  loading={loading}
                  style={styles.submitButton}
                />
              </>
            )}

            <TouchableOpacity style={styles.backLink} onPress={() => router.back()}>
              <Text style={styles.backLinkText}>{t('auth.forgotPassword.backToLogin')}</Text>
            </TouchableOpacity>
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
  successBox: {
    backgroundColor: '#F0FDF4',
    borderRadius: 10,
    padding: 16,
    marginBottom: 20,
  },
  successText: {
    fontSize: 14,
    color: '#166534',
    lineHeight: 20,
  },
  backLink: {
    alignItems: 'center',
    marginTop: 8,
  },
  backLinkText: {
    fontSize: 14,
    color: Colors.textSecondary,
    textDecorationLine: 'underline',
  },
});
