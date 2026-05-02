/// <reference path="../node_modules/pxt-core/localtypings/pxtarget.d.ts" />
/// <reference path="../node_modules/pxt-core/built/pxtcompiler.d.ts" />
/// <reference path="../node_modules/pxt-core/built/pxtlib.d.ts" />
/// <reference path="../node_modules/pxt-core/localtypings/pxteditor.d.ts" />
/// <reference path="dapjs.d.ts" />
import * as React from "react";
import * as dialogs from "./dialogs";
import * as flash from "./flash";
import * as patch from "./patch";

interface SmartTeamCourseDefinition {
    grade: number;
    label: string;
    dependency: string;
    toolboxFilter: SmartTeamToolboxFilter;
}

interface SmartTeamCoursePickerProps {
    courses: SmartTeamCourseDefinition[];
    showRequiredMessage: boolean;
    onSelect: (course: SmartTeamCourseDefinition) => void;
}

interface SmartTeamCoursePickerState {
    selectedGrade: number;
}

type SmartTeamFilterState = "hidden" | "visible" | "disabled";

interface SmartTeamToolboxFilter {
    namespaces: pxt.Map<SmartTeamFilterState>;
    blocks: pxt.Map<SmartTeamFilterState>;
}

const smartTeamCourseDependencies = /^smartteam-course-\d+$/;

const smartTeamAlwaysHiddenNamespaces = [
    "basic",
    "input",
    "music",
    "led",
    "light",
    "pins",
    "control",
    "game",
    "images",
    "arrays"
];

function hiddenMap(ids: string[]): pxt.Map<SmartTeamFilterState> {
    const map: pxt.Map<SmartTeamFilterState> = {};
    ids.forEach(id => map[id] = "hidden");
    return map;
}

function courseFilter(namespaces: string[], blocks: string[] = []): SmartTeamToolboxFilter {
    return {
        namespaces: hiddenMap(namespaces),
        blocks: hiddenMap(blocks)
    };
}

const smartTeamFutureControlBlocks = [
    "smartteam_control_if_then",
    "smartteam_control_on_logo_pressed",
    "smartteam_control_while",
    "smartteam_control_start_stopwatch",
    "smartteam_control_stopwatch"
];

const smartTeamFutureOutputBlocks = [
    "smartteam_outputs_rgb_leds_color",
    "smartteam_outputs_rgb_leds_rgb"
];

const smartTeamFutureMotorBlocks = [
    "smartteam_motors_servo_set_angle",
    "smartteam_motors_servo_move_gradually",
    "smartteam_motors_robot_move",
    "smartteam_motors_robot_move_speed",
    "smartteam_motors_robot_motor_turn",
    "smartteam_motors_robot_motor_turn_speed"
];

const smartTeamFutureInputBlocks = [
    "smartteam_inputs_touch_pin",
    "smartteam_inputs_temperature_pin",
    "smartteam_inputs_ultrasonic_pin",
    "smartteam_inputs_line_follower",
    "smartteam_inputs_light_pin",
    "smartteam_inputs_soil_pin",
    "smartteam_inputs_potentiometer_pin",
    "smartteam_inputs_joystick_axis"
];

const smartTeamCourses: SmartTeamCourseDefinition[] = [
    {
        grade: 1,
        label: lf("1er grado"),
        dependency: "smartteam-course-1",
        toolboxFilter: courseFilter(
            smartTeamAlwaysHiddenNamespaces.concat(["serial", "radio", "logic", "Math", "text", "variables", "functions"]),
            smartTeamFutureControlBlocks.concat(smartTeamFutureOutputBlocks, smartTeamFutureMotorBlocks)
        )
    },
    {
        grade: 2,
        label: lf("2do grado"),
        dependency: "smartteam-course-2",
        toolboxFilter: courseFilter(
            smartTeamAlwaysHiddenNamespaces.concat(["serial", "radio", "logic", "Math", "text", "variables", "functions"]),
            smartTeamFutureControlBlocks.concat(smartTeamFutureMotorBlocks.slice(2))
        )
    },
    {
        grade: 3,
        label: lf("3er grado"),
        dependency: "smartteam-course-3",
        toolboxFilter: courseFilter(
            smartTeamAlwaysHiddenNamespaces.concat(["serial", "radio", "text", "variables", "functions"]),
            [
                "smartteam_control_while",
                "smartteam_control_start_stopwatch",
                "smartteam_control_stopwatch",
                "smartteam_inputs_touch_pin"
            ].concat(smartTeamFutureInputBlocks.slice(1), smartTeamFutureMotorBlocks.slice(2))
        )
    },
    {
        grade: 4,
        label: lf("4to grado"),
        dependency: "smartteam-course-4",
        toolboxFilter: courseFilter(
            smartTeamAlwaysHiddenNamespaces.concat(["serial", "radio", "variables", "functions"]),
            smartTeamFutureInputBlocks.slice(1).concat(smartTeamFutureMotorBlocks.slice(3))
        )
    },
    {
        grade: 5,
        label: lf("5to grado"),
        dependency: "smartteam-course-5",
        toolboxFilter: courseFilter(
            smartTeamAlwaysHiddenNamespaces.concat(["serial", "radio"]),
            ["function_definition_return", "function_return_if"]
        )
    },
    {
        grade: 6,
        label: lf("6to grado"),
        dependency: "smartteam-course-6",
        toolboxFilter: courseFilter(smartTeamAlwaysHiddenNamespaces)
    }
];

