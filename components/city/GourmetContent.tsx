import React from 'react';
import { View, Text, TouchableOpacity, Linking, StyleSheet } from 'react-native';
import CityImage from '@/components/ui/CityImage';
import { Colors } from '@/constants/colors';
import { Spacing, Radius } from '@/constants/spacing';
import { Typography } from '@/constants/typography';
import type { Spot } from '@/types/guide';

type Props = {
  spots: Spot[]; // pre-filtered to kind='food', pre-sorted by rankOrder
};

export default function GourmetContent({ spots }: Props) {
  return (
    <>
      <Text style={styles.heading}>Gourmet{'\n'}Experience</Text>

      {spots.map((spot) => (
        <View key={spot.id} style={styles.item}>

          {/* Full-width image with category badge and name overlay */}
          <View style={styles.imageCard}>
            <CityImage placeholderColor={Colors.navy} />
            <View style={styles.imageOverlay}>
              <View style={styles.overlayTop}>
                {spot.categoryLabel != null && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{spot.categoryLabel}</Text>
                  </View>
                )}
                <Text style={styles.spotName}>{spot.name}</Text>
              </View>
              {spot.manuelQuote != null && (
                <View style={styles.quoteBox}>
                  <Text style={styles.quoteText}>{spot.manuelQuote}</Text>
                  <Text style={styles.attribution}>— Bon vivant</Text>
                </View>
              )}
            </View>
          </View>

          {/* Detail section */}
          <View style={styles.detail}>
            {spot.cuisineType != null && (
              <View style={styles.row}>
                <Text style={styles.metaLabel}>Cocina</Text>
                <Text style={styles.metaValue}>{spot.cuisineType}</Text>
              </View>
            )}

            {spot.mustTry != null && (
              <>
                <Text style={styles.sectionTitle}>No te lo pierdas</Text>
                <Text style={styles.body}>{spot.mustTry}</Text>
              </>
            )}

            {spot.bestTime != null && (
              <>
                <Text style={styles.sectionTitle}>Mejor momento</Text>
                <Text style={styles.body}>{spot.bestTime}</Text>
              </>
            )}

            {spot.reservation != null && (
              <>
                <Text style={styles.sectionTitle}>Reserva</Text>
                <Text style={styles.body}>{spot.reservation}</Text>
              </>
            )}

            {(spot.address != null || spot.website != null) && (
              <>
                <Text style={styles.sectionTitle}>Info</Text>
                {spot.address != null && (
                  <Text style={styles.body}>
                    <Text style={styles.infoLabel}>Dirección: </Text>
                    {spot.address}
                  </Text>
                )}
                {spot.website != null && (
                  <TouchableOpacity
                    onPress={() => Linking.openURL(`https://${spot.website}`)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.link}>{spot.website}</Text>
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
    marginBottom: Spacing.md,
  },
  item: {
    marginBottom: Spacing.xl,
  },
  imageCard: {
    height: 340,
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
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(0,0,0,0.55)',
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: 5,
  },
  badgeText: {
    ...Typography.guideSmall,
    color: Colors.white,
    fontWeight: '500',
  },
  spotName: {
    ...Typography.guideOverviewHeading,
    color: Colors.white,
    lineHeight: 38,
  },
  quoteBox: {
    backgroundColor: 'rgba(20,20,35,0.72)',
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
    color: 'rgba(255,255,255,0.65)',
    textAlign: 'right',
    marginTop: Spacing.sm,
  },
  detail: {
    paddingVertical: Spacing.xl,
  },
  row: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  metaLabel: {
    ...Typography.guideSmall,
    color: Colors.textSecondary,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  metaValue: {
    ...Typography.guideSmall,
    color: Colors.blueAccent,
    fontWeight: '500',
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
