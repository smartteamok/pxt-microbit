/// <reference path="../../node_modules/pxt-core/localtypings/pxtarget.d.ts" />
/// <reference path="../../node_modules/pxt-core/built/pxtlib.d.ts" />
/// <reference path="../../node_modules/pxt-core/localtypings/pxteditor.d.ts" />

/**
 * Presentation-only customization of the native (non-SmartTeam) toolbox
 * categories: rename, reorder, recolor. This does NOT filter blocks — visibility
 * is owned by the profile allow-list (see profiles.ts).
 */

const definition: pxt.editor.ToolboxDefinition = {
    functions: { name: "Functions", weight: 110, color: "#7E57C2" },
    loops: { name: "Control", weight: 100, color: "#FF9800" },
    logic: { name: "Logic", weight: 50, color: "#3BC64A" },
    maths: { name: "Math", weight: 45, color: "#9400D3" },
    text: { name: "Text", weight: 40, color: "#B8860B" },
    variables: { name: "Variables", weight: 35, color: "#DC143C" },
    arrays: { name: "Lists", weight: 20, color: "#E65722" }
};

export function toolboxOptions(): pxt.editor.IToolboxOptions {
    return {
        blocklyToolbox: definition,
        monacoToolbox: definition
    };
}
