import { getLocales } from 'expo-localization';
import en from './en.json';
import es from './es.json';
import fr from './fr.json';

export const supportedLocales = ['en', 'es', 'fr'] as const;
type SupportedLocale = (typeof supportedLocales)[number];

const translations: Record<SupportedLocale, typeof en> = { en, es, fr };

function detectLocale(): SupportedLocale {
  const locales = getLocales();
  const tag = locales[0]?.languageCode ?? 'en';
  if ((supportedLocales as readonly string[]).includes(tag)) {
    return tag as SupportedLocale;
  }
  return 'en';
}

export const currentLocale: SupportedLocale = detectLocale();

const strings = translations[currentLocale];

export function t(key: string, vars?: Record<string, string>): string {
  const parts = key.split('.');
  let node: unknown = strings;
  for (const part of parts) {
    if (typeof node !== 'object' || node === null) return key;
    node = (node as Record<string, unknown>)[part];
  }
  if (typeof node !== 'string') return key;
  if (!vars) return node;
  return Object.entries(vars).reduce(
    (str, [k, v]) => str.replace(new RegExp(`\\{${k}\\}`, 'g'), v),
    node,
  );
}
