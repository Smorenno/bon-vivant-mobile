import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import Button from '@/components/ui/Button';
import PaginationDots from '@/components/ui/PaginationDots';
import { t } from '@/constants/i18n';
import { Colors } from '@/constants/colors';
import { storage } from '@/services/storage';

const CITY_NAMES: Record<string, string> = {
  barcelona: 'Barcelona',
  nassau: 'Nassau',
  athens: 'Athens',
  yokohama: 'Yokohama',
  rio: 'Rio de Janeiro',
};

export default function Success() {
  const router = useRouter();
  const [cityName, setCityName] = useState('');

  useEffect(() => {
    storage.getSelectedCity().then((slug) => {
      if (slug) setCityName(CITY_NAMES[slug] ?? slug);
    });
  }, []);

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.container}>
        <View style={styles.check}>
          <Feather name="check" size={36} color="#FFFFFF" />
        </View>
        <Text style={styles.title}>{t('onboarding.success.title')}</Text>
        <Text style={styles.subtitle}>
          {t('onboarding.success.subtitle', { city: cityName })}
        </Text>
        <View style={styles.dots}>
          <PaginationDots total={4} current={3} />
        </View>
        <Button
          label={t('onboarding.success.done')}
          onPress={() => router.replace('/(app)')}
          variant="primary"
          style={styles.button}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  check: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: Colors.text,
    marginTop: 24,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 24,
  },
  dots: {
    marginTop: 32,
  },
  button: {
    marginTop: 32,
    width: '100%',
  },
});
