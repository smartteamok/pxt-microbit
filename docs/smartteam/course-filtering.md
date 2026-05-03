# Course Filtering

## Single Source of Truth

`libs/smartteam-course-<N>/pxt.json` is the only place where grade-specific toolbox visibility is declared. The editor reads this metadata at runtime; nothing in `editor/extension.tsx` re-declares it.

The full filtering surface is split across three layers, each with one responsibility:

1. SmartTeam functional packages (`libs/smartteam-core`, `libs/smartteam-outputs`, `libs/smartteam-motors`, `libs/smartteam-inputs`, …)
   - Declare the categories, groups, colors, weights, and stable `blockId` values.
   - Use `blockNamespace` to attach wrappers to native categories (for example, `Control`).
   - Use `blockHidden=true` for helper blocks that should never appear in the toolbox.

2. SmartTeam course profile packages (`libs/smartteam-course-1` through `libs/smartteam-course-6`)
   - Declare the `dependencies` required by the grade.
   - Declare the full `toolboxFilter` for that grade in `pxt.json`. This is the source of truth.
   - Each `toolboxFilter` is self-contained: the always-hidden native namespaces are listed explicitly, not inferred.

3. `editor/extension.tsx`
   - Renames, reorders, and recolors native categories through `smartTeamNativeToolbox`.
   - Owns the project-creation modal and the editor-only metadata (`grade`, `label`, `dependency`).
   - Loads the per-grade `toolboxFilter` at runtime from `pxt.appTarget.bundledpkgs[<dependency>]["pxt.json"]`. It does not duplicate the rules.

## Recommended Course Filtering Model

Use course packages as the source of truth for grade-specific visibility.

Example package:

```json
{
    "name": "smartteam-course-3",
    "dependencies": {
        "core": "file:../core",
        "radio": "file:../radio",
        "microphone": "file:../microphone",
        "smartteam-core": "file:../smartteam-core",
        "smartteam-outputs": "file:../smartteam-outputs",
        "smartteam-motors": "file:../smartteam-motors",
        "smartteam-inputs": "file:../smartteam-inputs"
    },
    "files": [
        "main.ts",
        "README.md"
    ],
    "public": true,
    "toolboxFilter": {
        "namespaces": {
            "input": "hidden",
            "music": "hidden",
            "led": "hidden",
            "light": "hidden",
            "pins": "hidden"
        },
        "blocks": {
            "logic_compare": "visible",
            "logic_operation": "visible",
            "logic_negate": "visible"
        }
    }
}
```

Exact filter shape must be verified in the target after the first prototype because native categories can be affected by `editor/extension.tsx` toolbox snippets and by category renames.

## Filtering Rules

- Use [Category Taxonomy](category-taxonomy.md) as the source of truth for category ownership and default native category policy.
- Prefer hiding at namespace level when a whole native category is not wanted.
- Prefer hiding at block level when a category stays visible but only some blocks are allowed.
- Prefer SmartTeam wrapper blocks when the native block label or parameter model is too advanced.
- Keep stable `blockId` values once released.
- Avoid grade-specific conditional code inside functional packages.

## Selection Strategy

Each new project must be created through the normal MakeCode "New Project" flow and then select exactly one course profile in the SmartTeam course modal.

The selected course package becomes part of the project's `pxt.json`, making the grade persistent and project-local.

Current implementation:

- Course profile packages live in `libs/smartteam-course-1` through `libs/smartteam-course-6`.
- `editor/extension.tsx` keeps a small editor-only registry (`smartTeamCourseGrades`) with `{ grade, label, dependency }` for each course. The visible labels are wrapped in `lf(...)` so they participate in the editor localization pipeline.
- `loadSmartTeamCourses()` reads each grade's `toolboxFilter` from `pxt.appTarget.bundledpkgs[<dependency>][pxt.CONFIG_NAME]` at runtime. The function falls back to an empty filter and logs through `pxt.log` if the metadata is missing or malformed.
- `editor/extension.tsx` wraps `askForProjectCreationOptionsAsync` and opens a required course selector before project creation completes.
- The selected course is saved by adding `smartteam-course-N` to the new project's dependencies.
- `editor/extension.tsx` keeps the selected course while MakeCode finishes its own project creation flow, then injects the course dependency, root `toolboxFilter`, and `ProjectCreationOptions.filters` before `createProjectAsync` installs the project.
- `editor/extension.tsx` forces a toolbox refresh after project creation so the selected course is visible immediately.
- The root project `pxt.json` and the selected `smartteam-course-N` package both carry the same filter intent, so reopening the project can reload the grade filter from project state and package metadata.
- Course packages include a minimal `main.ts`; this keeps each profile as a real dependency in PXT's package graph so dependency-level `toolboxFilter` metadata is available.
- Lower-grade packages hide known future SmartTeam block IDs in `toolboxFilter.blocks` so later package additions do not leak into earlier courses.
- The default `blocksprj` and `tsprj` templates remain generic; they should not force a fixed course profile.

Important implementation detail: Blockly's built-in Mathematics namespace is `Math`, not `math`. Course filters must use the capitalized key.

Day-to-day editing instructions for blocks, filters, categories, and colors live in [Blocks and Filters Guide](blocks-and-filters-guide.md). Short Spanish checklists: [Filtros y personalización de bloques](filtros-y-personalizacion-bloques.md), [Bloques: función y creación](bloques-funcion-y-creacion.md).

Do not manually edit `docs/projects.md` as the source of truth. `pxt buildtarget` regenerates it from `targetconfig.galleries`.

## No In-Project Course Switching

Course switching is out of scope. If a user needs another grade profile, they create a new project.

This simplifies:

- toolbox refresh behavior
- dependency conflicts
- project migration rules
- classroom support
