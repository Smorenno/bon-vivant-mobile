import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import CityImage from '@/components/ui/CityImage';
import Button from '@/components/ui/Button';
import PaginationDots from '@/components/ui/PaginationDots';
import { t } from '@/constants/i18n';

export default function Welcome() {
  const router = useRouter();

  return (
    <View style={styles.root}>
      <CityImage placeholderColor="#1a2744" style={StyleSheet.absoluteFillObject} />
      <View style={[StyleSheet.absoluteFillObject, styles.overlay]} />
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <View style={styles.content}>
          <View style={styles.logoRow}>
            <Feather name="eye" size={28} color="#FFFFFF" />
            <Text style={styles.brand}>BON VIVANT</Text>
          </View>

          <View style={styles.middle}>
            <Text style={styles.title}>{t('onboarding.welcome.title')}</Text>
            <Text style={styles.subtitle}>{t('onboarding.welcome.subtitle')}</Text>
            <View style={styles.spacer} />
            <Text style={styles.bio}>{t('onboarding.welcome.bio')}</Text>
            <Text style={styles.bio2}>{t('onboarding.welcome.bio2')}</Text>
          </View>

          <View style={styles.bottom}>
            <Button
              label={t('onboarding.welcome.cta')}
              onPress={() => router.push('/(onboarding)/value-props')}
              variant="light"
            />
            <View style={styles.dots}>
              <PaginationDots
                total={4}
                current={0}
                activeColor="#FFFFFF"
                inactiveColor="rgba(255,255,255,0.4)"
              />
            </View>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#1a2744',
  },
  overlay: {
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  safe: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 16,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  brand: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 2,
  },
  middle: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.8)',
    lineHeight: 22,
  },
  spacer: {
    height: 16,
  },
  bio: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.8)',
    lineHeight: 22,
    marginBottom: 8,
  },
  bio2: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.7)',
    lineHeight: 22,
  },
  bottom: {
    gap: 20,
  },
  dots: {
    alignItems: 'center',
  },
});
