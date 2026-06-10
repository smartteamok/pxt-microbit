"use strict";

/**
 * Validate that every block id referenced by a SmartTeam profile actually exists
 * in the target's block inventory. Catches drift between the allow-list in
 * editor/smartteam/profiles.ts and the real blocks defined in libs/.
 *
 * Prerequisites (same as the rest of the SmartTeam tooling):
 *   pxt buildtarget        # builds built/target.json AND built/editor/**
 *
 * Usage:
 *   node scripts/validate-toolbox-filters.js
 *
 * Exit code 1 on any unknown block id (suitable for CI).
 */

const fs = require("fs");
const path = require("path");
const { collectInventory } = require("./lib/block-inventory");

const REPO_ROOT = path.resolve(__dirname, "..");
const PROFILES_JS = path.join(REPO_ROOT, "built", "editor", "smartteam", "profiles.js");

function loadProfilesModule() {
    if (!fs.existsSync(PROFILES_JS))
        throw new Error(`Compiled profiles not found at ${PROFILES_JS}. Run \`pxt buildtarget\` first.`);

    // profiles.js is a CommonJS module that calls lf() at load and references
    // pxt.editor.FilterState in resolveFilters(). Stub both before requiring.
    global.lf = global.lf || (s => s);
    global.pxt = global.pxt || {};
    global.pxt.editor = global.pxt.editor || {};
    global.pxt.editor.FilterState = global.pxt.editor.FilterState || { Hidden: 0, Visible: 1, Disabled: 2 };

    // Bust any cached copy so re-runs reflect a fresh build.
    delete require.cache[require.resolve(PROFILES_JS)];
    return require(PROFILES_JS);
}

function main() {
    const { allIds } = collectInventory(REPO_ROOT);
    const profilesModule = loadProfilesModule();
    const profiles = profilesModule.PROFILES || [];

    let errors = 0;
    profiles.forEach(profile => {
        const filters = profilesModule.resolveFilters(profile);
        const blockIds = Object.keys(filters.blocks || {});
        const missing = blockIds.filter(id => !allIds.has(id));
        if (missing.length) {
            errors += missing.length;
            console.error(`\n✗ profile "${profile.id}" references unknown block ids:`);
            missing.forEach(id => console.error(`    - ${id}`));
        } else {
            console.log(`✓ profile "${profile.id}": ${blockIds.length} block ids OK`);
        }
    });

    if (errors) {
        console.error(`\n${errors} unknown block id(s). Fix editor/smartteam/profiles.ts or implement the blocks.`);
        console.error(`(Tip: regenerate the inventory with \`node scripts/dump-block-inventory.js\`.)`);
        process.exit(1);
    }
    console.log(`\nAll profile block ids resolve against the inventory (${allIds.size} known ids).`);
}

main();
