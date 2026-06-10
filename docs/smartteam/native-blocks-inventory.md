# Native Blocks Inventory

This document is the source of truth for native micro:bit blocks that are shown, hidden, wrapped, or moved.

## Generated inventory (authoritative)

The full, machine-extracted list of valid block IDs lives in
[`native-blocks-inventory.generated.md`](native-blocks-inventory.generated.md). Regenerate it with:

```
pxt buildtarget                          # refresh built/target.json
node scripts/dump-block-inventory.js > docs/smartteam/native-blocks-inventory.generated.md
```

Sources (see `scripts/lib/block-inventory.js`):

- **API blocks** — `built/target.json#apiInfo[pkg].apis.byQName[*].attributes.blockId` (everything declared with `//% blockId=` plus all native blocks). 317 distinct after deduping course re-exports.
- **Blockly built-ins** — `pxt.blocks.blockDefinitions()` in `pxt-core/built/pxtlib.js` (38 ids: `math_number`, `logic_compare`, `controls_repeat_ext`, `function_*`, `variables_*`, `text`, `lists_*`, `device_while`, …). These are NOT in apiInfo.

`scripts/validate-toolbox-filters.js` cross-checks the SmartTeam profile allow-lists against this inventory in CI.

## Drift finding (filters vs. real blocks)

Of the 31 block IDs referenced by the old `libs/smartteam-course-*/pxt.json` deny-list filters, **22 do not exist** in the inventory. Two distinct cases:

1. **Future SmartTeam blocks** (`smartteam_control_while`, `smartteam_control_if_then`, `smartteam_control_on_logo_pressed`, `smartteam_control_start_stopwatch`, `smartteam_control_stopwatch`, `smartteam_motors_robot_move`, `smartteam_motors_robot_move_speed`, `smartteam_motors_robot_motor_turn`, `smartteam_motors_robot_motor_turn_speed`, `smartteam_inputs_touch_pin`, `smartteam_inputs_temperature_pin`, `smartteam_inputs_ultrasonic_pin`, `smartteam_inputs_line_follower`, `smartteam_inputs_light_pin`, `smartteam_inputs_soil_pin`, `smartteam_inputs_potentiometer_pin`, `smartteam_inputs_joystick_axis`) — not implemented yet. Under the new **allow-list** model these need **no entry at all**: `defaultState: Hidden` hides them automatically until implemented and explicitly allowed.
2. **Blockly alias IDs** (`break_keyword`, `continue_keyword`, `controls_flow_statements`, `function_definition_return`, `function_return_if`, plus `text_equals`, `variables_create`) — present in the rendered toolbox via `blockIdMap`, but absent from both `apiInfo` and `blockDefinitions()`. **Verify these against the running editor** (`Blockly` registered types) before using them in an allow-list. Flagged as a runtime spike.

## Original worksheet (historical)

The first implementation task should populate this table from the actual target block metadata, not from memory.

## Inventory Columns

| Field | Meaning |
|---|---|
| Native namespace | Original MakeCode namespace/category. |
| Current category label | Label shown after SmartTeam `extension.tsx` customization. |
| Native block label | Label shown by MakeCode. |
| Block ID | Exact serialized block ID. |
| Grade 1 | `visible`, `hidden`, `wrapped`, or `pending`. |
| Grade 2 | `visible`, `hidden`, `wrapped`, or `pending`. |
| Grade 3 | `visible`, `hidden`, `wrapped`, or `pending`. |
| Grade 4 | `visible`, `hidden`, `wrapped`, or `pending`. |
| Grade 5 | `visible`, `hidden`, `wrapped`, or `pending`. |
| Grade 6 | `visible`, `hidden`, `wrapped`, or `pending`. |
| Replacement | SmartTeam block ID if wrapped/replaced. |
| Notes | Behavior, localization, or UX notes. |

## Initial Native Categories

These are expected native categories to audit:

- Basic
- Input
- Music
- Led
- Radio
- Loops / Control
- Logic
- Math
- Variables
- Functions
- Text
- Arrays
- Pins
- Serial
- Control

