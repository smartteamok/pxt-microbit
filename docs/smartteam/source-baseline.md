# Source Baseline

## Repository

Workspace:

- `/Users/marianobat/dev/makecode-st2`

Cloned source:

- `https://github.com/smartteamok/pxt-microbit.git`

Current branch:

- `smartteam/course-target-plan`

Remote:

- `origin https://github.com/smartteamok/pxt-microbit.git`

## Current workspace

- `docs/smartteam/` — planning and operational docs.

SmartTeam packages and course profiles in the tree:

- `libs/smartteam-core`
- `libs/smartteam-outputs`
- `libs/smartteam-motors`
- `libs/smartteam-inputs`
- `libs/smartteam-course-1`
- `libs/smartteam-course-2`
- `libs/smartteam-course-3`
- `libs/smartteam-course-4`
- `libs/smartteam-course-5`
- `libs/smartteam-course-6`

Target integration:

- `pxtarget.json` — target id and `bundleddirs` listing the packages above.
- `editor/extension.tsx` — SmartTeam course modal, toolbox filter injection, native category presentation (`smartTeamNativeToolbox`).

## Historical note

The **original** upstream `master` imported into this line of work was a clean micro:bit base (`blocksprj` / `tsprj` depending only on `core`, `radio`, `microphone`). That snapshot is obsolete as a description of **this** workspace: SmartTeam packages and extension behavior are already present. Default project templates remain generic; grade-specific toolboxes come from the selected `smartteam-course-*` package.

## Source Material To Port Later

- Older local/pilot target: `/Users/marianobat/dev/makecode-smartteam/pxt-microbit`
- Public SmartTeam pilot context supplied by the user: `smartteamok/pxt-microbit`
- Hardware logic extension: `https://github.com/smartteamok/exp-microbit-fifa-v1`

## Immediate Policy

- Keep `microsoft/pxt` as a reference only.
- Work inside the micro:bit fork first.
- Use standard target mechanisms from MakeCode docs before considering PXT core changes:
  - `pxtarget.json`
  - target `appTheme`
  - `libs/*` packages
  - `pxt.json` package dependencies
  - `toolboxFilter`
  - `//%` block metadata
  - docs/galleries/templates
