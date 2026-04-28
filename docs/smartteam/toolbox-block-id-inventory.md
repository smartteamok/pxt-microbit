# SmartTEAM Toolbox Block ID Inventory

## Scope

This inventory records the block IDs and namespace/category IDs that should be used by SmartTEAM course filters.

Sources inspected:

- `libs/smartteam-course-config/course-config.json`
- `docs/smartteam/course-config-implementation.md`
- `pxtarget.json`
- `built/target.json`
- Native micro:bit block sources under `libs/core` and `libs/radio`
- Current default project templates `libs/blocksprj/pxt.json` and `libs/tsprj/pxt.json`
- Reference extension at `../exp-microbit-fifa-v1`

`docs/smartteam/toolbox-spec.md` was not present in this branch, so the current reference is `docs/smartteam/course-config-implementation.md` plus the reference extension.

## Current Branch Findings

- The clean branch currently has `libs/smartteam-core`, `libs/smartteam-inputs`, `libs/smartteam-outputs`, `libs/smartteam-motors`, and `libs/smartteam-display` directories, but they contain only built artifacts or dependency caches. Their root `main.ts` and `pxt.json` source files are not present in this branch.
- `libs/blocksprj/pxt.json` and `libs/tsprj/pxt.json` currently depend only on `core`, `radio`, and `microphone`; they do not include SmartTEAM package dependencies.
- `built/target.json` contains native micro:bit metadata, but no `smartteam*` or `beatMundial` APIs.
- `libs/smartteam-course-config/course-config.json` includes several SmartTEAM block IDs that are expected design IDs, not verified IDs from compiled SmartTEAM package sources in this branch.
- The reference extension `../exp-microbit-fifa-v1` contains many relevant SmartTEAM/FIFA kit blocks in namespace `beatMundial`, but the functions do not declare explicit `blockId` annotations. Their exact generated block IDs should not be guessed.

## Namespace and Category IDs

| UI category | Namespace/category ID | Status | Source | Notes |
| --- | --- | --- | --- | --- |
| Funciones | `functions` | Native builtin category | `pxt/webapp/src/blocksSnippets.ts` | Builtin category, no normal API namespace source. |
| Control | `loops` / `basic` / `input` / expected SmartTEAM wrappers | Mixed | `pxt/webapp/src/blocksSnippets.ts`, `libs/core/basic.cpp`, `libs/core/input.cpp` | Structural loop blocks are builtin IDs. Native micro:bit event blocks live in `input`; pause lives in `basic`. |
| Lógica | `logic` | Native builtin category | `pxt/webapp/src/blocksSnippets.ts` | Builtin Blockly category. |
| Matemáticas | `Math` | Native builtin category | `pxt/webapp/src/blocksSnippets.ts` | Category ID used by filters is `Math` in the current config. Many individual block IDs are shared by multiple flyout variants. |
| Variables | `variables` | Native builtin category | `pxt/webapp/src/blocksSnippets.ts` | Custom variable flyout; variable get/set blocks are Blockly generated. |
| Texto | `text` | Native builtin category | `pxt/webapp/src/blocksSnippets.ts` | Builtin Blockly category. |
| Comunicación | `radio`, `serial` | Native packages | `libs/radio`, `libs/core/serial.ts`, `libs/core/serial.cpp` | Radio is a package dependency in default projects; serial is in core. |
| Entradas (D) | `smartteamDigitalInputs` | Expected SmartTEAM namespace | `libs/smartteam-course-config/course-config.json` | Namespace appears only in filters; source package is missing from clean branch. |
| Entradas (A~) | `smartteamAnalogInputs` | Expected SmartTEAM namespace | `libs/smartteam-course-config/course-config.json` | Namespace appears only in filters; source package is missing from clean branch. |
| Salidas | `smartteamOutputs` | Expected SmartTEAM namespace | `docs/smartteam/course-config-implementation.md` | Expected wrapper namespace; source package is missing from clean branch. |
| Pantallas | `smartteamDisplay` | Expected SmartTEAM namespace | `libs/smartteam-course-config/course-config.json` | Namespace appears only in filters; source package is missing from clean branch. |
| Motores | `smartteamMotors` | Expected SmartTEAM namespace | `docs/smartteam/course-config-implementation.md` | Expected wrapper namespace; source package is missing from clean branch. |
| Native Basic | `basic` | Native namespace | `libs/core/basic.cpp`, `libs/core/basic.ts` | Hidden by current grade filters. |
| Native Input | `input` | Native namespace | `libs/core/input.cpp`, `libs/core/input.ts`, `libs/core/logo.cpp` | Hidden by current grade filters. |
| Native Pins | `pins` | Native namespace | `libs/core/pins.cpp`, `libs/core/pins.ts` | Hidden by current grade filters. |
| Native Music | `music` | Native namespace | `libs/core/music.ts`, `libs/core/music.cpp`, `libs/core/soundexpressions.ts` | Hidden by current grade filters. |
| Native LED | `led` | Native namespace | `libs/core/led.ts`, `libs/core/led.cpp` | Hidden by current grade filters. |

