# SmartTEAM toolbox specification

This is the source of truth for the full SmartTEAM toolbox before any future grade/course filtering.

General rule: visible blocks should use the color of their SmartTEAM category. Native MakeCode/micro:bit APIs can still be used internally, but kit-facing visible blocks should be wrapped or whitelisted so the student sees a consistent category color.

## Official categories and colors

- `Funciones`: `#7E57C2`
- `Control`: `#FF9800`
- `Lógica`: `#3BC64A`
- `Matemáticas`: `#13BFD3`
- `Variables`: `#E91E63`
- `Texto`: `#009688`
- `Comunicación`: `#00BFA5`
- `Entradas`: `#9C27B0`
- `Salidas`: `#F44336`
- `Pantallas`: `#3F51B5`
- `Motores`: `#42A5F5`

## Funciones

Color: `#7E57C2`

Blocks:

- Crear función sin retorno
- Crear función con retorno
- Si devuelve

Origin:

- Native MakeCode where possible.
- Keep native function behavior and colors where applicable.

## Control

Color: `#FF9800`

Blocks:

- Esperar (ms) `[ms]`
- Si... Entonces
- Mientras... hacer
- Repetir `[n]` veces
- Al presionar el botón `[A/B]`
- Al `[agitar]`
- Al presionar el logo
- Iniciar cronómetro
- Cronómetro

Notes:

- Visible blocks should use Control color.
- `Al presionar el logo` may depend on micro:bit v2.
- `Mientras... hacer` appears in product reference but not always in the grade PDF; keep it in the full toolbox spec for now.

## Lógica

Color: `#3BC64A`

Blocks:

- `[valor]` es `[= / != / < / > / <= / >=]` a `[valor]`
- `[condición]` `[y / o]` `[condición]`
- No `[condición]`

Origin:

- Prefer native MakeCode logic blocks.
- Keep original native block colors.

## Matemáticas

Color: `#13BFD3`

Blocks:

- Número entero `[0]`
- `[número]` `[+ / - / x / ÷]` `[número]`
- Mapear `[valor]` de `[mínimo]` - `[máximo]` a `[mínimo]` - `[máximo]`
- Aleatorio entre `[mínimo]` y `[máximo]`

Origin:

- Use native MakeCode math blocks where possible.
- Mapear can be SmartTEAM wrapper if not available natively.
- Native blocks keep original colors.

## Variables

Color: `#E91E63`

Blocks:

- Crear variable
- Definir `[variable]` a `[valor]`
- Cambiar `[variable]` por `[valor]`
- `[variable]`

Origin:

- Native MakeCode variables.
- Keep native colors and behavior.

## Texto

Color: `#009688`

Blocks:

- Elemento de texto `"abc"`
- Crear texto
- `[texto]` igual a `[texto]`

Origin:

- Prefer native text blocks where possible.
- Keep original native colors.

## Comunicación

Color: `#00BFA5`

### Bluetooth

Blocks:

- Escribir por puerto serie con salto de línea `"abc"`
- Escribir por puerto serie `"abc"`
- Número con etiqueta `[A]`
- Enviar por bluetooth el mensaje `"abc"` con etiqueta `[A]`
- Si se recibe un mensaje por bluetooth, leer
- Control del Robot
- Joystick
- Botón A
- Botón B

### Radio

Blocks:

- Establece el grupo de radio a `[0]`
- Envía número `[0]` por radio
- Envía texto `"abc"` por radio
- Enviar número `[0]` con etiqueta `"abc"` por radio
- Si se recibe un `[Número / Texto]` por radio, leer
- Número recibido por radio
- Texto recibido por radio
- Etiqueta recibida por radio

Origin:

- Use native radio/serial blocks where appropriate.
- Keep native colors for native blocks.
- SmartTEAM Bluetooth-specific blocks should use Comunicación color.

## Entradas

Color: `#9C27B0`

### Digitales / Microbit

Blocks:

- Botón `[A/B]` está presionado
- LOGO está presionado

### Digitales / Externos

Blocks:

