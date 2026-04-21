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

export default function ValueProps() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.container}>
        <TouchableOpacity style={styles.back} onPress={() => router.back()}>
          <Feather name="arrow-left" size={24} color={Colors.primary} />
        </TouchableOpacity>

        <Text style={styles.label}>{t('onboarding.valueProps.label')}</Text>
        <Text style={styles.title}>{t('onboarding.valueProps.title')}</Text>
        <Text style={styles.subtitle}>{t('onboarding.valueProps.subtitle')}</Text>

        <View style={styles.features}>
          <FeatureRow
            icon="list"
            title={t('onboarding.valueProps.feature1Title')}
            description={t('onboarding.valueProps.feature1Desc')}
          />
          <FeatureRow
            icon="clock"
            title={t('onboarding.valueProps.feature2Title')}
            description={t('onboarding.valueProps.feature2Desc')}
          />
          <FeatureRow
            icon="download-cloud"
            title={t('onboarding.valueProps.feature3Title')}
            description={t('onboarding.valueProps.feature3Desc')}
          />
        </View>

        <View style={styles.spacer} />

        <View style={styles.bottom}>
          <Button
            label={t('onboarding.valueProps.cta')}
            onPress={() => router.push('/(onboarding)/pick-city')}
            variant="primary"
            iconRight={<Feather name="arrow-right" size={18} color="#FFFFFF" />}
          />
          <View style={styles.dots}>
            <PaginationDots total={4} current={1} />
          </View>
        </View>
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
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 16,
  },
  back: {
    marginBottom: 24,
    alignSelf: 'flex-start',
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.teal,
    letterSpacing: 1,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 15,
    color: Colors.textSecondary,
    lineHeight: 22,
    marginBottom: 32,
  },
  features: {
    flex: 0,
  },
  spacer: {
    flex: 1,
  },
  bottom: {
    gap: 16,
    marginBottom: 0,
  },
  dots: {
    alignItems: 'center',
  },
});
