import AsyncStorage from '@react-native-async-storage/async-storage';
import { resolveGuide } from '@/services/i18n/resolveGuide';
import type { CityGuide, CityGuideRaw } from '@/types/guide';
import type { Locale } from '@/types/i18n';

// Bundles are stored as CityGuideRaw (all 3 locales preserved) so that changing
// the device locale re-renders content instantly without a network request.
// Phase 6-8: replace AsyncStorage with WatermelonDB for structured queries and
// efficient updates. The public API of this module must not change.

const bundleKey = (slug: string) => `offline_bundle_${slug}`;

export async function saveBundle(slug: string, raw: CityGuideRaw): Promise<void> {
  await AsyncStorage.setItem(bundleKey(slug), JSON.stringify(raw));
}

export async function loadBundle(
  slug: string,
  locale: Locale,
): Promise<{ guide: CityGuide; raw: CityGuideRaw }> {
  const json = await AsyncStorage.getItem(bundleKey(slug));
  if (json == null) {
    throw new Error(`No offline bundle found for city: ${slug}`);
  }
  const raw = JSON.parse(json) as CityGuideRaw;
  return { guide: resolveGuide(raw, locale), raw };
}

export async function deleteBundle(slug: string): Promise<void> {
  await AsyncStorage.removeItem(bundleKey(slug));
}

export async function hasCachedBundle(slug: string): Promise<boolean> {
  const value = await AsyncStorage.getItem(bundleKey(slug));
  return value != null;
}
