/// <reference path="../../node_modules/pxt-core/localtypings/pxtarget.d.ts" />
/// <reference path="../../node_modules/pxt-core/built/pxtlib.d.ts" />
/// <reference path="../../node_modules/pxt-core/localtypings/pxteditor.d.ts" />
import * as React from "react";
import * as profiles from "./profiles";

/**
 * Project-creation modal that asks the user to pick a SmartTeam profile.
 * Profiles are grouped (e.g. "Cursos" vs "Modos") and ordered by weight, so new
 * modalities appear without changing this component.
 */

interface PickerProps {
    profiles: profiles.Profile[];
    showRequiredMessage: boolean;
    onSelect: (profile: profiles.Profile) => void;
}

interface PickerState {
    selectedId: string;
}

interface ProfileGroup {
    group: string;
    profiles: profiles.Profile[];
}

function groupProfiles(list: profiles.Profile[]): ProfileGroup[] {
    const order: string[] = [];
    const byGroup: pxt.Map<profiles.Profile[]> = {};
    list
        .slice()
        .sort((a, b) => a.weight - b.weight)
        .forEach(p => {
            if (!byGroup[p.group]) { byGroup[p.group] = []; order.push(p.group); }
            byGroup[p.group].push(p);
        });
    return order.map(group => ({ group, profiles: byGroup[group] }));
}

class ProfilePicker extends React.Component<PickerProps, PickerState> {
    constructor(props: PickerProps) {
        super(props);
        this.state = { selectedId: "" };
    }

    private select(profile: profiles.Profile) {
        this.setState({ selectedId: profile.id });
        this.props.onSelect(profile);
    }

    renderGroup(group: ProfileGroup) {
        return <div key={group.group} className="smartteam-profile-group" style={{ marginBottom: "1rem" }}>
            <div className="smartteam-profile-group-label" style={{ fontWeight: "bold", marginBottom: "0.5rem" }}>{group.group}</div>
            <div role="radiogroup" aria-label={group.group} style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: "0.75rem" }}>
                {group.profiles.map(profile => {
                    const selected = this.state.selectedId === profile.id;
                    return <button
                        key={profile.id}
                        type="button"
                        role="radio"
                        aria-checked={selected}
                        className={`ui button ${selected ? "primary" : ""}`}
                        style={{ margin: 0 }}
                        onClick={() => this.select(profile)}>
                        {profile.label}
                    </button>;
                })}
            </div>
        </div>;
    }

    render() {
        const groups = groupProfiles(this.props.profiles);
        return <div className="smartteam-course-picker">
            <p>{lf("Selecciona el perfil para este proyecto.")}</p>
            {groups.map(g => this.renderGroup(g))}
            {this.props.showRequiredMessage && !this.state.selectedId
                ? <div className="ui tiny negative message" role="alert">{lf("Debes seleccionar un perfil antes de crear el proyecto.")}</div>
                : undefined}
        </div>;
    }
}

/** Show the modal and resolve with the chosen profile (or undefined on cancel). */
export async function askProfileAsync(
    confirmAsync: (options: any) => Promise<number>
): Promise<profiles.Profile | undefined> {
    let showRequiredMessage = false;

    while (true) {
        let selected: profiles.Profile;
        const choice = await confirmAsync({
            header: lf("Nuevo proyecto SmartTeam"),
            jsx: <ProfilePicker
                profiles={profiles.PROFILES}
                showRequiredMessage={showRequiredMessage}
                onSelect={p => selected = p}
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
        if (selected)
            return selected;

        showRequiredMessage = true;
    }
}
