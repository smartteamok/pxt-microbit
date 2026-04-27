# Reference extension migration plan (FIFA Foundation → SmartTEAM)

This document analyzes the reference repository at `exp-microbit-fifa-v1`, maps it into the existing **SmartTEAM** package layout under `libs/` in `pxt-microbit`, and records the first implementation pass.

**Reference:** `/Users/marianobat/dev/makecode-smartteam/exp-microbit-fifa-v1`  
**Target:** `/Users/marianobat/dev/makecode-smartteam/pxt-microbit/libs/smartteam-*`

---

## 1. Reference package overview

### 1.1 `pxt.json`

| Field | Value |
| --- | --- |
| `name` | `FIFA Foundation` (package id: implied by folder when installed) |
| `version` | `1.4.0` |
| `dependencies` | `core: *`, `radio: *`, `microphone: *`, `neopixel: github:microsoft/pxt-neopixel` |
| `files` | `main.ts`, `README.md`, `icon.png` |
| `testFiles` | `test.ts` (empty; not loaded as extension) |
| `targetVersions.target` | `5.0.12` (older than current SmartTEAM / pxt-microbit 8.x) |
| `preferredEditor` | `blocksprj` |

**Implication for migration:** any port must re-validate on **micro:bit** target 8.x and **codal** variants; the reference predates the current target stack. The reference uses the **neopixel** extension, but the SmartTEAM implementation uses native `light.sendWS2812Buffer` so the target can build without bundling an external GitHub package.

### 1.2 `main.ts` structure

- **Single namespace:** `beatMundial` (Block palette title: “FIFA Foundation”).
- **Toolbox groups:** `Configuración`, `Entradas Digitales`, `Entradas Analógicas`, `Motores`, `Visualización` (set via `//% groups=` on the namespace).
- **All user-facing logic** lives in this file (~800 lines), including:
  - Exported blocks (enums + functions).
  - Private helpers: LCD (bit-bang over I2C), TCS34725 (I2C), DHT11 bit-bang, NeoPixel strip cache, pin maps, `clamp`, servo position array.

No separate `.ts` modules or `shims` / C++ in the reference.

---

## 2. Inventory: enums

| Enum | Values (summary) | Used for |
| --- | --- | --- |
| `BeatMotor` | Ambos, Izquierdo, Derecho | DC motor selection |
| `BeatDireccion` | Adelante, Atras, Izquierda, Derecha | Differential / move |
| `BeatPosicionLinea` | Izquierda, Centro, Derecha, Ninguna | Line position predicate |
| `BeatPuerto` | Puerto0–3 | Logical “port” for digital/Neo/servo/ultrasound API surface |
| `BeatPuertoAnalog` | Puerto0, Puerto1 | Soil/light/pot (maps to P0 or P2) |
| `BeatFanAccion` | Izquierda, Derecha, Parar | H-bridge or dual-pin fan |
| `BeatJoystickEje` | EjeX, EjeY, Pulsador | Joystick + button |
| `BeatPuertoJoystick` | Puerto1 only | Joystick always “port 1” |
| `BeatColorCanal` / `BeatColorDetectado` | R/G/B | TCS34725 color channels / dominant color check |
| `BeatLedIndex` | 0–5 | Per-LED index on strip |
| `BeatLedSeleccion` | Todos, 0–5 | Whole strip or one LED |

**Migration note:** SmartTEAM should use new enum names under Spanish labels as needed (`smartteamInputs`, `smartteamMotors`, etc.); do not copy `beatMundial` / `Beat*` names unless you want API compatibility for imported projects.

---

## 3. Inventory: blocks (exported functions)

### 3.1 Configuración (matrix LED vs line sensor)

| Block label (ES) | Function | Behavior |
| --- | --- | --- |
| Deshabilitar matriz LED | `deshabilitarMatriz()` | `led.enable(false)` — docs say avoid interference with line sensor on **P10** |
| Habilitar matriz LED | `habilitarMatriz()` | `led.enable(true)` |

**Target package:** `smartteam-core` (generic board behavior) or **`smartteam-shield`** if SmartTEAM treats “disable matrix when using shield sensors” as kit-specific policy.

### 3.2 Motores

