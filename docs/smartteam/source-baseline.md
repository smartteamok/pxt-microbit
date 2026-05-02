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

## Current Local Changes

SmartTeam planning documentation has been added:

- `docs/smartteam/`

Initial package skeletons have also been added:

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

Target code changes are now tracked in:

- `pxtarget.json`
- `editor/extension.tsx`

## Baseline Findings

The public `master` branch originally cloned into this workspace was a clean micro:bit base:

- `pxtarget.json` still identifies the target as `microbit`.
- `editor/extension.tsx` contains only the standard micro:bit extension initialization.
- `libs/blocksprj/pxt.json` depends on `core`, `radio`, and `microphone`.
- `libs/tsprj/pxt.json` depends on `core`, `radio`, and `microphone`.

This means the SmartTeam work should be treated as a controlled port into a clean base.

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
