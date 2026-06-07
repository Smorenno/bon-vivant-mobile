import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import CityImage from '@/components/ui/CityImage';
import Button from '@/components/ui/Button';
import PaginationDots from '@/components/ui/PaginationDots';
import { t } from '@/constants/i18n';
import { Colors } from '@/constants/colors';
import { Spacing } from '@/constants/spacing';

export default function Welcome() {
  const router = useRouter();

  return (
    <View style={styles.root}>
      {/* Top: full-width photo with logo overlay */}
      <View style={styles.imageContainer}>
        <CityImage placeholderColor="#1a2744" style={StyleSheet.absoluteFillObject} />
        <View style={styles.imageOverlay} />
        <SafeAreaView edges={['top']} style={styles.logoSafe}>
          <View style={styles.logoRow}>
            <Feather name="eye" size={26} color={Colors.white} />
            <Text style={styles.brand}>BON VIVANT</Text>
          </View>
        </SafeAreaView>
      </View>

      {/* Bottom: white card with content */}
      <View style={styles.card}>
        <View style={styles.cardContent}>
          <Text style={styles.title}>{t('onboarding.welcome.title')}</Text>
          <Text style={styles.subtitle}>{t('onboarding.welcome.subtitle')}</Text>

          <View style={styles.bioBlock}>
            <Text style={styles.bio}>
              {t('onboarding.welcome.bio')}
            </Text>
            <Text style={styles.bio2}>
              {t('onboarding.welcome.bio2')}
            </Text>
          </View>

          <Button
            label={t('onboarding.welcome.cta')}
            onPress={() => router.push('/(onboarding)/value-props')}
            variant="primary"
          />

          <View style={styles.dotsRow}>
            <PaginationDots total={3} current={0} />
          </View>
        </View>
        <SafeAreaView edges={['bottom']} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.navy,
  },
  imageContainer: {
    flex: 1,
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(27,30,60,0.35)',
  },
  logoSafe: {
    paddingHorizontal: Spacing.screenHorizontal,
    paddingTop: Spacing.sm,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  brand: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.white,
    letterSpacing: 2,
  },
  // White rounded card sliding up from the bottom
  card: {
    backgroundColor: Colors.bgCard,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: Spacing.xxl,
    paddingHorizontal: Spacing.screenHorizontal,
  },
  cardContent: {
    gap: Spacing.lg,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: Colors.textPrimary,
    lineHeight: 32,
  },
  subtitle: {
    fontSize: 15,
    color: Colors.textSecondary,
    lineHeight: 22,
    marginTop: -Spacing.sm,
  },
  bioBlock: {
    gap: Spacing.sm,
    marginTop: -Spacing.xs,
  },
  bio: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 21,
  },
  bio2: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 21,
  },
  dotsRow: {
    alignItems: 'center',
    paddingBottom: Spacing.lg,
  },
});
