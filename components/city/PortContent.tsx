import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import CityImage from '@/components/ui/CityImage';
import { Colors } from '@/constants/colors';
import { Spacing, Radius } from '@/constants/spacing';
import { Typography } from '@/constants/typography';

export type TransportOption = {
  id: string;
  label: string;
  time: string;
  description: string;
  separatorBefore?: boolean;
};

export type PortData = {
  subtitle: string;
  locationTitle: string;
  locationBody: string[];
  distance: {
    title: string;
    summary: string;
    options: TransportOption[];
  };
  recommendationImageColor: string;
  recommendation: string;
  facilitiesTitle: string;
  facilitiesBody: string;
};

type Props = {
  data: PortData;
};

export default function PortContent({ data }: Props) {
  return (
    <>
      <Text style={styles.heading}>Port</Text>
      <Text style={styles.subtitle}>{data.subtitle}</Text>

      <Text style={styles.sectionTitle}>{data.locationTitle}</Text>
      {data.locationBody.map((para, i) => (
        <Text key={i} style={[styles.body, i > 0 && styles.bodyGap]}>
          {para}
        </Text>
      ))}

      <View style={styles.distanceCard}>
        <Text style={styles.distanceTitle}>{data.distance.title}</Text>
        <Text style={styles.distanceSummary}>{data.distance.summary}</Text>
        {data.distance.options.map((opt) => (
          <React.Fragment key={opt.id}>
            {opt.separatorBefore && <View style={styles.dashedLine} />}
            <View style={styles.optionHeader}>
              <Text style={styles.optionLabel}>{opt.label}</Text>
              <View style={styles.timeBadge}>
                <Text style={styles.timeBadgeText}>{opt.time}</Text>
              </View>
            </View>
            <Text style={styles.optionDesc}>{opt.description}</Text>
          </React.Fragment>
        ))}
      </View>

      <View style={styles.midImage}>
        <CityImage placeholderColor={data.recommendationImageColor} />
      </View>

      <Text style={styles.sectionTitle}>Bon Vivant Recommendation</Text>
      <View style={styles.quoteCard}>
        <Text style={styles.quoteText}>{data.recommendation}</Text>
      </View>

      <Text style={styles.sectionTitle}>{data.facilitiesTitle}</Text>
      <Text style={styles.body}>{data.facilitiesBody}</Text>
    </>
  );
}

const styles = StyleSheet.create({
  heading: {
    ...Typography.guideOverviewHeading,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    ...Typography.guideBody,
    color: Colors.textSecondary,
    lineHeight: 22,
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    ...Typography.guideSectionTitle,
    color: Colors.textPrimary,
    marginTop: Spacing.xl,
    marginBottom: Spacing.md,
  },
  body: {
    ...Typography.guideBody,
    color: Colors.textPrimary,
  },
  bodyGap: {
    marginTop: Spacing.md,
  },
  // --- Distance card ---
  distanceCard: {
    backgroundColor: Colors.bgPrimary,
    borderRadius: Radius.md + 4,
    padding: Spacing.xl,
    marginTop: Spacing.lg,
  },
  distanceTitle: {
    ...Typography.guideSectionTitle,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  distanceSummary: {
    ...Typography.guideBody,
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  optionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.md,
    marginBottom: Spacing.xs,
  },
  optionLabel: {
    ...Typography.guideBody,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  timeBadge: {
    backgroundColor: Colors.navy,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
  },
  timeBadgeText: {
    ...Typography.guideSmall,
    color: Colors.white,
    fontWeight: '500',
  },
  optionDesc: {
    ...Typography.guideBody,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  dashedLine: {
    borderTopWidth: 1,
    borderStyle: 'dashed',
    borderColor: Colors.border,
    marginVertical: Spacing.md,
  },
  // --- Mid image (breaks out of screen horizontal padding) ---
  midImage: {
    height: 220,
    marginHorizontal: -Spacing.screenHorizontal,
    marginTop: Spacing.xl,
  },
  // --- Quote ---
  quoteCard: {
    backgroundColor: Colors.bgPrimary,
    borderRadius: Radius.md,
    marginTop: Spacing.md,
    padding: Spacing.lg,
  },
  quoteText: {
    ...Typography.guideBody,
    fontStyle: 'italic',
    color: Colors.textPrimary,
  },
});
