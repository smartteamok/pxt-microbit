# Category Taxonomy

This document is the working contract for the SmartTeam toolbox categories.

The goal is to keep category ownership simple:

- Native structural categories stay native when their behavior is hard to reproduce safely.
- SmartTeam hardware categories live in `libs/smartteam-*`.
- Course visibility is controlled by `libs/smartteam-course-*`.
- Grade-specific block lists should not be hardcoded in `editor/extension.tsx`.

## Proposed Toolbox Order

Higher MakeCode `weight` values appear closer to the top.

| Order | Visible label | Owner namespace | Owner package | Weight | Color | First grade | Policy |
|---:|---|---|---|---:|---|---:|---|
| 1 | Control | `loops` plus SmartTeam wrappers | `core`, `smartteam-core` | 100 | `#FF9800` | 1 | Keep native structural blocks, add SmartTeam wrappers where labels/API need simplification. |
| 2 | Salidas | `smartteamOutputs` | `smartteam-outputs` | 90 | `#E91E63` | 1 | SmartTeam-owned hardware outputs. Hide most native `music`/`led` unless deliberately reused. |
| 3 | Motores | `smartteamMotors` | `smartteam-motors` | 80 | `#607D8B` | 1 | SmartTeam-owned motor and robot movement APIs. |
| 4 | Entradas (D) | `smartteamDigitalInputs` | `smartteam-inputs` | 70 | `#009688` | 3 | Digital input sensors and boolean reporters. |
| 5 | Entradas (~A) | `smartteamAnalogInputs` | `smartteam-inputs` | 65 | `#00A3A3` | 3 | Analog/magnitude input sensors and numeric reporters. |
| 6 | Pantallas | `smartteamDisplay` | `smartteam-display` | 60 | `#3F51B5` | 5 | LCD, matrix 8x8, and later display devices. |
| 7 | Comunicacion | `smartteamCommunication` or `radio` | `smartteam-communication`, `radio`, `core` | 55 | `#795548` | 6 | Pending final decision because native radio/serial are split across namespaces. |
| 8 | Logica | `logic` | PXT/Blockly native | 50 | `#3BC64A` | 3 | Native Blockly logic blocks, filtered by course. |
| 9 | Matematicas | `math` | PXT/Blockly native + `core` | 45 | `#9400D3` | 3 | Native numbers/random/math, filtered by course. |
| 10 | Texto | `text` | PXT/Blockly native + `core` | 40 | `#B8860B` | 4 | Native text blocks, filtered by course. |
| 11 | Variables | `variables` | PXT/Blockly native | 35 | `#DC143C` | 5 | Native variables category. |
| 12 | Funciones | `functions` | PXT/Blockly native | 30 | `#7E57C2` | 5 | Native functions category. Grade 6 adds return-related function blocks. |
| 13 | Avanzado | `advanced` | native | 10 | `#00272B` | varies | Mostly hidden in course profiles unless needed. |

Visible labels above are Spanish baseline labels. They must be localized before release.

## Category Ownership Rules

### Control

Use the native `loops` category as the category owner and rename it to `Control`.

Reasoning:

- Repeat/while/if-like blocks are Blockly structural blocks.
- Reimplementing statement blocks as normal functions is risky and usually inferior.
- SmartTeam wrappers can be attached to this category with `blockNamespace=loops`.

Likely SmartTeam wrappers:

- `smartteam_core_wait_ms`
- `smartteam_control_on_button_pressed`
- `smartteam_control_on_gesture`
- `smartteam_control_start_stopwatch`
- `smartteam_control_stopwatch`

Native structural blocks to curate:

- `controls_repeat_ext`
- `device_while` or current while block ID after toolbox audit
- condition/if block IDs after toolbox audit

### Salidas

Use `smartteamOutputs` as a custom namespace.

Initial groups:

- `Externos`
- `RGB`
- `Zumbador`

Native categories to hide or wrap:

- Hide `music` by default once SmartTeam buzzer blocks exist.
- Hide `led`/`light` if display LED matrix blocks are not part of the curriculum.

### Motores

Use `smartteamMotors` as a custom namespace.

Initial groups:

- `Motor DC`
- `Servo`
- `Movimiento robot`

