import React, { useState } from 'react';
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
  if (message.includes('rate limit') || message.includes('too many')) {
    return t('auth.errors.rateLimit');
  }
  if (message.includes('network') || message.includes('fetch')) {
    return t('auth.errors.network');
  }
  return t('auth.errors.generic');
}

export default function NewPassword() {
  const router = useRouter();

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function validate(): string | null {
    if (newPassword.length < 8) return t('auth.errors.passwordTooShort');
    if (newPassword.length > 128) return t('auth.errors.passwordTooLong');
    if (newPassword !== confirmPassword) return t('auth.errors.passwordsDoNotMatch');
    return null;
  }

  async function handleReset() {
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError('');

    const { error: updateError } = await supabase.auth.updateUser({ password: newPassword });

    setLoading(false);

    if (updateError) {
      setError(getMappedError(updateError.message));
      return;
    }

    router.replace('/(auth)/password-success');
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
            <Text style={styles.title}>{t('auth.newPassword.title')}</Text>
            <Text style={styles.subtitle}>{t('auth.newPassword.subtitle')}</Text>

            <View style={styles.spacer} />

            <View style={styles.passwordWrapper}>
              <Input
                placeholder={t('auth.newPassword.newPassword')}
                value={newPassword}
                onChangeText={(v) => { setNewPassword(v); setError(''); }}
                secureTextEntry={!showNew}
                style={styles.passwordInput}
              />
              <TouchableOpacity
                style={styles.eyeToggle}
                onPress={() => setShowNew((v) => !v)}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Feather
                  name={showNew ? 'eye-off' : 'eye'}
                  size={20}
                  color={Colors.textTertiary}
                />
              </TouchableOpacity>
            </View>

            <View style={styles.passwordWrapper}>
              <Input
                placeholder={t('auth.newPassword.confirmPassword')}
                value={confirmPassword}
                onChangeText={(v) => { setConfirmPassword(v); setError(''); }}
                secureTextEntry={!showConfirm}
                style={styles.passwordInput}
              />
              <TouchableOpacity
                style={styles.eyeToggle}
                onPress={() => setShowConfirm((v) => !v)}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Feather
                  name={showConfirm ? 'eye-off' : 'eye'}
                  size={20}
                  color={Colors.textTertiary}
                />
              </TouchableOpacity>
            </View>

            {error !== '' && <Text style={styles.error}>{error}</Text>}

            <Button
              label={t('auth.newPassword.cta')}
              onPress={handleReset}
              variant="primary"
              loading={loading}
              style={styles.submitButton}
            />
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
  },
  submitButton: {
    marginTop: 4,
  },
});
