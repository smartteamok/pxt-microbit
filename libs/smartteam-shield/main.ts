/**
 * SmartTeam shield port mapping helpers.
 */
namespace smartteamShield {
    /**
     * Student-facing RJ ports on the SmartTeam shield.
     *
     * Current digital signal mapping from the kit reference:
     * - Port 0 -> P0
     * - Port 1 -> P2
     * - Port 2 -> P11
     * - Port 3 -> P5
     */
    export enum SmartTeamPort {
        //% block="Port 0"
        Port0 = 0,
        //% block="Port 1"
        Port1 = 1,
        //% block="Port 2"
        Port2 = 2,
        //% block="Port 3"
        Port3 = 3
    }

    /**
     * Return the primary digital signal pin for a SmartTeam shield port.
     * @param port SmartTeam shield port
     */
    //% blockHidden=true
    export function digitalPinForPort(port: SmartTeamPort): DigitalPin {
        switch (port) {
            case SmartTeamPort.Port0: return DigitalPin.P0;
            case SmartTeamPort.Port1: return DigitalPin.P2;
            case SmartTeamPort.Port2: return DigitalPin.P11;
            case SmartTeamPort.Port3:
            default: return DigitalPin.P5;
        }
    }

    /**
     * Return the primary analog-capable signal pin for a SmartTeam shield port.
     * @param port SmartTeam shield port
     */
    //% blockHidden=true
    export function analogPinForPort(port: SmartTeamPort): AnalogPin {
        return <AnalogPin><number>digitalPinForPort(port);
    }

    /**
     * Return a stable array index for a SmartTeam shield port.
     * @param port SmartTeam shield port
     */
    //% blockHidden=true
    export function portIndex(port: SmartTeamPort): number {
        switch (port) {
            case SmartTeamPort.Port0: return 0;
            case SmartTeamPort.Port1: return 1;
            case SmartTeamPort.Port2: return 2;
            case SmartTeamPort.Port3:
            default: return 3;
        }
    }
}
