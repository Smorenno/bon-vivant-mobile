import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import PaginationDots from '@/components/ui/PaginationDots';
import { t } from '@/constants/i18n';

export default function PasswordSuccess() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/(app)');
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.container}>
        <View style={styles.checkCircle}>
          <Feather name="check" size={36} color="#FFFFFF" />
        </View>

        <Text style={styles.title}>{t('auth.passwordSuccess.title')}</Text>
        <Text style={styles.subtitle}>{t('auth.passwordSuccess.subtitle')}</Text>
        <Text style={styles.redirecting}>{t('auth.passwordSuccess.redirecting')}</Text>

        <View style={styles.dots}>
          <PaginationDots total={2} current={1} activeColor="#FFFFFF" inactiveColor="rgba(255,255,255,0.35)" />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#1E2340',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    gap: 12,
  },
  checkCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#1D9E75',
    textAlign: 'center',
  },
  redirecting: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.5)',
    textAlign: 'center',
    marginTop: 4,
  },
  dots: {
    marginTop: 32,
  },
});
