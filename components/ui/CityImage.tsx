import React from 'react';
import { Image, View, StyleSheet, StyleProp, ViewStyle } from 'react-native';

interface CityImageProps {
  imageUrl?: string;
  placeholderColor?: string;
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
}

export default function CityImage({
  imageUrl,
  placeholderColor = '#2C3E6B',
  style,
  children,
}: CityImageProps) {
  return (
    <View style={[styles.container, { backgroundColor: placeholderColor }, style]}>
      {imageUrl != null && (
        <Image source={{ uri: imageUrl }} style={styles.image} resizeMode="cover" />
      )}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    overflow: 'hidden',
  },
  image: {
    ...StyleSheet.absoluteFillObject,
  },
});