Shared motor enums and pin aliases should live in `smartteam-shield` if used by more than one package.

### Entradas

Use one package, `smartteam-inputs`, but two namespaces:

- `smartteamDigitalInputs` for `Entradas (D)`
- `smartteamAnalogInputs` for `Entradas (~A)`

Reasoning:

- The student-facing curriculum treats these as separate categories.
- One package still keeps shared sensor helpers together.

Initial groups for `Entradas (D)`:

- `micro:bit`
- `Externos`

Initial groups for `Entradas (~A)`:

- `micro:bit`
- `Externos`

Native `input` should generally be hidden, then selected native input blocks should be reintroduced by wrappers or explicit curated blocks.

### Pantallas

Use `smartteamDisplay`.

Initial groups:

- `LCD`
- `Matriz 8x8`

Do not mix micro:bit LED matrix basics here unless the curriculum explicitly wants them. If LED matrix/image blocks are needed, wrap or reassign carefully to avoid exposing the full native `led` category.

### Comunicacion

This needs one more design decision before implementation.

Two viable options:

1. Use native `radio` renamed to `Comunicacion` and add SmartTeam Bluetooth wrappers there.
2. Use `smartteamCommunication` as the visible category and wrap the required native radio/serial APIs.

Preferred for maintainability: option 2.

Reasoning:

- Native radio and serial blocks live in different namespaces.
- The grade 6 Bluetooth blocks still need protocol decisions.
- Wrappers give stable Spanish labels and keep `toolboxFilter` simpler.

Open point: if preserving native radio block IDs is required for compatibility, option 1 may be needed for those specific blocks.

## Hidden Native Categories By Default

Course packages should hide these unless a course explicitly needs them:

| Native namespace | Default policy | Reason |
|---|---|---|
| `basic` | hidden or heavily curated | Native LED matrix basics do not match the SmartTeam hardware-first taxonomy. |
| `input` | hidden or heavily curated | Selected input blocks appear under `Entradas`. |
| `music` | hidden | SmartTeam buzzer blocks replace beginner-facing music. |
| `led` | hidden | Avoid exposing raw LED matrix APIs early. |
| `light` | hidden | Use SmartTeam output/RGB/display abstractions instead. |
| `pins` | hidden | Too low-level for the curated curriculum. |
| `serial` | hidden unless wrapped | Communication should be student-facing and grade 6 only. |
| `game` | hidden | Out of scope for hardware curriculum. |
| `images` | hidden unless display curriculum asks for it | Too broad for early grades. |
| `arrays` | hidden initially | Not in the provided grade matrix. |

## Where Labels, Colors, And Order Should Live

Custom SmartTeam categories:

- Define label/color/weight/icon on the namespace in `libs/smartteam-*/main.ts`.

Native categories:

- Use `pxtarget.json` `appTheme.blockColors` for global native colors where possible.
- Use `editor/extension.tsx` `toolboxOptions` only if native labels/order cannot be controlled cleanly from target settings.

Course visibility:

- Use `libs/smartteam-course-*/pxt.json` `toolboxFilter`.

## Localization Keys To Plan

Grade labels:

- `smartteam.grade.1`: `1er grado`
- `smartteam.grade.2`: `2do grado`
- `smartteam.grade.3`: `3er grado`
- `smartteam.grade.4`: `4to grado`
- `smartteam.grade.5`: `5to grado`
- `smartteam.grade.6`: `6to grado`

Category labels:

- `smartteam.category.control`: `Control`
- `smartteam.category.outputs`: `Salidas`
- `smartteam.category.motors`: `Motores`
- `smartteam.category.digitalInputs`: `Entradas (D)`
- `smartteam.category.analogInputs`: `Entradas (~A)`
- `smartteam.category.display`: `Pantallas`
- `smartteam.category.communication`: `Comunicacion`
- `smartteam.category.logic`: `Logica`
- `smartteam.category.math`: `Matematicas`
- `smartteam.category.text`: `Texto`
- `smartteam.category.variables`: `Variables`
- `smartteam.category.functions`: `Funciones`

The visible Spanish strings in code can start as direct block labels during prototyping, but release-ready localization should move them into MakeCode localization files.
