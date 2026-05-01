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

## Current Baseline

Workspace source is now cloned from:

- Repository: `https://github.com/smartteamok/pxt-microbit.git`
- Branch: `smartteam/course-target-plan`
- Upstream branch cloned from: `master`

The cloned `master` branch is currently close to stock `pxt-microbit`:

- `editor/extension.tsx` only initializes the normal micro:bit extension hooks.
- `libs/blocksprj/pxt.json` and `libs/tsprj/pxt.json` depend on `core`, `radio`, and `microphone`.
- No `libs/smartteam-*` packages are present yet.

This is a good clean baseline for building the target deliberately. The older SmartTeam pilot and FIFA extension should be treated as source material to port, not as code already present in this workspace.

## Proposed Target Model

Use one micro:bit-based target and multiple SmartTeam packages.

Core packages:

- `smartteam-core`: control wrappers and basic helpers.
- `smartteam-shield`: shared enums, pin mapping, clamp/utilities.
- `smartteam-inputs`: digital and analog inputs.
- `smartteam-outputs`: LEDs, buzzer, RGB outputs.
- `smartteam-motors`: DC motor, robot movement, servo, fan.
- `smartteam-display`: LCD, RGB strip, later matrix 8x8.
- `smartteam-communication`: Bluetooth/radio abstractions for grade 6, pending definition.

Course profile packages:

- `smartteam-course-1`
- `smartteam-course-2`
- `smartteam-course-3`
- `smartteam-course-4`
- `smartteam-course-5`
- `smartteam-course-6`

Each course package should define the toolbox policy for that grade.

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
2. User selects `1er grado`, `2do grado`, ..., `6to grado`.
3. MakeCode creates a project using the matching course template/dependencies.
4. The toolbox is filtered by the selected course package.
5. The grade is not changed later inside that project.

Implementation detail to verify in PXT core: the cleanest path is probably project cards/templates whose package dependencies include exactly one `smartteam-course-*` package. If standard gallery/template behavior is insufficient for a mandatory grade choice, then `editor/extension.tsx` or target-specific editor extension code can customize the new-project flow.

## Localization

Grade labels and SmartTeam block strings must be localizable.

Use MakeCode localization mechanisms where possible:

- block strings in `_locales/*-strings.json`
- JSDoc strings in `_locales/*-jsdoc-strings.json`
- docs/cards localized through standard target documentation/localization flow

Grade labels should not be hardcoded only in Spanish if they appear in UI/docs.
