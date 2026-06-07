import { TextStyle } from 'react-native';

/**
 * Familias tipográficas del design system (Mathias).
 * Cárgalas con expo-font antes de usarlas en producción.
 */
export const FontFamily = {
  logo: 'Blackout Midnight',
  ui: 'Helvetica Now Display',
} as const;

/**
 * Tokens de texto. Úsalos siempre vía StyleSheet — nunca fontSize/lineHeight sueltos.
 * Escala: hero-title 24/30 · body 16/24 · card-city 18 medium · btn 16 medium
 *         · meta 10 · small 12 · quote 18 italic.
 */
export const Typography = {
  heroTitle: { fontSize: 24, lineHeight: 30, fontWeight: '700' },
  body: { fontSize: 16, lineHeight: 24, fontWeight: '400' },
  cardCity: { fontSize: 18, fontWeight: '500' },
  button: { fontSize: 16, fontWeight: '500' },
  meta: { fontSize: 10, fontWeight: '400' },
  small: { fontSize: 12, fontWeight: '400' },
  quote: { fontSize: 18, fontStyle: 'italic', fontWeight: '400' },
} satisfies Record<string, TextStyle>;