## Block Inventory

| Category | Subgroup | Visible block label | Exact block ID | Namespace | Source file/package | Native or SmartTEAM | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Control | Startup | Al iniciar | `pxt-on-start` | `basic` runtime startup block | `pxt/webapp/src/blocksSnippets.ts` | Native builtin | Current grade1 filter hides it. |
| Control | Timing | Esperar (ms) | `device_pause` | `basic` | `libs/core/basic.cpp`; verified in `built/target.json` as `basic.pause` | Native | Exact native ID. SmartTEAM docs also mention expected wrapper ID `smartteam_core_wait_ms`, but no source exists in this branch. |
| Control | Timing | Esperar (ms) | `smartteam_core_wait_ms` | `smartteamCore` | `docs/smartteam/course-config-implementation.md` | SmartTEAM expected | Expected design ID only; no `libs/smartteam-core/main.ts` source found in this branch. Duplicate of native `device_pause` if both are present. |
| Control | Loops | Repetir X veces | `controls_repeat_ext` | `loops` | `pxt/webapp/src/blocksSnippets.ts` | Native builtin | Exact builtin ID. SmartTEAM docs also mention expected wrapper ID `smartteam_control_repeat_times`; no wrapper source found. |
| Control | Loops | Repetir X veces | `smartteam_control_repeat_times` | expected SmartTEAM control namespace | `docs/smartteam/course-config-implementation.md` | SmartTEAM expected | Expected design ID only. Duplicate of `controls_repeat_ext` if both are present. |
| Control | Events | Al presionar botón | `device_button_event` | `input` | `libs/core/input.cpp`; verified in `built/target.json` as `input.onButtonPressed` | Native | Exact native ID. SmartTEAM docs also mention expected wrapper ID `smartteam_control_on_button_pressed`; no wrapper source found. |
| Control | Events | Al presionar botón | `smartteam_control_on_button_pressed` | expected SmartTEAM control namespace | `docs/smartteam/course-config-implementation.md` | SmartTEAM expected | Expected design ID only. Duplicate of native `device_button_event` if both are present. |
| Control | Events | Al agitar | `device_gesture_event` | `input` | `libs/core/input.cpp`; verified in `built/target.json` as `input.onGesture` | Native | Exact native ID. Default parameter in metadata is `Gesture.Shake`. |
| Control | Events | Al agitar | `smartteam_control_on_gesture` | expected SmartTEAM control namespace | `docs/smartteam/course-config-implementation.md` | SmartTEAM expected | Expected design ID only. Duplicate of native `device_gesture_event` if both are present. |
| Control | Loops | Mientras | `device_while` | `loops` | `pxt/webapp/src/blocksSnippets.ts` | Native builtin | Current grade1 filter hides it. |
| Control | Loops | Para | `pxt_controls_for` | `loops` | `pxt/webapp/src/blocksSnippets.ts` | Native builtin | Current grade1 filter hides it. |
| Control | Loops | Para cada valor | `pxt_controls_for_of` | `loops` | `pxt/webapp/src/blocksSnippets.ts` | Native builtin | Current grade1 filter hides it. |
| Control | Flow | Salir del bucle | `break_keyword` | `loops` | `pxt/webapp/src/blocksSnippets.ts` | Native builtin | Current grade1 filter hides it. |
| Control | Flow | Continuar | `continue_keyword` | `loops` | `pxt/webapp/src/blocksSnippets.ts` | Native builtin | Current grade1 filter hides it. |
| Control | Logic wrapper | Si / entonces | `smartteam_control_if_then` | expected SmartTEAM control namespace | `libs/smartteam-course-config/course-config.json` | SmartTEAM expected | Present in filter only; no source found in this branch. |
| Control | Events | Al presionar el logo | `input_logo_event` | `input` | `libs/core/logo.cpp`; `libs/core/shims.d.ts` | Native | Exact native ID. The filter references expected wrapper `smartteam_control_on_logo_pressed`. |
| Control | Events | Al presionar el logo | `smartteam_control_on_logo_pressed` | expected SmartTEAM control namespace | `libs/smartteam-course-config/course-config.json` | SmartTEAM expected | Present in filter only; no source found in this branch. |
| Control | Stopwatch | Iniciar cronómetro | `smartteam_control_start_stopwatch` | expected SmartTEAM control namespace | `libs/smartteam-course-config/course-config.json` | SmartTEAM expected | Present in filter only; no source found in this branch. Native approximate runtime block is `control_running_time`, but that is not a start/reset stopwatch block. |
| Control | Stopwatch | Cronómetro | `smartteam_control_stopwatch` | expected SmartTEAM control namespace | `libs/smartteam-course-config/course-config.json` | SmartTEAM expected | Present in filter only; no source found in this branch. Native approximate runtime block is `control_running_time`. |
| Control | Runtime | Millis (ms) | `control_running_time` | `input` in shims metadata / `control` shim | `libs/core/shims.d.ts`, `libs/core/control.cpp`, `libs/core/input.ts` | Native | There are related time APIs: `control_running_time` and `device_get_running_time`. Treat carefully because category routing differs. |
| Lógica | Conditionals | Si / entonces | `controls_if` | `logic` | `pxt/webapp/src/blocksSnippets.ts` | Native builtin | `if` and `if/else` flyout entries share block ID `controls_if`; filtering this ID hides both variants. |
| Lógica | Comparison | Igual / menor / mayor | `logic_compare` | `logic` | `pxt/webapp/src/blocksSnippets.ts` | Native builtin | Multiple comparison variants share this block ID. |
| Lógica | Boolean | Y / O | `logic_operation` | `logic` | `pxt/webapp/src/blocksSnippets.ts` | Native builtin | AND/OR variants share this block ID. |
| Lógica | Boolean | No | `logic_negate` | `logic` | `pxt/webapp/src/blocksSnippets.ts` | Native builtin | Exact builtin ID. |
| Lógica | Boolean | Verdadero / falso | `logic_boolean` | `logic` | `pxt/webapp/src/blocksSnippets.ts` | Native builtin | True/false variants share this block ID. |
| Matemáticas | Arithmetic | Suma / resta / multiplicación / división | `math_arithmetic` | `Math` | `pxt/webapp/src/blocksSnippets.ts` | Native builtin | Four flyout variants share this block ID. |
| Matemáticas | Literals | Número | `math_number` | `Math` | `pxt/webapp/src/blocksSnippets.ts` | Native builtin | Exact builtin ID. |
| Matemáticas | Arithmetic | Resto | `math_modulo` | `Math` | `pxt/webapp/src/blocksSnippets.ts` | Native builtin | Exact builtin ID. |
| Matemáticas | Min/max | Mínimo / máximo | `math_op2` | `Math` | `pxt/webapp/src/blocksSnippets.ts` | Native builtin | Min/max variants share this block ID. |
| Matemáticas | Absolute | Valor absoluto | `math_op3` | `Math` | `pxt/webapp/src/blocksSnippets.ts` | Native builtin | Exact builtin ID. |
| Matemáticas | Functions | Raíz / seno / coseno / etc. | `math_js_op` | `Math` | `pxt/webapp/src/blocksSnippets.ts` | Native builtin | Multiple operation variants share this block ID. |
| Matemáticas | Rounding | Redondear / piso / techo / truncar | `math_js_round` | `Math` | `pxt/webapp/src/blocksSnippets.ts` | Native builtin | Multiple variants share this block ID. |
| Variables | Variables | Establecer variable | `variables_set` | `variables` | Blockly builtin flyout | Native builtin | Generated by Blockly variable flyout; not listed in `blocksSnippets.ts` as a normal static block. |
| Variables | Variables | Obtener variable | `variables_get` | `variables` | Blockly builtin flyout | Native builtin | Generated by Blockly variable flyout; often appears as `variables_get_reporter` in nested builtin XML. |
| Texto | Text | Texto | `text` | `text` | `pxt/webapp/src/blocksSnippets.ts` | Native builtin | Exact builtin ID. |
| Texto | Text | Longitud de texto | `text_length` | `text` | `pxt/webapp/src/blocksSnippets.ts` | Native builtin | Exact builtin ID. |
| Texto | Text | Unir texto | `text_join` | `text` | `pxt/webapp/src/blocksSnippets.ts` | Native builtin | Exact builtin ID. |
| Comunicación | Radio events | Al recibir radio | `radio_on_packet` | `radio` | `libs/radio/targetoverrides.ts` | Native micro:bit package | Exact ID. |
| Comunicación | Radio events | Al recibir número | `radio_on_number` | `radio` | `libs/radio/targetoverrides.ts` | Native micro:bit package | Exact ID. |
| Comunicación | Radio events | Al recibir valor | `radio_on_value` | `radio` | `libs/radio/targetoverrides.ts` | Native micro:bit package | Exact ID. |
| Comunicación | Radio events | Al recibir texto | `radio_on_string` | `radio` | `libs/radio/targetoverrides.ts` | Native micro:bit package | Exact ID. |
| Comunicación | Radio receive | Recibir número | `radio_datagram_receive` | `radio` | `libs/radio/targetoverrides.ts` | Native micro:bit package | Exact ID. |
| Comunicación | Radio receive | Recibir texto | `radio_datagram_receive_string` | `radio` | `libs/radio/targetoverrides.ts` | Native micro:bit package | Exact ID. |
| Comunicación | Radio setup | Establecer grupo | `radio_set_group` | `radio` | `libs/radio/shims.d.ts` | Native micro:bit package | Exact ID. |
| Comunicación | Serial | Escribir línea | `serial_writeline` | `serial` | `libs/core/serial.ts` | Native | Exact ID. |
| Comunicación | Serial | Escribir número | `serial_writenumber` | `serial` | `libs/core/serial.ts` | Native | Exact ID. |
| Comunicación | Serial | Escribir valor | `serial_writevalue` | `serial` | `libs/core/serial.ts` | Native | Exact ID. |
| Comunicación | Serial | Leer línea | `serial_read_line` | `serial` | `libs/core/serial.ts` | Native | Exact ID. |
| Entradas (D) | micro:bit | Al presionar botón | `device_button_event` | `input` | `libs/core/input.cpp` | Native | Duplicate with Control event if both categories expose it. |
| Entradas (D) | micro:bit | Botón presionado | `device_get_button2` | `input` | `libs/core/input.cpp` | Native | Exact ID. |
| Entradas (D) | micro:bit | Al agitar / gesto | `device_gesture_event` | `input` | `libs/core/input.cpp` | Native | Duplicate with Control event if both categories expose it. |
| Entradas (D) | micro:bit | Es gesto | `deviceisgesture` | `input` | `libs/core/shims.d.ts` | Native | Exact ID from shims metadata. |
| Entradas (D) | micro:bit | Al presionar logo | `input_logo_event` | `input` | `libs/core/logo.cpp` | Native | Exact ID. |
| Entradas (D) | micro:bit | Logo presionado | `input_logo_is_pressed` | `input` | `libs/core/shims.d.ts` | Native | Exact ID. |
| Entradas (D) | micro:bit | Pin presionado | `device_pin_event` | `input` | `libs/core/input.cpp` | Native | Exact ID. |
| Entradas (D) | micro:bit | Pin liberado | `device_pin_released` | `input` | `libs/core/input.cpp` | Native | Exact ID. |
| Entradas (D) | micro:bit | Pin está presionado | `device_pin_is_pressed` | `input` | `libs/core/shims.d.ts` | Native | Exact ID. |
| Entradas (D) | Externos | Siguelíneas | UNKNOWN | `beatMundial` in reference; expected target namespace `smartteamDigitalInputs` | `../exp-microbit-fifa-v1/main.ts` function `siguelineas` | Reference extension / SmartTEAM pending | No explicit `blockId`; add one during migration or compile extension metadata to determine generated ID. |
| Entradas (D) | Externos | Distancia (cm) | UNKNOWN | `beatMundial` in reference; expected target namespace `smartteamDigitalInputs` | `../exp-microbit-fifa-v1/main.ts` function `leerDistancia` | Reference extension / SmartTEAM pending | No explicit `blockId`. |
| Entradas (D) | Externos | Táctil | UNKNOWN | `beatMundial` in reference; expected target namespace `smartteamDigitalInputs` | `../exp-microbit-fifa-v1/main.ts` function `leerBotonTactil` | Reference extension / SmartTEAM pending | No explicit `blockId`. |
| Entradas (D) | Externos | Pulsador | UNKNOWN | `beatMundial` in reference; expected target namespace `smartteamDigitalInputs` | `../exp-microbit-fifa-v1/main.ts` function `leerPulsador` | Reference extension / SmartTEAM pending | No explicit `blockId`. |
| Entradas (D) | Externos | Temperatura DHT11 (°C) | UNKNOWN | `beatMundial` in reference; expected target namespace `smartteamDigitalInputs` | `../exp-microbit-fifa-v1/main.ts` function `leerTemperaturaDHT11` | Reference extension / SmartTEAM pending | No explicit `blockId`. |
| Entradas (D) | Externos | Humedad DHT11 | UNKNOWN | `beatMundial` in reference; expected target namespace `smartteamDigitalInputs` | `../exp-microbit-fifa-v1/main.ts` function `leerHumedadDHT11` | Reference extension / SmartTEAM pending | No explicit `blockId`. |
| Entradas (A~) | micro:bit | Aceleración | `device_acceleration` | `input` | `libs/core/input.cpp` | Native | Exact ID. |
| Entradas (A~) | micro:bit | Nivel de luz | `device_get_light_level` | `input` | `libs/core/input.cpp` | Native | Exact ID. |
| Entradas (A~) | micro:bit | Rumbo brújula | `device_heading` | `input` | `libs/core/input.cpp` | Native | Exact ID. |
| Entradas (A~) | micro:bit | Temperatura | `device_temperature` | `input` | `libs/core/input.cpp` | Native | Exact ID. |
| Entradas (A~) | micro:bit | Rotación | `device_get_rotation` | `input` | `libs/core/input.cpp` | Native | Exact ID. |
| Entradas (A~) | micro:bit | Fuerza magnética | `device_get_magnetic_force` | `input` | `libs/core/input.cpp` | Native | Exact ID. |
| Entradas (A~) | micro:bit | Leer pin digital | `device_get_digital_pin` | `pins` | `libs/core/pins.cpp` | Native | Exact ID. Could belong under digital inputs if exposed. |
| Entradas (A~) | micro:bit | Leer pin analógico | `device_get_analog_pin` | `pins` | `libs/core/pins.cpp` | Native | Exact ID. |
| Entradas (A~) | Externos | Humedad de suelo | UNKNOWN | `beatMundial` in reference; expected target namespace `smartteamAnalogInputs` | `../exp-microbit-fifa-v1/main.ts` function `leerHumedadSuelo` | Reference extension / SmartTEAM pending | No explicit `blockId`. |
| Entradas (A~) | Externos | Intensidad luminosa | UNKNOWN | `beatMundial` in reference; expected target namespace `smartteamAnalogInputs` | `../exp-microbit-fifa-v1/main.ts` function `leerLuz` | Reference extension / SmartTEAM pending | No explicit `blockId`. |
| Entradas (A~) | Externos | Posición potenciómetro | UNKNOWN | `beatMundial` in reference; expected target namespace `smartteamAnalogInputs` | `../exp-microbit-fifa-v1/main.ts` function `leerPotenciometro` | Reference extension / SmartTEAM pending | No explicit `blockId`. |
| Entradas (A~) | Externos | Nivel RGB en sensor de color | UNKNOWN | `beatMundial` in reference; expected target namespace `smartteamAnalogInputs` | `../exp-microbit-fifa-v1/main.ts` function `leerNivelColor` | Reference extension / SmartTEAM pending | No explicit `blockId`. |
| Entradas (A~) | Externos | Color detectado | UNKNOWN | `beatMundial` in reference; expected target namespace `smartteamAnalogInputs` | `../exp-microbit-fifa-v1/main.ts` function `colorDetectado` | Reference extension / SmartTEAM pending | No explicit `blockId`. |
| Entradas (A~) | Externos | Joystick | UNKNOWN | `beatMundial` in reference; expected target namespace `smartteamAnalogInputs` | `../exp-microbit-fifa-v1/main.ts` function `leerJoystick` | Reference extension / SmartTEAM pending | No explicit `blockId`. |
| Salidas | Externos | Prender el LED | `smartteam_outputs_set_led` | `smartteamOutputs` | `docs/smartteam/course-config-implementation.md` | SmartTEAM expected | Expected design ID only; no `libs/smartteam-outputs/main.ts` source found in this branch. |
| Salidas | Externos | Ajustar el brillo del LED | `smartteam_outputs_set_led_brightness` | `smartteamOutputs` | `docs/smartteam/course-config-implementation.md` | SmartTEAM expected | Expected design ID only; no source found. |
| Salidas | Externos | Reproducir nota | `smartteam_outputs_play_note` | `smartteamOutputs` | `docs/smartteam/course-config-implementation.md` | SmartTEAM expected | Expected wrapper ID. Native equivalent is `device_play_note` in namespace `music`. |
| Salidas | Externos | Reproducir tono | `smartteam_outputs_play_tone` | `smartteamOutputs` | `docs/smartteam/course-config-implementation.md` | SmartTEAM expected | Expected wrapper ID. Native equivalent is `device_ring` or `device_analog_pitch`, depending intended behavior. |
| Salidas | Externos | Comenzar melodía | `smartteam_outputs_start_melody` | `smartteamOutputs` | `docs/smartteam/course-config-implementation.md` | SmartTEAM expected | Expected wrapper ID. Native equivalent is `device_start_melody`. |
| Salidas | Externos | Apagar zumbador | `smartteam_outputs_stop_buzzer` | `smartteamOutputs` | `docs/smartteam/course-config-implementation.md` | SmartTEAM expected | Expected wrapper ID. Native equivalent is `music_stop_all_sounds` or `device_stop_melody`, depending intended behavior. |
| Salidas | Externos | Ajustar color de tira RGB | `smartteam_outputs_rgb_leds_color` | `smartteamOutputs` | `libs/smartteam-course-config/course-config.json` | SmartTEAM expected | Present in filter only; no source found. Reference extension has `tiraRgbColor` with unknown ID. |
| Salidas | Externos | Ajustar color RGB con números | `smartteam_outputs_rgb_leds_rgb` | `smartteamOutputs` | `libs/smartteam-course-config/course-config.json` | SmartTEAM expected | Present in filter only; no source found. Reference extension has `tiraRgbLed` with unknown ID. |
| Salidas | Native music | Reproducir nota | `device_play_note` | `music` | `libs/core/music.ts` | Native | Native duplicate of expected SmartTEAM wrapper. Current filters hide namespace `music`. |
| Salidas | Native music | Reproducir tono | `device_ring` | `music` | `libs/core/music.ts` | Native | Native duplicate/alternate for expected SmartTEAM wrapper. |
| Salidas | Native music | Pitch analógico | `device_analog_pitch` | `pins` | `libs/core/pins.cpp` | Native | Native output block via pins, hidden with `pins`. |
| Salidas | Native music | Comenzar melodía | `device_start_melody` | `music` | `libs/core/music.ts` | Native | Native duplicate of expected SmartTEAM wrapper. |
| Salidas | Native music | Detener todos los sonidos | `music_stop_all_sounds` | `music` | `libs/core/music.ts` | Native | Native approximate for "Apagar zumbador". |
| Salidas | Native music | Detener melodía | `device_stop_melody` | `music` | `libs/core/music.ts` | Native | Native approximate for "Apagar zumbador". |
| Salidas | Native pins | Escribir pin digital | `device_set_digital_pin` | `pins` | `libs/core/pins.cpp` | Native | Native low-level output, currently hidden. |
| Salidas | Native pins | Escribir pin analógico | `device_set_analog_pin` | `pins` | `libs/core/pins.cpp` | Native | Native low-level output, currently hidden. |
| Salidas | Native pins | Servo write | `device_set_servo_pin` | `pins` | `libs/core/pins.cpp` | Native | Native low-level output, currently hidden. |
| Pantallas | LCD | Borrar Pantalla LCD | UNKNOWN | `beatMundial` in reference; expected target namespace `smartteamDisplay` | `../exp-microbit-fifa-v1/main.ts` function `lcdBorrar` | Reference extension / SmartTEAM pending | No explicit `blockId`. |
| Pantallas | LCD | Pantalla LCD mostrar texto | UNKNOWN | `beatMundial` in reference; expected target namespace `smartteamDisplay` | `../exp-microbit-fifa-v1/main.ts` function `lcdMostrar` | Reference extension / SmartTEAM pending | No explicit `blockId`. |
| Pantallas | RGB | Tira RGB mostrar color | UNKNOWN | `beatMundial` in reference; expected target namespace `smartteamDisplay` or `smartteamOutputs` | `../exp-microbit-fifa-v1/main.ts` function `tiraRgbColor` | Reference extension / SmartTEAM pending | No explicit `blockId`. Overlaps expected `smartteam_outputs_rgb_leds_color`. |
| Pantallas | RGB | Tira RGB LED R/G/B | UNKNOWN | `beatMundial` in reference; expected target namespace `smartteamDisplay` or `smartteamOutputs` | `../exp-microbit-fifa-v1/main.ts` function `tiraRgbLed` | Reference extension / SmartTEAM pending | No explicit `blockId`. Overlaps expected `smartteam_outputs_rgb_leds_rgb`. |
| Pantallas | RGB | Tira RGB apagar | UNKNOWN | `beatMundial` in reference; expected target namespace `smartteamDisplay` or `smartteamOutputs` | `../exp-microbit-fifa-v1/main.ts` function `tiraRgbApagar` | Reference extension / SmartTEAM pending | No explicit `blockId`. |
| Motores | DC | Girar el MOTOR DC | `smartteam_motors_turn_dc_motor` | `smartteamMotors` | `docs/smartteam/course-config-implementation.md` | SmartTEAM expected | Expected design ID only; no `libs/smartteam-motors/main.ts` source found in this branch. |
| Motores | Robot | Mover robot | `smartteam_motors_robot_move` | `smartteamMotors` | `libs/smartteam-course-config/course-config.json` | SmartTEAM expected | Present in filter only; no source found. Reference extension has `mover` with unknown ID. |
| Motores | Robot | Mover robot con velocidad | `smartteam_motors_robot_move_speed` | `smartteamMotors` | `libs/smartteam-course-config/course-config.json` | SmartTEAM expected | Present in filter only; no source found. Reference extension has `moverVelocidad` with unknown ID. |
| Motores | Robot | Parar robot/motor | `smartteam_motors_robot_stop` | `smartteamMotors` | `libs/smartteam-course-config/course-config.json` | SmartTEAM expected | Present in filter only; no source found. Reference extension has `parar` with unknown ID. |
| Motores | Fan | Ventilador | `smartteam_motors_fan_control` | `smartteamMotors` | `libs/smartteam-course-config/course-config.json` | SmartTEAM expected | Present in filter only; no source found. Reference extension has `ventilador` with unknown ID. |
| Motores | Servo | Posicionar servo | `smartteam_motors_servo_set_angle` | `smartteamMotors` | `libs/smartteam-course-config/course-config.json` | SmartTEAM expected | Present in filter only; no source found. Reference extension has `servoPosicionar` with unknown ID. |
| Motores | Servo | Mover servo gradualmente | `smartteam_motors_servo_move_gradually` | `smartteamMotors` | `libs/smartteam-course-config/course-config.json` | SmartTEAM expected | Present in filter only; no source found. Reference extension has `servoMoverGradual` with unknown ID. |
| Motores | Reference | Mover | UNKNOWN | `beatMundial` in reference; expected target namespace `smartteamMotors` | `../exp-microbit-fifa-v1/main.ts` function `mover` | Reference extension / SmartTEAM pending | No explicit `blockId`. |
| Motores | Reference | Mover con velocidad | UNKNOWN | `beatMundial` in reference; expected target namespace `smartteamMotors` | `../exp-microbit-fifa-v1/main.ts` function `moverVelocidad` | Reference extension / SmartTEAM pending | No explicit `blockId`. |
| Motores | Reference | Parar | UNKNOWN | `beatMundial` in reference; expected target namespace `smartteamMotors` | `../exp-microbit-fifa-v1/main.ts` function `parar` | Reference extension / SmartTEAM pending | No explicit `blockId`. |
| Motores | Reference | Ventilador | UNKNOWN | `beatMundial` in reference; expected target namespace `smartteamMotors` | `../exp-microbit-fifa-v1/main.ts` function `ventilador` | Reference extension / SmartTEAM pending | No explicit `blockId`. |
| Motores | Reference | Posicionar servo | UNKNOWN | `beatMundial` in reference; expected target namespace `smartteamMotors` | `../exp-microbit-fifa-v1/main.ts` function `servoPosicionar` | Reference extension / SmartTEAM pending | No explicit `blockId`. |
| Motores | Reference | Mover servo gradualmente | UNKNOWN | `beatMundial` in reference; expected target namespace `smartteamMotors` | `../exp-microbit-fifa-v1/main.ts` function `servoMoverGradual` | Reference extension / SmartTEAM pending | No explicit `blockId`. |

