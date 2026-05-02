/**
 * SmartTeam motor blocks.
 */
//% block="Motores"
//% color="#607D8B"
//% icon="\uf085"
//% weight=80
//% groups=["Motor DC", "Servo", "Movimiento robot"]
namespace smartteamMotors {
    export enum SmartTeamMotorDirection {
        //% block="derecha"
        Right,
        //% block="izquierda"
        Left
    }

    /**
     * Turn a DC motor using a single digital control pin.
     * @param direction motor direction
     * @param pin motor control pin
     */
    //% blockId=smartteam_motors_turn_dc_motor
    //% block="Girar a la $direction el MOTOR DC en el pin $pin"
    //% direction.defl=smartteamMotors.SmartTeamMotorDirection.Right
    //% pin.shadow=digital_pin_shadow
    //% pin.defl=DigitalPin.P1
    //% group="Motor DC"
    //% weight=100
    export function turnDcMotor(direction: SmartTeamMotorDirection, pin: DigitalPin): void {
        pins.digitalWritePin(pin, direction === SmartTeamMotorDirection.Right ? 1 : 0);
    }
}
