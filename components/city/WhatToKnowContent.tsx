import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '@/constants/colors';
import { Spacing, Radius } from '@/constants/spacing';
import { Typography } from '@/constants/typography';
import type { WhatToKnowItem } from '@/types/guide';

type Props = {
  items: WhatToKnowItem[];
};

export default function WhatToKnowContent({ items }: Props) {
  return (
    <>
      <Text style={styles.heading}>What to Know</Text>

      {items.map((item) => (
        <View key={item.id} style={styles.card}>
          <View style={styles.accent} />
          <View style={styles.textWrap}>
            <Text style={styles.heading2}>{item.heading}</Text>
            <Text style={styles.body}>{item.text}</Text>
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
    gap: Spacing.md,
    backgroundColor: Colors.bgPrimary,
    borderRadius: Radius.md + 4,
    padding: Spacing.xl,
    marginBottom: Spacing.md,
    overflow: 'hidden',
  },
  accent: {
    width: 4,
    borderRadius: 2,
    backgroundColor: Colors.blueAccent,
    flexShrink: 0,
  },
  textWrap: {
    flex: 1,
    gap: Spacing.sm,
  },
  heading2: {
    ...Typography.guideSubHeading,
    color: Colors.textPrimary,
  },
  body: {
    ...Typography.guideBody,
    color: Colors.textPrimary,
    lineHeight: 22,
  },
});
