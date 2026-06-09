import { pick } from './pick';
import type { Locale } from '@/types/i18n';
import type {
  CityGuideRaw,
  CityGuidePreviewRaw,
  CityMetaRaw,
  HighlightRaw,
  TransportOptionRaw,
  WhatToKnowItemRaw,
  NoteRaw,
  SpotRaw,
  ItineraryStepRaw,
  ItineraryRaw,
  TipRaw,
  ImageRaw,
  CityGuide,
  CityGuidePreview,
} from '@/types/guide';

export function resolveCityMeta(raw: CityMetaRaw, locale: Locale) {
  return {
    slug: raw.slug,
    name: raw.name,
    countryCode: raw.countryCode,
    tagline: pick(raw.tagline, locale),
    intro: pick(raw.intro, locale),
    historicalContext: pick(raw.historicalContext, locale),
    portDescription: pick(raw.portDescription, locale),
    distanceToCenter: pick(raw.distanceToCenter, locale),
    portFacilities: pick(raw.portFacilities, locale),
    portRecommendation: pick(raw.portRecommendation, locale),
    portLat: raw.portLat,
    portLng: raw.portLng,
    isUnlocked: raw.isUnlocked,
    imageUrl: raw.imageUrl,
    latitude: raw.latitude,
    longitude: raw.longitude,
  };
}

function resolveHighlight(raw: HighlightRaw, locale: Locale) {
  return {
    id: raw.id,
    label: pick(raw.label, locale),
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

function resolveWhatToKnow(raw: WhatToKnowItemRaw, locale: Locale) {
  return {
    id: raw.id,
    heading: pick(raw.heading, locale),
    text: pick(raw.text, locale),
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
    cityId: raw.cityId,
    kind: raw.kind,
    category: raw.category,
    name: raw.name,
    address: raw.address,
    latitude: raw.latitude,
    longitude: raw.longitude,
    distanceFromPortKm: raw.distanceFromPortKm,
    rankOrder: raw.rankOrder,
    website: raw.website,
    manuelQuote: raw.manuelQuote != null ? pick(raw.manuelQuote, locale) : null,
    reservation: raw.reservation != null ? pick(raw.reservation, locale) : null,
    tagLine: raw.tagLine != null ? pick(raw.tagLine, locale) : null,
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
    itineraryId: raw.itineraryId,
    rankOrder: raw.rankOrder,
    spotId: raw.spotId,
    spot: raw.spot != null ? resolveSpot(raw.spot, locale) : null,
    title: raw.title != null ? pick(raw.title, locale) : null,
    address: raw.address,
    description: raw.description != null ? pick(raw.description, locale) : null,
    bonVivantNotes: raw.bonVivantNotes != null ? pick(raw.bonVivantNotes, locale) : null,
    mustTry: raw.mustTry != null ? pick(raw.mustTry, locale) : null,
    reservation: raw.reservation != null ? pick(raw.reservation, locale) : null,
    website: raw.website,
    distanceFromPrevKm: raw.distanceFromPrevKm,
    travelMode: raw.travelMode,
    timeOnSiteMin: raw.timeOnSiteMin,
    timeOnSiteMax: raw.timeOnSiteMax,
  };
}

function resolveItinerary(raw: ItineraryRaw, locale: Locale) {
  return {
    id: raw.id,
    cityId: raw.cityId,
    theme: raw.theme,
    timeOfDay: raw.timeOfDay,
    title: pick(raw.title, locale),
    catchyPhrase: pick(raw.catchyPhrase, locale),
    bestFor: pick(raw.bestFor, locale),
    durationMinHrs: raw.durationMinHrs,
    durationMaxHrs: raw.durationMaxHrs,
    totalWalkKm: raw.totalWalkKm,
    totalTransitKm: raw.totalTransitKm,
    flexNote: pick(raw.flexNote, locale),
    isRecommended: raw.isRecommended,
    isPremium: raw.isPremium,
    isLocked: raw.isLocked,
    rankOrder: raw.rankOrder,
    steps: raw.steps.map((s) => resolveStep(s, locale)),
  };
}

function resolveTip(raw: TipRaw, locale: Locale) {
  return {
    id: raw.id,
    cityId: raw.cityId,
    title: pick(raw.title, locale),
    body: pick(raw.body, locale),
    rankOrder: raw.rankOrder,
  };
}

function resolveImage(raw: ImageRaw, locale: Locale) {
  return {
    id: raw.id,
    cityId: raw.cityId,
    spotId: raw.spotId,
    slot: raw.slot,
    storagePath: raw.storagePath,
    altText: pick(raw.altText, locale),
  };
}

export function resolveGuide(raw: CityGuideRaw, locale: Locale): CityGuide {
  return {
    meta: resolveCityMeta(raw.meta, locale),
    highlights: raw.highlights.map((h) => resolveHighlight(h, locale)),
    transport: raw.transport.map((t) => resolveTransportOption(t, locale)),
    whatToKnow: raw.whatToKnow.map((w) => resolveWhatToKnow(w, locale)),
    spots: raw.spots.map((s) => resolveSpot(s, locale)),
    itineraries: raw.itineraries.map((i) => resolveItinerary(i, locale)),
    tips: raw.tips.map((t) => resolveTip(t, locale)),
    warnings: raw.warnings.map((w) => resolveNote(w, locale)),
    images: raw.images.map((img) => resolveImage(img, locale)),
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
