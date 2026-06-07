import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import CityImage from '@/components/ui/CityImage';
import { t } from '@/constants/i18n';
import { Colors } from '@/constants/colors';
import { Spacing, Radius } from '@/constants/spacing';
import { storage } from '@/services/storage';

const CITIES = [
  {
    slug: 'barcelona',
    name: 'Barcelona',
    country: 'Spain · Mediterranean',
    quote: "My favorite port in the Mediterranean. 20 years and I still find new corners.",
    placeholderColor: '#C8860A',
  },
  {
    slug: 'yokohama',
    name: 'Yokohama',
    country: 'Japan · Pacific',
    quote: "If there is something I would eat there, it's the matcha from Motomachi's corners.",
    placeholderColor: '#1D9E75',
  },
  {
    slug: 'rio',
    name: 'Rio de Janeiro',
    country: 'Brazil · Atlantic',
    quote: "My favorite port in the Atlantic. The energy of this city is unlike anything else.",
    placeholderColor: '#D85A30',
  },
];

export default function PickCity() {
  const router = useRouter();

  async function handleSelect(slug: string) {
    await storage.setSelectedCity(slug);
    await storage.setOnboardingSeen();
    router.push('/(onboarding)/preview');
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.container}>
        <TouchableOpacity style={styles.back} onPress={() => router.back()}>
          <Feather name="chevron-left" size={22} color={Colors.white} />
        </TouchableOpacity>

        <Text style={styles.label}>{t('onboarding.pickCity.label')}</Text>
        <Text style={styles.title}>{t('onboarding.pickCity.title')}</Text>
        <Text style={styles.subtitle}>{t('onboarding.pickCity.subtitle')}</Text>

        <ScrollView
          showsVerticalScrollIndicator={false}
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
        >
          {CITIES.map((city) => (
            <TouchableOpacity
              key={city.slug}
              style={styles.card}
              onPress={() => handleSelect(city.slug)}
              activeOpacity={0.85}
            >
              <View style={styles.imageWrap}>
                <CityImage placeholderColor={city.placeholderColor} style={styles.cityImage} />
              </View>
              <View style={styles.info}>
                <View style={styles.topRow}>
                  <Text style={styles.cityName}>{city.name}</Text>
                </View>
                <Text style={styles.country}>{city.country}</Text>
                <Text style={styles.quote} numberOfLines={2}>
                  {city.quote}
                </Text>
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{t('onboarding.pickCity.freeBadge')}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <Text style={styles.hint}>Tap a city to open your free guide instantly</Text>
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
    marginBottom: Spacing.xl,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: Spacing.sm,
  },
  card: {
    borderRadius: Radius.md,
    overflow: 'hidden',
    marginBottom: Spacing.sm,
    height: 112,
    flexDirection: 'row',
    backgroundColor: Colors.bgPrimary,
  },
  imageWrap: {
    width: 100,
    height: '100%',
  },
  cityImage: {
    width: '100%',
    height: '100%',
  },
  info: {
    flex: 1,
    paddingHorizontal: Spacing.cardPadding,
    paddingVertical: Spacing.cardPadding,
    justifyContent: 'center',
    gap: 2,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cityName: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  country: {
    fontSize: 11,
    color: Colors.textSecondary,
  },
  quote: {
    fontSize: 11,
    fontStyle: 'italic',
    color: Colors.textSecondary,
    lineHeight: 15,
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.badgeGreenBg,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.sm + 2,
    paddingVertical: 3,
    marginTop: 2,
  },
  badgeText: {
    fontSize: 11,
    color: Colors.badgeGreenText,
    fontWeight: '600',
  },
  hint: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'center',
    paddingVertical: Spacing.lg,
  },
});
