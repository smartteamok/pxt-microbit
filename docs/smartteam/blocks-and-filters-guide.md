# Guía operativa: bloques, filtros y categorías

Esta guía es el manual de uso para mantener el target SmartTeam. Cubre las
tareas que aparecen una y otra vez:

- Agregar, modificar o quitar un bloque SmartTeam.
- Cambiar qué bloques o categorías ve cada grado.
- Renombrar categorías y subcategorías.
- Cambiar colores, íconos, peso y orden.
- Crear un nuevo paquete funcional.
- Dar de alta un nuevo grado.

Es una guía operativa, no un documento de diseño. Para el "por qué" de la
arquitectura ver [Architecture](architecture.md), [Category Taxonomy](category-taxonomy.md)
y [Course Filtering](course-filtering.md).

## Reglas que no cambian

1. Los `blockId` son contratos. Nunca renombres un `blockId` ya publicado.
   Si necesitás migrar uno existente, hacelo con un patch en
   `editor/patch.ts` (ya hay precedentes para shadows de pin y notas).
2. La fuente de verdad del filtro por grado es
   `libs/smartteam-course-<N>/pxt.json`. El editor lo lee a runtime; no
   dupliques el filtro en `editor/extension.tsx`.
3. La namespace de matemáticas de Blockly se llama `Math` (con mayúscula)
   en los filtros, no `math`. La de loops se llama `loops` y no debe
   ocultarse nunca: los wrappers de Control de SmartTeam viven adentro
   vía `blockNamespace=loops`.
4. Cualquier label, group o category visible se replica en
   `_locales/*-strings.json` con la clave correspondiente. Si la clave no
   existe, MakeCode usa el texto del decorador `//% block="..."` como
   fallback, pero la traducción se rompe en otros idiomas.

## Mapa rápido: dónde toco para qué

| Quiero ajustar… | Archivo |
|---|---|
| Texto, ID, parámetros o `weight` de un bloque SmartTeam | `libs/smartteam-<area>/main.ts` |
| Traducción de un bloque, grupo o categoría SmartTeam | `libs/smartteam-<area>/_locales/smartteam-<area>-strings.json` y `-jsdoc-strings.json` |
| Color, ícono, peso y orden de una categoría SmartTeam | Decorador `//%` del namespace en `libs/smartteam-<area>/main.ts` |
| Subcategorías (groups) y su orden | `groups=[...]` del namespace + `//% group="..."` en cada bloque + `{id:group}...` en locales |
| Color, peso o label de una categoría nativa (Lógica, Matemáticas, Texto, …) | `editor/extension.tsx` → `smartTeamNativeToolbox`. Color global: `pxtarget.json` → `appTheme.blockColors` |
| Qué bloques o categorías ve un grado | `libs/smartteam-course-<N>/pxt.json` → `toolboxFilter` |
| Texto del modal de selección de curso | `editor/extension.tsx` → `askSmartTeamCourseAsync` y `smartTeamCourseGrades[i].label` |
| Agregar o quitar un paquete del bundle | `pxtarget.json` → `bundleddirs` |
| Dependencias de un grado | `libs/smartteam-course-<N>/pxt.json` → `dependencies` |
| Migrar proyectos viejos cuando renombrás un blockId | `editor/patch.ts` |

## Receta 1: agregar un bloque SmartTeam

Caso típico: agregar un sensor o un actuador nuevo que sólo aparece a
partir de cierto grado.

1. Elegí el paquete que lo contiene: `smartteam-core`, `smartteam-outputs`,
   `smartteam-motors` o `smartteam-inputs`. Si no encaja en ninguno,
   creá un paquete nuevo (ver Receta 5).
2. Editá `libs/smartteam-<area>/main.ts` y agregá la función con su
   decorador `//%`. Usá un `blockId` estable, con el prefijo del
   namespace y nombre descriptivo en snake_case:

   ```ts
   /**
    * Read an external sensor connected to a digital pin.
    * @param pin input pin
    */
   //% blockId=smartteam_inputs_my_sensor_pin
   //% block="MI SENSOR en el pin $pin"
   //% pin.shadow=digital_pin_shadow
   //% pin.defl=DigitalPin.P0
   //% group="External"
   //% weight=60
   export function mySensorPin(pin: DigitalPin): boolean {
       return pins.digitalReadPin(pin) === 1;
   }
   ```