| Block label (ES) | Function | Hardware notes |
| --- | --- | --- |
| Mover %direccion %motor | `mover()` | Calls `moverVelocidad` at 50% |
| Mover %direccion %motor con velocidad %velocidad | `moverVelocidad()` | **Left:** P13 (dir) + P14 (PWM). **Right:** P15 (dir) + P16 (PWM). Direction bits swapped per side (commented in code). |
| Parar %motor | `parar()` | PWM to 0 on P14 and/or P16 only |
| Ventilador %accion | `ventilador()` | P2 and P1 as digital; “left/right/stop” |
| Posicionar servo en %puerto a %grados° | `servoPosicionar()` | `pins.servoWritePin` on servo pin for port |
| Mover servo en %puerto … gradualmente | `servoMoverGradual()` | Steps angle with `basic.pause` |

**Target package:** `smartteam-motors` (DC, servo, fan). Pin assumptions are **FIFA board specific**; belong in comments or in **`smartteam-shield`** as named constants if we add a “FIFA / legacy kit” profile.

### 3.3 Entradas digitales (toolbox) — mixed analog/digital in implementation

| Block label (ES) | Function | Notes |
| --- | --- | --- |
| siguelíneas %posicion en %puerto | `siguelineas()` | **Ignores `puerto`:** reads **P10, P1, P2** as analog, threshold 30. |
| Distancia (cm) en %puerto | `leerDistancia()` | **Ignores `puerto`:** trigger **P2**, echo **P1** (`pulseIn` on P1). |
| Táctil en %puerto | `leerBotonTactil()` | `getDigitalPin(puerto) == 1` |
| Pulsador en %puerto | `leerPulsador()` | `getDigitalPin(puerto) == 0` (active low) |
| Temperatura DHT11 (°C) en %puerto | `leerTemperaturaDHT11()` | `dht11Read` on `getDigitalPin` |
| Humedad DHT11 en %puerto | `leerHumedadDHT11()` | same |

**Target package:** `smartteam-inputs`. Line and ultrasonic are **not** on abstract ports in code — document as **technical debt** in the reference.

### 3.4 Entradas analógicas

| Block label (ES) | Function | Notes |
| --- | --- | --- |
| Humedad de suelo en %puerto | `leerHumedadSuelo()` | `getAnalogPin`: **P0** or **P2** only |
| Intensidad luminosa en %puerto | `leerLuz()` | same |
| Posición potenciómetro en %puerto | `leerPotenciometro()` | same |
| Nivel de %canal en sensor de color | `leerNivelColor()` | TCS34725 @ **0x29**, I2C |
| Color detectado es %color | `colorDetectado()` | Dominant color heuristic; returns 0/1 |
| Joystick %eje en %puerto | `leerJoystick()` | X→**P1**, Y→**P2**, button→**P10** + pull-up; **ignores `puerto`** enum beyond signature |

**Target package:** `smartteam-inputs`. Color sensor and joystick share pins with other features (see section 5).

### 3.5 Visualización

| Block label (ES) | Function | Notes |
| --- | --- | --- |
| Borrar Pantalla LCD | `lcdBorrar()` | HD44780 via I2C **0x27** (4-bit nibble in `lcdWrite4`) |
| Pantalla LCD mostrar %texto en x %x y %y | `lcdMostrar()` | 16×2 implied |
| Tira RGB en %puerto … (color picker / R-G-B / apagar) | `tiraRgbColor`, `tiraRgbLed`, `tiraRgbApagar()` | Reference uses `neopixel.create(getDigitalPin(puerto), 6, RGB)`; SmartTEAM sends a native WS2812 buffer. |

**Target package:** `smartteam-display`. Implemented without a `neopixel` dependency to keep the default bundled target self-contained.

---

## 4. Internal helpers (not blocks)

- **LCD:** `lcdEnsureInit`, `lcdWrite4`, `lcdSend`, `lcdCommand`, `lcdData`, `lcdSetCursor` — I2C address `0x27`, fixed assumptions.
- **TCS34725:** `tcs34725Init`, `tcs34725ReadRgb`, 8/16-bit reads, `tcs34725ToAnalog` (scales 16-bit to 0–1023).
- **DHT11:** `dht11Read` — single-wire bit timing on chosen `DigitalPin`.
- **RGB strip:** reference uses lazy `neopixel.Strip[4]`; SmartTEAM uses cached 18-byte buffers and `light.sendWS2812Buffer`, 6 pixels per strip.
- **Pin mapping:** `getDigitalPin` (P0, P2, P11, P5 for ports 0–3), `getAnalogPin` (P0, P2), `getServoPin`, `puertoIndex`, `clamp` / `clampServoAngle`.
- **State:** `servoPosiciones[4]`, `neoStrips[4]`, `lcdInicializado`, `tcs34725Inicializado`.