class SmartTeamCoursePicker extends React.Component<SmartTeamCoursePickerProps, SmartTeamCoursePickerState> {
    constructor(props: SmartTeamCoursePickerProps) {
        super(props);
        this.state = { selectedGrade: 0 };
    }

    render() {
        const selectedGrade = this.state.selectedGrade;

        return <div className="smartteam-course-picker">
            <p>{lf("Selecciona el curso para este proyecto.")}</p>
            <div role="radiogroup" aria-label={lf("Curso")} style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: "0.75rem" }}>
                {this.props.courses.map(course => {
                    const selected = selectedGrade === course.grade;
                    return <button
                        key={course.dependency}
                        type="button"
                        role="radio"
                        aria-checked={selected}
                        className={`ui button ${selected ? "primary" : ""}`}
                        style={{ margin: 0 }}
                        onClick={() => this.selectCourse(course)}>
                        {course.label}
                    </button>;
                })}
            </div>
            {this.props.showRequiredMessage && !selectedGrade
                ? <div className="ui tiny negative message" role="alert">{lf("Debes seleccionar un curso antes de crear el proyecto.")}</div>
                : undefined}
        </div>;
    }

    private selectCourse(course: SmartTeamCourseDefinition) {
        this.setState({ selectedGrade: course.grade });
        this.props.onSelect(course);
    }
}

async function askSmartTeamCourseAsync(confirmAsync: (options: any) => Promise<number>): Promise<SmartTeamCourseDefinition | undefined> {
    let showRequiredMessage = false;

    while (true) {
        let selectedCourse: SmartTeamCourseDefinition;
        const choice = await confirmAsync({
            header: lf("Nuevo proyecto SmartTeam"),
            jsx: <SmartTeamCoursePicker
                courses={smartTeamCourses}
                showRequiredMessage={showRequiredMessage}
                onSelect={course => selectedCourse = course}
            />,
            agreeLbl: lf("Crear proyecto"),
            agreeClass: "positive",
            agreeIcon: "checkmark",
            disagreeLbl: lf("Cancelar"),
            disagreeClass: "cancel",
            disagreeIcon: "cancel",
            hasCloseIcon: true,
            size: "small"
        });

        if (!choice)
            return undefined;

        if (selectedCourse)
            return selectedCourse;

        showRequiredMessage = true;
    }
}

function addSmartTeamCourseDependency(options: pxt.editor.ProjectCreationOptions, course: SmartTeamCourseDefinition): pxt.editor.ProjectCreationOptions {
    const dependencies: pxt.Map<string> = {};
    const existingDependencies = options.dependencies || {};
    const baseProject = options.prj || pxt.appTarget.blocksprj;
    const prj = {
        ...baseProject,
        config: {
            ...baseProject.config,
            toolboxFilter: course.toolboxFilter
        }
    } as pxt.ProjectTemplate;

    Object.keys(existingDependencies)
        .filter(dependency => !smartTeamCourseDependencies.test(dependency))
        .forEach(dependency => dependencies[dependency] = existingDependencies[dependency]);

    dependencies[course.dependency] = "*";

    return {
        ...options,
        prj,
        dependencies,
        filters: toProjectFilters(course.toolboxFilter)
    };
}

