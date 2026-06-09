import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors } from '@/constants/colors';
import { Spacing, Radius } from '@/constants/spacing';
import { Typography } from '@/constants/typography';
import type { Itinerary, ItineraryStep } from '@/types/guide';

type Props = {
  itineraries: Itinerary[]; // pre-sorted by rankOrder
};

const TRAVEL_MODE_LABEL: Record<string, string> = {
  walk: '🚶 A pie',
  transit: '🚇 Transporte',
  taxi: '🚕 Taxi',
};

function StepRow({ step }: { step: ItineraryStep }) {
  const stepName = step.spot?.name ?? step.title ?? '—';
  const travelLabel = step.travelMode != null ? TRAVEL_MODE_LABEL[step.travelMode] : null;
  const duration = step.timeOnSiteMax != null
    ? `${step.timeOnSiteMin}–${step.timeOnSiteMax} min`
    : `${step.timeOnSiteMin} min`;

  return (
    <View style={stepStyles.wrap}>
      {/* Connector line */}
      <View style={stepStyles.timeline}>
        <View style={stepStyles.dot} />
        <View style={stepStyles.line} />
      </View>

      <View style={stepStyles.content}>
        {travelLabel != null && step.distanceFromPrevKm != null && (
          <View style={stepStyles.travelRow}>
            <Text style={stepStyles.travelLabel}>{travelLabel}</Text>
            <Text style={stepStyles.travelMeta}>· {step.distanceFromPrevKm} km</Text>
          </View>
        )}

        <Text style={stepStyles.title}>{stepName}</Text>

        <View style={stepStyles.durationBadge}>
          <Text style={stepStyles.durationText}>{duration}</Text>
        </View>

        {step.description != null && (
          <Text style={stepStyles.body}>{step.description}</Text>
        )}

        {step.bonVivantNotes != null && (
          <View style={stepStyles.noteCard}>
            <Text style={stepStyles.noteLabel}>Nota Bon Vivant</Text>
            <Text style={stepStyles.noteBody}>{step.bonVivantNotes}</Text>
          </View>
        )}

        {step.mustTry != null && (
          <Text style={stepStyles.mustTry}>
            <Text style={stepStyles.mustTryLabel}>No te pierdas: </Text>
            {step.mustTry}
          </Text>
        )}

        {step.reservation != null && (
          <Text style={stepStyles.reservation}>
            <Text style={stepStyles.reservationLabel}>Reserva: </Text>
            {step.reservation}
          </Text>
        )}
      </View>
    </View>
  );
}

function ItineraryCard({ itinerary }: { itinerary: Itinerary }) {
  const [expanded, setExpanded] = useState(false);
  const duration = `${itinerary.durationMinHrs}–${itinerary.durationMaxHrs} h`;

  return (
    <View style={cardStyles.card}>
      {/* Header */}
      <View style={cardStyles.header}>
        <View style={cardStyles.headerTop}>
          {itinerary.isRecommended && (
            <View style={cardStyles.recommendedBadge}>
              <Text style={cardStyles.recommendedText}>Recomendado</Text>
            </View>
          )}
          {itinerary.isLocked && (
            <View style={cardStyles.lockedBadge}>
              <Text style={cardStyles.lockedText}>Premium 🔒</Text>
            </View>
          )}
        </View>

        <Text style={cardStyles.title}>{itinerary.title}</Text>
        <Text style={cardStyles.catchyPhrase}>{itinerary.catchyPhrase}</Text>

        <View style={cardStyles.metaRow}>
          <Text style={cardStyles.metaItem}>⏱ {duration}</Text>
          <Text style={cardStyles.metaDot}>·</Text>
          <Text style={cardStyles.metaItem}>🚶 {itinerary.totalWalkKm} km</Text>
          {itinerary.totalTransitKm != null && (
            <>
              <Text style={cardStyles.metaDot}>·</Text>
              <Text style={cardStyles.metaItem}>🚇 {itinerary.totalTransitKm} km</Text>
            </>
          )}
        </View>

        <Text style={cardStyles.bestFor}>{itinerary.bestFor}</Text>
      </View>

      {/* Toggle steps */}
      <TouchableOpacity
        style={cardStyles.toggleBtn}
        onPress={() => setExpanded((v) => !v)}
        activeOpacity={0.7}
      >
        <Text style={cardStyles.toggleLabel}>
          {expanded ? 'Ocultar paradas' : `Ver paradas (${itinerary.steps.length})`}
        </Text>
      </TouchableOpacity>

      {expanded && (
        <View style={cardStyles.steps}>
          {itinerary.steps
            .slice()
            .sort((a, b) => a.rankOrder - b.rankOrder)
            .map((step) => (
              <StepRow key={step.id} step={step} />
            ))}

          <View style={cardStyles.flexNote}>
            <Text style={cardStyles.flexNoteText}>{itinerary.flexNote}</Text>
          </View>
        </View>
      )}
    </View>
  );
}

