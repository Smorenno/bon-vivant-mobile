# Development Standards — Bon Vivant Mobile

Lee este archivo antes de escribir cualquier línea de código del cliente.
Cada regla se cumple sin excepción. El núcleo de seguridad es compartido con
el repo backend (ver `../../CLAUDE.md`).

---

## Seguridad

### Auth y datos
- Nunca loguear passwords, tokens, JWTs ni datos personales.
- Nunca exponer mensajes crudos de terceros → siempre mensaje genérico al usuario.
- Mismo mensaje para email incorrecto Y password incorrecto (anti-enumeración).
- Mismo response en password reset exista o no el email.
- `email.trim().toLowerCase()` siempre. **Nunca** hagas trim a passwords (los espacios son válidos).
- Password: mínimo 8 chars, máximo 128.
- `detectSessionInUrl: false` en todos los clientes Supabase de React Native, siempre.
- Nunca almacenar tokens en AsyncStorage en claro sin encriptar.
- Rate limit en todos los forms de auth: bloquea si <2000ms entre intentos.
- El cliente nunca calcula `is_unlocked` ni se cree una compra: eso es verdad del backend.
- Recurso existente sin acceso devuelve **403** (no 404) — trátalo como tal en la UI.

### Secrets
- Nunca poner secrets en código — solo en variables de entorno `EXPO_PUBLIC_*`.
- Solo la `anon key` de Supabase en el cliente; jamás `service_role`.

---

## Calidad de código

### General
- Cero `any` en TypeScript, cero `as unknown`. Nunca.
- Sin returns implícitos en funciones async.
- Maneja todos los rechazos de promesas — sin errores async sin capturar.
- Borra código muerto, no lo comentes y lo dejes.
- Cero strings hardcodeados en UI → siempre `t('key')` (claves en inglés).
- Cero colores hardcodeados → siempre `constants/colors.ts`.
- Sin números mágicos → constantes con nombre en `constants/`.

### React Native
- Toda screen envuelta en `SafeAreaView`.
- `KeyboardAvoidingView` solo en screens con inputs.
- Cero estilos inline → `StyleSheet.create()` o tokens de `constants/`.
- Maneja `loading` y `error` en CADA operación async.
- Nunca mutar Zustand state directo → siempre vía actions.
- Todo `useEffect` con listeners/suscripciones retorna su cleanup.

---

## Escalabilidad

- La lógica de negocio vive en `services/` — nunca en componentes ni screens.
- Cero llamadas directas a Supabase desde screens → siempre vía `services/supabase.ts`.
- Cero llamadas a API desde componentes → vía stores o `services/api/`.
- Reutiliza componentes — nunca dupliques UI.
- i18n desde el día uno: los 3 idiomas (es/en/fr) se añaden siempre juntos.
- Config por entorno en `.env` (`EXPO_PUBLIC_*`) — nunca en código.

---

## Git y workflow

- Conventional Commits: `feat:` / `fix:` / `chore:` / `docs:` / `refactor:`.
- Nunca commitear `.env` ni `node_modules`.
- Una responsabilidad por función — si hace dos cosas, divídela.

---

## Antes de escribir código, pregúntate

1. ¿Expone datos sensibles?
2. ¿Maneja `loading` + `error`?
3. ¿Es reutilizable o estoy duplicando?
4. ¿Funciona en ES, EN y FR?
5. ¿Qué pasa si falla la red?
