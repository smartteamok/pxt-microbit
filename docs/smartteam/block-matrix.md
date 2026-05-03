# Initial Block Matrix

This document captures the first pass of block availability by grade. It is a **planning / curriculum worksheet**: rows can drift from `libs/smartteam-*/main.ts` (`blockId`, naming). For what is actually implemented and exposed per grade, use the course `pxt.json` files and the sources under `libs/smartteam-*`.

Assumption: rows marked `4,5,2006` in the source notes mean `4,5,6`.

Status values:

- `existing-smartteam`: implemented or mostly implemented in the current SmartTeam pilot.
- `extension-source`: logic exists in `smartteamok/exp-microbit-fifa-v1` and should be adapted.
- `native`: provided by micro:bit/MakeCode.
- `pending-definition`: needs product/protocol details before implementation.
- `to-confirm`: block ID, label, or behavior needs verification.

## Grades 1-6

| Category | Label | Expected blockId | Source | Status |
|---|---|---|---|---|
| Control | Esperar (ms) | `smartteam_core_wait_ms` | `smartteamCore` | existing-smartteam |
| Control | Repetir [n] veces / Hacer | `smartteam_control_repeat_times` | `smartteamCore` | existing-smartteam |
| Control | Al presionar el boton [A] | `smartteam_control_on_button_pressed` | `smartteamCore` | existing-smartteam |
| Control | Al [agitar] | `smartteam_control_on_gesture` | `smartteamCore` | existing-smartteam; grade 1 should only expose shake |
| Salidas | [Prender] el LED en el pin [0] | `smartteam_outputs_set_led` | `smartteamOutputs` | existing-smartteam |
| Salidas | Ajustar el brillo a [1023] del LED en el pin [0] | `smartteam_outputs_set_led_brightness` | `smartteamOutputs` | existing-smartteam |
| Salidas | Reproducir nota [MI] con duracion [ms] [1000] en el ZUMBADOR integrado | `smartteam_outputs_play_note` | `smartteamOutputs` | existing-smartteam |
| Salidas | Reproducir tono [frecuencia] con duracion [ms] [1000] en el ZUMBADOR integrado | `smartteam_outputs_play_tone` | `smartteamOutputs` | existing-smartteam |
| Salidas | Comenzar melodia [dadadadum] [hasta el final] | `smartteam_outputs_start_melody` | `smartteamOutputs` | existing-smartteam |
| Salidas | Apagar ZUMBADOR integrado | `smartteam_outputs_stop_buzzer` | `smartteamOutputs` | existing-smartteam |
| Motores | Girar a la [derecha] el MOTOR DC en el pin [1] | `smartteam_motors_turn_dc_motor` | `smartteamMotors` | to-confirm; current pilot uses speed model |

## Grades 2-6

| Category | Label | Expected blockId | Source | Status |
|---|---|---|---|---|
| Salidas | Prender de color [color1]...[color6] los LEDs RGB en el pin [0] | `smartteam_outputs_rgb_leds_color` | `smartteamOutputs` | to-confirm; current pilot has single-color selection, extension has RGB strip logic |
| Salidas | Ajustar el color a R [255] G [255] B [255] del modulo de LED RGB en el pin [0] | `smartteam_outputs_rgb_leds_rgb` | `smartteamOutputs` | existing-smartteam |
| Motores | Posicionar en el grado [90] el SERVO en el pin [0] | `smartteam_motors_servo_set_angle` | `smartteamMotors` | existing-smartteam |
| Motores | Mover gradualmente al grado [90] cada [10] [ms] el SERVO en el pin [0] | `smartteam_motors_servo_move_gradually` | `smartteamMotors` | existing-smartteam |

## Grades 3-6