3. Si el bloque tiene un parámetro estructurado (pin, número, nota,
   melodía), declaralo con `param.shadow=` y `param.defl=` para que el
   shadow block sea correcto en el toolbox.
4. Agregá la traducción en
   `libs/smartteam-<area>/_locales/smartteam-<area>-strings.json`:

   ```json
   "smartteamDigitalInputs.mySensorPin|block": "MI SENSOR en el pin $pin"
   ```

   Y la docstring localizada en
   `libs/smartteam-<area>/_locales/smartteam-<area>-jsdoc-strings.json`:

   ```json
   "smartteamDigitalInputs.mySensorPin": "Read an external sensor connected to a digital pin.",
   "smartteamDigitalInputs.mySensorPin|param|pin": "input pin"
   ```

   **Otros idiomas:** la fuente visible en inglés está en esos mismos
   archivos base de `_locales/`. Para regenerar las variantes
   (`es-ES`, `pt-BR`, `pt-PT`, etc.) y mantener alineadas las entradas
   `files` de cada `libs/smartteam-*/pxt.json`, ejecutá en la raíz del
   repo:

   ```bash
   node scripts/generate-smartteam-locales.js
   npx pxt buildtarget
   ```

5. Si el bloque sólo debe verse a partir de cierto grado, agregá su
   `blockId` a `toolboxFilter.blocks` con valor `"hidden"` en cada
   `libs/smartteam-course-<N>/pxt.json` donde no debe aparecer (ver
   Receta 3).
6. Reconstruí: `npx pxt buildtarget`. Validá en el simulador local
   (`pxt serve`) que el bloque aparece en la categoría correcta y que
   los grados anteriores no lo muestran.

## Receta 2: modificar un bloque existente

| Tipo de cambio | Acción |
|---|---|
| Renombrar el texto visible (con o sin parámetros) | Cambiar `//% block="..."` y la entrada `<namespace>.<func>|block` en `_locales/*-strings.json`. |
| Cambiar el shadow o el default de un parámetro | Cambiar `param.shadow=` o `param.defl=`. |
| Mover el bloque a otra subcategoría | Cambiar `//% group="..."`. Si el grupo nuevo no existe, agregarlo a `groups=[...]` del namespace y a `_locales` con la clave `{id:group}<Nombre>`. |
| Cambiar el orden dentro de la categoría | Cambiar `//% weight=...`. Mayor `weight` aparece más arriba. |
| Marcarlo como avanzado / oculto del toolbox | Agregar `//% blockHidden=true` o `//% advanced=true`. Mejor preferir filtros por curso si la condición depende del grado. |

No renombres `blockId`. Si la API cambió de tal manera que el bloque
viejo ya no es compatible, marcá el viejo `//% deprecated=true`,
agregá uno nuevo con un `blockId` distinto y, si hace falta, una
migración en `editor/patch.ts`.

## Receta 3: ocultar o mostrar bloques por grado

Esta es la operación más frecuente. Hay dos sub-casos.

### 3.a. Ocultar/mostrar una categoría completa en un grado

1. Abrir `libs/smartteam-course-<N>/pxt.json`.
2. En `toolboxFilter.namespaces` agregar la clave del namespace con
   `"hidden"` o `"visible"`. Recordatorios:
   - Las namespaces nativas relevantes: `basic`, `input`, `music`, `led`,
     `light`, `pins`, `serial`, `radio`, `control`, `game`, `images`,
     `arrays`, `logic`, `Math`, `text`, `variables`, `functions`.
   - `loops` no se oculta nunca (ver "Reglas que no cambian").
   - Las namespaces SmartTeam usan el nombre TypeScript:
     `smartteamCore`, `smartteamOutputs`, `smartteamMotors`,
     `smartteamDigitalInputs`, `smartteamAnalogInputs`.

   Ejemplo:

   ```json
   "toolboxFilter": {
       "namespaces": {
           "Math": "hidden",
           "text": "hidden",
           "smartteamAnalogInputs": "hidden"
       },
       "blocks": {}
   }
   ```

3. Reconstruir el target (`npx pxt buildtarget`). Crear un proyecto
   nuevo de ese grado y verificar que la categoría no aparece en el
   toolbox de Blockly y que los bloques del paquete están ocultos en
   Monaco.