## Duplicates and Shared IDs

- `device_pause` and expected `smartteam_core_wait_ms` represent the same user-facing "Esperar (ms)" behavior if both are surfaced.
- `controls_repeat_ext` and expected `smartteam_control_repeat_times` represent the same repeat-loop behavior if both are surfaced.
- `device_button_event` and expected `smartteam_control_on_button_pressed` duplicate the same button event behavior.
- `device_gesture_event` and expected `smartteam_control_on_gesture` duplicate the same gesture event behavior for "Al agitar".
- `device_button_event`, `device_gesture_event`, and `input_logo_event` can logically appear in either `Control` or `Entradas`; filters and toolbox XML should expose each in only one SmartTEAM category.
- Many builtin categories use one block ID for several visible variants:
  - `controls_if` covers `if` and `if/else`.
  - `logic_compare` covers equality and comparison variants.
  - `logic_operation` covers AND/OR variants.
  - `logic_boolean` covers true/false.
  - `math_arithmetic` covers add/subtract/multiply/divide.
  - `math_op2` covers min/max.
- Native output blocks in `music` and `pins` overlap with intended SmartTEAM output wrappers. For a clean SmartTEAM toolbox, prefer wrappers and keep native namespaces hidden.
- The reference extension uses one namespace, `beatMundial`, with groups. The clean target design splits those blocks into `smartteamDigitalInputs`, `smartteamAnalogInputs`, `smartteamOutputs`, `smartteamMotors`, and `smartteamDisplay`.