function refreshSmartTeamToolbox(projectView: pxt.editor.IProjectView) {
    const view = projectView as any;
    const editor = view.editor || view.blocksEditor;
    if (editor && editor.filterToolbox)
        editor.filterToolbox(true);
    else if (editor && editor.refreshToolbox)
        editor.refreshToolbox();
}

function applySmartTeamProjectFilters(projectView: pxt.editor.IProjectView, filters: pxt.editor.ProjectFilters) {
    const view = projectView as any;
    const currentEditorState = view.state && view.state.editorState || {};
    const editorState = {
        ...currentEditorState,
        filters
    };

    if (view.setState)
        view.setState({ editorState }, () => refreshSmartTeamToolbox(projectView));
    else
        refreshSmartTeamToolbox(projectView);
}

function toProjectFilters(toolboxFilter: SmartTeamToolboxFilter): pxt.editor.ProjectFilters {
    const namespaces: pxt.editor.ProjectFilters["namespaces"] = {};
    const blocks: pxt.editor.ProjectFilters["blocks"] = {};

    Object.keys(toolboxFilter.namespaces)
        .forEach(namespace => namespaces[namespace] = toProjectFilterState(toolboxFilter.namespaces[namespace]));
    Object.keys(toolboxFilter.blocks)
        .forEach(block => blocks[block] = toProjectFilterState(toolboxFilter.blocks[block]));

    return { namespaces, blocks };
}

function toProjectFilterState(state: SmartTeamFilterState): pxt.editor.FilterState {
    switch (state) {
        case "visible": return pxt.editor.FilterState.Visible;
        case "disabled": return pxt.editor.FilterState.Disabled;
        case "hidden":
        default: return pxt.editor.FilterState.Hidden;
    }
}

function patchSmartTeamProjectCreation(projectView: pxt.editor.IProjectView, confirmAsync: (options: any) => Promise<number>) {
    const patchedProjectView = projectView as pxt.editor.IProjectView & {
        smartTeamCoursePatchApplied?: boolean;
        smartTeamPendingCourse?: SmartTeamCourseDefinition;
    };
    if (patchedProjectView.smartTeamCoursePatchApplied)
        return;

    const askForProjectCreationOptionsAsync = projectView.askForProjectCreationOptionsAsync.bind(projectView);
    patchedProjectView.askForProjectCreationOptionsAsync = async () => {
        const options = await askForProjectCreationOptionsAsync();
        if (!options)
            return options;

        const course = await askSmartTeamCourseAsync(confirmAsync);
        if (!course)
            return undefined;

        patchedProjectView.smartTeamPendingCourse = course;
        return addSmartTeamCourseDependency(options, course);
    };

    const createProjectAsync = projectView.createProjectAsync.bind(projectView);
    patchedProjectView.createProjectAsync = async options => {
        let projectOptions = options;
        const pendingCourse = patchedProjectView.smartTeamPendingCourse;

        if (pendingCourse && (!projectOptions || !projectOptions.filters))
            projectOptions = addSmartTeamCourseDependency(projectOptions || {}, pendingCourse);

        patchedProjectView.smartTeamPendingCourse = undefined;

        await createProjectAsync(projectOptions);
        if (projectOptions && projectOptions.filters)
            applySmartTeamProjectFilters(projectView, projectOptions.filters);
    };

    patchedProjectView.smartTeamCoursePatchApplied = true;
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

    const smartTeamNativeToolbox: pxt.editor.ToolboxDefinition = {
        functions: { name: "Funciones", weight: 110, color: "#7E57C2" },
        loops: { name: "Control", weight: 100, color: "#FF9800" },
        logic: { name: "Lógica", weight: 50, color: "#3BC64A" },
        maths: { name: "Matemáticas", weight: 45, color: "#9400D3" },
        text: { name: "Texto", weight: 40, color: "#B8860B" },
        variables: { name: "Variables", weight: 35, color: "#DC143C" },
        arrays: { name: "Listas", weight: 20, color: "#E65722" }
    };

    const res: pxt.editor.ExtensionResult = {
        hexFileImporters: [],
        toolboxOptions: {
            blocklyToolbox: smartTeamNativeToolbox,
            monacoToolbox: smartTeamNativeToolbox
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
    res.initAsync = async extensionOpts => {
        patchSmartTeamProjectCreation(opts.projectView, extensionOpts.confirmAsync);
    };
    return Promise.resolve<pxt.editor.ExtensionResult>(res);
}