Some categories may be renamed or re-colored by `editor/extension.tsx`.

Current cloned baseline note: `editor/extension.tsx` does not yet rename/recolor categories. Category customization still needs to be introduced.

## Known Native Blocks From The Course Matrix

| Native namespace | Block ID | Desired grades | Status |
|---|---|---|---|
| logic | `logic_compare` | 3-6 | confirmed likely |
| logic | `logic_operation` | 3-6 | confirmed likely |
| logic | `logic_negate` | 3-6 | confirmed likely |
| math | `math_number` | 3-6 | confirmed likely |
| math | `device_random` | 3-6 | confirmed in generated `built/target.json` as `randint` |
| input | `device_get_button2` | 3-6 | confirmed in `libs/core/input.cpp` and `libs/core/shims.d.ts` |
| input | `input_logo_is_pressed` | 3-6 | confirmed in `libs/core/logo.cpp` and `libs/core/shims.d.ts` |
| input | `device_get_light_level` | 3-6 | confirmed in `libs/core/input.cpp` and `libs/core/shims.d.ts` |
| text | `text` | 4-6 | confirmed likely |
| text | `text_join` | 4-6 | confirmed likely |
| text | `text_equals` | 4-6 | to-confirm |
| input | `device_temperature` | 4-6 | confirmed in `libs/core/input.cpp` and `libs/core/shims.d.ts` |
| input | `device_acceleration` | 4-6 | confirmed in `libs/core/input.cpp` and `libs/core/shims.d.ts` |
| input | `device_get_magnetic_force` | 4-6 | confirmed in `libs/core/input.cpp` and `libs/core/shims.d.ts` |
| functions | `function_definition` | 5-6 | to-confirm current functions plugin ID |
| variables | `variables_create` | 5-6 | to-confirm current toolbox ID |
| input | `device_get_sound_level` | 5-6 | confirmed in `libs/microphone` and generated `built/target.json`; replaces matrix value `input_sound_level` |
| functions | `function_definition_return` | 6 | to-confirm current functions plugin ID |
| functions | `function_return_if` | 6 | to-confirm |
| serial | `serial_writeline` | 6 | confirmed in `libs/core/serial.ts` |
| serial | `serial_writestring` | 6 | confirmed in `libs/core/serial.cpp` and `libs/core/shims.d.ts` |
| radio | `radio_set_group` | 6 | confirmed in `libs/radio/shims.d.ts` |
| radio | `radio_datagram_send` | 6 | confirmed in generated `built/target.json`; replaces matrix value `radio_datagram_send_number` |
| radio | `radio_datagram_send_string` | 6 | confirmed in generated `built/target.json` |
| radio | `radio_datagram_send_value` | 6 | confirmed in generated `built/target.json` |
| radio | `radio_on_packet` | 6 | confirmed in `libs/radio/targetoverrides.ts` |
| radio | `radio_received_number` | 6 | not found as separate block ID; likely represented by event parameter or packet API |
| radio | `radio_received_string` | 6 | not found as separate block ID; likely represented by event parameter or packet API |
| radio | `radio_received_name` | 6 | not found; value/name radio may use `radio_on_value_drag` callback parameter or `radio_received_packet` |

Confirmed related current radio IDs:

- `radio_datagram_send`
- `radio_datagram_send_string`
- `radio_datagram_send_value`
- `radio_on_number`
- `radio_on_number_drag`
- `radio_on_value`
- `radio_on_value_drag`
- `radio_on_string`
- `radio_on_string_drag`
- `radio_datagram_receive`
- `radio_datagram_receive_string`
- `radio_received_packet`
- `radio_packet_property`

## Audit Method

Recommended audit process:

1. Build/load the target.
2. Ask PXT/compiler for block metadata.
3. Export actual `namespace`, `blockId`, label, and package.
4. Compare against the course matrix.
5. Update this file before implementing filters.

The output of this audit should drive `toolboxFilter.blocks` entries.
