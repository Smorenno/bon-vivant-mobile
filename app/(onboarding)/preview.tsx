import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import CityImage from '@/components/ui/CityImage';
import Button from '@/components/ui/Button';
import FeatureRow from '@/components/ui/FeatureRow';
import { t } from '@/constants/i18n';
import { Colors } from '@/constants/colors';
import { storage } from '@/services/storage';

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

const CITY_COUNTRIES: Record<string, string> = {
  barcelona: 'Spain · Mediterranean',
  nassau: 'Bahamas · Atlantic',
  athens: 'Greece · Mediterranean',
  yokohama: 'Japan · Pacific',
  rio: 'Brazil · Atlantic',
};

export default function Preview() {
  const router = useRouter();
  const [citySlug, setCitySlug] = useState<string>('barcelona');

  useEffect(() => {
    storage.getSelectedCity().then((slug) => {
      if (slug) setCitySlug(slug);
    });
  }, []);

  const cityName = CITY_NAMES[citySlug] ?? citySlug;
  const placeholderColor = CITY_COLORS[citySlug] ?? '#2C3E6B';
  const country = CITY_COUNTRIES[citySlug] ?? '';

  return (
    <View style={styles.root}>
      <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
        <Feather name="arrow-left" size={24} color="#FFFFFF" />
      </TouchableOpacity>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <CityImage placeholderColor={placeholderColor} style={styles.heroImage} />
          <View style={styles.heroOverlay} />
          <View style={styles.heroContent}>
            <Text style={styles.heroCity}>{cityName}</Text>
            <Text style={styles.heroCountry}>{country}</Text>
            <Text style={styles.heroRating}>
              ★ 4.9 (128 {t('onboarding.preview.reviews')})
            </Text>
          </View>
        </View>

        <View style={styles.body}>
          <Text style={styles.sectionTitle}>{t('onboarding.preview.sectionTitle')}</Text>
          <FeatureRow
            icon="map"
            title={t('onboarding.preview.feature1Title')}
            description={t('onboarding.preview.feature1Desc')}
          />
          <FeatureRow
            icon="star"
            title={t('onboarding.preview.feature2Title')}
            description={t('onboarding.preview.feature2Desc')}
          />
          <FeatureRow
            icon="message-circle"
            title={t('onboarding.preview.feature3Title')}
            description={t('onboarding.preview.feature3Desc')}
          />
          <FeatureRow
            icon="navigation"
            title={t('onboarding.preview.feature4Title')}
            description={t('onboarding.preview.feature4Desc')}
          />
        </View>
      </ScrollView>

      <SafeAreaView edges={['bottom']} style={styles.bottomSafe}>
        <View style={styles.bottom}>
          <Button
            label={t('onboarding.preview.cta')}
            onPress={() => router.push('/(auth)/register')}
            variant="primary"
          />
          <Text style={styles.saveText}>{t('onboarding.preview.saveProgress')}</Text>
          <TouchableOpacity onPress={() => router.replace('/(app)')}>
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
    backgroundColor: Colors.background,
  },
  backBtn: {
    position: 'absolute',
    top: 56,
    left: 20,
    zIndex: 10,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  hero: {
    height: 220,
    width: '100%',
  },
  heroImage: {
    ...StyleSheet.absoluteFillObject,
  },
  heroOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '60%',
    backgroundColor: 'rgba(0,0,0,0.55)',
  },
  heroContent: {
    position: 'absolute',
    bottom: 16,
    left: 20,
  },
  heroCity: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  heroCountry: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
  heroRating: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.9)',
    marginTop: 4,
  },
  body: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 8,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 16,
  },
  bottomSafe: {
    backgroundColor: Colors.background,
  },
  bottom: {
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  saveText: {
    fontSize: 12,
    color: Colors.textTertiary,
    textAlign: 'center',
    marginTop: 8,
  },
  skipText: {
    fontSize: 13,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 12,
    paddingBottom: 4,
  },
});
