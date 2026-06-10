/// <reference path="../../node_modules/pxt-core/localtypings/pxtarget.d.ts" />
/// <reference path="../../node_modules/pxt-core/built/pxtlib.d.ts" />
/// <reference path="../../node_modules/pxt-core/localtypings/pxteditor.d.ts" />
import * as profiles from "./profiles";

/**
 * Helpers that turn a SmartTeam profile into project-creation options and apply
 * the resulting toolbox filters to the live editor. The runtime ProjectFilters
 * (with defaultState) always wins over package pxt.json filters in pxt-core, so
 * this is the only place the allow-list actually takes effect.
 */

const smartTeamDependency = /^smartteam-course-\d+$/;

/** Build ProjectCreationOptions that install the profile and its filters. */
export function addProfileToOptions(
    options: pxt.editor.ProjectCreationOptions,
    profile: profiles.Profile
): pxt.editor.ProjectCreationOptions {
    const existing = options.dependencies || {};
    const dependencies: pxt.Map<string> = {};

    // Keep non-SmartTeam deps; drop any previous course marker.
    Object.keys(existing)
        .filter(dep => !smartTeamDependency.test(dep))
        .forEach(dep => dependencies[dep] = existing[dep]);

    // Add this profile's packages.
    profile.dependencies.forEach(dep => dependencies[dep] = "*");

    const baseProject = options.prj || pxt.appTarget.blocksprj;
    const prj = {
        ...baseProject,
        config: { ...baseProject.config }
    } as pxt.ProjectTemplate;

    return {
        ...options,
        prj,
        dependencies,
        filters: profiles.resolveFilters(profile)
    };
}

function getBlocksEditor(projectView: pxt.editor.IProjectView): any {
    const view = projectView as any;
    return view.editor || view.blocksEditor;
}

/** Force the toolbox to re-render with the current filters. */
export function refreshToolbox(projectView: pxt.editor.IProjectView) {
    const editor = getBlocksEditor(projectView);
    if (editor && editor.filterToolbox)
        editor.filterToolbox(true);
    else if (editor && editor.refreshToolbox)
        editor.refreshToolbox();
}

/** Inject filters into the editor state and refresh the toolbox. */
export function applyFilters(projectView: pxt.editor.IProjectView, filters: pxt.editor.ProjectFilters) {
    const view = projectView as any;
    const currentEditorState = (view.state && view.state.editorState) || {};
    const editorState = { ...currentEditorState, filters };

    if (view.setState)
        view.setState({ editorState }, () => refreshToolbox(projectView));
    else
        refreshToolbox(projectView);
}

/** Apply a profile's filters to the live editor. */
export function applyProfile(projectView: pxt.editor.IProjectView, profile: profiles.Profile) {
    applyFilters(projectView, profiles.resolveFilters(profile));
}
