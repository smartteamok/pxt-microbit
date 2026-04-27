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

1. Ejecutar: `npx pxt serve`
2. Crear un proyecto nuevo.
3. Verificar que aparecen las categorias/bloques SmartTEAM en el toolbox.
4. Arrastrar al menos un bloque SmartTEAM al workspace.
5. Compilar y descargar el `.hex`.

## No implementado intencionalmente

- Modal de seleccion de curso.
- Filtrado dinamico del toolbox por grado/curso.
- Separacion por paquete por grado.
- Cambios en login, cloud sync, autenticacion, branding, home o UI general.
