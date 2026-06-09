import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Linking,
  ScrollView,
  StyleSheet,
} from 'react-native';
import CityImage from '@/components/ui/CityImage';
import { Colors } from '@/constants/colors';
import { Spacing, Radius } from '@/constants/spacing';
import { Typography } from '@/constants/typography';
import type { Spot } from '@/types/guide';

// Placeholder colors per spot id — DEV ONLY
const SPOT_BG: Record<string, string> = {
  'yk-f1': '#2C3E6B',
  'yk-f2': '#3B1A1A',
  'yk-f3': '#1A2B3C',
};

type Props = {
  spots: Spot[]; // pre-filtered to kind='food', pre-sorted by rankOrder
};

export default function GourmetContent({ spots }: Props) {
  const categories = useMemo(() => {
    const labels = spots
      .map((s) => s.categoryLabel)
      .filter((l): l is string => l != null);
    return ['Todos', ...Array.from(new Set(labels))];
  }, [spots]);

  const [selected, setSelected] = useState('Todos');

  const visible = useMemo(
    () =>
      selected === 'Todos'
        ? spots
        : spots.filter((s) => s.categoryLabel === selected),
    [spots, selected],
  );

  return (
    <>
      {/* Title + subtitle */}
      <Text style={styles.heading}>Gourmet{'\n'}experience</Text>
      <Text style={styles.subtitle}>
        {spots.length} spots elegidos por Bon Vivant
      </Text>

      {/* Category filter chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chips}
        style={styles.chipScroll}
      >
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat}
            onPress={() => setSelected(cat)}
            activeOpacity={0.7}
            style={[styles.chip, selected === cat && styles.chipActive]}
          >
            <Text style={[styles.chipText, selected === cat && styles.chipTextActive]}>
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Spot cards */}
      {visible.map((spot) => (
        <View key={spot.id} style={styles.spotWrap}>

          {/* Full-width image card */}
          <View style={styles.imageCard}>
            <CityImage placeholderColor={SPOT_BG[spot.id] ?? Colors.navy} />
            <View style={styles.overlay}>
              {/* Top badges */}
              <View style={styles.badgeRow}>
                {spot.categoryLabel != null && (
                  <View style={styles.badgeDark}>
                    <Text style={styles.badgeDarkText}>{spot.categoryLabel}</Text>
                  </View>
                )}
                {(spot.cuisineType ?? spot.name) && (
                  <View style={styles.badgeBlue}>
                    <Text style={styles.badgeBlueText}>
                      {spot.cuisineType ?? spot.name}
                    </Text>
                  </View>
                )}
              </View>
              {/* Spot name */}
              <View style={styles.overlayBottom}>
                <Text style={styles.spotName}>{spot.name}</Text>
                {spot.manuelQuote != null && (
                  <View style={styles.quoteBox}>
                    <Text style={styles.quoteText}>{spot.manuelQuote}</Text>
                    <Text style={styles.attribution}>— Bon vivant</Text>
                  </View>
                )}
              </View>
            </View>
          </View>

          {/* White detail card */}
          <View style={styles.detailCard}>
            {spot.address != null && (
              <>
                <Text style={styles.sectionHeading}>Where it is</Text>
                <Text style={styles.detailBody}>{spot.address}</Text>
                {spot.distanceFromPortKm != null && (
                  <Text style={styles.fromPort}>
                    From port: ~{spot.distanceFromPortKm} km
                  </Text>
                )}
              </>
            )}

            {spot.mustTry != null && (
              <>
                <Text style={styles.sectionHeading}>Must-try</Text>
                <Text style={styles.detailBody}>{spot.mustTry}</Text>
              </>
            )}

            {spot.bestTime != null && (
              <>
                <Text style={styles.sectionHeading}>Best time</Text>
                <Text style={styles.detailBody}>{spot.bestTime}</Text>
              </>
            )}

            {spot.reservation != null && (
              <>
                <Text style={styles.sectionHeading}>Reservation</Text>
                <Text style={styles.detailBody}>{spot.reservation}</Text>
              </>
            )}

            {spot.website != null && (
              <TouchableOpacity
                onPress={() => Linking.openURL(`https://${spot.website}`)}
                activeOpacity={0.7}
                style={styles.websiteRow}
              >
                <Text style={styles.websiteLink}>{spot.website}</Text>
              </TouchableOpacity>
            )}
          </View>

        </View>
      ))}
    </>
  );
}

const styles = StyleSheet.create({
  heading: {
    ...Typography.guideOverviewHeading,
    color: Colors.white,
    marginBottom: Spacing.xs,
    lineHeight: 38,
  },
  subtitle: {
    ...Typography.guideBody,
    color: Colors.textSecondary,
    marginBottom: Spacing.lg,
  },
  chipScroll: {
    marginHorizontal: -Spacing.screenHorizontal,
    marginBottom: Spacing.xl,
  },
  chips: {
    paddingHorizontal: Spacing.screenHorizontal,
    gap: Spacing.sm,
  },
  chip: {
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  chipActive: {
    backgroundColor: Colors.white,
    borderColor: Colors.white,
  },
  chipText: {
    ...Typography.guideSmall,
    color: 'rgba(255,255,255,0.7)',
    fontWeight: '500',
  },
  chipTextActive: {
    color: Colors.navy,
    fontWeight: '600',
  },
  // --- Spot ---
  spotWrap: {
    marginBottom: Spacing.xl,
  },
  imageCard: {
    height: 380,
    marginHorizontal: -Spacing.screenHorizontal,
    overflow: 'hidden',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'space-between',
    padding: Spacing.lg,
    paddingBottom: 0,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    flexWrap: 'wrap',
  },
  badgeDark: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: 5,
  },
  badgeDarkText: {
    ...Typography.guideSmall,
    color: Colors.white,
    fontWeight: '500',
  },
  badgeBlue: {
    backgroundColor: Colors.blueAccent,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: 5,
  },
  badgeBlueText: {
    ...Typography.guideSmall,
    color: Colors.white,
    fontWeight: '600',
  },
  overlayBottom: {
    gap: Spacing.sm,
    paddingBottom: 0,
  },
  spotName: {
    ...Typography.guideOverviewHeading,
    color: Colors.white,
    lineHeight: 36,
  },
  quoteBox: {
    backgroundColor: 'rgba(10,10,20,0.72)',
    borderRadius: Radius.md,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  quoteText: {
    ...Typography.guideBody,
    color: Colors.white,
    lineHeight: 21,
  },
  attribution: {
    ...Typography.guideSmall,
    color: 'rgba(255,255,255,0.6)',
    textAlign: 'right',
    marginTop: Spacing.sm,
  },
  // --- Detail card (white) ---
  detailCard: {
    backgroundColor: Colors.bgCard,
    paddingHorizontal: Spacing.screenHorizontal,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.xl,
    gap: 2,
  },
  sectionHeading: {
    ...Typography.guideSectionTitle,
    color: Colors.textPrimary,
    marginTop: Spacing.lg,
    marginBottom: Spacing.xs,
  },
  detailBody: {
    ...Typography.guideBody,
    color: Colors.textPrimary,
    lineHeight: 22,
  },
  fromPort: {
    ...Typography.guideBody,
    color: Colors.textSecondary,
    lineHeight: 22,
    marginTop: 2,
  },
  websiteRow: {
    marginTop: Spacing.md,
  },
  websiteLink: {
    ...Typography.guideBody,
    color: Colors.blueAccent,
    textDecorationLine: 'underline',
  },
});