export default function ItinerariesContent({ itineraries }: Props) {
  return (
    <>
      <Text style={styles.heading}>Itineraries</Text>

      {itineraries.map((it) => (
        <ItineraryCard key={it.id} itinerary={it} />
      ))}
    </>
  );
}

const styles = StyleSheet.create({
  heading: {
    ...Typography.guideOverviewHeading,
    color: Colors.textPrimary,
    marginBottom: Spacing.lg,
  },
});

const cardStyles = StyleSheet.create({
  card: {
    backgroundColor: Colors.bgPrimary,
    borderRadius: Radius.md + 4,
    marginBottom: Spacing.lg,
    overflow: 'hidden',
  },
  header: {
    padding: Spacing.xl,
    gap: Spacing.sm,
  },
  headerTop: {
    flexDirection: 'row',
    gap: Spacing.sm,
    flexWrap: 'wrap',
    marginBottom: Spacing.xs,
  },
  recommendedBadge: {
    backgroundColor: Colors.badgeGreenBg,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: 4,
  },
  recommendedText: {
    ...Typography.guideSmall,
    color: Colors.badgeGreenText,
    fontWeight: '600',
  },
  lockedBadge: {
    backgroundColor: Colors.bgCard,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  lockedText: {
    ...Typography.guideSmall,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  title: {
    ...Typography.guideSectionTitle,
    color: Colors.textPrimary,
  },
  catchyPhrase: {
    ...Typography.guideBody,
    fontStyle: 'italic',
    color: Colors.textSecondary,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    flexWrap: 'wrap',
  },
  metaItem: {
    ...Typography.guideSmall,
    color: Colors.textPrimary,
    fontWeight: '500',
  },
  metaDot: {
    ...Typography.guideSmall,
    color: Colors.textSecondary,
  },
  bestFor: {
    ...Typography.guideSmall,
    color: Colors.blueAccent,
    fontWeight: '500',
  },
  toggleBtn: {
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    alignItems: 'center',
  },
  toggleLabel: {
    ...Typography.guideBody,
    color: Colors.navy,
    fontWeight: '600',
  },
  steps: {
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: Spacing.lg,
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.xl,
  },
  flexNote: {
    backgroundColor: Colors.bgCard,
    borderRadius: Radius.md,
    padding: Spacing.lg,
    marginTop: Spacing.md,
  },
  flexNoteText: {
    ...Typography.guideSmall,
    color: Colors.textSecondary,
    fontStyle: 'italic',
  },
});

const stepStyles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  timeline: {
    width: 20,
    alignItems: 'center',
    flexShrink: 0,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.navy,
    marginTop: 4,
  },
  line: {
    flex: 1,
    width: 2,
    backgroundColor: Colors.border,
    marginTop: 4,
  },
  content: {
    flex: 1,
    gap: Spacing.xs,
    paddingBottom: Spacing.md,
  },
  travelRow: {
    flexDirection: 'row',
    gap: Spacing.xs,
    marginBottom: Spacing.xs,
  },
  travelLabel: {
    ...Typography.guideSmall,
    color: Colors.textSecondary,
  },
  travelMeta: {
    ...Typography.guideSmall,
    color: Colors.textSecondary,
  },
  title: {
    ...Typography.guideSubHeading,
    color: Colors.textPrimary,
  },
  durationBadge: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.bgCard,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  durationText: {
    ...Typography.guideSmall,
    color: Colors.textPrimary,
    fontWeight: '500',
  },
  body: {
    ...Typography.guideBody,
    color: Colors.textPrimary,
    lineHeight: 22,
    marginTop: Spacing.xs,
  },
  noteCard: {
    backgroundColor: Colors.bgCard,
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginTop: Spacing.xs,
    borderLeftWidth: 3,
    borderLeftColor: Colors.blueAccent,
  },
  noteLabel: {
    ...Typography.guideSmall,
    color: Colors.blueAccent,
    fontWeight: '600',
    marginBottom: 2,
  },
  noteBody: {
    ...Typography.guideSmall,
    color: Colors.textPrimary,
    lineHeight: 20,
  },
  mustTry: {
    ...Typography.guideSmall,
    color: Colors.textPrimary,
    marginTop: Spacing.xs,
  },
  mustTryLabel: {
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  reservation: {
    ...Typography.guideSmall,
    color: Colors.textPrimary,
    marginTop: Spacing.xs,
  },
  reservationLabel: {
    fontWeight: '700',
  },
});
