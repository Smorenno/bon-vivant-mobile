import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';
import { Spacing, Radius } from '@/constants/spacing';
import { Typography } from '@/constants/typography';
import type { Itinerary } from '@/types/guide';

// Map itinerary theme → card background color
const THEME_COLOR: Record<string, string> = {
  waterfront_classic: '#6B7FD4',
  chinatown_gourmet: '#4A5568',
  culture_deep_dive: '#64748B',
  sunset_night: '#FADF76',
};
const DEFAULT_COLOR = '#6B7FD4';

function cardColor(theme: string): string {
  return THEME_COLOR[theme] ?? DEFAULT_COLOR;
}

function isLightCard(bg: string): boolean {
  return bg === Colors.yellow || bg === '#FADF76';
}

type Props = {
  itineraries: Itinerary[]; // pre-sorted by rankOrder
  onOpen: (it: Itinerary) => void;
};

function ItineraryCard({ itinerary, onOpen }: { itinerary: Itinerary; onOpen: () => void }) {
  const bg = cardColor(itinerary.theme);
  const light = isLightCard(bg);
  const textColor = light ? Colors.navy : Colors.white;
  const mutedColor = light ? 'rgba(39,39,62,0.6)' : 'rgba(255,255,255,0.65)';
  const pillBg = light ? 'rgba(39,39,62,0.12)' : 'rgba(255,255,255,0.18)';
  const pillText = light ? Colors.navy : Colors.white;

  const duration = `${itinerary.durationMinHrs}–${itinerary.durationMaxHrs} horas`;

  return (
    <View style={[styles.card, { backgroundColor: bg }]}>
      {/* Top pills */}
      <View style={styles.pills}>
        <View style={[styles.pill, { backgroundColor: pillBg }]}>
          <Text style={[styles.pillText, { color: pillText }]}>{duration}</Text>
        </View>
        {itinerary.bestFor.length <= 40 && (
          <View style={[styles.pill, { backgroundColor: pillBg }]}>
            <Text style={[styles.pillText, { color: pillText }]} numberOfLines={1}>
              {itinerary.bestFor}
            </Text>
          </View>
        )}
      </View>

      {/* Title + catchy phrase */}
      <Text style={[styles.cardTitle, { color: textColor }]}>{itinerary.title}</Text>
      <Text style={[styles.cardPhrase, { color: mutedColor }]} numberOfLines={2}>
        {itinerary.catchyPhrase}
      </Text>

      {/* Stats row + Open button */}
      <View style={styles.statsRow}>
        <View style={styles.statsLeft}>
          <View style={styles.stat}>
            <Feather name="navigation" size={13} color={mutedColor} />
            <Text style={[styles.statText, { color: mutedColor }]}>
              {itinerary.totalWalkKm} km
            </Text>
          </View>
          <View style={styles.stat}>
            <Feather name="map-pin" size={13} color={mutedColor} />
            <Text style={[styles.statText, { color: mutedColor }]}>
              {itinerary.steps.length} paradas
            </Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.openBtn}
          onPress={onOpen}
          activeOpacity={0.8}
        >
          <Text style={styles.openBtnText}>
            {itinerary.isLocked ? '🔒 Ver' : 'Open'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function ItinerariesContent({ itineraries, onOpen }: Props) {
  return (
    <>
      <Text style={styles.heading}>Itineraries</Text>
      <Text style={styles.subtitle}>Pick your mode and enjoy</Text>

      <View style={styles.list}>
        {itineraries.map((it) => (
          <ItineraryCard key={it.id} itinerary={it} onOpen={() => onOpen(it)} />
        ))}
      </View>

      {/* Disclaimer */}
      <View style={styles.disclaimer}>
        <Text style={styles.disclaimerTitle}>Disclaimer</Text>
        <Text style={styles.disclaimerText}>
          The times are durations, not a timetable — start whenever you like and
          add your own pace. The only fixed parts are the walking and transit links
          between stops. Most cruise calls give you roughly 6–8 hours ashore, so
          pick the route that matches your energy.
        </Text>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  heading: {
    ...Typography.guideOverviewHeading,
    color: Colors.white,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    ...Typography.guideBody,
    color: Colors.textSecondary,
    marginBottom: Spacing.xl,
  },
  list: {
    gap: Spacing.md,
  },
  // --- Card ---
  card: {
    borderRadius: Radius.md + 4,
    padding: Spacing.xl,
    gap: Spacing.sm,
  },
  pills: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  pill: {
    borderRadius: Radius.full,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  pillText: {
    ...Typography.guideSmall,
    fontWeight: '500',
  },
  cardTitle: {
    ...Typography.guideOverviewHeading,
    lineHeight: 36,
  },
  cardPhrase: {
    ...Typography.guideBody,
    fontStyle: 'italic',
    lineHeight: 20,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Spacing.sm,
  },
  statsLeft: {
    flexDirection: 'row',
    gap: Spacing.lg,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  statText: {
    ...Typography.guideSmall,
    fontWeight: '500',
  },
  openBtn: {
    backgroundColor: Colors.white,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.xl,
    paddingVertical: 8,
  },
  openBtnText: {
    ...Typography.guideSmall,
    color: Colors.navy,
    fontWeight: '600',
  },
  // --- Disclaimer ---
  disclaimer: {
    marginTop: Spacing.xxl,
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
  disclaimerTitle: {
    ...Typography.guideSmall,
    color: Colors.textSecondary,
    fontWeight: '600',
    marginBottom: Spacing.sm,
  },
  disclaimerText: {
    ...Typography.guideSmall,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
  },
});
