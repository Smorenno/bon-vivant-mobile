import { apiClient } from './client';
import { resolveGuide, resolvePreview, resolveCityMeta } from '@/services/i18n/resolveGuide';
import { currentLocale } from '@/constants/i18n';
import type {
  CityGuide,
  CityGuidePreview,
  CityGuidePreviewRaw,
  CityGuideRaw,
  CityMeta,
  CityMetaRaw,
} from '@/types/guide';

// --- Raw fetchers (return unresolved data — store caches these for offline re-resolution) ---

export async function fetchCityGuideRaw(slug: string): Promise<CityGuideRaw> {
  const { data } = await apiClient.get<CityGuideRaw>(`/cities/${slug}`);
  return data;
}

export async function fetchCityPreviewRaw(
  slug: string,
): Promise<CityGuidePreviewRaw> {
  const { data } = await apiClient.get<CityGuidePreviewRaw>(
    `/cities/${slug}/preview`,
  );
  return data;
}

// --- Resolved fetchers (ready for store / components) ---

export async function fetchCityGuide(slug: string): Promise<CityGuide> {
  const raw = await fetchCityGuideRaw(slug);
  return resolveGuide(raw, currentLocale);
}

export async function fetchCityPreview(slug: string): Promise<CityGuidePreview> {
  const raw = await fetchCityPreviewRaw(slug);
  return resolvePreview(raw, currentLocale);
}

export async function fetchCities(): Promise<CityMeta[]> {
  const { data } = await apiClient.get<CityMetaRaw[]>('/cities');
  return data.map((raw) => resolveCityMeta(raw, currentLocale));
}
