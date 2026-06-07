import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import Button from '@/components/ui/Button';
import FeatureRow from '@/components/ui/FeatureRow';
import PaginationDots from '@/components/ui/PaginationDots';
import { t } from '@/constants/i18n';
import { Colors } from '@/constants/colors';
import { Spacing } from '@/constants/spacing';

export default function ValueProps() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.container}>
        {/* Back button — navy circle */}
        <TouchableOpacity style={styles.back} onPress={() => router.back()}>
          <Feather name="chevron-left" size={22} color={Colors.white} />
        </TouchableOpacity>

        <Text style={styles.label}>{t('onboarding.valueProps.label')}</Text>
        <Text style={styles.title}>{t('onboarding.valueProps.title')}</Text>
        <Text style={styles.subtitle}>{t('onboarding.valueProps.subtitle')}</Text>

        <View style={styles.features}>
          <FeatureRow
            icon="list"
            title={t('onboarding.valueProps.feature1Title')}
            description={t('onboarding.valueProps.feature1Desc')}
            iconBg={Colors.navy}
          />
          <FeatureRow
            icon="clock"
            title={t('onboarding.valueProps.feature2Title')}
            description={t('onboarding.valueProps.feature2Desc')}
            iconBg={Colors.navy}
          />
          <FeatureRow
            icon="send"
            title={t('onboarding.valueProps.feature3Title')}
            description={t('onboarding.valueProps.feature3Desc')}
            iconBg={Colors.navy}
          />
        </View>

        <View style={styles.spacer} />

        <Button
          label={t('onboarding.valueProps.cta')}
          onPress={() => router.push('/(onboarding)/pick-city')}
          variant="primary"
          iconRight={<Feather name="arrow-right" size={18} color={Colors.white} />}
        />
        <View style={styles.dotsRow}>
          <PaginationDots total={3} current={1} />
        </View>
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
    paddingHorizontal: Spacing.screenHorizontal,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.lg,
  },
  back: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.navy,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xl,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.blueAccent,
    letterSpacing: 0.8,
    marginBottom: Spacing.sm,
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: Colors.textPrimary,
    lineHeight: 33,
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 21,
    marginBottom: Spacing.xxl,
  },
  features: {
    flex: 0,
  },
  spacer: {
    flex: 1,
  },
  dotsRow: {
    alignItems: 'center',
    marginTop: Spacing.lg,
  },
});
