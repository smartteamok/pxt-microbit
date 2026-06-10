"use strict";

/**
 * Shared block-inventory collector for SmartTeam tooling.
 *
 * Two disjoint sources of truth for block IDs in a PXT target:
 *
 *  1. API-defined blocks  -> built/target.json#apiInfo[pkg].apis.byQName[*].attributes.blockId
 *     (everything declared with //% blockId=... in libs/<pkg>/main.ts, plus all native blocks)
 *
 *  2. Pure Blockly built-ins -> pxt.blocks.blockDefinitions() in pxt-core/built/pxtlib.js
 *     (math_number, logic_compare, controls_repeat_ext, function_*, variables_*, text, lists_*, ...)
 *     These are NOT in apiInfo and must be read from the core bundle.
 *
 * Both sources are static (no running editor needed), so this module is safe to run in CI.
 *
 * Used by:
 *   - scripts/dump-block-inventory.js     (human-readable table)
 *   - scripts/validate-toolbox-filters.js (cross-check SmartTeam profile filters)
 */

const fs = require("fs");
const path = require("path");
const vm = require("vm");

const REPO_ROOT = path.resolve(__dirname, "..", "..");

function targetJsonPath(repoRoot) {
    return path.join(repoRoot || REPO_ROOT, "built", "target.json");
}

function pxtlibPath(repoRoot) {
    return path.join(repoRoot || REPO_ROOT, "node_modules", "pxt-core", "built", "pxtlib.js");
}

/**
 * Collect every block ID exposed by API symbols across all bundled packages.
 * @returns {Array<{blockId, qName, namespace, blockNamespace, block, package}>}
 */
function collectApiBlocks(repoRoot) {
    const tjPath = targetJsonPath(repoRoot);
    if (!fs.existsSync(tjPath))
        throw new Error(`built/target.json not found at ${tjPath}. Run \`pxt buildtarget\` first.`);

    const target = JSON.parse(fs.readFileSync(tjPath, "utf8"));
    const apiInfo = target.apiInfo;
    if (!apiInfo)
        throw new Error("built/target.json has no apiInfo. Rebuild the target with `pxt buildtarget`.");

    const out = [];
    for (const pkg of Object.keys(apiInfo)) {
        const byQName = apiInfo[pkg] && apiInfo[pkg].apis && apiInfo[pkg].apis.byQName;
        if (!byQName) continue;
        for (const qName of Object.keys(byQName)) {
            const sym = byQName[qName];
            const attrs = sym.attributes || {};
            if (!attrs.blockId) continue;
            out.push({
                blockId: attrs.blockId,
                qName,
                namespace: sym.namespace || "",
                blockNamespace: attrs.blockNamespace || "",
                block: attrs.block || "",
                package: pkg
            });
        }
    }
    return out;
}

/**
 * Collect pure Blockly built-in block IDs (with their category) from the core bundle.
 * Loaded in an isolated VM context because pxtlib.js is a concatenated browser bundle
 * that assigns to a script-scoped `var pxt` rather than exporting a module.
 * @returns {Array<{blockId, category}>}
 */
function collectBuiltinBlocks(repoRoot) {
    const libPath = pxtlibPath(repoRoot);
    if (!fs.existsSync(libPath))
        throw new Error(`pxt-core bundle not found at ${libPath}. Run \`npm install\` first.`);

    const code = fs.readFileSync(libPath, "utf8");
    const sandbox = { console, globalThis: {}, lf: s => s, setTimeout, clearTimeout };
    sandbox.window = sandbox;
    sandbox.global = sandbox;
    vm.createContext(sandbox);
    try {
        vm.runInContext(code, sandbox, { filename: "pxtlib.js" });
    } catch (e) {
        // The bundle references browser-only globals (e.g. navigator) during load.
        // Those throw harmlessly after pxt.blocks is already populated.
    }

    const pxt = sandbox.pxt;
    if (!pxt || !pxt.blocks || typeof pxt.blocks.blockDefinitions !== "function")
        throw new Error("Could not reach pxt.blocks.blockDefinitions() in the core bundle.");

    const defs = pxt.blocks.blockDefinitions();
    const out = [];
    for (const blockId of Object.keys(defs)) {
        if (!blockId || blockId === "undefined") continue;
        out.push({ blockId, category: (defs[blockId] && defs[blockId].category) || "" });
    }
    return out;
}

/**
 * Full inventory: API blocks + Blockly built-ins, plus a Set of every valid block ID.
 */
function collectInventory(repoRoot) {
    const apiBlocks = collectApiBlocks(repoRoot);
    const builtinBlocks = collectBuiltinBlocks(repoRoot);
    const allIds = new Set();
    apiBlocks.forEach(b => allIds.add(b.blockId));
    builtinBlocks.forEach(b => allIds.add(b.blockId));
    return { apiBlocks, builtinBlocks, allIds };
}

module.exports = {
    REPO_ROOT,
    collectApiBlocks,
    collectBuiltinBlocks,
    collectInventory
};
