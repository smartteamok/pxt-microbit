# Funcionamiento y creación de bloques SmartTeam

Guía corta. Visibilidad por grado y filtros: [Filtros y personalización de bloques](filtros-y-personalizacion-bloques.md). Recetas largas: [Blocks and Filters Guide](blocks-and-filters-guide.md).

## Dónde está el código que ejecuta el bloque

En **`libs/smartteam-<área>/main.ts`** (`smartteam-core`, `smartteam-outputs`, `smartteam-motors`, `smartteam-inputs`). Cada bloque es una **`export function`** con decoradores `//%`; el **cuerpo de la función** es lo que corre en el micro:bit y en el simulador (vía APIs estándar del target, p. ej. `pins`, `music`). Este repo no define simulador aparte bajo `sim/` solo para SmartTeam.

## Ajustar el funcionamiento de un bloque existente

1. Editá **`main.ts`**: lógica, límites, llamadas a APIs. Si cambian parámetros o la forma del bloque, actualizá también los `//%` (`block`, `param.shadow=`, `defl`, `min`/`max`, etc.).
2. Si cambia texto de bloque o de tooltips: **`_locales/smartteam-<área>-strings.json`** y **`_locales/smartteam-<área>-jsdoc-strings.json`**. Después, si aplica: `node scripts/generate-smartteam-locales.js` y `npx pxt buildtarget`.
3. **No renombres** un `blockId` ya publicado. Si necesitás una API distinta e incompatible, nuevo `blockId` y, si hace falta, **`editor/patch.ts`** para proyectos guardados.
4. **`npx pxt buildtarget`**. Probar con un proyecto nuevo que use el curso/paquete correcto.

## Crear un bloque nuevo (mismo paquete)

1. Elegí **`libs/smartteam-<área>/main.ts`** (core / outputs / motors / inputs).
2. Nuevo **`blockId`** único y estable; `//% block`, `group`, `weight`, sombras y valores por defecto coherentes con el namespace.
3. Añadí claves en **`_locales/smartteam-<área>-strings.json`** y **`*-jsdoc-strings.json`** (inglés en repo).
4. **Cursos:** el paquete debe estar en **`dependencies`** de cada `libs/smartteam-course-<N>/pxt.json` que deba incluir ese código. En **`toolboxFilter.blocks`**, usá **`"hidden"`** (y el resto de valores que defináis) para controlar en qué grado se ve el bloque.
5. `node scripts/generate-smartteam-locales.js` si tocáis locales o el generador; **`npx pxt buildtarget`**.

### Ejemplo actual: servo en Motores

Los bloques de servo viven en **`libs/smartteam-motors/main.ts`**, dentro del namespace `smartteamMotors` y el grupo `Servo`. Sus IDs estables son `smartteam_motors_servo_set_angle` y `smartteam_motors_servo_move_gradually`. Como pertenecen al paquete `smartteam-motors`, aparecen en los cursos que dependen de ese paquete salvo que el curso los oculte explícitamente; 1° los lista como `"hidden"` en `libs/smartteam-course-1/pxt.json`, y 2° los deja visibles.

## Nuevo paquete de bloques (área nueva)

1. Carpeta **`libs/<nombre>/`** con **`main.ts`**, **`pxt.json`** (`name`, `files`, `dependencies`, `public`).
2. **`pxtarget.json`** → **`bundleddirs`**: incluir `libs/<nombre>`.
3. **`libs/smartteam-course-<N>/pxt.json`** → **`dependencies`** hacia el paquete nuevo donde corresponda; **`toolboxFilter`** como arriba.
4. Locales y generador: el script actual cubre los cuatro paquetes `smartteam-*`; un paquete distinto requiere entradas propias en `_locales` y, si queréis el mismo flujo, extender **`scripts/generate-smartteam-locales.js`** y el **`files`** del `pxt.json` del paquete.

## Orden práctico (resumen)

| Objetivo | Archivos principales |
|----------|----------------------|
| Cambiar qué hace el bloque | `libs/smartteam-*/main.ts` |
| Texto / doc en editor | `libs/smartteam-*/_locales/*.json` (+ generador si aplica) |
| Quién lo ve por grado | `libs/smartteam-course-*/pxt.json` → `toolboxFilter`, `dependencies` |
| Proyectos viejos rotos por cambio de bloque | `editor/patch.ts` |
| Publicar cambios al editor/target | `npx pxt buildtarget` |