| Category | Label | Expected blockId | Source | Status |
|---|---|---|---|---|
| Control | si [condicion] es [=] a [0], entonces | `smartteam_control_if_then` | `smartteamCore` | existing-smartteam; label may need adjustment |
| Control | Al [presionar] el logo | `smartteam_control_on_logo_pressed` | `smartteamCore` | existing-smartteam |
| Logica | [valor] es [=] a [1] | `logic_compare` | native | native |
| Logica | [condicion] [y] [condicion] | `logic_operation` | native | native |
| Logica | no [condicion] | `logic_negate` | native | native |
| Matematicas | [0] | `math_number` | native | native |
| Matematicas | Aleatorio entre [1] y [10] | `device_random` | native | to-confirm |
| Entradas (D) | Boton [A] esta presionado | `device_get_button2` | native/wrapper | existing-smartteam wrapper exists as `smartteam_digital_button_pressed` |
| Entradas (D) | LOGO esta presionado | `input_logo_is_pressed` | native/wrapper | existing-smartteam wrapper exists as `smartteam_digital_logo_pressed` |
| Entradas (D) | BOTON en el pin [0] | `smartteam_inputs_button_pin` | `smartteamDigitalInputs` | naming mismatch; current pilot uses `smartteam_digital_push_button` |
| Entradas (D) | OBSTACULO en el pin [0] | `smartteam_inputs_obstacle_pin` | `smartteamDigitalInputs` | pending |
| Entradas (D) | COLOR [rojo] en el pin [IIC] | `smartteam_inputs_color_value` | `smartteamDigitalInputs` | extension-source |
| Entradas (D) | COLOR en el pin [IIC] es [color] | `smartteam_inputs_color_is` | `smartteamDigitalInputs` | extension-source |
| Entradas (~A) | NIVEL DE LUZ en el sensor de microbit | `device_get_light_level` | native | native |

## Grades 4-6

| Category | Label | Expected blockId | Source | Status |
|---|---|---|---|---|
| Control | Mientras [condicion] hacer | `smartteam_control_while` | `smartteamCore` | to-confirm; current `extension.tsx` injects native `device_while` snippet |
| Control | Iniciar cronometro | `smartteam_control_start_stopwatch` | `smartteamCore` | existing-smartteam |
| Control | Cronometro | `smartteam_control_stopwatch` | `smartteamCore` | existing-smartteam |
| Texto | " " | `text` | native | native |
| Texto | crear texto con [texto] [texto] | `text_join` | native | native |
| Texto | [texto] = "abc" | `text_equals` | native | to-confirm |
| Entradas (D) | TACTIL en el pin [0] | `smartteam_inputs_touch_pin` | `smartteamDigitalInputs` | naming mismatch; current pilot uses `smartteam_digital_touch_button` |
| Entradas (~A) | Temperatura en el sensor de microbit | `device_temperature` | native | native |
| Entradas (~A) | Aceleracion en el eje [x] | `device_acceleration` | native | native |
| Entradas (~A) | Fuerza magnetica en el eje [x] | `device_get_magnetic_force` | native | native |
| Motores | [Avanzar] | `smartteam_motors_robot_move` | `smartteamMotors` | existing-smartteam |

## Grades 5-6

| Category | Label | Expected blockId | Source | Status |
|---|---|---|---|---|
| Funciones | Crear funcion sin retorno | `function_definition` | native | native |
| Variables | Crear variable... | `variables_create` | native | native |
| Entradas (D) | TEMPERATURA [opcion] en el pin [0] | `smartteam_inputs_temperature_pin` | `smartteamDigitalInputs` | extension-source; current extension has DHT11 temperature/humidity |
| Entradas (D) | ULTRASONIDO en el pin [1] | `smartteam_inputs_ultrasonic_pin` | `smartteamDigitalInputs` | extension-source |
| Entradas (D) | Seguidor de lineas en el pin [1] | `smartteam_inputs_line_follower` | `smartteamDigitalInputs` | extension-source |
| Entradas (~A) | Nivel de sonido en el sensor microbit | `input_sound_level` | native | to-confirm |
| Entradas (~A) | LUZ en el pin [0] | `smartteam_inputs_light_pin` | `smartteamAnalogInputs` | existing-smartteam logic |
| Entradas (~A) | SUELO en el pin [0] | `smartteam_inputs_soil_pin` | `smartteamAnalogInputs` | existing-smartteam logic |
| Entradas (~A) | POTENCIOMETRO en el pin [0] | `smartteam_inputs_potentiometer_pin` | `smartteamAnalogInputs` | existing-smartteam logic |
| Entradas (~A) | Eje [X] del JOYSTICK en el pin [1] | `smartteam_inputs_joystick_axis` | `smartteamAnalogInputs` | extension-source |
| Pantallas | Escribir "abc" en la fila [0] y columna [0] del LCD en el pin [IIC] | `smartteam_display_lcd_write` | `smartteamDisplay` | naming mismatch; current pilot uses `smartteam_display_lcd_show` |
| Pantallas | Borrar textos del LCD en el pin [IIC] | `smartteam_display_lcd_clear` | `smartteamDisplay` | existing-smartteam |
| Pantallas | Matriz 8x8 [IIC] | `smartteam_display_matrix8x8_create` | `smartteamDisplay` | pending |
| Pantallas | Escribir "abc" en la matriz 8x8 en el pin [IIC] | `smartteam_display_matrix8x8_write` | `smartteamDisplay` | pending |
| Pantallas | [Dibujar] linea desde x [0], y [0] hasta x [2], y [0] en la matriz 8x8 [IIC] | `smartteam_display_matrix8x8_line` | `smartteamDisplay` | pending |
| Pantallas | Rotar a la posicion [0] la matriz 8x8 en el pin [IIC] | `smartteam_display_matrix8x8_rotate` | `smartteamDisplay` | pending |
| Pantallas | Invertir colores de la matriz 8x8 en el pin [IIC] | `smartteam_display_matrix8x8_invert` | `smartteamDisplay` | pending |
| Pantallas | Borrar la matriz 8x8 en el pin [IIC] | `smartteam_display_matrix8x8_clear` | `smartteamDisplay` | pending |
| Motores | [Avanzar] con velocidad [1023] | `smartteam_motors_robot_move_speed` | `smartteamMotors` | existing-smartteam; current range is 0-100 |
| Motores | Girar a la [derecha] el MOTOR en el pin [RM] | `smartteam_motors_robot_motor_turn` | `smartteamMotors` | pending |
| Motores | Girar a la [derecha] con velocidad [1023] el MOTOR en el pin [RM] | `smartteam_motors_robot_motor_turn_speed` | `smartteamMotors` | pending |

