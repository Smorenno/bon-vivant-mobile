// Mathias design system tokens — single source of truth.
// Never hardcode hex values in components; always use these names.
export const Colors = {
  // --- Core brand ---
  navy: '#27273E',
  white: '#FFFFFF',
  yellow: '#FADF76',

  // --- Backgrounds ---
  bgPrimary: '#F2F2F7',   // default screen background
  bgCard: '#FFFFFF',       // card / surface background

  // --- Accent ---
  blueAccent: '#6B7FD4',  // labels, active dots, links
  blueLight: '#76A7FF',   // light accent (meta text, tags)

  // --- Text ---
  textPrimary: '#27273E',
  textSecondary: '#8E8E93',
  textMeta: '#76A7FF',

  // --- Status ---
  error: '#DC2626',
  success: '#059669',
  badgeGreenBg: '#E8F5E9',
  badgeGreenText: '#4CAF50',

  // --- Borders ---
  border: '#E5E5EA',
  borderLight: '#D1D5DB',
  borderFaint: '#F3F4F6',

  // --- Legacy aliases (kept for non-onboarding screens) ---
  primary: '#27273E',
  primaryLight: '#374151',
  background: '#F2F2F7',
  surface: '#FFFFFF',
  borderDark: '#27273E',
  text: '#27273E',
  textTertiary: '#8E8E93',
  teal: '#6B7FD4',
  tealLight: '#E8F5E9',
  tealDark: '#4C5BBE',
  purple: '#7F77DD',
  purpleLight: '#EDE9FE',
  purpleDark: '#4C1D95',
  amberLight: '#FEF3C7',
  amberMid: '#F59E0B',
  amberText: '#92400E',
  infoLight: '#F0F9FF',
  blueLight2: '#DBEAFE',
  blueDark: '#1E3A8A',
  guestBannerBg: '#F0FDF4',
} as const;
