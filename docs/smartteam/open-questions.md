# Open Questions

## Workspace

- Resolved: `/Users/marianobat/dev/makecode-st2` now contains the cloned `smartteamok/pxt-microbit` fork.
- Current working branch: `smartteam/course-target-plan`.
- The cloned public `master` branch does not contain the older SmartTeam pilot packages, so they must be ported intentionally.

## Matrix Corrections

- Confirm whether `4,5,2006` means `4,5,6`.

## Block IDs And Labels

- Some desired block IDs do not match the current SmartTeam pilot.
- Decide whether to preserve existing pilot block IDs or rename to the matrix IDs before release.

Known mismatches:

- `smartteam_inputs_button_pin` vs current `smartteam_digital_push_button`
- `smartteam_inputs_touch_pin` vs current `smartteam_digital_touch_button`
- `smartteam_display_lcd_write` vs current `smartteam_display_lcd_show`
- `smartteam_control_while` vs current injected native `device_while`

## Native Block IDs To Confirm

- `text_equals`
- `function_return_if`
- built-in text block IDs from Blockly/PXT core, including `text` and `text_join`, are still to be confirmed from Blockly metadata rather than API metadata
- functions/variables block IDs from Blockly/PXT core are still to be confirmed from the rendered toolbox
- received radio reporter IDs if exposed separately; API metadata suggests they may not be separate reporter block IDs

Confirmed from cloned source:

- `device_random` for random integer, generated from `randint`
- `serial_writeline`
- `serial_writestring`
- `device_get_button2`
- `input_logo_is_pressed`
- `device_get_light_level`
- `device_temperature`
- `device_acceleration`
- `device_get_magnetic_force`
- `device_get_sound_level`, not `input_sound_level`
- `radio_set_group`
- `radio_datagram_send`, not `radio_datagram_send_number`
- `radio_datagram_send_string`
- `radio_datagram_send_value`
- `radio_on_packet`
- `radio_datagram_receive`
- `radio_datagram_receive_string`

## Build Notes

- `npm install` completed in the target workspace.
- `pxt buildtarget` completed successfully after allowing access to `~/.pxt/cache`.
- During simulator build, TypeScript parser warnings were printed for optional-chain-like syntax in simulator files, but the command exited successfully and generated `built/target.json`.

## Grade 1 Gesture Filter

Grade 1 should only expose `agitar` for the gesture block.

Need to decide whether this requires:

- a SmartTeam-specific enum/shadow picker per grade, or
- separate wrapper blocks, or
- accepting all gesture dropdown values until a later UI refinement.

## RGB Blocks

The matrix asks for one block with six color parameters:

- color1
- color2
- color3
- color4
- color5
- color6

Current pilot and extension logic mostly model either one selected LED or all LEDs. Confirm exact desired UX.

## Motor Ranges

Some matrix rows use speed `1023`, while current robot movement wrappers use `0-100`.

Confirm whether student-facing speed should be:

- `0-100`, easier pedagogically, or
- `0-1023`, closer to PWM.

## Communication Protocol

Grade 6 Bluetooth communication blocks are pending definition.

Need details for:

- app/protocol format
- labels
- received message storage
- robot control mapping
- joystick event model
- button event model

## Tutorials And Examples

Need decide:

- remove current micro:bit tutorials/examples entirely
- hide them from home but keep docs accessible
- replace with SmartTeam-owned galleries

## JavaScript And Python

JS/Python remain enabled for now.

Need verify whether toolbox curation should also apply to Monaco toolbox and whether autocomplete should expose native APIs hidden from blocks.
