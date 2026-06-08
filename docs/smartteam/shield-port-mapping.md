# SmartTeam Shield Port Mapping

This document is the maintenance reference for student-facing SmartTeam shield ports.

The shield labels connectors as `Puerto 0`, `Puerto 1`, `Puerto 2`, and `Puerto 3`. SmartTeam blocks should expose those labels to students and use `libs/smartteam-shield` to translate them to micro:bit pins.

## Source Of Truth

The code source of truth is `libs/smartteam-shield/main.ts`.

Do not duplicate port switch statements inside `smartteam-outputs`, `smartteam-motors`, or `smartteam-inputs` unless a component genuinely needs a secondary or tertiary pin that is not yet modeled in `smartteam-shield`.

## Primary Digital Mapping

| Student label | Primary digital pin | Current uses |
|---|---|---|
| Puerto 0 | `DigitalPin.P0` | RGB strip, digital outputs, servo-compatible signal |
| Puerto 1 | `DigitalPin.P2` | RGB strip, digital outputs, servo-compatible signal |
| Puerto 2 | `DigitalPin.P11` | RGB strip, digital outputs, servo-compatible signal |
| Puerto 3 | `DigitalPin.P5` | RGB strip, digital outputs, servo-compatible signal |

This mapping comes from the FIFA Foundation kit reference extension provided during SmartTeam development.

## Helpers

Use these helpers from `smartteamShield`:

| Helper | Purpose |
|---|---|
| `digitalPinForPort(port)` | Primary digital signal for a shield port. |
| `analogPinForPort(port)` | Primary analog-capable signal for blocks that need an `AnalogPin`. |
| `portIndex(port)` | Stable index for per-port caches, such as NeoPixel strips. |

## Multi-Signal Connectors

Some RJ connectors carry two or three micro:bit signals. Add explicit helpers when a component needs those extra lines, for example:

- `secondaryDigitalPinForPort(port)`
- `tertiaryDigitalPinForPort(port)`
- component-specific helpers such as `ultrasonicTriggerPinForPort(port)` and `ultrasonicEchoPinForPort(port)`

When adding one, update this document and include the hardware source for the mapping.

## Adding A Component

1. Add the component block in the owning package (`smartteam-outputs`, `smartteam-motors`, or `smartteam-inputs`).
2. Depend on `smartteam-shield` from that package's `pxt.json`.
3. Use `smartteamShield.SmartTeamPort` in block parameters so students see `Puerto 0` through `Puerto 3`.
4. Use the appropriate helper to get micro:bit pins.
5. Update course filters if the block is not visible in every grade that loads the package.
6. Run `node scripts/generate-smartteam-locales.js` and `npx pxt buildtarget`.
