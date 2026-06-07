export type Locale = 'es' | 'en' | 'fr';

export type LocalizedText = {
  es: string;
  en?: string | null;
  fr?: string | null;
};

// Maps every LocalizedText in a structure to a plain string.
export type Resolved<T> =
  T extends LocalizedText
    ? string
    : T extends Array<infer U>
      ? Array<Resolved<U>>
      : T extends object
        ? { [K in keyof T]: Resolved<T[K]> }
        : T;
