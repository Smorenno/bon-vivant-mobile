import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import CityImage from '@/components/ui/CityImage';
import { Colors } from '@/constants/colors';
import { Spacing, Radius } from '@/constants/spacing';
import { Typography } from '@/constants/typography';

type Props = {
  title: string;
  body: string[];
  placeholderColor?: string;
  imageUrl?: string;
};

export default function ContextCard({ title, body, placeholderColor = '#2C3E6B', imageUrl }: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.imageWrap}>
        <CityImage placeholderColor={placeholderColor} imageUrl={imageUrl} />
      </View>
      <View style={styles.textWrap}>
        <Text style={styles.title}>{title}</Text>
        {body.map((para, i) => (
          <Text key={i} style={[styles.body, i > 0 && styles.bodyGap]}>
            {para}
          </Text>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Radius.md + 4,
    overflow: 'hidden',
  },
  imageWrap: {
    height: 160,
  },
  textWrap: {
    backgroundColor: Colors.navy,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.xl,
  },
  title: {
    ...Typography.guideSubHeading,
    fontSize: 24,
    color: Colors.white,
    marginBottom: Spacing.md,
  },
  body: {
    ...Typography.guideBody,
    color: 'rgba(255, 255, 255, 0.85)',
  },
  bodyGap: {
    marginTop: Spacing.md,
  },
});
