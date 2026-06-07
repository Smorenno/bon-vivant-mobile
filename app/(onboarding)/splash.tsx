import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { t } from '@/constants/i18n';
import { Colors } from '@/constants/colors';

export default function Splash() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/(onboarding)/welcome');
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.logoBlock}>
        <Feather name="eye" size={40} color={Colors.navy} />
        <Text style={styles.brand}>BON VIVANT</Text>
      </View>
      <Text style={styles.tagline}>{t('onboarding.splash.tagline')}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bgCard,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  logoBlock: {
    alignItems: 'center',
    gap: 10,
  },
  brand: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.navy,
    letterSpacing: 3,
  },
  tagline: {
    fontSize: 15,
    color: Colors.textSecondary,
    letterSpacing: 0.3,
  },
});
