# Guía de datos — bon-vivant-mobile

> Espejo del esquema de Confluence "Esquema de guías de ciudad".
> **Es la fuente de verdad del contrato de datos del front.**
> Si tu cambio toca `types/guide.ts`, los mocks, los stores de guías,
> o el render de cualquier sección de guía: LEE ESTE ARCHIVO PRIMERO.

---

## a) Convención LocalizedText

Todos los textos editoriales de la API real viajan como `LocalizedText`:

```ts
{ es: string; en?: string | null; fr?: string | null }
```

- `es` es canónico y siempre existe. `en`/`fr` pueden ser `null`.
- El **backend** NO resuelve idioma: serializa el objeto tal cual.
- El **cliente** resuelve en `services/i18n/pick.ts` con `pick(text, locale)` → fallback a `es`.
- Los **componentes** reciben SIEMPRE `string` plano, nunca `LocalizedText`.
- No confundir con el chrome de UI (botones, labels de tabs), que usa `t()` + `constants/i18n/*.json`.

> **Nota de fase actual (mock):** `mocks/yokohama.guide.json` está en forma **resuelta**
> (strings planos en español). Cuando entren los services reales, el dato llegará como
> `LocalizedText` y se resolverá con `pick()` antes de llegar a los componentes.

---

## b) Tablas y tipos (origen en el backend)

`(L)` = campo `jsonb` con forma `LocalizedText`.

### `cities` — identidad + Overview + Port (1:1 con la guía)

| Columna DB              | Tipo TS                  | Notas                                  |
|-------------------------|--------------------------|----------------------------------------|
| `id`                    | `string`                 | UUID                                   |
| `slug`                  | `string`                 | kebab-case único, nunca localizable    |
| `name`                  | `string`                 | nombre propio, nunca localizable       |
| `country_code`          | `string`                 | ISO 3166-1 alpha-2 (ej. "JP")          |
| `tagline`               | `LocalizedText` (L)      |                                        |
| `intro`                 | `LocalizedText` (L)      | multi-párrafo; separar en `\n\n`       |
| `historical_context`    | `LocalizedText` (L)      | multi-párrafo                          |
| `highlights`            | `jsonb [{label(L), description(L)}]` | array, n variable = "Top n Highlights" |
| `port_description`      | `LocalizedText` (L)      | multi-párrafo                          |
| `distance_to_center`    | `LocalizedText` (L)      | línea resumen                          |
| `port_facilities`       | `LocalizedText` (L)      |                                        |
| `port_recommendation`   | `LocalizedText` (L)      | cita en primera persona de Manuel      |
| `transport_options`     | `jsonb [{method, time_label, tips(L)}]` | array variable               |
| `what_to_know`          | `jsonb [{heading(L), text(L)}]` | array variable                  |
| `port_lat`              | `number`                 |                                        |
| `port_lng`              | `number`                 |                                        |
| `latitude`              | `number`                 | centro de la ciudad                    |
| `longitude`             | `number`                 | centro de la ciudad                    |
| `status`                | `'draft' \| 'published'` | solo `published` llega al cliente      |
| `last_verified`         | `string`                 | ISO date                               |
| `created_at`            | `string`                 | ISO date                               |
| `updated_at`            | `string`                 | ISO date                               |

### `spots` — attractions + gourmet (discriminador `kind`) — 1:N por ciudad

| Columna DB               | Tipo TS                    | Notas                                      |
|--------------------------|----------------------------|--------------------------------------------|
| `id`                     | `string`                   | UUID                                       |
| `city_id`                | `string`                   | FK → cities                                |
| `kind`                   | `'attraction' \| 'food'`   |                                            |
| `category`               | `'restaurant' \| 'cafe' \| 'bar' \| null` | solo kind='food'             |
| `name`                   | `string`                   | nombre propio, nunca localizable           |
| `address`                | `string \| null`           |                                            |
| `latitude`               | `number \| null`           |                                            |
| `longitude`              | `number \| null`           |                                            |
| `distance_from_port_km`  | `number \| null`           |                                            |
| `rank_order`             | `number`                   | orden de presentación                      |
| `website`                | `string \| null`           | sin `https://`                             |
| `manuel_quote`           | `LocalizedText \| null` (L)|                                            |
| `reservation`            | `LocalizedText \| null` (L)| instrucciones de reserva                   |
| `what_it_is`             | `LocalizedText \| null` (L)| solo kind='attraction'                     |
| `why_it_matters`         | `LocalizedText \| null` (L)| solo kind='attraction'                     |
| `good_to_know`           | `LocalizedText \| null` (L)| solo kind='attraction'                     |
| `tag_line`               | `LocalizedText \| null` (L)| **schema gap** — pendiente de añadir a DB  |
| `cuisine_type`           | `LocalizedText \| null` (L)| solo kind='food'                           |
| `category_label`         | `LocalizedText \| null` (L)| solo kind='food'                           |
| `must_try`               | `LocalizedText \| null` (L)| solo kind='food'                           |
| `best_time`              | `LocalizedText \| null` (L)| solo kind='food'                           |

### `itineraries` — rutas por ciudad — 1:N