### 3.b. Ocultar bloques individuales

1. Abrir `libs/smartteam-course-<N>/pxt.json`.
2. En `toolboxFilter.blocks`, agregar el `blockId` con `"hidden"`. Es la
   misma clave que figura en `//% blockId=...` del bloque.

   Ejemplo:

   ```json
   "blocks": {
       "smartteam_motors_robot_move": "hidden",
       "smartteam_motors_robot_move_speed": "hidden"
   }
   ```

3. Si el bloque todavía no existe (por ejemplo lo estás "reservando"
   para un grado superior), implementalo primero como bloque real, aunque
   sea un stub. Filtrar IDs inexistentes funciona pero queda sin
   verificación: cualquier typo se vuelve invisible.
4. Reconstruir y validar. Para auditar el set efectivo en runtime, mirar
   `built/target.json` en `bundledpkgs.smartteam-course-<N>["pxt.json"]`.

### Cómo se aplica en la práctica

- En proyecto nuevo: `editor/extension.tsx` lee `toolboxFilter` desde el
  `pxt.json` bundleado y lo inyecta en `ProjectCreationOptions.filters`
  y en el `editorState`. El toolbox queda filtrado al instante.
- En proyecto reabierto: PXT reaplica el `toolboxFilter` que quedó
  guardado en el `pxt.json` raíz del proyecto, que es copia del
  `pxt.json` del curso seleccionado al momento de la creación.

## Receta 4: renombrar o recolorear una categoría

### 4.a. Categoría SmartTeam (Salidas, Motores, Entradas D, Entradas ~A, Control SmartTeam)

1. Abrir `libs/smartteam-<area>/main.ts`.
2. En el decorador del namespace, cambiar:
   - `//% block="..."` para la label visible.
   - `//% color="..."` para el color (hex).
   - `//% icon="\uXXXX"` para el ícono Unicode (Font Awesome).
   - `//% weight=...` para el orden (más alto = más arriba).
3. Replicar la label en `_locales/smartteam-<area>-strings.json`:

   ```json
   "smartteamOutputs|block": "Salidas"
   ```

4. Reconstruir.

### 4.b. Categoría nativa (Funciones, Lógica, Matemáticas, Texto, Variables, Listas)

1. Abrir `editor/extension.tsx` y editar `smartTeamNativeToolbox`:

   ```ts
   const smartTeamNativeToolbox: pxt.editor.ToolboxDefinition = {
       functions: { name: "Funciones", weight: 110, color: "#7E57C2" },
       loops:     { name: "Control",   weight: 100, color: "#FF9800" },
       logic:     { name: "Lógica",    weight: 50,  color: "#3BC64A" },
       maths:     { name: "Matemáticas", weight: 45, color: "#9400D3" },
       text:      { name: "Texto",     weight: 40, color: "#B8860B" },
       variables: { name: "Variables", weight: 35, color: "#DC143C" },
       arrays:    { name: "Listas",    weight: 20, color: "#E65722" }
   };
   ```

2. Si vas a cambiar el color global del namespace y no sólo en este
   target, sincronizá también `pxtarget.json` →
   `appTheme.blockColors`.
3. Para localizar los nombres, envolver cada `name:` con `lf("...")`.
4. Reconstruir el editor: `npx pxt buildtarget`.

## Receta 5: crear un nuevo paquete funcional

Aplica cuando agregás una familia de bloques nueva (por ejemplo
`smartteam-display` o `smartteam-communication`).

1. Crear la carpeta `libs/smartteam-<nombre>/` con los archivos:
   - `pxt.json`
   - `main.ts`
   - `README.md`
   - `_locales/smartteam-<nombre>-strings.json`
   - `_locales/smartteam-<nombre>-jsdoc-strings.json`
2. Modelo de `pxt.json`:

   ```json
   {
       "name": "smartteam-<nombre>",
       "description": "...",
       "files": [
           "README.md",
           "main.ts"
       ],
       "public": true,
       "dependencies": {
           "core": "file:../core",
           "microphone": "file:../microphone"
       }
   }
   ```

3. Modelo de `main.ts`:

   ```ts
   //% block="<Etiqueta visible>"
   //% color="#3F51B5"
   //% icon="\uf2db"
   //% weight=60
   //% groups=["Grupo A", "Grupo B"]
   namespace smartteam<Nombre> {
       // bloques...
   }
   ```