## Reference Extension Blocks Not Yet Present in the Clean Branch

The following blocks exist in `../exp-microbit-fifa-v1/main.ts` and are not present as compiled SmartTEAM source blocks in the clean branch:

- Configuration: `deshabilitarMatriz`, `habilitarMatriz`
- Motors: `mover`, `moverVelocidad`, `parar`, `ventilador`, `servoPosicionar`, `servoMoverGradual`
- Digital inputs: `siguelineas`, `leerDistancia`, `leerBotonTactil`, `leerPulsador`, `leerTemperaturaDHT11`, `leerHumedadDHT11`
- Analog inputs: `leerHumedadSuelo`, `leerLuz`, `leerPotenciometro`, `leerNivelColor`, `colorDetectado`, `leerJoystick`
- Display/RGB: `lcdBorrar`, `lcdMostrar`, `tiraRgbColor`, `tiraRgbLed`, `tiraRgbApagar`

Because these reference blocks do not declare explicit `blockId` values, their exact block IDs are marked `UNKNOWN` in the table. During migration, each block should receive a stable explicit SmartTEAM `blockId` before it is used in course filters.

## SmartTEAM Packages Still Needing Source Migration

The following clean-architecture packages need source files and explicit block IDs before course filters can be exact:

- `libs/smartteam-core`
- `libs/smartteam-inputs`
- `libs/smartteam-outputs`
- `libs/smartteam-motors`
- `libs/smartteam-display`
- `libs/smartteam-shield` currently exists only as a placeholder under `libs/smartteam-display/pxt_modules/smartteam-shield`; it is not a root bundled/default source package.

