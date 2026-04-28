/// <reference path="../node_modules/pxt-core/localtypings/pxtarget.d.ts" />
/// <reference path="../node_modules/pxt-core/built/pxtcompiler.d.ts" />
/// <reference path="../node_modules/pxt-core/built/pxtlib.d.ts" />
/// <reference path="../node_modules/pxt-core/localtypings/pxteditor.d.ts" />
/// <reference path="dapjs.d.ts" />
import * as dialogs from "./dialogs";
import * as flash from "./flash";
import * as patch from "./patch";

declare function require(path: string): any;

interface SmartTeamCourseOption extends pxt.editor.NewProjectOption {
    enabled?: boolean;
}

interface SmartTeamCourseOptionGroup extends pxt.editor.NewProjectOptionGroup {
    options: SmartTeamCourseOption[];
}

interface SmartTeamCourseConfig {
    newProjectOptionGroups: SmartTeamCourseOptionGroup[];
}

const smartTeamCourseConfig = require("../../libs/smartteam-course-config/course-config.json") as SmartTeamCourseConfig;

function getSmartTeamNewProjectOptionGroups(): pxt.editor.NewProjectOptionGroup[] {
    return (smartTeamCourseConfig.newProjectOptionGroups || []).map(group => ({
        ...group,
        options: group.options
            .filter(option => option.enabled !== false)
            .map(option => ({
                id: option.id,
                label: option.label,
                disabled: option.disabled || option.enabled === false,
                projectConfig: option.projectConfig,
                toolboxFilter: option.toolboxFilter
            }))
    }));
}

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

    const res: pxt.editor.ExtensionResult = {
        hexFileImporters: [],
        newProjectOptionGroups: getSmartTeamNewProjectOptionGroups()
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
