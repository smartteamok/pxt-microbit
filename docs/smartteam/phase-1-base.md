# SmartTEAM phase 1 base

## Carpetas creadas

- `libs/smartteam-core`
- `libs/smartteam-shield`
- `libs/smartteam-inputs`
- `libs/smartteam-outputs`
- `libs/smartteam-motors`
- `libs/smartteam-display`
- `libs/smartteam-course-config`

## Archivos modificados

- `pxtarget.json`
  - Se agregaron los paquetes SmartTEAM en `bundleddirs` para que el target los conozca localmente.
- `libs/blocksprj/pxt.json`
  - Se agregaron dependencias SmartTEAM para que un proyecto nuevo en Blocks cargue estas categorias.
- `libs/tsprj/pxt.json`
  - Se agregaron dependencias SmartTEAM para mantener consistencia en proyectos TypeScript nuevos.
- `libs/smartteam-*/pxt.json` (todos los paquetes SmartTEAM bajo `libs/`)
  - Cada paquete declara las mismas dependencias base que el proyecto por defecto (`core`, `radio`, `microphone`) ademas de SmartTEAM donde corresponda. Sin `radio` y `microphone` explicitos, el build del target puede intentar inyectar dependencias con version `*` durante `MainPackage.loadAsync()` y fallar al resolver la config embebida del paquete.

## Como PXT registra paquetes locales y por que el toolbox mostraba solo lo nativo

Referencia inspeccionada en `pxt-core` (CLI): al compilar el target, `buildTargetCoreAsync` llama a `updateDefaultProjects(cfg)`.

1. **`bundleddirs` en `pxtarget.json`**  
   Lista carpetas bajo `libs/` que se compilan y se publican en `built/target.json` como `bundledpkgs` (fuentes + API). Esto **no** define solo el toolbox: habilita que el paquete exista en el target embebido.

2. **Proyecto por defecto para “Nuevo proyecto”**  
   No se lee `libs/blocksprj/pxt.json` en caliente en el navegador. El CLI copia `libs/blocksprj` y `libs/tsprj` dentro de `cfg.blocksprj` / `cfg.tsprj` en **`built/target.json`**, reemplazando dependencias `file:...` por `*`. El editor carga esa config al crear un proyecto nuevo.

3. **Por que no alcanzaba con editar solo `libs/blocksprj/pxt.json`**  
   La carpeta `built/` esta en `.gitignore`. Si no se vuelve a ejecutar un build del target, `built/target.json` sigue con el `blocksprj` viejo (solo `core`, `radio`, `microphone`) y el toolbox nunca ve SmartTEAM.

4. **Patron de paquetes que si aparecen en el toolbox**  
   Paquetes como `datalogger` usan namespaces con anotaciones `//%` en lineas separadas (`block`, `icon`, `color`) y dependen de otros `libs/` via `pxt.json`. El “Basic / Input / Music” del micro:bit viene del **core** (`libs/core` + `pxt-common-packages`), no de `libs/` sueltos.

### Comando obligatorio despues de cambiar dependencias del proyecto por defecto o paquetes bundled

Ejecutar al menos una vez (o usar `npx pxt serve` **sin** `--just`, que vuelve a compilar el target):

```bash
cd pxt-microbit
npx pxt buildtarget
```

(O `npx pxt buildtarget --skip-core` para acelerar si el entorno lo permite.) Luego recargar el editor y crear un proyecto nuevo.

## Bloques de validacion implementados

- `smartteamCore.waitMs` -> **Esperar (ms)**
- `smartteamOutputs.turnLedOn` -> **Prender el LED**
- `smartteamOutputs.setLedBrightness` -> **Ajustar el brillo del LED**
- `smartteamOutputs.playTone` -> **Reproducir tono**
- `smartteamOutputs.stopBuzzer` -> **Apagar zumbador**
- `smartteamMotors.turnDcMotor` -> **Girar el MOTOR DC**

## Archivo placeholder de configuracion

- `libs/smartteam-course-config/course-config.json`
- `libs/smartteam-course-config/config.ts`

Se incluye como base para futura configuracion por grado/curso. No esta conectado a UI ni a filtrado dinamico del toolbox.

## Como probar localmente

1. Desde la raiz del target: `npx pxt buildtarget` (o `npx pxt serve` sin `--just`) para regenerar `built/target.json`.
2. Ejecutar: `npx pxt serve`
3. Crear un proyecto nuevo (el template usa `blocksprj` embebido en `built/target.json`).
4. Verificar que aparecen las categorias SmartTEAM (p. ej. “SmartTEAM Core”, “SmartTEAM Salidas”, “SmartTEAM Motores”) en el toolbox.
5. Arrastrar al menos un bloque SmartTEAM al workspace.
6. Compilar y descargar el `.hex`.

**Nota:** `npx pxt serve --just` sirve archivos sin reconstruir el target; deja `built/target.json` desactualizado respecto a `libs/blocksprj/pxt.json`.

## No implementado intencionalmente

- Modal de seleccion de curso.
- Filtrado dinamico del toolbox por grado/curso.
- Separacion por paquete por grado.
- Cambios en login, cloud sync, autenticacion, branding, home o UI general.

## Toolbox SmartTEAM

La organizacion visible del toolbox se controla en dos niveles:

- `editor/extension.tsx`
  - Define `toolboxOptions` para renombrar y ordenar las categorias integradas del editor: `Funciones`, `Control`, `Lógica`, `Matemáticas`, `Variables` y `Texto`.
- Anotaciones `//%` en los namespaces de paquetes:
  - `blockNamespace=loops` mueve `basic` y `control` a `Control`.
  - `blockNamespace=smartteamInputs` mueve `input` y `pins` a `Entradas`.
  - `blockNamespace=smartteamOutputs` mueve `music` y sonidos a `Salidas`.
  - `blockNamespace=smartteamDisplay` mueve `led` e `images` a `Pantallas`.
  - `blockNamespace=radio` mueve `serial` y `console` a la categoria de comunicacion; `libs/radio/targetoverrides.ts` etiqueta esa categoria como `Comunicación`.

Los paquetes SmartTEAM visibles quedan nombrados como `Entradas`, `Salidas`, `Pantallas` y `Motores`. `smartteam-core` se reubica bajo `Control` para evitar una categoria separada.
