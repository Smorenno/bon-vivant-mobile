import React from 'react';
import { View, StyleSheet } from 'react-native';

interface PaginationDotsProps {
  total: number;
  current: number;
  activeColor?: string;
  inactiveColor?: string;
}

export default function PaginationDots({
  total,
  current,
  activeColor = '#111827',
  inactiveColor = '#D1D5DB',
}: PaginationDotsProps) {
  return (
    <View style={styles.row}>
      {Array.from({ length: total }).map((_, i) => (
        <View
          key={i}
          style={[
            styles.dot,
            i === current
              ? [styles.active, { backgroundColor: activeColor }]
              : [styles.inactive, { backgroundColor: inactiveColor }],
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    borderRadius: 4,
    marginHorizontal: 3,
  },
  active: {
    width: 20,
    height: 8,
  },
  inactive: {
    width: 8,
    height: 8,
  },
});
