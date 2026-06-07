import { pick } from './pick';
import type { Locale } from '@/types/i18n';
import type {
  CityGuideRaw,
  CityGuidePreviewRaw,
  CityMetaRaw,
  HighlightRaw,
  TransportOptionRaw,
  NoteRaw,
  SpotRaw,
  ItineraryStepRaw,
  ItineraryRaw,
  TipRaw,
  CityGuide,
  CityGuidePreview,
} from '@/types/guide';

// Each resolver handles exactly one entity. pick() is the only call site for
// LocalizedText → string. No generic walker — explicit per-field resolution.

export function resolveCityMeta(raw: CityMetaRaw, locale: Locale) {
  return {
    slug: raw.slug,
    name: raw.name,
    countryCode: raw.countryCode,
    portName: raw.portName,
    tagline: pick(raw.tagline, locale),
    description: pick(raw.description, locale),
    isUnlocked: raw.isUnlocked,
    imageUrl: raw.imageUrl,
    latitude: raw.latitude,
    longitude: raw.longitude,
  };
}

function resolveHighlight(raw: HighlightRaw, locale: Locale) {
  return {
    id: raw.id,
    title: pick(raw.title, locale),
    description: pick(raw.description, locale),
  };
}

function resolveTransportOption(raw: TransportOptionRaw, locale: Locale) {
  return {
    method: raw.method,
    timeLabel: raw.timeLabel,
    tips: pick(raw.tips, locale),
  };
}

function resolveNote(raw: NoteRaw, locale: Locale) {
  return {
    id: raw.id,
    text: pick(raw.text, locale),
  };
}

function resolveSpot(raw: SpotRaw, locale: Locale) {
  return {
    id: raw.id,
    kind: raw.kind,
    category: raw.category,
    name: raw.name,
    address: raw.address,
    latitude: raw.latitude,
    longitude: raw.longitude,
    distanceFromPortKm: raw.distanceFromPortKm,
    rankOrder: raw.rankOrder,
    manuelQuote: raw.manuelQuote != null ? pick(raw.manuelQuote, locale) : null,
    whatItIs: raw.whatItIs != null ? pick(raw.whatItIs, locale) : null,
    whyItMatters: raw.whyItMatters != null ? pick(raw.whyItMatters, locale) : null,
    goodToKnow: raw.goodToKnow != null ? pick(raw.goodToKnow, locale) : null,
    cuisineType: raw.cuisineType != null ? pick(raw.cuisineType, locale) : null,
    categoryLabel: raw.categoryLabel != null ? pick(raw.categoryLabel, locale) : null,
    mustTry: raw.mustTry != null ? pick(raw.mustTry, locale) : null,
    bestTime: raw.bestTime != null ? pick(raw.bestTime, locale) : null,
  };
}

function resolveStep(raw: ItineraryStepRaw, locale: Locale) {
  return {
    id: raw.id,
    order: raw.order,
    spotId: raw.spotId,
    spot: raw.spot != null ? resolveSpot(raw.spot, locale) : null,
    durationMin: raw.durationMin,
    distanceFromPreviousKm: raw.distanceFromPreviousKm,
    travelMode: raw.travelMode,
    note: raw.note != null ? pick(raw.note, locale) : null,
  };
}

function resolveItinerary(raw: ItineraryRaw, locale: Locale) {
  return {
    id: raw.id,
    durationHours: raw.durationHours,
    timeOfDay: raw.timeOfDay,
    isRecommended: raw.isRecommended,
    isLocked: raw.isLocked,
    isPremium: raw.isPremium,
    title: pick(raw.title, locale),
    description: raw.description != null ? pick(raw.description, locale) : null,
    steps: raw.steps.map((s) => resolveStep(s, locale)),
  };
}

function resolveTip(raw: TipRaw, locale: Locale) {
  return {
    id: raw.id,
    cityId: raw.cityId,
    text: pick(raw.text, locale),
    author: raw.author,
  };
}

export function resolveGuide(raw: CityGuideRaw, locale: Locale): CityGuide {
  return {
    meta: resolveCityMeta(raw.meta, locale),
    highlights: raw.highlights.map((h) => resolveHighlight(h, locale)),
    transport: raw.transport.map((t) => resolveTransportOption(t, locale)),
    spots: raw.spots.map((s) => resolveSpot(s, locale)),
    itineraries: raw.itineraries.map((i) => resolveItinerary(i, locale)),
    tips: raw.tips.map((t) => resolveTip(t, locale)),
    warnings: raw.warnings.map((w) => resolveNote(w, locale)),
  };
}

export function resolvePreview(
  raw: CityGuidePreviewRaw,
  locale: Locale,
): CityGuidePreview {
  return {
    meta: resolveCityMeta(raw.meta, locale),
    teaser: pick(raw.teaser, locale),
    tip: raw.tip != null ? resolveTip(raw.tip, locale) : null,
  };
}
