# Implementation Plan

## Phase 0: Repo Baseline

Current requested workspace:

- `/Users/marianobat/dev/makecode-st2`

Current state:

- Source cloned from `https://github.com/smartteamok/pxt-microbit.git`.
- Branch created: `smartteam/course-target-plan`.
- Remote: `origin` points to `smartteamok/pxt-microbit`.
- Planning docs live under `docs/smartteam`.

Baseline observation:

- The cloned `master` branch does not yet contain `libs/smartteam-*`.
- `editor/extension.tsx` is stock/near-stock micro:bit extension initialization.
- Default templates only depend on `core`, `radio`, and `microphone`.

Decision:

- Use this fork as the clean base.
- Port SmartTeam packages and toolbox customization deliberately from the older local pilot and the FIFA extension.
- Do not fork or modify `microsoft/pxt` unless target-level mechanisms prove insufficient.

## Phase 1: Documentation Baseline

Create and maintain these documents before implementation:

- architecture
- course filtering model
- block matrix
- native block inventory
- open questions

This folder starts that baseline.

## Phase 2: Native Toolbox Inventory

Generate a precise list of native micro:bit categories and block IDs.

Output should include:

- namespace/category
- visible block label
- actual block ID
- current visibility
- desired visibility per grade
- whether it will be wrapped/replaced by a SmartTeam block

This is required because several native block IDs in the first matrix are marked `to-confirm`.

Initial confirmed IDs from the cloned source:

- `serial_writeline`
- `serial_writestring`
- `device_get_button2`
- `input_logo_is_pressed`
- `device_get_light_level`
- `device_temperature`
- `device_acceleration`
- `device_get_magnetic_force`
- `radio_set_group`
- `radio_on_packet`
- `radio_datagram_receive`
- `radio_datagram_receive_string`
- `device_get_sound_level` for sound level, not `input_sound_level`

Still to confirm after dependency install/build:

- built-in Blockly IDs such as `math_number`, `logic_compare`, `logic_operation`, `logic_negate`, `text`, `text_join`, `controls_repeat_ext`
- random integer block ID in the current target/runtime
- functions return-related block IDs
- exact send-value radio block IDs exposed in the toolbox

## Phase 3: SmartTeam Package Normalization

Normalize package boundaries:

- `smartteam-core`
- `smartteam-shield`
- `smartteam-inputs`
- `smartteam-outputs`
- `smartteam-motors`
- `smartteam-display`
- `smartteam-communication`

Normalize block IDs so they match the matrix or update the matrix if an existing block ID should be preserved.

Important: once released, block IDs should not change because blocks are serialized by ID in projects.

## Phase 4: Course Packages

Create:

- `libs/smartteam-course-1`
- `libs/smartteam-course-2`
- `libs/smartteam-course-3`
- `libs/smartteam-course-4`
- `libs/smartteam-course-5`
- `libs/smartteam-course-6`

Each course package should:

- depend on required SmartTeam functional packages
- define `toolboxFilter`
- expose no runtime API unless unavoidable

## Phase 5: Project Creation

Replace or simplify default micro:bit home/tutorial flow.

Add grade creation entries:

- `1er grado`
- `2do grado`
- `3er grado`
- `4to grado`
- `5to grado`
- `6to grado`

Grade labels must be localizable.

Each entry creates a project with the corresponding course package installed.

Known files/areas to audit for cleanup:

- `pxtarget.json`: `homeScreenHero`, `homeScreenHeroGallery`, `docMenu`, `appTheme` gallery-related settings.
- `docs/projects.md`
- `docs/tutorials.md`
- `docs/tutorials-v2.md`
- `docs/courses.md`
- `docs/lessons/**`
- `docs/projects/**`
- `docs/examples/**`

Prefer hiding/replacing galleries first, before deleting large documentation trees. That keeps upstream reference docs available while the SmartTeam home is made clean.

## Phase 6: Custom Block Implementation

Adapt logic from `smartteamok/exp-microbit-fifa-v1`.

Do this package by package:

1. Shield enums and pin mapping.
2. Control wrappers.
3. Outputs.
4. Motors.
5. Inputs.
6. Display.
7. Communication.

## Phase 7: Verification

For each grade:

- create a new project
- verify visible categories
- verify visible native blocks
- verify visible SmartTeam blocks
- verify hidden categories stay hidden
- verify JS/Python are still usable
- compile for micro:bit
- run simulator smoke checks where possible

## Phase 8: Iteration With Curriculum

Expect multiple passes over:

- labels
- block ordering
- grouping
- parameter defaults
- category color
- block availability by grade
- tutorial/example content
