# Filtros y personalización de bloques

Guía corta: qué archivos tocar y en qué orden. Detalle amplio: [Blocks and Filters Guide](blocks-and-filters-guide.md) y [Course Filtering](course-filtering.md).

## 1. Visibilidad por grado (filtros)

**Archivo:** `libs/smartteam-course-<N>/pxt.json` (`<N>` = 1 … 6).

**Campo:** `toolboxFilter`

- **`namespaces`:** clave = id de categoría/namespace en MakeCode (ej. `logic`, `led`, `control`). Para matemáticas usar **`Math`** (mayúscula), no `math`.
- **`blocks`:** clave = **`blockId`** exacto del bloque (`//% blockId=...` en el código fuente).

**Valores:** `"hidden"` | `"visible"` | `"disabled"`.

**Reglas:**

- Lo que no aparece en el mapa no pasa por el filtro explícito; en la práctica suele mostrarse lo que el proyecto ya carga. Para ocultar algo de forma clara, listarlo con `"hidden"`.
- El curso debe declarar en **`dependencies`** el paquete que define el bloque. Sin dependencia, el bloque no existe en el proyecto aunque el filtro diga `"visible"`.

**Después de editar:** `npx pxt buildtarget`. El editor lee el filtro desde el `pxt.json` empaquetado (`bundledpkgs`), no desde el archivo del repo en caliente sin rebuild.

**No duplicar** listas de filtros en `editor/extension.tsx`; ahí solo metadatos de curso (grado, etiqueta, dependencia) y UI del toolbox nativo.

## 2. Definición y texto de bloques SmartTeam

**Archivos:** `libs/smartteam-<área>/main.ts`.  
**Áreas:** `smartteam-core`, `smartteam-outputs`, `smartteam-motors`, `smartteam-inputs`.

- Decoradores `//%`: `blockId` (estable una vez publicado), `block`, `group`, `weight`, sombras de parámetros, etc.
- Traducción y doc: `libs/smartteam-<área>/_locales/smartteam-<área>-strings.json` y `*-jsdoc-strings.json` (inglés como base en repo).
- Otros idiomas: en la raíz del repo, `node scripts/generate-smartteam-locales.js`, luego `npx pxt buildtarget`.

**Si un bloque no debe verse en un grado:** agregar su `blockId` con `"hidden"` en `toolboxFilter.blocks` de los `pxt.json` de curso correspondientes (y rebuild).

## 3. Categorías nativas (solo presentación)

**Archivo:** `editor/extension.tsx` → `smartTeamNativeToolbox`.  
Renombre, orden, color de categorías **nativas** del micro:bit. No sustituye `toolboxFilter` del curso.

## 4. Secuencia habitual

1. Cambiar bloque o categoría SmartTeam en `libs/smartteam-*/main.ts` y locales si hace falta.
2. Ajustar `toolboxFilter` y, si corresponde, `dependencies` en `libs/smartteam-course-*/pxt.json`.
3. `node scripts/generate-smartteam-locales.js` si tocaste cadenas base o el script de idiomas.
4. `npx pxt buildtarget`.
5. Probar creando un **proyecto nuevo** con el grado afectado; proyectos viejos pueden llevar filtro guardado en su propio estado.
