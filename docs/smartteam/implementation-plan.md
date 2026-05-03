# Implementation Plan

## Phase 0: Repo Baseline

Workspace:

- `/Users/marianobat/dev/makecode-st2`

Origin:

- Fork line based on `https://github.com/smartteamok/pxt-microbit.git` (e.g. branch `smartteam/course-target-plan`).
- Planning docs under `docs/smartteam`.

**Original** import observation (historical): upstream `master` had no `libs/smartteam-*` and a stock `editor/extension.tsx`.

**Current** observation: this repo already contains `smartteam-core`, `smartteam-outputs`, `smartteam-motors`, `smartteam-inputs`, course packages `smartteam-course-1` … `6`, bundled in `pxtarget.json`, with SmartTeam project creation and `toolboxFilter` loading in `editor/extension.tsx`. Default `blocksprj` / `tsprj` stay generic.

Ongoing decision:

- Port remaining design (display, communication, shield helpers, etc.) and curriculum details from the older pilot and `smartteamok/exp-microbit-fifa-v1` using the same target mechanisms.
- Avoid forking `microsoft/pxt` unless a mechanism is truly missing.

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

- `smartteam-core` - skeleton created
- `smartteam-shield`
- `smartteam-inputs` - skeleton and first digital/analog input blocks created
- `smartteam-outputs` - skeleton created
- `smartteam-motors` - skeleton created
- `smartteam-display`
- `smartteam-communication`

Normalize block IDs so they match the matrix or update the matrix if an existing block ID should be preserved.

Important: once released, block IDs should not change because blocks are serialized by ID in projects.

Before implementing these packages, keep [Category Taxonomy](category-taxonomy.md) synchronized with namespace ownership, category labels, colors, groups, and native category policy.

## Phase 4: Course Packages

Created:

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

Add required grade selection to the standard project creation flow:

- `1er grado`
- `2do grado`
- `3er grado`
- `4to grado`
- `5to grado`
- `6to grado`

Grade labels must be localizable.

Each selection creates a project with the corresponding course package installed.

Implemented course selection:

- The stock "New Project" button remains visible.
- `editor/extension.tsx` wraps `askForProjectCreationOptionsAsync`.
- After the stock project creation dialog returns, a required SmartTeam course selector appears.
- The selected grade is persisted as a `smartteam-course-N` dependency in the project `pxt.json`.
- The selected grade filter is also persisted as the root project `toolboxFilter`, because dependency-level `toolboxFilter` is not sufficient to filter the active project toolbox.
- `libs/blocksprj/pxt.json` and `libs/tsprj/pxt.json` no longer force a fixed course profile.

Single source of truth for the grade filter:

- The `toolboxFilter` for each grade lives only in `libs/smartteam-course-N/pxt.json`.
- `editor/extension.tsx` keeps a small editor-only registry (`smartTeamCourseGrades`) with `{ grade, label, dependency }` and loads each filter at runtime from `pxt.appTarget.bundledpkgs[<dependency>][pxt.CONFIG_NAME]`.
- The previous duplicated arrays (`smartTeamAlwaysHiddenNamespaces`, `smartTeamFutureControlBlocks`, `smartTeamFutureOutputBlocks`, `smartTeamFutureMotorBlocks`, `smartTeamFutureInputBlocks`, plus the literal `smartTeamCourses` filter shapes) have been removed.

This keeps the MakeCode project creation flow intact while preventing new projects without an explicit course profile.

Known files/areas to audit for cleanup:

- `pxtarget.json`: `homeScreenHero`, `homeScreenHeroGallery`, `docMenu`, `appTheme` gallery-related settings.
- `targetconfig.json`: `galleries`
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

Initial implemented grade-1 blocks:

- `smartteam_core_wait_ms`
- `smartteam_control_on_button_pressed`
- `smartteam_control_on_gesture`
- `smartteam_outputs_set_led`
- `smartteam_outputs_set_led_brightness`
- `smartteam_outputs_play_note`
- `smartteam_outputs_play_tone`
- `smartteam_outputs_start_melody`
- `smartteam_outputs_stop_buzzer`
- `smartteam_motors_turn_dc_motor`

Initial implemented grade-3 input blocks:

- `smartteam_inputs_microbit_button_pressed`
- `smartteam_inputs_logo_is_pressed`
- `smartteam_inputs_button_pin`
- `smartteam_inputs_obstacle_pin`
- `smartteam_inputs_microbit_light_level`

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
