/// <reference path="../../node_modules/pxt-core/localtypings/pxtarget.d.ts" />
/// <reference path="../../node_modules/pxt-core/built/pxtlib.d.ts" />
/// <reference path="../../node_modules/pxt-core/localtypings/pxteditor.d.ts" />
import * as profiles from "./profiles";
import * as projectFilters from "./projectFilters";
import * as picker from "./picker";

/**
 * Wires SmartTeam into the editor without an official hook:
 *  - intercepts project creation to require a profile selection and inject its
 *    filters/dependencies;
 *  - intercepts project load (loadHeaderAsync) to re-inject the profile's
 *    allow-list, since runtime filters are not persisted across reload and the
 *    package pxt.json filter cannot express defaultState.
 *
 * The load interception is the part flagged for runtime verification: it relies
 * on internal IProjectView methods and is guarded to be a no-op on any failure.
 */

type PatchedView = pxt.editor.IProjectView & {
    smartTeamPatchApplied?: boolean;
    smartTeamPendingProfile?: profiles.Profile;
};

// Best-effort read of the currently-loaded project's dependency map.
function currentDependencies(): pxt.Map<string> | undefined {
    try {
        if (typeof pkg === "undefined" || !pkg)
            return undefined;
        const main = pkg.mainPkg || (pkg.mainEditorPkg && pkg.mainEditorPkg());
        const config = main && (main.config || (main.getKsPkg && main.getKsPkg() && main.getKsPkg().config));
        if (config && config.dependencies)
            return config.dependencies;
    } catch (e) {
        // ignore — pkg internals may be unavailable in some hosts
    }
    return undefined;
}

function installProjectCreation(view: PatchedView, confirmAsync: (options: any) => Promise<number>) {
    const askForProjectCreationOptionsAsync = view.askForProjectCreationOptionsAsync.bind(view);
    view.askForProjectCreationOptionsAsync = async () => {
        const options = await askForProjectCreationOptionsAsync();
        if (!options)
            return options;

        const profile = await picker.askProfileAsync(confirmAsync);
        if (!profile)
            return undefined;

        view.smartTeamPendingProfile = profile;
        return projectFilters.addProfileToOptions(options, profile);
    };

    const createProjectAsync = view.createProjectAsync.bind(view);
    view.createProjectAsync = async options => {
        let projectOptions = options;
        const pending = view.smartTeamPendingProfile;

        if (pending && (!projectOptions || !projectOptions.filters))
            projectOptions = projectFilters.addProfileToOptions(projectOptions || {}, pending);

        view.smartTeamPendingProfile = undefined;

        await createProjectAsync(projectOptions);
        if (projectOptions && projectOptions.filters)
            projectFilters.applyFilters(view, projectOptions.filters);
    };
}

function installProjectLoad(view: PatchedView) {
    const loadHeaderAsync = view.loadHeaderAsync.bind(view);
    view.loadHeaderAsync = async header => {
        await loadHeaderAsync(header);
        try {
            const deps = currentDependencies();
            if (!deps) return;
            const profile = profiles.byDependencies(deps);
            // No grade marker => legacy/free project: leave everything visible.
            if (profile)
                projectFilters.applyProfile(view, profile);
        } catch (e) {
            pxt.log("SmartTeam: reopen migration skipped");
        }
    };
}

/** Install all SmartTeam editor interceptors (idempotent). */
export function install(projectView: pxt.editor.IProjectView, confirmAsync: (options: any) => Promise<number>) {
    const view = projectView as PatchedView;
    if (view.smartTeamPatchApplied)
        return;
    installProjectCreation(view, confirmAsync);
    installProjectLoad(view);
    view.smartTeamPatchApplied = true;
}