## Grade 6

| Category | Label | Expected blockId | Source | Status |
|---|---|---|---|---|
| Funciones | Crear funcion con retorno | `function_definition_return` | native | native |
| Funciones | si [condicion] devuelve [valor] | `function_return_if` | native | to-confirm |
| Comunicacion Bluetooth | Escribir por puerto serie con salto de linea "abc" | `serial_writeline` | native | to-confirm |
| Comunicacion Bluetooth | Escribir por puerto serie "abc" | `serial_writestring` | native | native |
| Comunicacion Bluetooth | [Numero] con etiqueta [A] | `smartteam_communication_value_with_label` | `smartteamCommunication` | pending-definition |
| Comunicacion Bluetooth | Enviar por bluetooth el mensaje "abc" con etiqueta [A] | `smartteam_communication_bluetooth_send_message` | `smartteamCommunication` | pending-definition |
| Comunicacion Bluetooth | Si se recibe un mensaje por bluetooth, leer | `smartteam_communication_bluetooth_on_message` | `smartteamCommunication` | pending-definition |
| Comunicacion Bluetooth | Control del Robot | `smartteam_communication_robot_control` | `smartteamCommunication` | pending-definition |
| Comunicacion Bluetooth | Joystick [direccion] | `smartteam_communication_joystick_event` | `smartteamCommunication` | pending-definition |
| Comunicacion Bluetooth | Boton [A] | `smartteam_communication_button_event` | `smartteamCommunication` | pending-definition |
| Comunicacion Radio | Establece el grupo de radio a [0] | `radio_set_group` | native | native |
| Comunicacion Radio | Envia numero [0] por radio | `radio_datagram_send_number` | native | to-confirm |
| Comunicacion Radio | Envia texto "abc" por radio | `radio_datagram_send_string` | native | to-confirm |
| Comunicacion Radio | Enviar numero [0] con etiqueta "abc" por radio | `radio_datagram_send_value` | native | to-confirm |
| Comunicacion Radio | Si se recibe un [Numero] por radio, leer | `radio_on_packet` | native | native/to-confirm behavior |
| Comunicacion Radio | Numero recibido por radio | `radio_received_number` | native | to-confirm |
| Comunicacion Radio | Texto recibido por radio | `radio_received_string` | native | to-confirm |
| Comunicacion Radio | Etiqueta recibida por radio | `radio_received_name` | native | to-confirm |

## Notes From Extension Review

The `smartteamok/exp-microbit-fifa-v1` extension contains useful implementation logic for:

- robot movement with P13/P14 and P15/P16
- line follower over P10/P1/P2
- ultrasonic distance over P1/P2
- fan over P1/P2
- servo positioning and gradual movement
- soil, light, potentiometer analog reads
- TCS34725 color sensor
- joystick
- touch button and push button
- DHT11 temperature/humidity
- LCD 16x2 over I2C
- RGB strip

This logic should be adapted into SmartTeam packages with stable SmartTeam block IDs and localized labels.

