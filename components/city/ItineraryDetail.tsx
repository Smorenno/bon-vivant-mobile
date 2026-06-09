import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Linking,
  StyleSheet,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';
import { Spacing, Radius } from '@/constants/spacing';
import { Typography } from '@/constants/typography';
import type { Itinerary, ItineraryStep } from '@/types/guide';

const THEME_COLOR: Record<string, string> = {
  waterfront_classic: '#6B7FD4',
  chinatown_gourmet: '#4A5568',
  culture_deep_dive: '#64748B',
  sunset_night: '#FADF76',
};
const DEFAULT_COLOR = '#6B7FD4';

function getColor(theme: string): string {
  return THEME_COLOR[theme] ?? DEFAULT_COLOR;
}

function isLight(color: string): boolean {
  return color === '#FADF76' || color === Colors.yellow;
}

function openMap(lat: number, lng: number): void {
  Linking.openURL(`https://maps.google.com/?q=${lat},${lng}`);
}

// --- Step card ---

type StepCardProps = {
  step: ItineraryStep;
  index: number;
  isLast: boolean;
};

function StepCard({ step, index, isLast }: StepCardProps) {
  const [expanded, setExpanded] = useState(false);

  const title = step.spot?.name ?? step.title ?? `Parada ${index + 1}`;
  const description = step.description;
  const duration =
    step.timeOnSiteMax != null
      ? `${step.timeOnSiteMin}–${step.timeOnSiteMax} min`
      : `${step.timeOnSiteMin} min`;

  const address = step.address ?? step.spot?.address;
  const distFromPort = step.spot?.distanceFromPortKm;
  const whereText = [
    address,
    distFromPort != null ? `${distFromPort} km from port` : null,
  ]
    .filter(Boolean)
    .join(' · ');

  const lat = step.spot?.latitude;
  const lng = step.spot?.longitude;
  const hasMap = lat != null && lng != null;
  const hasMenu = step.spot?.website != null;

  return (
    <View style={stepStyles.row}>
      {/* Timeline column */}
      <View style={stepStyles.timeline}>
        <View style={stepStyles.dot} />
        {!isLast && <View style={stepStyles.line} />}
      </View>

      {/* Card */}
      <View style={stepStyles.cardWrap}>
        <TouchableOpacity
          style={stepStyles.card}
          onPress={() => setExpanded((v) => !v)}
          activeOpacity={0.85}
        >
          {/* Header row */}
          <View style={stepStyles.cardHeader}>
            <View style={stepStyles.cardHeaderLeft}>
              <View style={stepStyles.durationBadge}>
                <Text style={stepStyles.durationText}>{duration}</Text>
              </View>
              <Text style={stepStyles.stepTitle}>{title}</Text>
              {description != null && (
                <Text style={stepStyles.stepDesc} numberOfLines={expanded ? undefined : 2}>
                  {description}
                </Text>
              )}
            </View>
            <Feather
              name={expanded ? 'chevron-up' : 'chevron-down'}
              size={18}
              color={Colors.textSecondary}
              style={stepStyles.chevron}
            />
          </View>

          {/* Expanded detail */}
          {expanded && (
            <View style={stepStyles.expandedSection}>
              {/* Where */}
              {whereText.length > 0 && (
                <>
                  <View style={stepStyles.detailSep} />
                  <View style={stepStyles.detailRow}>
                    <View style={stepStyles.detailLeft}>
                      <Text style={stepStyles.detailLabel}>Where</Text>
                      <Text style={stepStyles.detailValue}>{whereText}</Text>
                    </View>
                    {hasMap && (
                      <TouchableOpacity
                        style={stepStyles.actionBtn}
                        onPress={() => openMap(lat!, lng!)}
                        activeOpacity={0.8}
                      >
                        <Text style={stepStyles.actionBtnText}>See on map</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </>
              )}

              {/* Must try */}
              {step.mustTry != null && (
                <>
                  <View style={stepStyles.detailSep} />
                  <View style={stepStyles.detailRow}>
                    <View style={stepStyles.detailLeft}>
                      <Text style={stepStyles.detailLabel}>Must try</Text>
                      <Text style={stepStyles.detailValue}>{step.mustTry}</Text>
                    </View>
                    {hasMenu && (
                      <TouchableOpacity
                        style={stepStyles.actionBtn}
                        onPress={() =>
                          Linking.openURL(`https://${step.spot!.website}`)
                        }
                        activeOpacity={0.8}
                      >
                        <Text style={stepStyles.actionBtnText}>Menu</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </>
              )}

              {/* Reservation */}
              <View style={stepStyles.detailSep} />
              <View style={stepStyles.detailRow}>
                <View style={stepStyles.detailLeft}>
                  <Text style={stepStyles.detailLabel}>Reservation</Text>
                  <Text style={stepStyles.detailValue}>
                    {step.reservation ?? step.spot?.reservation ?? 'Not needed'}
                  </Text>
                </View>
                {(step.spot?.reservation != null || step.reservation != null) && (
                  <TouchableOpacity style={stepStyles.actionBtn} activeOpacity={0.8}>
                    <Text style={stepStyles.actionBtnText}>Book</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

// --- Main component ---

type Props = {
  itinerary: Itinerary;
  onBack: () => void;
};

export default function ItineraryDetail({ itinerary, onBack }: Props) {
  const bg = getColor(itinerary.theme);
  const light = isLight(bg);
  const headerText = light ? Colors.navy : Colors.white;
  const headerMuted = light ? 'rgba(39,39,62,0.65)' : 'rgba(255,255,255,0.7)';

  const duration = `${itinerary.durationMinHrs}–${itinerary.durationMaxHrs} hours`;
  const timeLabel = itinerary.timeOfDay === 'night' ? '🌙 Night route' : '☀️ Day route';

  const steps = [...itinerary.steps].sort((a, b) => a.rankOrder - b.rankOrder);

  return (
    <View style={styles.root}>
      {/* Colored header (fixed, not scrolling) */}
      <View style={[styles.header, { backgroundColor: bg }]}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack} activeOpacity={0.7}>
          <Feather name="chevron-left" size={22} color={headerText} />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={[styles.durationLabel, { color: headerMuted }]}>{duration}</Text>
          <Text style={[styles.headerTitle, { color: headerText }]}>
            {itinerary.title}
          </Text>
        </View>
      </View>

      {/* Stats row */}
      <View style={styles.statsRow}>
        <View style={styles.stat}>
          <Feather name="navigation" size={14} color={Colors.textSecondary} />
          <Text style={styles.statText}>{itinerary.totalWalkKm} km</Text>
        </View>
        <View style={styles.statDot} />
        <View style={styles.stat}>
          <Feather name="map-pin" size={14} color={Colors.textSecondary} />
          <Text style={styles.statText}>{steps.length} paradas</Text>
        </View>
        <View style={styles.statDot} />
        <Text style={styles.statText}>{timeLabel}</Text>
      </View>

      {/* Scrollable step list */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {steps.map((step, i) => (
          <StepCard
            key={step.id}
            step={step}
            index={i}
            isLast={i === steps.length - 1}
          />
        ))}

        {steps.length === 0 && (
          <Text style={styles.emptyText}>
            Las paradas de este itinerario aún no están disponibles.
          </Text>
        )}

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
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  // --- Header ---
  header: {
    paddingTop: Spacing.md,
    paddingBottom: Spacing.lg,
    paddingHorizontal: Spacing.screenHorizontal,
  },
  backBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  headerContent: {
    alignItems: 'center',
  },
  durationLabel: {
    ...Typography.guideSmall,
    fontWeight: '500',
    marginBottom: 4,
  },
  headerTitle: {
    ...Typography.guideOverviewHeading,
    textAlign: 'center',
    lineHeight: 36,
  },
  // --- Stats ---
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.screenHorizontal,
    backgroundColor: Colors.navy,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  statDot: {
    width: 3,
    height: 3,
    borderRadius: 2,
    backgroundColor: Colors.textSecondary,
  },
  statText: {
    ...Typography.guideSmall,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  // --- Scroll ---
  scroll: {
    flex: 1,
    backgroundColor: Colors.navy,
  },
  scrollContent: {
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.xxl,
  },
  emptyText: {
    ...Typography.guideBody,
    color: Colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: Spacing.screenHorizontal,
    marginTop: Spacing.xxl,
  },
  // --- Disclaimer ---
  disclaimer: {
    marginTop: Spacing.xxl,
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
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

const stepStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.screenHorizontal,
    marginBottom: Spacing.lg,
  },
  timeline: {
    width: 24,
    alignItems: 'center',
    marginTop: 16,
    marginRight: Spacing.md,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.blueAccent,
    marginBottom: 4,
  },
  line: {
    flex: 1,
    width: 2,
    backgroundColor: 'rgba(255,255,255,0.12)',
    minHeight: 40,
  },
  cardWrap: {
    flex: 1,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: Radius.md + 4,
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    padding: Spacing.lg,
    gap: Spacing.sm,
  },
  cardHeaderLeft: {
    flex: 1,
    gap: 6,
  },
  durationBadge: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.bgPrimary,
    borderRadius: Radius.full,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  durationText: {
    ...Typography.guideSmall,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  stepTitle: {
    ...Typography.guideSubHeading,
    color: Colors.textPrimary,
    lineHeight: 24,
  },
  stepDesc: {
    ...Typography.guideBody,
    color: Colors.textPrimary,
    lineHeight: 20,
  },
  chevron: {
    marginTop: 4,
    flexShrink: 0,
  },
  // --- Expanded section ---
  expandedSection: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.lg,
  },
  detailSep: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: Spacing.md,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  detailLeft: {
    flex: 1,
    gap: 4,
  },
  detailLabel: {
    ...Typography.guideSmall,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  detailValue: {
    ...Typography.guideBody,
    color: Colors.textPrimary,
    lineHeight: 20,
  },
  actionBtn: {
    backgroundColor: Colors.navy,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: 8,
    flexShrink: 0,
  },
  actionBtnText: {
    ...Typography.guideSmall,
    color: Colors.white,
    fontWeight: '600',
  },
});
