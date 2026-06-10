/// <reference path="../../node_modules/pxt-core/localtypings/pxteditor.d.ts" />
import * as nativeToolbox from "./nativeToolbox";
import * as patch from "./patch";

/**
 * Public entry point for the SmartTeam editor customization. Keeping the surface
 * tiny (two functions) lets editor/extension.tsx stay close to upstream and
 * minimizes merge conflicts when pulling from microsoft/pxt-microbit.
 */

export { Profile, PROFILES } from "./profiles";

/** Native category rename/recolor/reorder options. */
export function toolboxOptions(): pxt.editor.IToolboxOptions {
    return nativeToolbox.toolboxOptions();
}

/** Install project-creation + reopen-migration interceptors. */
export function install(projectView: pxt.editor.IProjectView, confirmAsync: (options: any) => Promise<number>) {
    patch.install(projectView, confirmAsync);
}
