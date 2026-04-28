# SmartTEAM toolbox cleanup plan

This plan treats SmartTEAM as a custom editor experience for a specific kit. MakeCode remains the runtime/compiler foundation, but the visible toolbox should be a curated SmartTEAM API rather than a reorganized copy of the default micro:bit toolbox.

## Direction

- Build the visible toolbox from explicit block whitelists.
- Prefer SmartTEAM wrapper blocks for kit-facing concepts.
- Use one color per visible category.
- Keep native MakeCode APIs available internally for compilation and wrappers, but do not expose extra native blocks by default.
- Avoid broad `blockNamespace` moves as the final strategy because they pull unrelated blocks into SmartTEAM categories.

## Target Architecture

Short term:

- Keep the current `smartteam-*` packages to avoid a large risky move.
- Clean one category at a time.
- For each category, add wrappers and an explicit `toolboxOptions` block list.
- Hide or omit extra native blocks from the visible flyout.

Long term:

- Consider consolidating the package surface into a single `libs/smartteam` package with files such as:
  - `control.ts`
  - `communication.ts`
  - `inputs.ts`
  - `outputs.ts`
  - `display.ts`
  - `motors.ts`
  - `shield.ts`
- Keep `smartteam-shield` as internal mapping code instead of a standalone visible package.
- Add course/grade filtering only after the full toolbox is clean.

## Category Workflow

For each category:

1. Start from `docs/smartteam/toolbox-spec.md`.
2. Decide which blocks are native language constructs, native APIs, or SmartTEAM wrappers.
3. Add missing SmartTEAM wrappers.
4. Define category color, groups, and ordering.
5. Add a `toolboxOptions` whitelist for the category.
6. Validate with `npx pxt buildtarget --skip-core`.
7. Test in `npx pxt serve` by creating a fresh Blocks project.

## First Executed Pass: Control

`Control` now begins the new strategy:

- `smartteam-core` owns kit-facing Control wrappers.
- `editor/extension.tsx` defines an explicit block list for the `loops` category renamed as `Control`.
- `basic` is no longer relied on as the source of the visible Control flyout.
- Extra `smartteam-core` configuration helpers remain callable from TypeScript but are hidden from the toolbox.

Visible Control target:

- `Esperar (ms)`
- `Si... Entonces`
- `Mientras... hacer`
- `Repetir [n] veces`
- `Al presionar el boton [A/B]`
- `Al [agitar]`
- `Al presionar el logo`
- `Iniciar cronometro`
- `Cronometro`

## Follow-Up Order

1. Finish visual verification of `Control`.
2. Apply the same whitelist/wrapper strategy to `Lógica`.
3. Continue with `Matemáticas`, especially a SmartTEAM `Mapear` wrapper if needed.
4. Clean `Entradas`, `Salidas`, `Pantallas`, and `Motores` from the existing kit APIs.
5. Revisit package consolidation once the visible categories are stable.
