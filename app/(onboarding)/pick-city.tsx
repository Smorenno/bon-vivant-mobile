import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import CityImage from '@/components/ui/CityImage';
import { t } from '@/constants/i18n';
import { Colors } from '@/constants/colors';
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
    quote: "If there is something I would eat there are the matcha from Motomachi's corners.",
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
          <Feather name="arrow-left" size={24} color={Colors.primary} />
        </TouchableOpacity>

        <Text style={styles.label}>{t('onboarding.pickCity.label')}</Text>
        <Text style={styles.title}>{t('onboarding.pickCity.title')}</Text>
        <Text style={styles.subtitle}>{t('onboarding.pickCity.subtitle')}</Text>

        <ScrollView showsVerticalScrollIndicator={false} style={styles.scroll}>
          {CITIES.map((city) => (
            <TouchableOpacity
              key={city.slug}
              style={styles.card}
              onPress={() => handleSelect(city.slug)}
              activeOpacity={0.85}
            >
              <View style={styles.imageWrap}>
                <CityImage
                  placeholderColor={city.placeholderColor}
                  style={styles.cityImage}
                />
              </View>
              <View style={styles.info}>
                <Text style={styles.cityName}>{city.name}</Text>
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
    marginBottom: 24,
  },
  scroll: {
    flex: 1,
  },
  card: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 12,
    height: 110,
    flexDirection: 'row',
    backgroundColor: Colors.surface,
  },
  imageWrap: {
    width: '35%',
    height: '100%',
  },
  cityImage: {
    width: '100%',
    height: '100%',
  },
  info: {
    flex: 1,
    padding: 14,
    justifyContent: 'center',
  },
  cityName: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 2,
  },
  country: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  quote: {
    fontSize: 12,
    fontStyle: 'italic',
    color: Colors.textSecondary,
    lineHeight: 16,
    marginBottom: 6,
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.tealLight,
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  badgeText: {
    fontSize: 11,
    color: Colors.tealDark,
    fontWeight: '600',
  },
});
