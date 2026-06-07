import type { Locale, LocalizedText } from '@/types/i18n';

// Single source of truth for content-language fallback: requested locale → es.
export const pick = (text: LocalizedText, locale: Locale): string =>
  text[locale] ?? text.es;