Suggested target mapping:

- `smartteam-core`: control helpers such as `smartteam_core_wait_ms`, stopwatch helpers if kept there.
- `smartteam-inputs`: split visible namespaces into `smartteamDigitalInputs` and `smartteamAnalogInputs`.
- `smartteam-outputs`: LED, buzzer, melody, RGB strip output wrappers.
- `smartteam-motors`: DC motor, robot move/stop, fan, servo blocks.
- `smartteam-display`: LCD and any display-only blocks. RGB strip placement should be decided once: either `Salidas` or `Pantallas`, not both.
- `smartteam-shield`: shared pin mapping and low-level helpers, with no visible category unless needed.

## How to Resolve Unknown IDs

Preferred approach:

1. Migrate each reference function into the appropriate `libs/smartteam-*` package.
2. Add explicit stable `//% blockId=...` annotations matching the SmartTEAM naming convention.
3. Build the target and inspect generated metadata in `built/target.json`.
4. Update `libs/smartteam-course-config/course-config.json` only after the IDs are verified in source or generated metadata.

Do not rely on implicit generated IDs from function names for course filtering. They are harder to audit and easier to break during renames.

## Recommended Canonical IDs

These IDs are already referenced by current SmartTEAM docs/config and should be made canonical when implementing source packages:

- `smartteam_core_wait_ms`
- `smartteam_control_repeat_times`
- `smartteam_control_on_button_pressed`
- `smartteam_control_on_gesture`
- `smartteam_control_if_then`
- `smartteam_control_on_logo_pressed`
- `smartteam_control_start_stopwatch`
- `smartteam_control_stopwatch`
- `smartteam_outputs_set_led`
- `smartteam_outputs_set_led_brightness`
- `smartteam_outputs_play_note`
- `smartteam_outputs_play_tone`
- `smartteam_outputs_start_melody`
- `smartteam_outputs_stop_buzzer`
- `smartteam_outputs_rgb_leds_color`
- `smartteam_outputs_rgb_leds_rgb`
- `smartteam_motors_turn_dc_motor`
- `smartteam_motors_robot_move`
- `smartteam_motors_robot_move_speed`
- `smartteam_motors_robot_stop`
- `smartteam_motors_fan_control`
- `smartteam_motors_servo_set_angle`
- `smartteam_motors_servo_move_gradually`

