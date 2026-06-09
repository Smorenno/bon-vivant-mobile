# .claude/ — bon-vivant-mobile

Config de Claude Code para la app móvil.

- **`../CLAUDE.md`** — fuente de verdad del repo: stack, estructura, design system, estado actual.
- **`standards.md`** — reglas no negociables de seguridad y calidad React Native. Léelo antes de codear.
- **`data-model.md`** — contrato de datos de las guías + ejemplo `CityGuide`. Espejo de Confluence.
- **`settings.json`** — permisos (expo/metro/watchman) + `systemPrompt` que recuerda leer `standards.md` y `data-model.md`.

Contexto compartido entre repos: `../../CLAUDE.md` (paraguas).

---

## Antes de tocar nada que afecte al JSON de las guías

> Si tu cambio toca `types/guide.ts`, los mocks, los stores de guías, o cualquier
> render de una sección de guía: **LEE `.claude/data-model.md` ANTES de empezar.**
> Es el contrato que comparten backend y front. No añadas, renombres ni cambies
> campos sin que coincida con ese archivo (y con Confluence). Si el contrato se
> queda corto, **PÁRALO y coméntalo** — no improvises una estructura nueva ni lleves
> el desarrollo en otra dirección.
