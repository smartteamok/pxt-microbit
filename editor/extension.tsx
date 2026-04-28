/// <reference path="../node_modules/pxt-core/localtypings/pxtarget.d.ts" />
/// <reference path="../node_modules/pxt-core/built/pxtcompiler.d.ts" />
/// <reference path="../node_modules/pxt-core/built/pxtlib.d.ts" />
/// <reference path="../node_modules/pxt-core/localtypings/pxteditor.d.ts" />
/// <reference path="dapjs.d.ts" />
import * as dialogs from "./dialogs";
import * as flash from "./flash";
import * as patch from "./patch";

pxt.editor.initExtensionsAsync = function (opts: pxt.editor.ExtensionOptions): Promise<pxt.editor.ExtensionResult> {
    pxt.debug('loading microbit target extensions...')

    const manyAny = Math as any;
    if (!manyAny.imul)
        manyAny.imul = function (a: number, b: number): number {
            const ah = (a >>> 16) & 0xffff;
            const al = a & 0xffff;
            const bh = (b >>> 16) & 0xffff;
            const bl = b & 0xffff;
            // the shift by 0 fixes the sign on the high part
            // the final |0 converts the unsigned value into a signed value
            return ((al * bl) + (((ah * bl + al * bh) << 16) >>> 0) | 0);
        };

    const smartTeamControlBlocks: pxt.editor.ToolboxBlockDefinition[] = [
        {
            name: "smartteam.control.while",
            blockId: "device_while",
            weight: 40,
            blockXml: `<block type="device_while">
    <value name="COND">
        <block type="logic_compare">
            <field name="OP">EQ</field>
            <value name="A">
                <shadow type="math_number">
                    <field name="NUM">0</field>
                </shadow>
            </value>
            <value name="B">
                <shadow type="math_number">
                    <field name="NUM">0</field>
                </shadow>
            </value>
        </block>
    </value>
</block>`
        }
    ];

    const smartTeamLogicBlocks: pxt.editor.ToolboxBlockDefinition[] = [
        {
            name: "smartteam.logic.compare",
            blockXml: `<block type="logic_compare">
    <field name="OP">EQ</field>
    <value name="A">
        <shadow type="math_number">
            <field name="NUM">0</field>
        </shadow>
    </value>
    <value name="B">
        <shadow type="math_number">
            <field name="NUM">1</field>
        </shadow>
    </value>
</block>`
        },
        {
            name: "smartteam.logic.operation",
            blockXml: `<block type="logic_operation">
    <field name="OP">AND</field>
</block>`
        },
        {
            name: "smartteam.logic.negate",
            blockXml: `<block type="logic_negate"></block>`
        }
    ];

    const res: pxt.editor.ExtensionResult = {
        hexFileImporters: [],
        toolboxOptions: {
            blocklyToolbox: {
                functions: { name: "Funciones", weight: 110, color: "#7E57C2" },
                loops: {
                    name: "Control",
                    weight: 100,
                    color: "#FF9800",
                    blocks: smartTeamControlBlocks
                },
                logic: {
                    name: "Lógica",
                    weight: 90,
                    color: "#3BC64A",
                    blocks: smartTeamLogicBlocks
                },
                maths: { name: "Matemáticas", weight: 80, color: "#13BFD3" },
                variables: { name: "Variables", weight: 70, color: "#E91E63" },
                text: { name: "Texto", weight: 60, color: "#009688" },
                arrays: { name: "Variables", weight: 69, color: "#E91E63" }
            },
            monacoToolbox: {
                functions: { name: "Funciones", weight: 110, color: "#7E57C2" },
                loops: {
                    name: "Control",
                    weight: 100,
                    color: "#FF9800",
                    blocks: smartTeamControlBlocks
                },
                logic: {
                    name: "Lógica",
                    weight: 90,
                    color: "#3BC64A",
                    blocks: smartTeamLogicBlocks
                },
                maths: { name: "Matemáticas", weight: 80, color: "#13BFD3" },
                variables: { name: "Variables", weight: 70, color: "#E91E63" },
                text: { name: "Texto", weight: 60, color: "#009688" },
                arrays: { name: "Variables", weight: 69, color: "#E91E63" }
            }
        }
    };

    pxt.usb.setFilters([{
        vendorId: 0x0D28,
        productId: 0x0204,
        classCode: 0xff,
        subclassCode: 0x03 // the ctrl pipe endpoint
    }, {
        vendorId: 0x0D28,
        productId: 0x0204,
        classCode: 0xff,
        subclassCode: 0x00 // the custom CMSIS2 endpoint
    }])

    res.mkPacketIOWrapper = flash.mkDAPLinkPacketIOWrapper;
    res.blocklyPatch = patch.patchBlocks;
    res.showProgramTooLargeErrorAsync = dialogs.showProgramTooLargeErrorAsync;
    return Promise.resolve<pxt.editor.ExtensionResult>(res);
}
