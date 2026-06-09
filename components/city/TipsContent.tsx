import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors } from '@/constants/colors';
import { Spacing } from '@/constants/spacing';
import { Typography } from '@/constants/typography';
import type { Tip } from '@/types/guide';

type Props = {
  tips: Tip[];    // pre-sorted by rankOrder
  cityName: string;
};

function TipRow({ tip }: { tip: Tip }) {
  const [open, setOpen] = useState(false);

  return (
    <View>
      <View style={styles.separator} />
      <TouchableOpacity
        style={styles.row}
        onPress={() => setOpen((v) => !v)}
        activeOpacity={0.7}
      >
        <Text style={styles.title}>{tip.title}</Text>
        <Text style={styles.icon}>{open ? '−' : '+'}</Text>
      </TouchableOpacity>
      {open && (
        <Text style={styles.body}>{tip.body}</Text>
      )}
    </View>
  );
}

export default function TipsContent({ tips, cityName }: Props) {
  return (
    <>
      <Text style={styles.heading}>Bon vivant{'\n'}tips</Text>
      <Text style={styles.subtitle}>Insider knowledge unique to {cityName}</Text>

      <View style={styles.list}>
        {tips.map((tip) => (
          <TipRow key={tip.id} tip={tip} />
        ))}
        <View style={styles.separator} />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  heading: {
    ...Typography.guideOverviewHeading,
    color: Colors.white,
    lineHeight: 38,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    ...Typography.guideBody,
    color: Colors.textSecondary,
    marginBottom: Spacing.xl,
  },
  list: {
    marginTop: Spacing.md,
  },
  separator: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.12)',
    marginVertical: Spacing.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingVertical: Spacing.md,
    gap: Spacing.md,
  },
  title: {
    ...Typography.guideSubHeading,
    color: Colors.white,
    flex: 1,
    lineHeight: 26,
  },
  icon: {
    fontSize: 24,
    color: Colors.white,
    lineHeight: 30,
    fontWeight: '300',
    marginTop: 2,
  },
  body: {
    ...Typography.guideBody,
    color: 'rgba(255,255,255,0.7)',
    lineHeight: 22,
    paddingBottom: Spacing.lg,
  },
});
