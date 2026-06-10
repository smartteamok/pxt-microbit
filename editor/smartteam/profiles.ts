/// <reference path="../../node_modules/pxt-core/localtypings/pxtarget.d.ts" />
/// <reference path="../../node_modules/pxt-core/localtypings/pxtpackage.d.ts" />
/// <reference path="../../node_modules/pxt-core/built/pxtlib.d.ts" />
/// <reference path="../../node_modules/pxt-core/localtypings/pxteditor.d.ts" />

/**
 * SmartTeam profiles: the single source of truth for which blocks/categories a
 * project exposes. A "profile" generalizes the old per-grade course model so we
 * can add non-grade modalities (e.g. "Modo libre", by-kit, by-difficulty)
 * without touching the rest of the editor wiring.
 *
 * Filtering model: ALLOW-LIST.
 *   - Curated profiles (grades) use defaultState "hidden": everything is hidden
 *     unless explicitly listed in `visibleBlocks` / visible `namespaces`.
 *     => New blocks NEVER leak into a grade until explicitly allowed.
 *   - "Modo libre" uses defaultState "visible": everything shows, except an
 *     optional `hiddenBlocks` deny-list (mostly internal helpers).
 *
 * NOTE: package-level pxt.json `toolboxFilter` cannot express `defaultState`, so
 * the allow-list is injected at runtime via ProjectFilters (see projectFilters.ts).
 * The runtime filter always wins the merge over package filters in pxt-core.
 */

export type FilterStateName = "hidden" | "visible" | "disabled";

export interface ProfileFilter {
    // Fallback for anything not explicitly listed.
    defaultState: FilterStateName;
    // Toolbox category ids to reveal (needed when defaultState is "hidden").
    namespaces?: pxt.Map<FilterStateName>;
    // Allow-list of block ids to reveal (when defaultState is "hidden").
    visibleBlocks?: string[];
    // Explicit deny-list of block ids (mostly for the "visible" default).
    hiddenBlocks?: string[];
}

export interface Profile {
    // Stable id. Never rename once released.
    id: string;
    label: string;            // localized, shown in the picker
    group: string;            // localized, groups profiles in the picker
    weight: number;           // ordering within a group (lower = first)
    // Packages added to the project. This set is what persists the profile in
    // pxt.json (dependencies survive reload). Grades carry exactly one
    // smartteam-course-N marker; modes carry the functional packages directly.
    dependencies: string[];
    // Shared base block ids merged into the allow-list (see COMMON_VISIBLE).
    base?: string[];
    filter: ProfileFilter;
}

// Functional packages every SmartTeam project needs to expose the blocks.
const FUNCTIONAL_PACKAGES = [
    "smartteam-core", "smartteam-outputs", "smartteam-motors", "smartteam-inputs"
];

// --- Toolbox category ids -----------------------------------------------------
// Native Blockly/PXT categories use these filter keys. NB: the math category
// filter key is capitalized "Math" (Blockly), distinct from the toolbox rename
// key "maths" used in nativeToolbox.ts.
const NS = {
    control: "loops",        // SmartTeam "Control" wrappers attach here (blockNamespace=loops)
    logic: "logic",
    math: "Math",
    text: "text",
    variables: "variables",
    functions: "functions",
    arrays: "arrays",
    // SmartTeam functional package categories (namespace ids).
    outputs: "smartteamOutputs",
    motors: "smartteamMotors",
    inputsDigital: "smartteamDigitalInputs",
    inputsAnalog: "smartteamAnalogInputs"
};

