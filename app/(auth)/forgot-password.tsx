import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
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
const OTP_LENGTH = 6;
const MAX_RESEND_ATTEMPTS = 3;
const RESEND_COOLDOWN_MS = 3000;

export default function ForgotPassword() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  const [resendCount, setResendCount] = useState(0);

  const inputRefs = useRef<Array<TextInput | null>>(Array(OTP_LENGTH).fill(null));
  const lastSendTime = useRef<number>(0);

  async function handleSendCode() {
    if (!emailRegex.test(email.trim().toLowerCase())) {
      setError(t('auth.errors.invalidEmail'));
      return;
    }

    if (resendCount >= MAX_RESEND_ATTEMPTS) {
      setError(t('auth.errors.tooManyAttempts'));
      return;
    }

    const now = Date.now();
    if (now - lastSendTime.current < RESEND_COOLDOWN_MS) return;
    lastSendTime.current = now;

    setLoading(true);
    setError('');

    // Fire and forget — never expose whether user exists
    await supabase.auth.signInWithOtp({ email: email.trim().toLowerCase() });

    setLoading(false);
    setCodeSent(true);
    setResendCount((c) => c + 1);
    setOtp(Array(OTP_LENGTH).fill(''));
  }

  async function verifyCode(code: string) {
    setVerifying(true);
    setError('');

    const { error: verifyError } = await supabase.auth.verifyOtp({
      email: email.trim().toLowerCase(),
      token: code,
      type: 'email',
    });

    setVerifying(false);

    if (verifyError) {
      setError(t('auth.errors.invalidCode'));
      setOtp(Array(OTP_LENGTH).fill(''));
      inputRefs.current[0]?.focus();
      return;
    }

    router.push('/(auth)/new-password');
  }

  function handleOtpChange(text: string, index: number) {
    // Accept only single numeric digit
    const digit = text.replace(/[^0-9]/g, '').slice(-1);
    const newOtp = [...otp];
    newOtp[index] = digit;
    setOtp(newOtp);

    if (digit && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-verify when all 6 digits are filled
    if (digit && index === OTP_LENGTH - 1) {
      const code = [...newOtp.slice(0, OTP_LENGTH - 1), digit].join('');
      if (code.length === OTP_LENGTH && !code.includes('')) {
        verifyCode(code);
      }
    }
  }

  function handleOtpKeyPress(key: string, index: number) {
    if (key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  }

  const otpComplete = otp.every((d) => d !== '');

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

            <Input
              placeholder={t('auth.forgotPassword.emailPlaceholder')}
              value={email}
              onChangeText={(v) => { setEmail(v); setError(''); }}
              keyboardType="email-address"
              autoCapitalize="none"
              style={styles.input}
              editable={!codeSent}
            />

            <View style={styles.otpRow}>
              {Array.from({ length: OTP_LENGTH }).map((_, i) => (
                <TextInput
                  key={i}
                  ref={(ref) => { inputRefs.current[i] = ref; }}
                  style={[
                    styles.otpBox,
                    focusedIndex === i && styles.otpBoxFocused,
                    otp[i] !== '' && styles.otpBoxFilled,
                  ]}
                  value={otp[i]}
                  onChangeText={(text) => handleOtpChange(text, i)}
                  onKeyPress={({ nativeEvent }) => handleOtpKeyPress(nativeEvent.key, i)}
                  onFocus={() => setFocusedIndex(i)}
                  onBlur={() => setFocusedIndex(null)}
                  keyboardType="number-pad"
                  maxLength={1}
                  textAlign="center"
                  selectTextOnFocus
                  editable={codeSent && !verifying}
                  contextMenuHidden
                />
              ))}
            </View>

            {error !== '' && <Text style={styles.error}>{error}</Text>}

            <Button
              label={codeSent ? t('auth.forgotPassword.resendCode') : t('auth.forgotPassword.sendCode')}
              onPress={handleSendCode}
              variant="primary"
              loading={loading || verifying}
              style={styles.submitButton}
            />

            {codeSent && (
              <View style={styles.resendRow}>
                <Text style={styles.resendText}>{t('auth.forgotPassword.didNotReceive')} • </Text>
                <TouchableOpacity onPress={handleSendCode}>
                  <Text style={styles.tealLink}>{t('auth.forgotPassword.resendCode')}</Text>
                </TouchableOpacity>
              </View>
            )}
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
    fontSize: 26,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: '#6B7280',
    lineHeight: 22,
  },
  spacer: {
    height: 24,
  },
  input: {
    marginBottom: 20,
  },
  otpRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    gap: 8,
  },
  otpBox: {
    flex: 1,
    height: 56,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    fontSize: 22,
    fontWeight: '600',
    color: '#111827',
    backgroundColor: Colors.background,
  },
  otpBoxFocused: {
    borderColor: '#111827',
    borderWidth: 1.5,
  },
  otpBoxFilled: {
    borderColor: '#6B7280',
  },
  error: {
    fontSize: 13,
    color: Colors.error,
    marginBottom: 12,
    marginTop: -8,
  },
  submitButton: {
    marginBottom: 16,
  },
  resendRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  resendText: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  tealLink: {
    fontSize: 13,
    color: Colors.teal,
    fontWeight: '500',
  },
});