---

## 5. Hardware assumptions and pin conflicts

| Resource | Pins or bus | Conflicts / notes |
| --- | --- | --- |
| **DC motors (differential)** | P13–P16 | Occupies all four; standard GPIO/PWM. |
| **Line follower (3-ch)** | P10, P1, P2 (analog) | README + code: **P10** conflicts with **LED matrix column**; `deshabilitarMatriz()` recommended. |
| **Ultrasonic** | Trigger P2, echo P1 | README: **ultrasound and line follower share P1/P2** — use one at a time. |
| **Ventilador** | P1, P2 digital | **Same pins** as line center/side, ultrasonic, joystick X/Y. Mutual exclusion. |
| **Joystick** | P1 (X), P2 (Y), P10 (button) | Overlaps line + matrix column issue on P10. |
| **Analog “ports”** | P0, P2 only | Limited; not a full 4-port analog mux. |
| **RGB strips / WS2812** | Data on P0, P2, P11, or P5 (per `getDigitalPin`) | 6 LEDs; SmartTEAM uses native `light.sendWS2812Buffer`. |
| **LCD** | I2C **0x27** | Shares **I2C bus** with TCS34725 **0x29** — OK on same bus, different addresses. |
| **TCS34725** | I2C **0x29** | Must not conflict with other I2C devices on same SDA/SCL. |
| **DHT11** | One-wire on mapped digital port | Timing sensitive; not concurrent with long blocking on same pin. |

**Risk:** the reference’s `BeatPuerto` abstraction **does not** consistently map to isolated hardware; several blocks **ignore** the `puerto` parameter. Migration should either fix mappings (SmartTEAM shield spec) or document the same limitations explicitly.

---

## 6. Overlap with current SmartTEAM blocks

| SmartTEAM (current) | Reference (FIFA) | Overlap type |
| --- | --- | --- |
| `smartteamCore.waitMs` | *(none)* | None — different role (pause vs kit config). |
| `smartteamOutputs.*` (LED, brightness, tone, buzzer) | *(no equivalent blocks)* | **No functional overlap** — FIFA does not expose generic LED-on-pin or piezo helpers; actuators are kit-specific. |
| `smartteamMotors.turnDcMotor` (single `AnalogPin`, −100..100) | `moverVelocidad` / `parar` (dual H-bridge, P13–P16) | **Conceptual overlap** (DC motor) but **different electrical model** (one PWM pin vs direction + PWM pairs). **Keep both** with distinct block labels and documentation. |

**Conclusion:** migration **adds** features; it does not replace the minimal SmartTEAM validation blocks. Namespace and `blockId`s should remain unique to avoid Blockly collisions.

---

## 7. Proposed package mapping (FIFA → SmartTEAM)

| Reference area | Target package | Rationale |
| --- | --- | --- |
| `deshabilitarMatriz` / `habilitarMatriz` | `smartteam-core` *or* `smartteam-shield` | Board-level policy; if only SmartTEAM kit needs it, prefer **shield**. |
| `mover`, `moverVelocidad`, `parar`, `ventilador`, `servoPosicionar`, `servoMoverGradual` | `smartteam-motors` | Motors and servos. |
| `siguelineas`, `leerDistancia`, `leerBotonTactil`, `leerPulsador`, `leerHumedadSuelo`, `leerLuz`, `leerPotenciometro`, `leerNivelColor`, `colorDetectado`, `leerJoystick`, DHT11 readers | `smartteam-inputs` | Sensors and user inputs. |
| *(none in FIFA)* | `smartteam-outputs` | Reserved for **generic** outputs (LED, sound) — FIFA blocks don’t map here unless we split “ventilador” as generic (unlikely). |
| `lcdBorrar`, `lcdMostrar`, NeoPixel tira blocks | `smartteam-display` | LCD + RGB strip. |
| Pin map documentation / `getDigitalPort` for a specific PCB | `smartteam-shield` | Central place for “port 0 = P0 …” and FIFA-specific P13–P16 motor wiring (optional `//%` or plain TS constants). |
| `clamp`, I2C low-level, DHT11 private implementation | Stay **internal** in the same packages as the blocks that need them, or a future `smartteam-core` **non-exported** helper module if duplication grows. |

