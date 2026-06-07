# bonvivant-mobile — Claude Code Context

> Lee este archivo al inicio de cada sesión. Es la fuente de verdad del repo mobile.
> Reglas de calidad y seguridad → `.claude/standards.md`.
> Dominio, contrato de endpoints y reglas que cruzan repos → `../CLAUDE.md` (paraguas).
> Si algo aquí contradice una conversación previa, gana este archivo.

## Qué es este repo

App móvil de **guías de ciudad offline** para pasajeros de crucero.
Consume la API REST `/api/v1` que sirve `bon-vivant-api`.
El cliente nunca decide acceso ni pagos: eso es verdad del backend.

## Stack objetivo

- **Framework:** React Native + Expo con **Expo Router** (file-based)
- **Lenguaje:** TypeScript estricto — cero `any`, cero `as unknown`
- **Estado global:** Zustand — mutaciones solo vía actions, nunca mutar state directo
- **HTTP:** Axios client en `services/api/` — nunca llamar API desde componentes ni screens
- **Auth:** Supabase JS con `detectSessionInUrl: false`
- **i18n:** ES / EN / FR — todo texto visible pasa por `t()`
- **Estilos:** `StyleSheet.create()` + tokens en `constants/` — cero hardcode
- **Offline (fase 6-8):** WatermelonDB para bundles de ciudad
- **Mapas (fase 6-8):** `@rnmapbox/maps` — requiere development build, no Expo Go
- **Alias de imports:** `@/*` → raíz del repo (ver `tsconfig.json`)

## Estructura de carpetas (real)

```
app/                        # Expo Router (file-based)
├── _layout.tsx             # root layout + Auth Guard global
├── index.tsx               # entry / redirección
├── (auth)/                 # login · register · forgot-password
├── (onboarding)/           # welcome · value-props · pick-city · choose-city
│                           #   · preview · success · splash
└── (app)/                  # app autenticada (tabs)
    ├── index.tsx · explore.tsx · saved.tsx · profile.tsx
    └── city/[slug].tsx
components/
├── ui/                     # átomos: Button · Card · Badge · Input · CityImage
│                           #   · FeatureRow · PaginationDots
├── city/                   # CityCard · SpotCard
└── home/                   # GuideCarousel · ManuelTipCard
stores/                     # Zustand: auth · cities · offline · purchases
services/
├── api/                    # Axios client + endpoints tipados: cities · purchases
├── supabase.ts             # Supabase Auth client
└── storage.ts              # almacenamiento local
hooks/                      # useCity · usePurchases
constants/
├── colors.ts               # tokens de color — nunca hardcodear hex
└── i18n/                   # es.json · en.json · fr.json · index.ts
types/                      # tipos TS compartidos (index.ts)
```

## Comandos

```bash
npx expo start -c          # arrancar con limpieza de caché
npx expo start --ios
npx expo start --android
npm run build              # eas build
```

## Design system — tokens objetivo (Mathias)

> Fuente de verdad de diseño. Implementa SIEMPRE vía `constants/colors.ts` y los
> tokens de tipografía/spacing — nunca hexes ni números sueltos en componentes.

### Colores
```
bgPrimary  #F2F2F7   bgCard      #FFFFFF   navy         #27273E
blueAccent #6B7FD4   blueLight   #76A7FF   textPrimary  #27273E
textSecondary #8E8E93  textMeta  #76A7FF   yellow       #FADF76
badgeGreenBg #E8F5E9   badgeGreenText #4CAF50   white     #FFFFFF
```

### Tipografía
- Logo: Blackout Midnight · UI: Helvetica Now Display
- Tokens: hero-title 24/30 · body 16/24 · card-city 18 medium · btn 16 medium
  · meta 10 · small 12 · quote 18 italic

### Spacing
- Padding horizontal de pantalla: 30px · padding interno cards: 12px
- Radius: sm 2px · md 4–12px · full 9999px

### Componentes canónicos
- **Botón primario:** navy `#1E2048`, texto blanco SemiBold 16, height 56, radius 12, width 100%
- **Input:** fondo blanco, borde `#E5E5EA`, focus 1.5px solid `#6B7FD4`, height 52, radius 8
- **Back button:** círculo 40×40, navy `#1E2048`, chevron blanco
- **City Card:** imagen 80×80 + nombre Bold 18 + metadata 12 `#6B7FD4` + quote italic 13
- **Badge Free:** fondo `#E8F5E9`, texto `#4CAF50` SemiBold 12, padding 4×10, radius 8

## Endpoints que consume

Lista completa en `../CLAUDE.md`. El cliente solo consume; nunca calcula
`is_unlocked` ni se cree una compra. Recuerda: detalle de ciudad bloqueada
devuelve **403** (no 404).

## Estado actual (a 2026-06) — ⚠️ divergencias con el objetivo

Estructura y pantallas scaffolded; muchos ficheros son stubs (`export {}`).
El **código actual diverge del stack/diseño objetivo** — al implementar, alinéalo:

- **Versiones:** `package.json` está en **Expo 51 / React Native 0.74** (el objetivo
  es Expo 54 / RN 0.81). No declares features que tu versión instalada no soporte.
- **i18n:** los JSON viven en `constants/i18n/` (no en `locales/`). **No hay i18next
  ni react-i18next** en dependencias todavía — instálalos y cablea `t()` antes de
  asumir que funcionan. `expo-localization` sí está.
- **Colores:** `constants/colors.ts` exporta hoy `Colors.primary #111827`,
  `Colors.teal #1D9E75`, `Colors.purple #7F77DD`… que **no coinciden** con los
  tokens objetivo de arriba. Migra `colors.ts` al design system de Mathias y usa
  esos nombres; no inventes tokens nuevos en componentes.
- **Sin `services/offline/` ni WatermelonDB ni `@rnmapbox/maps`** aún (fase 6-8,
  bloqueada esperando coordenadas reales de Manuel).
- Tipografía/spacing aún no tienen su token file — créalos en `constants/` al
  implementar (`typography.ts`, `spacing.ts`).

## Reglas no negociables

Detalle en `.claude/standards.md`. Lo crítico del mobile:

- Cero `any` · cero strings hardcodeados (→ `t('key')`) · cero hexes (→ `constants/colors.ts`)
  · cero estilos inline (→ `StyleSheet.create()`).
- Cero llamadas a API desde componentes → stores o `services/`.
- Nunca llamar a Supabase desde screens → siempre vía `services/supabase.ts`.
- `detectSessionInUrl: false` en el cliente Supabase, siempre.
- Toda screen envuelta en `SafeAreaView`; `KeyboardAvoidingView` solo si hay inputs.
- Toda función async maneja `loading` + `error` explícitamente.
- Todo `useEffect` con listeners retorna su cleanup.
- Nunca mutar Zustand state directo → siempre actions.
- Auth: `email.trim().toLowerCase()` siempre; nunca trim a passwords; min 8 / max 128.
  Mismo error para email y password incorrectos. Rate limit: bloquea si <2000ms entre intentos.

## Variables de entorno (nunca commitear valores)

```
EXPO_PUBLIC_SUPABASE_URL
EXPO_PUBLIC_SUPABASE_ANON_KEY
EXPO_PUBLIC_API_BASE_URL
EXPO_PUBLIC_MAPBOX_TOKEN    # fase 6-8
```

## Antes de escribir código, pregúntate

1. ¿Expone datos sensibles?
2. ¿Maneja `loading` + `error`?
3. ¿Es reutilizable o estoy duplicando?
4. ¿Funciona en ES, EN y FR?
5. ¿Qué pasa si falla la red?
