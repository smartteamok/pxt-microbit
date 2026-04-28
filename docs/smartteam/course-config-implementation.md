# SmartTEAM Course Config Implementation

## Files Changed

- `libs/smartteam-course-config/course-config.json`
- `editor/extension.tsx`
- `docs/smartteam/course-config-implementation.md`

No changes were made to `pxt`, native micro:bit packages, login, cloud, deployment, or branding.

## Course Configuration

The SmartTEAM course selector is defined in `libs/smartteam-course-config/course-config.json`.

It contributes one generic new project option group:

- `id`: `smartteamCourse`
- `label`: `Selecciona el curso`
- `required`: `true`
- `style`: `buttons`

Enabled options:

- `grade1`: `1.º grado`
- `grade6`: `6.º grado`

Courses 2.º through 5.º are omitted for this first implementation. The generic PXT hook also supports disabled options, so they can be added later if the UX should show all six grades.

## How the Config Is Loaded

`editor/extension.tsx` loads the JSON config at build time:

```typescript
const smartTeamCourseConfig = require("../../libs/smartteam-course-config/course-config.json") as SmartTeamCourseConfig;
```

The extension maps the target-local JSON into the generic PXT `newProjectOptionGroups` shape:

```typescript
newProjectOptionGroups: getSmartTeamNewProjectOptionGroups()
```

This keeps SmartTEAM-specific labels, course IDs, and filters in `pxt-microbit`, while `pxt` only knows about generic option groups.

## How It Connects to `newProjectOptionGroups`

The local `pxt` branch provides a generic extension hook:

```typescript
ExtensionResult.newProjectOptionGroups?: NewProjectOptionGroup[];
```

When `pxt-microbit/editor/extension.tsx` returns `newProjectOptionGroups`, the generic New Project dialog renders them as required buttons. The selected option contributes:

- `projectConfig`
- `toolboxFilter`

The PXT dialog then passes those values through `ProjectCreationOptions`.

## Selected Course Metadata

Each enabled course writes target-owned metadata into the generated project `pxt.json`.

For 1.º grado:

```json
{
  "smartteam": {
    "course": "grade1"
  }
}
```

For 6.º grado:

```json
{
  "smartteam": {
    "course": "grade6"
  }
}
```

PXT does not need to understand this metadata. It only merges and preserves it as generic project config.

## Toolbox Filter Persistence

Each course option also contributes a `toolboxFilter`.

The generic PXT project creation flow persists it into the generated project `pxt.json`:

```json
{
  "toolboxFilter": {
    "namespaces": {
      "basic": "hidden"
    },
    "blocks": {}
  }
}
```

On reload, PXT reads the main project `toolboxFilter` and converts it into runtime `ProjectFilters`, the same structure used by tutorial toolbox filtering.

Filtering only affects toolbox visibility. It does not delete packages, namespaces, APIs, or blocks already present in a project.

## 1.º Grado Filter

The 1.º grado filter hides known native categories that are not part of the first grade SmartTEAM toolbox and hides known extra SmartTEAM blocks that are not allowed for this course.

Allowed first grade toolbox:

### Control

- `smartteam_core_wait_ms` / `device_pause`: Esperar (ms)
- `smartteam_control_repeat_times` / `controls_repeat_ext`: Repetir X veces
- `smartteam_control_on_button_pressed` / `device_button_event`: Al presionar botón
- `smartteam_control_on_gesture` / `device_gesture_event`: Al agitar

### Salidas

- `smartteam_outputs_set_led`: Prender el LED
- `smartteam_outputs_set_led_brightness`: Ajustar el brillo del LED
- `smartteam_outputs_play_note`: Reproducir nota
- `smartteam_outputs_play_tone`: Reproducir tono
- `smartteam_outputs_start_melody`: Comenzar melodía
- `smartteam_outputs_stop_buzzer`: Apagar zumbador

### Motores

- `smartteam_motors_turn_dc_motor`: Girar el MOTOR DC

## 6.º Grado Filter

The 6.º grado filter is intentionally permissive for now.

It hides only known native categories that are not intended to appear in the SmartTEAM editor:

- `basic`
- `input`
- `music`
- `led`
- `light`
- `pins`

No SmartTEAM blocks are hidden for 6.º grado in this first version.

## Current Limitations

- This branch currently does not include the full `libs/smartteam-*` block packages, so several SmartTEAM block IDs in the filter are expected IDs from the SmartTEAM package design rather than IDs found in this branch.
- The filter is prepared for those IDs and will apply when the corresponding SmartTEAM blocks are present.
- The implementation does not polish the full toolbox layout.
- Courses 2.º through 5.º are not shown yet.
- The filter uses a hide-list model. New blocks may need to be explicitly hidden for lower grades.
- This change does not implement branding, accounts, cloud changes, deployment changes, or native micro:bit API changes.

## How to Test

From `pxt-microbit`:

```bash
PXT_FORCE_LOCAL=1 npx pxt serve --no-browser
```

Then:

1. Open the local MakeCode editor.
2. Create a new project.
3. Verify the required course selector appears.
4. Select `1.º grado`.
5. Verify the generated project `pxt.json` contains:
   - `smartteam.course = "grade1"`
   - a persisted `toolboxFilter`
6. Verify the toolbox is filtered according to the 1.º grado rules.
7. Create another new project.
8. Select `6.º grado`.
9. Verify the generated project `pxt.json` contains:
   - `smartteam.course = "grade6"`
   - a more permissive `toolboxFilter`
10. Compile/download to confirm hidden toolbox entries do not affect compilation.

## Validation Notes

Because filtering only affects toolbox visibility, existing code that uses hidden blocks should still compile as long as the required packages/APIs are present.
