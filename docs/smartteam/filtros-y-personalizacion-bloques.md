# Filtros y personalización de bloques

Guía corta: qué archivos tocar y en qué orden. Detalle amplio: [Blocks and Filters Guide](blocks-and-filters-guide.md) y [Course Filtering](course-filtering.md).

## 1. Visibilidad por perfil (filtros) — modelo allow-list

**Archivo:** `editor/smartteam/profiles.ts` (fuente única de verdad). Los `pxt.json` de curso ya **no** llevan `toolboxFilter`: solo dependencias.

**Modelo:** allow-list. Cada perfil tiene un `filter`:

- **`defaultState`:** `"hidden"` para cursos curados (todo oculto salvo lo permitido) · `"visible"` para "Modo libre" (todo visible).
- **`visibleBlocks`:** lista de **`blockId`** a mostrar cuando el default es `"hidden"`. Agregar un bloque nuevo a un grado = añadir su id aquí (o a `COMMON_VISIBLE`). Si no se agrega, queda oculto automáticamente; **no hay que ocultar bloques futuros uno por uno**.
- **`hiddenBlocks`:** lista opcional para ocultar explícitamente (sobre todo en "Modo libre").
- **`namespaces`:** categorías a revelar cuando el default es `"hidden"`. Para matemáticas usar **`Math`** (mayúscula), no `math`.

**Reglas:**

- El blockId debe existir realmente. `node scripts/validate-toolbox-filters.js` valida la lista contra el inventario (`docs/smartteam/native-blocks-inventory.generated.md`) y corre en CI.
- El paquete del perfil (`dependencies` del perfil) debe traer el lib que define el bloque. Sin dependencia, el bloque no existe aunque esté en `visibleBlocks`.
- **Nuevas modalidades:** agregar otra entrada a `PROFILES` (con su `group`, p.ej. `"Modos"`); el selector las agrupa solo.
- El filtro se inyecta en runtime (gana sobre el `toolboxFilter` de paquete). Tras editar: `npx pxt buildtarget`.

**Después de editar:** `npx pxt buildtarget`. El editor lee el filtro desde el `pxt.json` empaquetado (`bundledpkgs`), no desde el archivo del repo en caliente sin rebuild.

**No duplicar** listas de filtros en `editor/extension.tsx`; ahí solo metadatos de curso (grado, etiqueta, dependencia) y UI del toolbox nativo.

## 2. Definición y texto de bloques SmartTeam

**Archivos:** `libs/smartteam-<área>/main.ts`.  
**Áreas:** `smartteam-core`, `smartteam-outputs`, `smartteam-motors`, `smartteam-inputs`.

- Decoradores `//%`: `blockId` (estable una vez publicado), `block`, `group`, `weight`, sombras de parámetros, etc.
- Traducción y doc: `libs/smartteam-<área>/_locales/smartteam-<área>-strings.json` y `*-jsdoc-strings.json` (inglés como base en repo).
- Otros idiomas: en la raíz del repo, `node scripts/generate-smartteam-locales.js`, luego `npx pxt buildtarget`.

**Si un bloque no debe verse en un grado:** agregar su `blockId` con `"hidden"` en `toolboxFilter.blocks` de los `pxt.json` de curso correspondientes (y rebuild).

**RGB / NeoPixel:** los bloques de LEDs RGB viven en `libs/smartteam-outputs/main.ts`, grupo `RGB`, y usan el mapeo de puertos de `libs/smartteam-shield`. Sus IDs son `smartteam_outputs_rgb_leds_color`, `smartteam_outputs_rgb_leds_rgb` y `smartteam_outputs_rgb_leds_clear`; 1° los oculta en `toolboxFilter.blocks` y 2° en adelante los deja visibles.

## 3. Categorías nativas (solo presentación)

**Archivo:** `editor/extension.tsx` → `smartTeamNativeToolbox`.  
Renombre, orden, color de categorías **nativas** del micro:bit. No sustituye `toolboxFilter` del curso.

## 4. Secuencia habitual

1. Cambiar bloque o categoría SmartTeam en `libs/smartteam-*/main.ts` y locales si hace falta.
2. Ajustar `toolboxFilter` y, si corresponde, `dependencies` en `libs/smartteam-course-*/pxt.json`.
3. `node scripts/generate-smartteam-locales.js` si tocaste cadenas base o el script de idiomas.
4. `npx pxt buildtarget`.
5. Probar creando un **proyecto nuevo** con el grado afectado; proyectos viejos pueden llevar filtro guardado en su propio estado.
