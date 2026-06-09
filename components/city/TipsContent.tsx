import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '@/constants/colors';
import { Spacing, Radius } from '@/constants/spacing';
import { Typography } from '@/constants/typography';
import type { Tip } from '@/types/guide';

type Props = {
  tips: Tip[]; // pre-sorted by rankOrder
};

export default function TipsContent({ tips }: Props) {
  return (
    <>
      <Text style={styles.heading}>Bon Vivant{'\n'}Tips</Text>

      {tips.map((tip, index) => (
        <View key={tip.id} style={styles.card}>
          <View style={styles.numberBadge}>
            <Text style={styles.numberText}>{index + 1}</Text>
          </View>
          <View style={styles.textWrap}>
            <Text style={styles.title}>{tip.title}</Text>
            <Text style={styles.body}>{tip.body}</Text>
          </View>
        </View>
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
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.md,
    backgroundColor: Colors.bgPrimary,
    borderRadius: Radius.md + 4,
    padding: Spacing.xl,
    marginBottom: Spacing.md,
  },
  numberBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.navy,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    marginTop: 2,
  },
  numberText: {
    ...Typography.guideSmall,
    color: Colors.white,
    fontWeight: '700',
  },
  textWrap: {
    flex: 1,
    gap: Spacing.sm,
  },
  title: {
    ...Typography.guideSubHeading,
    color: Colors.textPrimary,
  },
  body: {
    ...Typography.guideBody,
    color: Colors.textPrimary,
    lineHeight: 22,
  },
});
