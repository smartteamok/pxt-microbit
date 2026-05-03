/**
 * SmartTeam control wrappers and core helpers.
 */
//% block="Control"
//% blockNamespace=loops
//% color="#FF9800"
//% icon="\uf0e7"
//% weight=100
namespace smartteamCore {
    export enum SmartTeamButton {
        //% block="A"
        A,
        //% block="B"
        B
    }

    export enum SmartTeamGesture {
        //% block="Shake"
        Shake
    }

    function toButton(button: SmartTeamButton): Button {
        return button === SmartTeamButton.B ? Button.B : Button.A;
    }

    function toGesture(gesture: SmartTeamGesture): Gesture {
        return Gesture.Shake;
    }

    /**
     * Wait for a number of milliseconds.
     * @param ms time to wait in milliseconds
     */
    //% blockId=smartteam_core_wait_ms
    //% block="Wait (ms) $ms"
    //% ms.shadow=timePicker
    //% ms.defl=1000
    //% ms.min=0
    //% weight=100
    export function waitMs(ms: number): void {
        basic.pause(Math.max(0, ms));
    }

    /**
     * Run code when a micro:bit button is pressed.
     * @param button button to handle
     */
    //% blockId=smartteam_control_on_button_pressed
    //% block="On button $button pressed"
    //% button.defl=smartteamCore.SmartTeamButton.A
    //% weight=90
    export function onButtonPressed(button: SmartTeamButton, handler: () => void): void {
        input.onButtonPressed(toButton(button), handler);
    }

    /**
     * Run code when a micro:bit gesture is detected.
     * @param gesture gesture to handle
     */
    //% blockId=smartteam_control_on_gesture
    //% block="On $gesture"
    //% gesture.defl=smartteamCore.SmartTeamGesture.Shake
    //% weight=80
    export function onGesture(gesture: SmartTeamGesture, handler: () => void): void {
        input.onGesture(toGesture(gesture), handler);
    }
}
