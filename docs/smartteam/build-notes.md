# Build Notes

## 2026-05-01

Commands run from `/Users/marianobat/dev/makecode-st2`:

- `npm install`
- `pxt install`
- `pxt buildtarget`

Results:

- `npm install` completed and installed target dependencies, including `pxt-core`.
- `pxt install` from target root is not the right command for this repo because it expects a package directory with `pxt.json`.
- `pxt buildtarget` first failed under the sandbox because it needed to write `~/.pxt/cache/hex-keys`.
- `pxt buildtarget` completed successfully when run with access to the PXT cache.

Generated files:

- `built/target.json`
- `built/target.js`
- simulator/editor build outputs under `built/`

Notes:

- `built/` and `node_modules/` are not part of the intended source changes.
- The build generated locale string changes in `libs/core/_locales`, but those were reverted because they are unrelated to SmartTeam planning.
- The simulator build printed TypeScript parser warnings for a few simulator files, but the command still exited with code `0`.
