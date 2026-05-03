# Architecture

## Goal

Create a SmartTeam MakeCode editor based on micro:bit, with custom blocks and grade-specific curated toolboxes.

The target should keep the standard micro:bit flow, but with a cleaner home experience and SmartTeam-owned tutorials/examples.

## Source References

- MakeCode target creation docs: target structure, `pxtarget.json`, packages under `libs`, simulator, docs, static packaging.
- MakeCode defining blocks docs: `//%` annotations, category metadata, stable `blockId`, groups, shadows, field editors, localization.
- `microsoft/pxt`: MakeCode core, including project creation, galleries, package loading, and toolbox filtering.
- `microsoft/pxt-microbit`: hardware/runtime base for micro:bit.
- `microsoft/pxt-maker`: reference for package-driven project templates and target customization.
- `microsoft/pxt-sample`: minimal target structure reference.
- `smartteamok/pxt-microbit`: current SmartTeam pilot.
- `smartteamok/exp-microbit-fifa-v1`: prior extension containing hardware logic for several custom blocks.

## Repository origin

Workspace continues to track the SmartTeam micro:bit fork (for example `smartteamok/pxt-microbit`, branch `smartteam/course-target-plan`). The tree under `/Users/marianobat/dev/makecode-st2` is no longer a stock micro:bit-only checkout.

## Current baseline (this workspace)

- **`pxtarget.json`**: target `microbit`; `bundleddirs` includes `libs/smartteam-core`, `smartteam-outputs`, `smartteam-motors`, `smartteam-inputs`, and `libs/smartteam-course-1` … `smartteam-course-6`.
- **`editor/extension.tsx`**: SmartTeam course selection at project creation, native toolbox tweaks (`smartTeamNativeToolbox`), loads per-grade `toolboxFilter` from bundled course packages (see [Course Filtering](course-filtering.md)).
- **Functional packages** present: `smartteam-core`, `smartteam-outputs`, `smartteam-motors`, `smartteam-inputs` with blocks in each `main.ts`, English-first strings under `_locales/`, extra editor languages generated via `scripts/generate-smartteam-locales.js`.
- **Course packages** present: `smartteam-course-1` … `smartteam-course-6` with `dependencies` and `toolboxFilter` in each `pxt.json`.
- **`libs/blocksprj` / `libs/tsprj`**: remain generic default templates; they do not pin a fixed course profile.

Packages described in [Category Taxonomy](category-taxonomy.md) but **not** in this tree yet (design / future port): e.g. `smartteam-shield`, `smartteam-display`, `smartteam-communication`. Treat `smartteamok/exp-microbit-fifa-v1` and older pilots as source material for those ports.

## Target model

One micro:bit-based target and multiple SmartTeam packages. Category ownership stays as in [Category Taxonomy](category-taxonomy.md).

Implemented functional packages (see `libs/`):

- `smartteam-core`, `smartteam-outputs`, `smartteam-motors`, `smartteam-inputs`.

Course profile packages:

- `smartteam-course-1` through `smartteam-course-6` — each defines `toolboxFilter` and grade `dependencies`.

## Responsibility Boundaries

### `editor/extension.tsx`

Use for global editor configuration:

- Rename and recolor native categories.
- Set stable category order.
- Add custom toolbox snippets only when the built-in block XML is not enough.
- Keep behavior independent from grade when possible.

Avoid putting grade logic here unless PXT standard package filtering cannot solve the requirement.

### SmartTeam Functional Packages

Use `//%` metadata to define:

- category name
- color
- icon
- weight
- groups
- block text
- block ID
- parameter defaults and shadows
- hidden helper blocks

Functional packages should not know about grade progression directly.

### Course Packages

Use `pxt.json` with:

- dependencies required by the grade
- `toolboxFilter.namespaces`
- `toolboxFilter.blocks`

This keeps grade selection project-local and avoids dynamic runtime/editor switching.

## Project Creation Flow

The new project flow should ask for grade before creating the project.

Expected user flow:

1. User clicks New Project.
2. MakeCode shows its standard new-project dialog.
3. User selects `1er grado`, `2do grado`, ..., `6to grado` in the required SmartTeam course modal.
4. MakeCode creates a project using the matching course dependency.
5. The toolbox is filtered by the selected course package.
6. The grade is not changed later inside that project.

Current implementation detail: `editor/extension.tsx` wraps `askForProjectCreationOptionsAsync`, opens the SmartTeam course modal, and adds exactly one `smartteam-course-*` dependency to the project creation options.

## Localization

Grade labels and SmartTeam block strings must be localizable.

Use MakeCode localization mechanisms where possible:

- block strings in `_locales/*-strings.json`
- JSDoc strings in `_locales/*-jsdoc-strings.json`
- for the four functional SmartTeam packages, run `node scripts/generate-smartteam-locales.js` after changing English base strings (keeps per-locale files and `pxt.json` `files` in sync), then `npx pxt buildtarget`
- docs/cards localized through standard target documentation/localization flow

Grade labels should not be hardcoded only in Spanish if they appear in UI/docs.
