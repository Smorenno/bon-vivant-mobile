import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import Button from '@/components/ui/Button';
import PaginationDots from '@/components/ui/PaginationDots';
import { t } from '@/constants/i18n';
import { Colors } from '@/constants/colors';
import { Spacing } from '@/constants/spacing';
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
        <View style={styles.checkCircle}>
          <Feather name="check" size={38} color={Colors.white} />
        </View>

        <Text style={styles.title}>{t('onboarding.success.title')}</Text>

        {/* Subtitle rendered in blueAccent per design */}
        <Text style={styles.subtitle}>
          {t('onboarding.success.subtitle', { city: cityName })}
        </Text>

        <View style={styles.dotsRow}>
          <PaginationDots total={3} current={2} />
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
    backgroundColor: Colors.bgCard,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.screenHorizontal,
    gap: Spacing.lg,
  },
  checkCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: Colors.navy,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: Colors.blueAccent,
    textAlign: 'center',
    lineHeight: 24,
  },
  dotsRow: {
    marginTop: Spacing.md,
  },
  button: {
    marginTop: Spacing.md,
    width: '100%',
  },
});
