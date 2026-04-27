//% color="#8E44AD" icon="" block="SmartTEAM Motores"
namespace smartteamMotors {
    /**
     * Gira un motor DC con velocidad de -100 a 100.
     */
    //% blockId=smartteam_motors_turn_dc_motor block="Girar el MOTOR DC en %pin con velocidad %speed"
    //% speed.min=-100 speed.max=100
    //% weight=100
    export function turnDcMotor(pin: AnalogPin, speed: number): void {
        const clamped = Math.clamp(-100, 100, speed)
        const duty = Math.idiv((clamped + 100) * 1023, 200)
        pins.analogWritePin(pin, duty)
    }
}
