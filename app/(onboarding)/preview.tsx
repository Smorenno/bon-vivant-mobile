import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import CityImage from '@/components/ui/CityImage';
import Button from '@/components/ui/Button';
import FeatureRow from '@/components/ui/FeatureRow';
import PaginationDots from '@/components/ui/PaginationDots';
import { t } from '@/constants/i18n';
import { Colors } from '@/constants/colors';
import { Spacing } from '@/constants/spacing';
import { storage } from '@/services/storage';
import { useAuthStore } from '@/stores/authStore';

const CITY_COLORS: Record<string, string> = {
  barcelona: '#C8860A',
  nassau: '#0F6E8C',
  athens: '#8B4513',
  yokohama: '#1D9E75',
  rio: '#D85A30',
};

const CITY_NAMES: Record<string, string> = {
  barcelona: 'Barcelona',
  nassau: 'Nassau',
  athens: 'Athens',
  yokohama: 'Yokohama',
  rio: 'Rio de Janeiro',
};

const CITY_QUOTES: Record<string, string> = {
  barcelona:
    '"My favorite port in the Mediterranean. 20 years and I still find new corners."',
  yokohama: '"There is something I would come back for every time — the Motomachi market."',
  rio: '"The energy of this city is unlike anything else I\'ve seen in 20 years at sea."',
  nassau: '"Forget the tourist strip — the real Nassau is ten minutes away."',
  athens: '"Athens rewards the curious. Get lost on purpose."',
};

export default function Preview() {
  const router = useRouter();
  const setGuest = useAuthStore((s) => s.setGuest);
  const [citySlug, setCitySlug] = useState<string>('barcelona');

  useEffect(() => {
    storage.getSelectedCity().then((slug) => {
      if (slug) setCitySlug(slug);
    });
  }, []);

  const cityName = CITY_NAMES[citySlug] ?? citySlug;
  const placeholderColor = CITY_COLORS[citySlug] ?? '#2C3E6B';
  const quote = CITY_QUOTES[citySlug] ?? '';

  return (
    <View style={styles.root}>
      {/* Back button floats above the hero image */}
      <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
        <Feather name="chevron-left" size={22} color={Colors.white} />
      </TouchableOpacity>

      <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
        {/* Hero: city photo with name + Manuel quote overlaid */}
        <View style={styles.hero}>
          <CityImage placeholderColor={placeholderColor} style={StyleSheet.absoluteFillObject} />
          <View style={styles.heroGradient} />
          <View style={styles.heroContent}>
            <Text style={styles.heroCity}>{cityName}</Text>
            {quote !== '' && (
              <Text style={styles.heroQuote}>{quote}</Text>
            )}
          </View>
        </View>

        <View style={styles.body}>
          <Text style={styles.sectionTitle}>{t('onboarding.preview.sectionTitle')}</Text>

          <FeatureRow
            icon="map"
            title={t('onboarding.preview.feature1Title')}
            description={t('onboarding.preview.feature1Desc')}
            iconBg={Colors.navy}
          />
          <FeatureRow
            icon="star"
            title={t('onboarding.preview.feature2Title')}
            description={t('onboarding.preview.feature2Desc')}
            iconBg={Colors.navy}
          />
          <FeatureRow
            icon="message-circle"
            title={t('onboarding.preview.feature3Title')}
            description={t('onboarding.preview.feature3Desc')}
            iconBg={Colors.navy}
          />
          <FeatureRow
            icon="navigation"
            title={t('onboarding.preview.feature4Title')}
            description={t('onboarding.preview.feature4Desc')}
            iconBg={Colors.navy}
          />
        </View>
      </ScrollView>

      {/* Fixed bottom CTA */}
      <SafeAreaView edges={['bottom']} style={styles.bottomSafe}>
        <View style={styles.bottom}>
          <Button
            label={t('onboarding.preview.cta')}
            onPress={() => router.push('/(auth)/register')}
            variant="primary"
          />
          <View style={styles.dotsRow}>
            <PaginationDots total={3} current={2} />
          </View>
          <Text style={styles.saveText}>{t('onboarding.preview.saveProgress')}</Text>
          <TouchableOpacity
            onPress={async () => {
              await storage.setGuestMode();
              setGuest(true);
              router.replace('/(app)');
            }}
          >
            <Text style={styles.skipText}>{t('onboarding.preview.skip')}</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.bgCard,
  },
  backBtn: {
    position: 'absolute',
    top: 56,
    left: Spacing.screenHorizontal,
    zIndex: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.navy,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hero: {
    height: 280,
    width: '100%',
  },
  heroGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '75%',
    // gradient-like fade from transparent to dark
    backgroundColor: 'rgba(27,30,60,0.72)',
  },
  heroContent: {
    position: 'absolute',
    bottom: Spacing.xl,
    left: Spacing.screenHorizontal,
    right: Spacing.screenHorizontal,
  },
  heroCity: {
    fontSize: 36,
    fontWeight: '800',
    color: Colors.white,
    lineHeight: 42,
    marginBottom: Spacing.sm,
  },
  heroQuote: {
    fontSize: 13,
    fontStyle: 'italic',
    color: 'rgba(255,255,255,0.85)',
    lineHeight: 19,
  },
  body: {
    paddingHorizontal: Spacing.screenHorizontal,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.sm,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: Spacing.lg,
  },
  bottomSafe: {
    backgroundColor: Colors.bgCard,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  bottom: {
    paddingHorizontal: Spacing.screenHorizontal,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.md,
    gap: Spacing.sm,
  },
  dotsRow: {
    alignItems: 'center',
  },
  saveText: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  skipText: {
    fontSize: 13,
    color: Colors.textSecondary,
    textAlign: 'center',
    paddingBottom: Spacing.xs,
  },
});