| Columna DB           | Tipo TS                  | Notas                                       |
|----------------------|--------------------------|---------------------------------------------|
| `id`                 | `string`                 | UUID                                        |
| `city_id`            | `string`                 | FK → cities                                 |
| `theme`              | `string`                 | clave estable (ej. `"waterfront_classic"`)  |
| `time_of_day`        | `'day' \| 'night'`       |                                             |
| `title`              | `LocalizedText` (L)      |                                             |
| `catchy_phrase`      | `LocalizedText` (L)      |                                             |
| `best_for`           | `LocalizedText` (L)      |                                             |
| `duration_min_hrs`   | `number`                 |                                             |
| `duration_max_hrs`   | `number`                 |                                             |
| `total_walk_km`      | `number`                 |                                             |
| `total_transit_km`   | `number \| null`         |                                             |
| `flex_note`          | `LocalizedText` (L)      | consejo editorial de flexibilidad           |
| `is_recommended`     | `boolean`                |                                             |
| `is_premium`         | `boolean`                | `isLocked = isPremium && !meta.isUnlocked`  |
| `rank_order`         | `number`                 |                                             |

### `itinerary_steps` — paradas de un itinerario — 1:N

| Columna DB                 | Tipo TS                    | Notas                                      |
|----------------------------|----------------------------|--------------------------------------------|
| `id`                       | `string`                   | UUID                                       |
| `itinerary_id`             | `string`                   | FK → itineraries                           |
| `rank_order`               | `number`                   | orden dentro del itinerario                |
| `spot_id`                  | `string \| null`           | null = paso genérico sin spot              |
| `title`                    | `LocalizedText \| null` (L)| solo pasos genéricos (spot_id = null)      |
| `address`                  | `string \| null`           |                                            |
| `description`              | `LocalizedText \| null` (L)| qué hacer en este paso                     |
| `bon_vivant_notes`         | `LocalizedText \| null` (L)| consejo editorial de Manuel                |
| `must_try`                 | `LocalizedText \| null` (L)|                                            |
| `reservation`              | `LocalizedText \| null` (L)|                                            |
| `website`                  | `string \| null`           |                                            |
| `distance_from_prev_km`    | `number \| null`           | null si es el primer paso                  |
| `travel_mode`              | `'walk' \| 'transit' \| 'taxi' \| null` |                             |
| `time_on_site_min`         | `number`                   | minutos mínimos en el lugar                |
| `time_on_site_max`         | `number \| null`           |                                            |

### `tips` — Bon Vivant Tips — 1:N

| Columna DB    | Tipo TS                  | Notas                                          |
|---------------|--------------------------|------------------------------------------------|
| `id`          | `string`                 | UUID                                           |
| `city_id`     | `string \| null`         | null = tip general (carousel Home)             |
| `title`       | `LocalizedText` (L)      |                                                |
| `body`        | `LocalizedText` (L)      |                                                |
| `rank_order`  | `number`                 |                                                |

### `images` — fotos en slots fijos — 1:N

| Columna DB      | Tipo TS        | Notas                                                    |
|-----------------|----------------|----------------------------------------------------------|
| `id`            | `string`       | UUID                                                     |
| `city_id`       | `string`       | FK → cities                                              |
| `spot_id`       | `string \| null` | null = foto de ciudad                                  |
| `slot`          | `ImageSlot`    | enum **PENDIENTE de cerrar** — ver nota                  |
| `storage_path`  | `string`       | ruta relativa dentro del bucket de Supabase Storage      |
| `alt_text`      | `LocalizedText` (L) |                                                     |

> **IMPORTANTE — `ImageSlot` pendiente:**
> El enum no está cerrado todavía. Slots definidos hasta ahora:
> `cover` · `overview_1` · `overview_2` · `spot`.
> No inventes slots nuevos sin acordarlo con el backend.

### `packs` / `pack_cities` — acceso IAP

No se serializa en `CityGuide`. `meta.isUnlocked` es calculado por el backend
según `user_purchases`. El cliente **nunca** lo calcula ni lo sobreescribe.

---

## c) Contrato CityGuide (lo que recibe el front)

### Forma raw (API futura)

```ts
CityGuideRaw = {
  meta:          CityMetaRaw          // identidad + overview + port
  highlights:    HighlightRaw[]       // → cities.highlights jsonb
  transport:     TransportOptionRaw[] // → cities.transport_options jsonb
  whatToKnow:    WhatToKnowItemRaw[]  // → cities.what_to_know jsonb
  spots:         SpotRaw[]            // → table spots (kind=attraction|food)
  itineraries:   ItineraryRaw[]       // → table itineraries + steps
  tips:          TipRaw[]             // → table tips (city_id = esta ciudad)
  warnings:      NoteRaw[]            // → table city_warnings
  images:        ImageRaw[]           // → table images
}
```

### Forma resuelta (componentes)

```ts
CityGuide = Resolved<CityGuideRaw>
// Todos los LocalizedText → string. Todo lo demás igual.
```

`isLocked` en `Itinerary` = `isPremium && !meta.isUnlocked`.
Backend lo computa; el cliente solo lo lee.

---

## d) Ejemplo JSON — Yokohama (español, forma resuelta)

Ver `mocks/yokohama.guide.json` para el ejemplo completo.
Está en forma resuelta (strings planos en español). Una fila representativa
de cada tabla: ciudad completa, 3 attractions + 2 food spots, 1 itinerario
con 3 pasos, 2 tips, 1 warning, 4 images.

---

## e) Reglas de oro del contrato

1. **No inventes campos** que no estén en este documento.
2. **Distancias y tiempos son números + enums** — la UI compone el label con `t()`.
3. **`name`, `address`, `slug`, `website`, `country_code`** son strings planos, nunca `LocalizedText`.
4. **Listas variables** (`highlights`, `transport`, `spots`...) nunca son columnas numeradas.
5. **"Top N Highlights"** sale de `highlights.length` — no se guarda en la DB.
6. Los **componentes** reciben siempre `string`, nunca `LocalizedText`.
7. Si el contrato se queda corto, **para y comenta** — no improvises una estructura nueva.