4. Registrar el paquete en `pxtarget.json` → `bundleddirs`:

   ```json
   "libs/smartteam-<nombre>"
   ```

5. Sumarlo como dependencia en cada `libs/smartteam-course-<N>/pxt.json`
   donde el grado deba tenerlo:

   ```json
   "dependencies": {
       "smartteam-<nombre>": "file:../smartteam-<nombre>"
   }
   ```

6. Si el paquete tiene bloques que sólo deben verse a partir de cierto
   grado, ocultar sus `blockId` en los grados anteriores siguiendo la
   Receta 3.b.

## Receta 6: dar de alta un grado nuevo

Sólo si la currícula crece a 7° o si querés un perfil paralelo
(por ejemplo "secundaria-introductorio").

1. Crear `libs/smartteam-course-<N>/` siguiendo el patrón de los
   existentes:
   - `pxt.json` con `dependencies` y `toolboxFilter`.
   - `main.ts` con un comentario único (`// SmartTeam course profile package. Toolbox filtering lives in pxt.json.`).
   - `README.md`.
   - `_locales/...` aunque estén vacíos: el build lo espera.
2. Registrar el paquete en `pxtarget.json` → `bundleddirs`.
3. Agregar la entrada en `editor/extension.tsx` →
   `smartTeamCourseGrades`:

   ```ts
   { grade: 7, label: lf("7mo grado"), dependency: "smartteam-course-7" }
   ```

4. Reconstruir el target.

No hace falta tocar nada más en `extension.tsx`: el filtro se carga
solo desde el `pxt.json` del curso nuevo.

## Receta 7: migrar un blockId publicado

Sólo cuando ya está claro que el ID viejo no puede convivir con el
nuevo (por ejemplo cambia la firma o se simplifica un parámetro).

1. Renombrar el bloque en su `main.ts` con un `blockId` nuevo. Mantener
   el viejo bloque marcado como `//% deprecated=true` con la firma
   anterior por un release.
2. Replicar el ID viejo a oculto en cada `course-N/pxt.json` que
   corresponda.
3. Agregar un patch en `editor/patch.ts` siguiendo el patrón:

   ```ts
   pxt.U.toArray(dom.querySelectorAll("block[type=smartteam_old_id]"))
       .forEach(node => {
           node.setAttribute("type", "smartteam_new_id");
           // ajustar campos/valores si la firma cambió
       });
   ```

4. Sumar tests en `tests/` si hay infraestructura para ello.

## Verificación recomendada después de cualquier cambio

- `npx tsc --noEmit -p editor/tsconfig.json` para chequear el editor.
- `npx pxt buildtarget` para validar que el target completo compila y
  se reempaqueta sin warnings nuevos.
- Inspección rápida con Node:

  ```bash
  node -e 'const t = require("./built/target.json"); for (const k of Object.keys(t.bundledpkgs).filter(x => x.startsWith("smartteam-course-"))) { const cfg = JSON.parse(t.bundledpkgs[k]["pxt.json"]); console.log(k, "ns:", Object.keys(cfg.toolboxFilter.namespaces).length, "blocks:", Object.keys(cfg.toolboxFilter.blocks).length); }'
  ```

  Útil para detectar de un vistazo si un curso quedó vacío o con un
  filtro inesperado.
- `pxt serve` y crear proyectos de cada grado para una verificación
  visual del toolbox.

## Errores frecuentes

- Olvidar registrar un paquete nuevo en `pxtarget.json.bundleddirs`.
  Síntoma: el bloque no aparece y no hay error.
- Cambiar un `blockId` por error al agregar un bloque "futuro". Síntoma:
  el filtro queda silenciosamente roto.
- Usar `math` (minúscula) en `toolboxFilter.namespaces`. Blockly llama
  a esa namespace `Math`; con minúscula no se aplica el filtro.
- Ocultar `loops`. Rompe los wrappers de Control. Para esconder una
  parte de Control, ocultá los `blockId` específicos.
- Cambiar la label de una categoría sólo en `main.ts` y olvidar el
  `_locales/*-strings.json`: la traducción al español-AR/EN/etc se
  pierde.
- Editar manualmente `docs/projects.md`. Es regenerado por
  `pxt buildtarget` desde `targetconfig.json` `galleries`. Tocar
  `targetconfig.json`.