// --- Implemented SmartTeam block ids (verified against the inventory) ----------
const ST = {
    waitMs: "smartteam_core_wait_ms",
    onButton: "smartteam_control_on_button_pressed",
    onGesture: "smartteam_control_on_gesture",
    setLed: "smartteam_outputs_set_led",
    setLedBrightness: "smartteam_outputs_set_led_brightness",
    playNote: "smartteam_outputs_play_note",
    playTone: "smartteam_outputs_play_tone",
    startMelody: "smartteam_outputs_start_melody",
    stopBuzzer: "smartteam_outputs_stop_buzzer",
    rgbColor: "smartteam_outputs_rgb_leds_color",
    rgbRgb: "smartteam_outputs_rgb_leds_rgb",
    rgbClear: "smartteam_outputs_rgb_leds_clear",
    dcMotor: "smartteam_motors_turn_dc_motor",
    servoAngle: "smartteam_motors_servo_set_angle",
    servoGradual: "smartteam_motors_servo_move_gradually",
    inMicrobitButton: "smartteam_inputs_microbit_button_pressed",
    inLogo: "smartteam_inputs_logo_is_pressed",
    inButtonPin: "smartteam_inputs_button_pin",
    inObstaclePin: "smartteam_inputs_obstacle_pin",
    inLightLevel: "smartteam_inputs_microbit_light_level"
};

// Native built-ins (verified present in pxt.blocks.blockDefinitions()).
const NB = {
    repeat: "controls_repeat_ext",
    forLoop: "pxt_controls_for",
    whileLoop: "device_while",
    ifBlock: "controls_if",
    logicCompare: "logic_compare",
    logicOperation: "logic_operation",
    logicNegate: "logic_negate",
    logicBoolean: "logic_boolean",
    mathNumber: "math_number",
    mathArithmetic: "math_arithmetic",
    variablesGet: "variables_get",
    variablesSet: "variables_set",
    variablesChange: "variables_change",
    text: "text",
    textJoin: "text_join",
    functionDef: "function_definition",
    functionCall: "function_call",
    functionCallOutput: "function_call_output",
    functionReturn: "function_return",
    listsCreate: "lists_create_with",
    listsLength: "lists_length",
    listsIndexGet: "lists_index_get",
    listsIndexSet: "lists_index_set",
    // micro:bit LED matrix display (native "Basic" category)
    showIcon: "basic_show_icon",
    showString: "device_print_message",
    showNumber: "device_show_number",
    clearDisplay: "device_clear_display",
    // math extra
    random: "device_random",
    // radio (micro:bit ↔ micro:bit)
    radioSetGroup: "radio_set_group",
    radioSendNumber: "radio_datagram_send",
    radioSendString: "radio_datagram_send_string",
    radioSendValue: "radio_datagram_send_value",
    radioOnNumber: "radio_on_number",
    radioOnString: "radio_on_string",
    radioOnValue: "radio_on_value"
};

/**
 * Blocks every curated grade exposes (grade 1 floor). Each grade then layers its
 * own `visibleBlocks` additions on top.
 */
export const COMMON_VISIBLE: string[] = [
    ST.waitMs, ST.onButton, ST.onGesture,
    ST.setLed, ST.setLedBrightness,
    ST.playNote, ST.playTone, ST.startMelody, ST.stopBuzzer,
    ST.dcMotor,
    NB.repeat,
    NB.showIcon            // G1: micro:bit LED icon
];

// Monotonic per-grade additions (curriculum baseline — tuned with curriculum).
// G2: RGB + servo + while/for + LED display (text/number/clear)
const GRADE2_ADDS = [
    ST.rgbColor, ST.rgbRgb, ST.rgbClear, ST.servoAngle, ST.servoGradual,
    NB.whileLoop, NB.forLoop,
    NB.showString, NB.showNumber, NB.clearDisplay
];
// G3: sensors (digital/analog inputs) + logic
const GRADE3_ADDS = GRADE2_ADDS.concat([
    ST.inMicrobitButton, ST.inLogo, ST.inButtonPin, ST.inObstaclePin, ST.inLightLevel,
    NB.ifBlock, NB.logicCompare, NB.logicOperation, NB.logicNegate, NB.logicBoolean
]);
// G4: numbers + variables + random
const GRADE4_ADDS = GRADE3_ADDS.concat([
    NB.mathNumber, NB.mathArithmetic, NB.variablesGet, NB.variablesSet, NB.variablesChange,
    NB.random
]);
// G5: text + functions + radio (basic set)
const GRADE5_ADDS = GRADE4_ADDS.concat([
    NB.text, NB.textJoin, NB.functionDef, NB.functionCall, NB.functionCallOutput, NB.functionReturn,
    NB.radioSetGroup, NB.radioSendNumber, NB.radioSendString, NB.radioOnNumber, NB.radioOnString
]);
// G6: lists + radio (name/value send + reporter)
const GRADE6_ADDS = GRADE5_ADDS.concat([
    NB.listsCreate, NB.listsLength, NB.listsIndexGet, NB.listsIndexSet,
    NB.radioSendValue, NB.radioOnValue
]);

