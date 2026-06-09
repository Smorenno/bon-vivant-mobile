import type { LocalizedText, Resolved } from './i18n';

// --- Enums (match DB enum values exactly) ---

export type TransportMethod = 'walk' | 'metro' | 'tram' | 'taxi' | 'train' | 'ferry';
export type SpotKind = 'attraction' | 'food';
export type SpotCategory = 'restaurant' | 'cafe' | 'bar';
export type TravelMode = 'walk' | 'transit' | 'taxi';
export type TimeOfDay = 'day' | 'night';

// Slots defined so far — PENDING: enum not closed yet. Do not invent new slots.
export type ImageSlot = 'cover' | 'overview_1' | 'overview_2' | 'spot';

// --- Raw interfaces (match DB / API shape; all (L) fields are LocalizedText) ---

export interface HighlightRaw {
  id: string;
  label: LocalizedText;
  description: LocalizedText;
}

export interface TransportOptionRaw {
  method: TransportMethod;
  timeLabel: string; // pre-formatted (e.g. "15-20 min") — not localized
  tips: LocalizedText;
}

export interface WhatToKnowItemRaw {
  id: string;
  heading: LocalizedText;
  text: LocalizedText;
}

export interface NoteRaw {
  id: string;
  text: LocalizedText;
}

export interface SpotRaw {
  id: string;
  cityId: string;
  kind: SpotKind;
  category: SpotCategory | null;  // null for attractions
  name: string;                    // proper noun, never localized
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  distanceFromPortKm: number | null;
  rankOrder: number;
  website: string | null;
  manuelQuote: LocalizedText | null;
  reservation: LocalizedText | null;
  // Attraction-only
  whatItIs: LocalizedText | null;
  whyItMatters: LocalizedText | null;
  goodToKnow: LocalizedText | null;
  // tagLine: schema gap — proposed `tag_line jsonb (L)` column in spots.
  // Displays the short category badge on attraction cards.
  // Must be added to DB schema before API integration.
  tagLine: LocalizedText | null;
  // Food-only
  cuisineType: LocalizedText | null;
  categoryLabel: LocalizedText | null;
  mustTry: LocalizedText | null;
  bestTime: LocalizedText | null;
}

export interface ItineraryStepRaw {
  id: string;
  itineraryId: string;
  rankOrder: number;
  spotId: string | null;
  spot: SpotRaw | null;
  // For generic steps (no spot): title is the step name; for spot steps it's null.
  title: LocalizedText | null;
  address: string | null;
  description: LocalizedText | null;
  bonVivantNotes: LocalizedText | null;
  mustTry: LocalizedText | null;
  reservation: LocalizedText | null;
  website: string | null;
  distanceFromPrevKm: number | null;
  travelMode: TravelMode | null;
  timeOnSiteMin: number;
  timeOnSiteMax: number | null;
}

export interface ItineraryRaw {
  id: string;
  cityId: string;
  theme: string;             // stable key (e.g. "waterfront_classic")
  timeOfDay: TimeOfDay;
  title: LocalizedText;
  catchyPhrase: LocalizedText;
  bestFor: LocalizedText;
  durationMinHrs: number;
  durationMaxHrs: number;
  totalWalkKm: number;
  totalTransitKm: number | null;
  flexNote: LocalizedText;
  isRecommended: boolean;
  isPremium: boolean;
  isLocked: boolean;         // backend-computed; true when isPremium && !isUnlocked
  rankOrder: number;
  steps: ItineraryStepRaw[];
}

export interface TipRaw {
  id: string;
  cityId: string | null;     // null = general tip shown on Home
  title: LocalizedText;
  body: LocalizedText;
  rankOrder: number;
}

export interface ImageRaw {
  id: string;
  cityId: string;
  spotId: string | null;
  slot: ImageSlot;
  storagePath: string;       // relative path within Supabase storage bucket
  altText: LocalizedText;
}

export interface CityMetaRaw {
  slug: string;
  name: string;              // proper noun, never localized
  countryCode: string;       // ISO 3166-1 alpha-2
  tagline: LocalizedText;
  intro: LocalizedText;                  // cities.intro — multi-para, split on \n\n
  historicalContext: LocalizedText;      // cities.historical_context
  portDescription: LocalizedText;        // cities.port_description — multi-para
  distanceToCenter: LocalizedText;       // cities.distance_to_center — summary line
  portFacilities: LocalizedText;         // cities.port_facilities
  portRecommendation: LocalizedText;     // cities.port_recommendation — the BV quote
  portLat: number;
  portLng: number;
  isUnlocked: boolean;       // backend-computed, never set by client
  imageUrl: string | null;   // legacy direct URL; canonical source is images[slot='cover']
  latitude: number;          // city center
  longitude: number;
}

export interface CityGuideRaw {
  meta: CityMetaRaw;
  highlights: HighlightRaw[];
  transport: TransportOptionRaw[];
  whatToKnow: WhatToKnowItemRaw[];
  spots: SpotRaw[];
  itineraries: ItineraryRaw[];
  tips: TipRaw[];
  warnings: NoteRaw[];
  images: ImageRaw[];
}

export interface CityGuidePreviewRaw {
  meta: CityMetaRaw;
  teaser: LocalizedText;
  tip: TipRaw | null;
}

// --- Resolved types (all LocalizedText → plain string via resolveGuide) ---
// Stores and components consume these — they never see LocalizedText.

export type Highlight = Resolved<HighlightRaw>;
export type TransportOption = Resolved<TransportOptionRaw>;
export type WhatToKnowItem = Resolved<WhatToKnowItemRaw>;
export type Note = Resolved<NoteRaw>;
export type Spot = Resolved<SpotRaw>;
export type ItineraryStep = Resolved<ItineraryStepRaw>;
export type Itinerary = Resolved<ItineraryRaw>;
export type Tip = Resolved<TipRaw>;
export type Image = Resolved<ImageRaw>;
export type CityMeta = Resolved<CityMetaRaw>;
export type CityGuide = Resolved<CityGuideRaw>;
export type CityGuidePreview = Resolved<CityGuidePreviewRaw>;
