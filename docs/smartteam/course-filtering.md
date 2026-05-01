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

- Prefer hiding at namespace level when a whole native category is not wanted.
- Prefer hiding at block level when a category stays visible but only some blocks are allowed.
- Prefer SmartTeam wrapper blocks when the native block label or parameter model is too advanced.
- Keep stable `blockId` values once released.
- Avoid grade-specific conditional code inside functional packages.

## Selection Strategy

Each grade should be created from a template/card that installs exactly one course profile package.

The selected course package becomes part of the project's `pxt.json`, making the grade persistent and project-local.

## No In-Project Course Switching

Course switching is out of scope. If a user needs another grade profile, they create a new project.

This simplifies:

- toolbox refresh behavior
- dependency conflicts
- project migration rules
- classroom support

