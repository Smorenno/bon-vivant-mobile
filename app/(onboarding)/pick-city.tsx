import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import CityImage from '@/components/ui/CityImage';
import PaginationDots from '@/components/ui/PaginationDots';
import { t } from '@/constants/i18n';
import { Colors } from '@/constants/colors';
import { Spacing, Radius } from '@/constants/spacing';
import { storage } from '@/services/storage';

const CITIES = [
  {
    slug: 'barcelona',
    name: 'Barcelona',
    country: 'Spain',
    spots: 12,
    itineraries: 3,
    quote:
      '"My favorite port in the Mediterranean. 20 years and I still find new corners."',
    placeholderColor: '#C8860A',
  },
  {
    slug: 'yokohama',
    name: 'Yokohama',
    country: 'Japan',
    spots: 9,
    itineraries: 3,
    quote:
      '"If there is something I would eat there are the mochis from luffy\'s mom."',
    placeholderColor: '#1D9E75',
  },
  {
    slug: 'rio',
    name: 'Rio de Janeiro',
    country: 'Brazil',
    spots: 11,
    itineraries: 3,
    quote:
      '"My favorite port in the Atlantic. The energy of this city is unlike anything else."',
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
        {/* Back button */}
        <TouchableOpacity style={styles.back} onPress={() => router.back()}>
          <Feather name="chevron-left" size={22} color={Colors.white} />
        </TouchableOpacity>

        {/* Label */}
        <Text style={styles.label}>{t('onboarding.pickCity.label')}</Text>

        {/* Mixed-weight title: bold + regular in the same line */}
        <Text style={styles.title}>
          <Text style={styles.titleBold}>{t('onboarding.pickCity.titleBold')}</Text>
          <Text style={styles.titleLight}>{t('onboarding.pickCity.titleLight')}</Text>
        </Text>

        <Text style={styles.subtitle}>{t('onboarding.pickCity.subtitle')}</Text>

        {/* City list */}
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
              activeOpacity={0.82}
            >
              {/* Left: city photo, flush to card edge */}
              <CityImage
                placeholderColor={city.placeholderColor}
                style={styles.cityImage}
              />

              {/* Right: city info */}
              <View style={styles.info}>
                <Text style={styles.cityName}>{city.name}</Text>
                <Text style={styles.meta}>
                  {city.country}
                  {'  ·  '}
                  <Text style={styles.metaAccent}>
                    {t('onboarding.pickCity.spots', { count: String(city.spots) })}
                  </Text>
                  {'  ·  '}
                  <Text style={styles.metaAccent}>
                    {t('onboarding.pickCity.itineraries', { count: String(city.itineraries) })}
                  </Text>
                </Text>
                <Text style={styles.quote} numberOfLines={3}>
                  {city.quote}
                </Text>
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{t('onboarding.pickCity.freeBadge')}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Bottom: hint + pagination */}
        <View style={styles.bottom}>
          <Text style={styles.hint}>{t('onboarding.pickCity.hint')}</Text>
          <PaginationDots total={4} current={2} />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.bgPrimary,
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
    fontSize: 13,
    fontWeight: '600',
    color: Colors.blueAccent,
    marginBottom: Spacing.sm,
  },
  title: {
    fontSize: 28,
    lineHeight: 34,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  titleBold: {
    fontWeight: '700',
  },
  titleLight: {
    fontWeight: '400',
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginBottom: Spacing.xl,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    gap: Spacing.md,
    paddingBottom: Spacing.sm,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: Colors.bgCard,
    borderRadius: Radius.md + 4, // 12px
    overflow: 'hidden',
    height: 132,
    // Card shadow
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  cityImage: {
    width: 100,
    height: '100%',
  },
  info: {
    flex: 1,
    paddingHorizontal: Spacing.cardPadding + 2,
    paddingVertical: Spacing.cardPadding,
    justifyContent: 'center',
    gap: 4,
  },
  cityName: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  meta: {
    fontSize: 11,
    color: Colors.textSecondary,
    lineHeight: 15,
  },
  metaAccent: {
    color: Colors.blueAccent,
    fontWeight: '500',
  },
  quote: {
    fontSize: 12,
    fontStyle: 'italic',
    color: Colors.textSecondary,
    lineHeight: 17,
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.badgeGreenBg,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: 3,
    marginTop: 2,
  },
  badgeText: {
    fontSize: 12,
    color: Colors.badgeGreenText,
    fontWeight: '600',
  },
  bottom: {
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.lg,
  },
  hint: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
});
