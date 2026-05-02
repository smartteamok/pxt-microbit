# Course Filtering

## Current Pilot State

The existing SmartTeam pilot filters and curates the toolbox in three places:

1. `editor/extension.tsx`
   - Renames native categories.
   - Reorders categories.
   - Recolors categories.
   - Adds explicit block snippets for `Control` and `Logica`.

2. SmartTeam package annotations
   - Define categories and custom blocks.
   - Use `blockNamespace` to move wrappers under native categories when needed.
   - Use `blockHidden=true` for helper blocks.

3. `toolboxFilter` in project templates
   - Hides native namespaces such as `input`, `music`, `led`, `light`, and `pins`.

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
- `editor/extension.tsx` wraps `askForProjectCreationOptionsAsync` and opens a required course selector before project creation completes.
- The selected course is saved by adding `smartteam-course-N` to the new project's dependencies.
- `editor/extension.tsx` keeps the selected course while MakeCode finishes its own project creation flow, then injects the course dependency, root `toolboxFilter`, and `ProjectCreationOptions.filters` before `createProjectAsync` installs the project.
- `editor/extension.tsx` forces a toolbox refresh after project creation so the selected course is visible immediately.
- The root project `pxt.json` and the selected `smartteam-course-N` package both carry the same filter intent, so reopening the project can reload the grade filter from project state and package metadata.
- Course packages include a minimal `main.ts`; this keeps each profile as a real dependency in PXT's package graph so dependency-level `toolboxFilter` metadata is available.
- Lower-grade packages hide known future SmartTeam block IDs in `toolboxFilter.blocks` so later package additions do not leak into earlier courses.
- The default `blocksprj` and `tsprj` templates remain generic; they should not force a fixed course profile.

Important implementation detail: Blockly's built-in Mathematics namespace is `Math`, not `math`. Course filters must use the capitalized key.

Do not manually edit `docs/projects.md` as the source of truth. `pxt buildtarget` regenerates it from `targetconfig.galleries`.

## No In-Project Course Switching

Course switching is out of scope. If a user needs another grade profile, they create a new project.

This simplifies:

- toolbox refresh behavior
- dependency conflicts
- project migration rules
- classroom support