// IMPORTANT: curated grades intentionally do NOT mark namespaces "visible".
// In pxt-core's shouldShowBlock the precedence is block > namespace >
// defaultState, so a "visible" namespace reveals EVERY block in that category
// and defeats the allow-list (e.g. grade 1 would leak the RGB blocks). Instead
// we list only the allowed block ids: a category appears automatically when it
// holds at least one visible block, and empty categories stay hidden under
// defaultState "hidden". (NS above is kept for reference / explicit hiding.)
function gradeProfile(grade: number, label: string, adds: string[]): Profile {
    return {
        id: `grade-${grade}`,
        label,
        group: lf("Cursos"),
        weight: grade * 10,
        dependencies: [`smartteam-course-${grade}`],
        base: COMMON_VISIBLE,
        filter: {
            defaultState: "hidden",
            visibleBlocks: adds
        }
    };
}

export const PROFILES: Profile[] = [
    gradeProfile(1, lf("1er grado"), []),
    gradeProfile(2, lf("2do grado"), GRADE2_ADDS),
    gradeProfile(3, lf("3er grado"), GRADE3_ADDS),
    gradeProfile(4, lf("4to grado"), GRADE4_ADDS),
    gradeProfile(5, lf("5to grado"), GRADE5_ADDS),
    gradeProfile(6, lf("6to grado"), GRADE6_ADDS),
    {
        id: "free",
        label: lf("Modo libre / todos los bloques"),
        group: lf("Modos"),
        weight: 100,
        // No course marker: depend on the functional packages directly so the
        // reopen migration sees no grade dependency and leaves everything visible.
        dependencies: FUNCTIONAL_PACKAGES,
        filter: { defaultState: "visible" }
    }
];

/** Map a stable profile id back to its definition. */
export function byId(id: string): Profile | undefined {
    return PROFILES.filter(p => p.id === id)[0];
}

/**
 * Infer a profile from a project's dependency set (used by reopen migration).
 * Grades are matched by their smartteam-course-N marker; legacy projects use the
 * same marker so they upgrade to the allow-list automatically.
 */
export function byDependencies(dependencies: pxt.Map<string>): Profile | undefined {
    const ids = Object.keys(dependencies || {});
    return PROFILES.filter(p => /^grade-/.test(p.id) && p.dependencies.some(d => ids.indexOf(d) >= 0))[0];
}

function toFilterState(name: FilterStateName): pxt.editor.FilterState {
    switch (name) {
        case "visible": return pxt.editor.FilterState.Visible;
        case "disabled": return pxt.editor.FilterState.Disabled;
        case "hidden":
        default: return pxt.editor.FilterState.Hidden;
    }
}

/** Expand a profile into the runtime ProjectFilters injected into the editor. */
export function resolveFilters(profile: Profile): pxt.editor.ProjectFilters {
    const f = profile.filter;
    const namespaces: pxt.Map<pxt.editor.FilterState> = {};
    const blocks: pxt.Map<pxt.editor.FilterState> = {};

    if (f.namespaces)
        Object.keys(f.namespaces).forEach(ns => namespaces[ns] = toFilterState(f.namespaces[ns]));

    const visible = (profile.base || []).concat(f.visibleBlocks || []);
    visible.forEach(id => blocks[id] = pxt.editor.FilterState.Visible);
    (f.hiddenBlocks || []).forEach(id => blocks[id] = pxt.editor.FilterState.Hidden);

    return {
        namespaces,
        blocks,
        defaultState: toFilterState(f.defaultState)
    };
}
