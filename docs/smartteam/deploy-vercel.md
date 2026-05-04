# Deploy a Vercel

El target se publica como **sitio estático** generado por `pxt staticpkg`. La salida queda en `built/packaged/` y Vercel sólo sirve archivos. Hay dos modos de uso. **Recomendado: integración con GitHub**.

## Modo A — Conexión con GitHub (auto-deploy en cada push)

Vercel ejecuta `npm install` y `npm run package` en cada push, y publica `built/packaged/`.

### 1. Configuración en el repo

`vercel.json` (en la raíz, ya incluido):

```json
{
    "framework": null,
    "installCommand": "npm install",
    "buildCommand": "npm run package",
    "outputDirectory": "built/packaged"
}
```

`package.json` declara `engines.node >=18` para forzar runtime moderno (Vercel default ya es Node 20+).

### 2. Importar el repo en Vercel

- En Vercel: **Add New → Project → Import Git Repository** y elegir el fork SmartTeam.
- En **Build & Output Settings** dejar todo en *Override = vercel.json*.
- **Production Branch**: la rama que quieras (`main`, `smartteam/course-target-plan`, etc.).
- **Root Directory**: la raíz del repo (no subdirectorio).
- Save.

### 3. Flujo

- Push a la **production branch** → deploy de producción.
- Push a otra rama o PR → preview URL automática.
- Logs del build: pestaña **Deployments → Build Logs**.

### 4. Tiempos y límites

- `pxt buildtarget` + `pxt staticpkg` toma ~1–2 min de build.
- El bundle ronda decenas de MB (incluye sim, docs, hexcache references). Encaja en plan Hobby/Pro.
- Aviso conocido: el simulador imprime warnings de TypeScript (`sim/state/record-audio.ts`, `sim/visuals/microbit.ts`); el build sigue y termina con éxito.

### 5. Variables y dominios

- Variables de entorno desde **Project Settings → Environment Variables**. Hoy el target no requiere ninguna. Si más adelante se agregan claves de cloud o telemetría, ahí.
- Dominio personalizado: **Settings → Domains**. Si el dominio queda en raíz (`/`), nada cambia. Si quedara en subdirectorio, hay que ajustar `--route /<sub>` en el script `package` y reconstruir.

## Modo B — Deploy local prebuilt (alternativa)

Para empujar manualmente sin ir por GitHub:

```bash
npm install
npm run package
npx vercel deploy built/packaged           # preview
npx vercel deploy built/packaged --prod    # producción
```

`vercel link` la primera vez para asociar carpeta a proyecto.

## Build minificado opcional

`pxt staticpkg --minify` requiere `uglify-js`:

```bash
npm i -D uglify-js
npm run package:min
```

Para activarlo en Vercel, cambiar `buildCommand` a `npm run package:min` y commitear `uglify-js` en `devDependencies`.

## Antes de un deploy público

Revisar en `pxtarget.json` y `targetconfig.json`:

- `appTheme.homeUrl`, `embedUrl`, `cdnUrl`, `appLogo` — si quedan defaults, varios links siguen apuntando a `makecode.microbit.org`.
- `appTheme.availableLocales` — alineado con los locales que genera `scripts/generate-smartteam-locales.js`.
- `targetconfig.galleries` — `pxt buildtarget` regenera `docs/projects.md` desde acá.
- `cloud.sharing` y proveedores cloud — sin backend propio, “compartir proyecto” depende de servicios externos.

## Validación local antes de subir cambios

```bash
npm run package
npm run preview     # http://localhost:3232
```

Probar:

- Crear proyecto en cada grado (1–6) y revisar el toolbox.
- Cambiar idioma con `?lang=es-ES`, `?lang=pt-BR`, etc.
- Simulador, descarga `.hex`, edición en blocks/JS/Python.