- BOTÓN en el pin `[0]`
- TÁCTIL en el pin `[0]`
- TEMPERATURA en el pin `[0]`
- ULTRASONIDO en el pin `[1]`
- OBSTÁCULO en el pin `[0]`
- COLOR `[rojo/verde/azul/...]` en el pin `[IIC]`
- COLOR en el pin `[IIC]` es `[color]`
- Seguidor de líneas en el pin `[1]`
- Derecha
- Centro
- Izquierda

### Analógicas / Microbit

Blocks:

- NIVEL DE LUZ en el sensor de microbit
- Temperatura en el sensor de microbit
- Aceleración en el eje `[X/Y/Z]`
- Fuerza magnética en el eje `[X/Y/Z]`
- Nivel de sonido en el sensor microbit

### Analógicas / Externos

Blocks:

- LUZ en el pin `[0]`
- SUELO en el pin `[0]`
- POTENCIÓMETRO en el pin `[0]`
- Eje `[X/Y]` del JOYSTICK en el pin `[1]`

Origin:

- Native micro:bit input blocks should keep original native colors.
- SmartTEAM external input blocks should use Entradas color.

Notes:

- Confirm later whether TEMPERATURA en el pin should remain under Digitales or move to Analógicas.
- Confirm whether Derecha/Centro/Izquierda are separate blocks, enum values, or dropdown options.

## Salidas

Color: `#F44336`

### Externos

Blocks:

- `[Prender / apagar]` el LED en el pin `[0]`
- Ajustar el brillo a `[1023]` del LED en el pin `[0]`
- Prender de color `[color1] [color2] [color3]...` los LEDs RGB en el pin `[0]`
- Ajustar el color a R `[255]` G `[255]` B `[255]` del módulo de LED RGB en el pin `[0]`
- Reproducir nota `[MI]` con duración `[ms] [1000]` en el ZUMBADOR integrado
- Reproducir tono `[frecuencia]` con duración `[ms] [1000]` en el ZUMBADOR integrado
- Comenzar melodía `[dadadadum] [hasta el final]`
- Apagar ZUMBADOR integrado

Origin:

- SmartTEAM outputs should use Salidas color.
- Native music blocks reused should keep native colors unless implemented as SmartTEAM wrappers.

## Pantallas

Color: `#3F51B5`

### LCD

Blocks:

- Escribir `"abc"` en la fila `[0]` y columna `[0]` del LCD en el pin `[IIC]`
- Borrar textos del LCD en el pin `[IIC]`

### Matriz 8x8

Blocks:

- Matriz 8x8 `[IIC]`
- Escribir `"abc"` en la matriz 8x8 en el pin `[IIC]`
- `[Dibujar / borrar]` línea desde x `[0]`, y `[0]` hasta x `[2]`, y `[0]` en la matriz 8x8 `[IIC]`
- Rotar a la posición `[0]` la matriz 8x8 en el pin `[IIC]`
- Invertir colores de la matriz 8x8 en el pin `[IIC]`
- Borrar la matriz 8x8 en el pin `[IIC]`

Origin:

- SmartTEAM display blocks should use Pantallas color.

## Motores

Color: `#42A5F5`

### Servo

Blocks:

- Posicionar en el grado `[90]` el SERVO en el pin `[0]`
- Mover gradualmente al grado `[90]` cada `[10] [ms]` el SERVO en el pin `[0]`

### Motor DC

Blocks:

- Girar a la `[derecha / izquierda]` el MOTOR DC en el pin `[1]`

### Movimiento robot

Blocks:

- Avanzar
- Avanzar con velocidad `[1023]`
- Girar a la `[derecha / izquierda]` el MOTOR en el pin `[RM/LM]`
- Girar a la `[derecha / izquierda]` con velocidad `[1023]` el MOTOR en el pin `[RM/LM]`

Origin:

- SmartTEAM motor blocks should use Motores color.

## Expected result

- `docs/smartteam/toolbox-spec.md` exists and contains the spec.
- `docs/smartteam/toolbox-audit.md` exists and summarizes what was changed and what still needs review.
- The toolbox is closer to the SmartTEAM target structure.
- Native blocks used in SmartTEAM categories keep their original colors.
- SmartTEAM custom blocks use the defined category colors.
- Extra/default blocks not listed in the spec are hidden where safe.
- No modal, grade filtering, login, cloud, or branding changes were made.
