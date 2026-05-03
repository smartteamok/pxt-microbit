/**
 * SmartTeam motor blocks.
 */
//% block="Motors"
//% color="#607D8B"
//% icon="\uf085"
//% weight=80
//% groups=["DC Motor", "Servo", "Robot movement"]
namespace smartteamMotors {
    export enum SmartTeamMotorDirection {
        //% block="right"
        Right,
        //% block="left"
        Left
    }

    /**
     * Turn a DC motor using a single digital control pin.
     * @param direction motor direction
     * @param pin motor control pin
     */
    //% blockId=smartteam_motors_turn_dc_motor
    //% block="Turn DC motor $direction on pin $pin"
    //% direction.defl=smartteamMotors.SmartTeamMotorDirection.Right
    //% pin.shadow=digital_pin_shadow
    //% pin.defl=DigitalPin.P1
    //% group="DC Motor"
    //% weight=100
    export function turnDcMotor(direction: SmartTeamMotorDirection, pin: DigitalPin): void {
        pins.digitalWritePin(pin, direction === SmartTeamMotorDirection.Right ? 1 : 0);
    }
}
