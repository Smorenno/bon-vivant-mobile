import React from 'react';
import { View, Text, TouchableOpacity, Linking, StyleSheet } from 'react-native';
import CityImage from '@/components/ui/CityImage';
import { Colors } from '@/constants/colors';
import { Spacing, Radius } from '@/constants/spacing';
import { Typography } from '@/constants/typography';

export type AttractionItem = {
  id: string;
  tag: string;
  name: string;
  placeholderColor: string;
  quote: string;
  whatItIs: string;
  whyItMattersIntro?: string;
  whyItMatters: string;
  info?: {
    address?: string;
    website?: string;
  };
};

export type AttractionsData = {
  subtitle: string;
  items: AttractionItem[];
};

type Props = {
  data: AttractionsData;
};

export default function AttractionsContent({ data }: Props) {
  return (
    <>
      <Text style={styles.heading}>Attractions &{'\n'}Exploration</Text>
      <Text style={styles.subtitle}>{data.subtitle}</Text>

      {data.items.map((item) => (
        <View key={item.id} style={styles.attraction}>

          {/* Full-width image card with overlaid badge, name and quote */}
          <View style={styles.imageCard}>
            <CityImage placeholderColor={item.placeholderColor} />
            <View style={styles.imageOverlay}>
              <View style={styles.overlayTop}>
                <View style={styles.tag}>
                  <Text style={styles.tagText}>{item.tag}</Text>
                </View>
                <Text style={styles.attractionName}>{item.name}</Text>
              </View>
              <View style={styles.quoteBox}>
                <Text style={styles.quoteText}>{item.quote}</Text>
                <Text style={styles.attribution}>— Bon vivant</Text>
              </View>
            </View>
          </View>

          {/* Detail section on white background */}
          <View style={styles.detail}>
            <Text style={styles.sectionTitle}>What it is</Text>
            <Text style={styles.body}>{item.whatItIs}</Text>

            <Text style={styles.sectionTitle}>Why it matters</Text>
            {item.whyItMattersIntro && (
              <Text style={styles.body}>{item.whyItMattersIntro}</Text>
            )}
            <Text style={[styles.body, item.whyItMattersIntro && styles.bodyGap]}>
              {item.whyItMatters}
            </Text>

            {item.info && (
              <>
                <Text style={styles.sectionTitle}>Info</Text>
                {item.info.address && (
                  <Text style={styles.body}>
                    <Text style={styles.infoLabel}>Address: </Text>
                    {item.info.address}
                  </Text>
                )}
                {item.info.website && (
                  <TouchableOpacity
                    onPress={() => Linking.openURL(`https://${item.info!.website}`)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.link}>{item.info.website}</Text>
                  </TouchableOpacity>
                )}
              </>
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
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    ...Typography.guideBody,
    color: Colors.textSecondary,
    lineHeight: 22,
    marginBottom: Spacing.md,
  },
  attraction: {
    marginBottom: Spacing.xl,
  },
  // --- Image card ---
  imageCard: {
    height: 380,
    marginHorizontal: -Spacing.screenHorizontal,
    overflow: 'hidden',
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'space-between',
    padding: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
  overlayTop: {
    gap: Spacing.sm,
  },
  tag: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: 5,
  },
  tagText: {
    ...Typography.guideSmall,
    color: Colors.white,
    fontWeight: '500',
  },
  attractionName: {
    ...Typography.guideOverviewHeading,
    color: Colors.white,
    lineHeight: 38,
  },
  quoteBox: {
    backgroundColor: 'rgba(20, 20, 35, 0.72)',
    borderRadius: Radius.md,
    padding: Spacing.lg,
  },
  quoteText: {
    ...Typography.guideBody,
    color: Colors.white,
    lineHeight: 21,
  },
  attribution: {
    ...Typography.guideSmall,
    color: 'rgba(255, 255, 255, 0.65)',
    textAlign: 'right',
    marginTop: Spacing.sm,
  },
  // --- Detail section ---
  detail: {
    paddingVertical: Spacing.xl,
  },
  sectionTitle: {
    ...Typography.guideSectionTitle,
    color: Colors.textPrimary,
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  body: {
    ...Typography.guideBody,
    color: Colors.textPrimary,
  },
  bodyGap: {
    marginTop: Spacing.sm,
  },
  infoLabel: {
    fontWeight: '700',
  },
  link: {
    ...Typography.guideBody,
    color: Colors.blueAccent,
    marginTop: Spacing.xs,
    textDecorationLine: 'underline',
  },
});