**RGB implementation decision:** do not add `neopixel` to SmartTEAM packages for now. The default target build does not install GitHub dependencies when compiling bundled project templates, so the implementation writes WS2812 buffers directly through the native `light` API.

---

## 8. Files changed in the first implementation pass

This is the checklist used for the first implementation pass.

| Location | Change |
| --- | --- |
| `libs/smartteam-motors/pxt.json` | Added dependency on `smartteam-shield`. |
| `libs/smartteam-motors/main.ts` | Ported robot movement, H-bridge stop, fan, and servo blocks while preserving the original simple `turnDcMotor` validation block. |
| `libs/smartteam-inputs/pxt.json` | Added dependency on `smartteam-shield`. |
| `libs/smartteam-inputs/main.ts` | Ported line, ultrasonic, analog, color, joystick, digital button, and DHT11 blocks. |
| `libs/smartteam-display/pxt.json` | Added dependency on `smartteam-shield`; no external `neopixel` dependency. |
| `libs/smartteam-display/main.ts` | Ported LCD and RGB strip blocks using native WS2812 buffers. |
| `libs/smartteam-shield/main.ts` | Added enums, port maps, and small shared helpers. |
| `libs/smartteam-core/main.ts` | Added LED matrix enable/disable blocks for P10 sensor workflows. |
| `libs/blocksprj/pxt.json` / `libs/tsprj/pxt.json` | No extra GitHub dependency required. |

**Do not modify:** `libs/core` or other native **micro:bit** packages; only `libs/smartteam-*` (and target registration already in place).

---

## 9. Risks and open questions

1. **Target version drift:** reference targets `5.0.12`; SmartTEAM uses current pxt-microbit. Re-test I2C timing, `pulseIn`, `servoWritePin`, and WS2812 output on **V1 vs V2** if you still support V1.
2. **`puerto` parameters ignored** in several blocks: fix vs preserve for backward compatibility for saved `.hex` / shared URLs?
3. **RGB color order:** SmartTEAM uses GRB buffer order for WS2812. Confirm with the physical strips used in the kit.
4. **Naming / branding:** replace “FIFA Foundation” and `beatMundial` with SmartTEAM namespaces (`smartteamInputs`, etc.) and new Spanish/English `block` strings; avoid copying marketing strings if policy requires.
5. **I2C LCD at 0x27:** some modules use 0x3F — might need a second address or a block to configure (open question for hardware team).
6. **Concurrent use:** document mutually exclusive subsystems (ultrasonic vs line vs ventilador vs joystick) on P1/P2/P10; optional runtime guard is heavy — documentation may be enough.
7. **Radio / microphone** in reference `pxt.json`: included but **unused** in `main.ts`. SmartTEAM already mirrors `core+radio+microphone` in package deps; can drop from SmartTEAM extension packages if not needed, or keep for parity with default project.

---

## 10. Suggested migration phases

1. **Document pin map** in `smartteam-shield` (or wiki): single source of truth for kit connectors vs micro:bit pins.  
2. **Port non-display inputs** (digital/analog, DHT, color, joystick) to `smartteam-inputs` with new `blockId`s and clear labels.  
3. **Port motors** to `smartteam-motors`, keeping SmartTEAM’s simple `turnDcMotor` for generic pedagogy; add H-bridge blocks as separate APIs.  
4. **Port LCD + RGB strip** to `smartteam-display` using the native WS2812 buffer path.  
5. **Acceptance test:** new project, drag one block per category, compile `.hex` (existing SmartTEAM workflow).  
6. **Optional:** course/grade toolboxes later (out of scope per product rules).

---

## 11. Summary

- The reference extension is a **single namespace** with **~20+ user blocks**, **10 enums**, and **substantial private code** (LCD, TCS34725, DHT11, NeoPixel) plus **hard-coded FIFA pinout** (especially P13–P16 motors and shared P1/P2/P10).
- **Map** motors → `smartteam-motors`, sensors → `smartteam-inputs`, LCD/Neo → `smartteam-display`, matrix enable/disable and port tables → `smartteam-core` or `smartteam-shield`.
- **Do not** replace existing SmartTEAM blocks; add parallel APIs with distinct names and wiring docs.
- **Risks:** pin sharing, ignored `puerto` in reference, RGB color order, and target version re-validation on 8.x.
