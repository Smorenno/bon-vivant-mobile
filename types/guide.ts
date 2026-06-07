import type { LocalizedText, Resolved } from './i18n';

export type TransportMethod =
  | 'walk'
  | 'metro'
  | 'bus'
  | 'taxi'
  | 'ferry'
  | 'tram'
  | 'shuttle';

export type SpotKind = 'attraction' | 'food';
export type SpotCategory = 'restaurant' | 'cafe' | 'bar';

export type TravelMode = 'walk' | 'transit' | 'taxi';
export type TimeOfDay = 'morning' | 'afternoon' | 'full-day';

export interface HighlightRaw {
  id: string;
  title: LocalizedText;
  description: LocalizedText;
}

export interface TransportOptionRaw {
  method: TransportMethod;
  // Already formatted label (e.g. "12 min") — not localized
  timeLabel: string;
  tips: LocalizedText;
}

export interface NoteRaw {
  id: string;
  text: LocalizedText;
}

export interface SpotRaw {
  id: string;
  kind: SpotKind;
  // Only set when kind === 'food'
  category: SpotCategory | null;
  // Proper nouns — never localized
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  distanceFromPortKm: number;
  rankOrder: number;
  manuelQuote: LocalizedText | null;
  // Attraction-only fields
  whatItIs: LocalizedText | null;
  whyItMatters: LocalizedText | null;
  goodToKnow: LocalizedText | null;
  // Food-only fields
  cuisineType: LocalizedText | null;
  categoryLabel: LocalizedText | null;
  mustTry: LocalizedText | null;
  bestTime: LocalizedText | null;
}

export interface ItineraryStepRaw {
  id: string;
  order: number;
  spotId: string | null;
  spot: SpotRaw | null;
  // Numeric — UI builds the label via t()
  durationMin: number;
  distanceFromPreviousKm: number | null;
  travelMode: TravelMode;
  note: LocalizedText | null;
}

export interface ItineraryRaw {
  id: string;
  durationHours: 4 | 6 | 8;
  timeOfDay: TimeOfDay;
  isRecommended: boolean;
  isLocked: boolean;
  isPremium: boolean;
  title: LocalizedText;
  description: LocalizedText | null;
  steps: ItineraryStepRaw[];
}

export interface TipRaw {
  id: string;
  // null = general tip shown on Home
  cityId: string | null;
  text: LocalizedText;
  author: string;
}

export interface CityMetaRaw {
  slug: string;
  // Proper noun — not localized (e.g. "Barcelona")
  name: string;
  // ISO 3166-1 alpha-2 — UI builds label via t('country.ES')
  countryCode: string;
  portName: string;
  tagline: LocalizedText;
  description: LocalizedText;
  // Calculated by backend; client never sets this
  isUnlocked: boolean;
  imageUrl: string | null;
  latitude: number;
  longitude: number;
}

export interface CityGuideRaw {
  meta: CityMetaRaw;
  highlights: HighlightRaw[];
  transport: TransportOptionRaw[];
  spots: SpotRaw[];
  itineraries: ItineraryRaw[];
  tips: TipRaw[];
  warnings: NoteRaw[];
}

export interface CityGuidePreviewRaw {
  meta: CityMetaRaw;
  teaser: LocalizedText;
  tip: TipRaw | null;
}

// Resolved types — all LocalizedText fields become plain strings.
// CityGuide is what stores and components consume; they never see LocalizedText.
export type Highlight = Resolved<HighlightRaw>;
export type TransportOption = Resolved<TransportOptionRaw>;
export type Note = Resolved<NoteRaw>;
export type Spot = Resolved<SpotRaw>;
export type ItineraryStep = Resolved<ItineraryStepRaw>;
export type Itinerary = Resolved<ItineraryRaw>;
export type Tip = Resolved<TipRaw>;
export type CityMeta = Resolved<CityMetaRaw>;
export type CityGuide = Resolved<CityGuideRaw>;
export type CityGuidePreview = Resolved<CityGuidePreviewRaw>;
