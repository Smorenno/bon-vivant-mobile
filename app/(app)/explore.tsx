import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/colors';
import { Spacing, Radius } from '@/constants/spacing';
import { Typography } from '@/constants/typography';
import CityImage from '@/components/ui/CityImage';

// ─── Types & data ─────────────────────────────────────────────────────────────

type BadgeVariant = 'On your route' | 'Popular' | "Bon vivant's choice" | 'New guide';
type FilterKey = 'All' | 'On your route' | 'Mediterranean' | 'Caribbean';

interface ExploreCity {
  slug: string;
  name: string;
  country: string;
  region: FilterKey;
  spotsCount: number;
  itinerariesCount: number;
  quote: string;
  placeholderColor: string;
  badge: BadgeVariant;
}

const BADGE_CONFIG: Record<BadgeVariant, { bg: string; text: string }> = {
  'On your route': { bg: Colors.blueAccent, text: Colors.white },
  'Popular': { bg: Colors.yellow, text: Colors.navy },
  "Bon vivant's choice": { bg: Colors.navy, text: Colors.white },
  'New guide': { bg: Colors.badgeGreenBg, text: Colors.badgeGreenText },
};

const FILTERS: FilterKey[] = ['All', 'On your route', 'Mediterranean', 'Caribbean'];

const MOCK_CITIES: ExploreCity[] = [
  {
    slug: 'yokohama',
    name: 'Yokohama',
    country: 'Japan',
    region: 'On your route',
    spotsCount: 9,
    itinerariesCount: 3,
    quote: '"If there is something I would eat there are the matcha from Motomachi\'s corners."',
    placeholderColor: '#2C6E6A',
    badge: 'On your route',
  },
  {
    slug: 'singapore',
    name: 'Singapore',
    country: 'Singapore',
    region: 'All',
    spotsCount: 9,
    itinerariesCount: 3,
    quote: '"If there is something I would eat there are the mocha from luffy\'s mom."',
    placeholderColor: '#185FA5',
    badge: 'Popular',
  },
  {
    slug: 'santorini',
    name: 'Santorini',
    country: 'Greece',
    region: 'Mediterranean',
    spotsCount: 6,
    itinerariesCount: 3,
    quote: '"If there is something I would eat there are the mocha from luffy\'s mom."',
    placeholderColor: '#D85A30',
    badge: "Bon vivant's choice",
  },
  {
    slug: 'portofino',
    name: 'Portofino',
    country: 'Italy',
    region: 'Mediterranean',
    spotsCount: 9,
    itinerariesCount: 3,
    quote: '"Portofino is a 5-hour masterpiece — if you know where to go. Most cruisers don\'t."',
    placeholderColor: '#534AB7',
    badge: 'New guide',
  },
  {
    slug: 'barcelona',
    name: 'Barcelona',
    country: 'Spain',
    region: 'Mediterranean',
    spotsCount: 6,
    itinerariesCount: 4,
    quote: '"Skip La Rambla, the real Barcelona is in El Born. Start at Mercat de Santa Caterina instead."',
    placeholderColor: '#C8860A',
    badge: 'On your route',
  },
];

const CITIES_AVAILABLE = 7;

// ─── Sub-components ───────────────────────────────────────────────────────────

function AvailablePill({ count }: { count: number }) {
  return (
    <View style={avail.wrap}>
      <Text style={avail.label}>You have</Text>
      <Text style={avail.value}>{count} cities available</Text>
    </View>
  );
}

const avail = StyleSheet.create({
  wrap: {
    backgroundColor: Colors.navy,
    borderRadius: Radius.full,
    paddingHorizontal: 14,
    paddingVertical: 7,
    alignItems: 'center',
  },
  label: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.6)',
    lineHeight: 14,
  },
  value: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.white,
    lineHeight: 15,
  },
});

function CityCard({
  city,
  onPress,
}: {
  city: ExploreCity;
  onPress: () => void;
}) {
  const badge = BADGE_CONFIG[city.badge];
  return (
    <TouchableOpacity style={card.wrap} onPress={onPress} activeOpacity={0.85}>
      <View style={card.imgWrap}>
        <CityImage placeholderColor={city.placeholderColor} />
      </View>
      <View style={card.body}>
        <View style={card.topRow}>
          <Text style={card.name}>{city.name}</Text>
          <View style={[card.badge, { backgroundColor: badge.bg }]}>
            <Text style={[card.badgeText, { color: badge.text }]}>{city.badge}</Text>
          </View>
        </View>
        <Text style={card.meta}>
          {city.country} · {city.spotsCount} spots · {city.itinerariesCount} itineraries
        </Text>
        <Text style={card.quote} numberOfLines={2}>{city.quote}</Text>
      </View>
    </TouchableOpacity>
  );
}

const card = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    backgroundColor: Colors.bgCard,
    borderRadius: Radius.md + 4,
    overflow: 'hidden',
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.borderFaint,
  },
  imgWrap: {
    width: 100,
    height: 110,
  },
  body: {
    flex: 1,
    padding: Spacing.md,
    justifyContent: 'center',
    gap: 3,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: Spacing.sm,
  },
  name: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
    flex: 1,
  },
  badge: {
    borderRadius: Radius.full,
    paddingHorizontal: 8,
    paddingVertical: 3,
    flexShrink: 0,
    alignSelf: 'flex-start',
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '600',
  },
  meta: {
    fontSize: 11,
    color: Colors.textSecondary,
    lineHeight: 15,
  },
  quote: {
    fontSize: 12,
    fontStyle: 'italic',
    color: Colors.textSecondary,
    lineHeight: 17,
    marginTop: 2,
  },
});

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function Explore() {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState<FilterKey>('All');

  const filtered = activeFilter === 'All'
    ? MOCK_CITIES
    : MOCK_CITIES.filter(
        (c) => c.region === activeFilter || c.badge === activeFilter,
      );

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* ── Header ─── */}
        <View style={styles.header}>
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>Discover</Text>
            <Text style={styles.subtitle}>Curated by Bon vivant · 50+ Destinations</Text>
          </View>
          <AvailablePill count={CITIES_AVAILABLE} />
        </View>

        {/* ── Filter chips ─── */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterScroll}
          contentContainerStyle={styles.filterRow}
        >
          {FILTERS.map((f) => {
            const active = f === activeFilter;
            return (
              <TouchableOpacity
                key={f}
                onPress={() => setActiveFilter(f)}
                activeOpacity={0.75}
                style={[styles.chip, active && styles.chipActive]}
              >
                <Text style={[styles.chipText, active && styles.chipTextActive]}>
                  {f}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* ── City list ─── */}
        {filtered.map((city) => (
          <CityCard
            key={city.slug}
            city={city}
            onPress={() => router.push(`/(app)/city/${city.slug}`)}
          />
        ))}

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.bgPrimary,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: Spacing.screenHorizontal,
    paddingTop: Spacing.lg,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: Spacing.lg,
    gap: Spacing.md,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 3,
  },
  subtitle: {
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 17,
  },

  // Filters
  filterScroll: {
    marginHorizontal: -Spacing.screenHorizontal,
    marginBottom: Spacing.lg,
  },
  filterRow: {
    paddingHorizontal: Spacing.screenHorizontal,
    gap: Spacing.sm,
    paddingBottom: 2,
  },
  chip: {
    borderRadius: Radius.full,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: Colors.bgCard,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  chipActive: {
    backgroundColor: Colors.navy,
    borderColor: Colors.navy,
  },
  chipText: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  chipTextActive: {
    color: Colors.white,
    fontWeight: '600',
  },
});
