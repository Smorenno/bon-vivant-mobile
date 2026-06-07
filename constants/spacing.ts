/**
 * Tokens de spacing del design system (Mathias).
 * Úsalos siempre — cero números mágicos en componentes.
 */
export const Spacing = {
  /** Padding horizontal de pantalla. */
  screenHorizontal: 30,
  /** Padding interno de cards. */
  cardPadding: 12,
  // Escala general
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const;

/**
 * Radios de borde. sm 2px · md 4–12px (usa 8 por defecto) · full pill.
 */
export const Radius = {
  sm: 2,
  md: 8,
  full: 9999,
} as const;
