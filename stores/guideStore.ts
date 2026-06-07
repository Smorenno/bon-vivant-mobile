import { create } from 'zustand';
import { resolveGuide } from '@/services/i18n/resolveGuide';
import { fetchCityGuideRaw } from '@/services/api/cities';
import { saveBundle, loadBundle } from '@/services/offline/cityBundle';
import { currentLocale } from '@/constants/i18n';
import { t } from '@/constants/i18n';
import type { CityGuide, CityGuideRaw } from '@/types/guide';
import type { Locale } from '@/types/i18n';

interface GuideState {
  guide: CityGuide | null;
  // Raw cache (all locales) — enables re-resolution without a network request
  rawCache: CityGuideRaw | null;
  loading: boolean;
  error: string | null;
  fetchGuide: (slug: string) => Promise<void>;
  // Re-resolve the cached raw guide with a different locale (e.g. device locale changed)
  reResolveWithLocale: (locale: Locale) => void;
  clearGuide: () => void;
}

export const useGuideStore = create<GuideState>((set, get) => ({
  guide: null,
  rawCache: null,
  loading: false,
  error: null,

  fetchGuide: async (slug: string) => {
    set({ loading: true, error: null });
    try {
      const raw = await fetchCityGuideRaw(slug);
      const guide = resolveGuide(raw, currentLocale);
      set({ guide, rawCache: raw, loading: false });
      // Cache raw bundle (all locales) for offline access — non-blocking
      saveBundle(slug, raw).catch(() => {
        // Offline save failure is non-critical; current session is unaffected
      });
    } catch (onlineError) {
      // Online fetch failed — fall back to locally cached bundle
      try {
        const { guide, raw } = await loadBundle(slug, currentLocale);
        set({ guide, rawCache: raw, loading: false });
      } catch {
        const message =
          onlineError instanceof Error ? onlineError.message : t('common.error');
        set({ error: message, loading: false });
      }
    }
  },

  reResolveWithLocale: (locale: Locale) => {
    const { rawCache } = get();
    if (rawCache == null) return;
    set({ guide: resolveGuide(rawCache, locale) });
  },

  clearGuide: () => set({ guide: null, rawCache: null, error: null }),
}));
