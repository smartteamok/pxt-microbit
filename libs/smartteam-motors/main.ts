/**
 * SmartTeam motor blocks.
 */
//% block="Motors"
//% color="#607D8B"
//% icon="\uf085"
//% weight=80
//% groups=["DC Motor", "Servo", "Robot movement"]
namespace smartteamMotors {
    let servoAngles: number[] = [];

    export enum SmartTeamMotorDirection {
        //% block="right"
        Right,
        //% block="left"
        Left
    }

    function clampServoAngle(angle: number): number {
        return Math.min(180, Math.max(0, Math.round(angle)));
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

    /**
     * Set a servo to an angle in degrees.
     * @param angle servo angle in degrees
     * @param pin servo control pin
     */
    //% blockId=smartteam_motors_servo_set_angle
    //% block="Set SERVO to $angle degrees on pin $pin"
    //% angle.shadow=math_number
    //% angle.defl=90
    //% angle.min=0
    //% angle.max=180
    //% pin.shadow=analog_pin_shadow
    //% pin.defl=AnalogPin.P0
    //% group="Servo"
    //% weight=90
    export function setServoAngle(angle: number, pin: AnalogPin): void {
        const clampedAngle = clampServoAngle(angle);
        servoAngles[pin] = clampedAngle;
        pins.servoWritePin(pin, clampedAngle);
    }

    /**
     * Move a servo gradually to an angle in degrees.
     * @param angle target servo angle in degrees
     * @param stepMs delay between each degree step in milliseconds
     * @param pin servo control pin
     */
    //% blockId=smartteam_motors_servo_move_gradually
    //% block="Move SERVO gradually to $angle degrees every $stepMs ms on pin $pin"
    //% angle.shadow=math_number
    //% angle.defl=90
    //% angle.min=0
    //% angle.max=180
    //% stepMs.shadow=timePicker
    //% stepMs.defl=10
    //% stepMs.min=0
    //% pin.shadow=analog_pin_shadow
    //% pin.defl=AnalogPin.P0
    //% group="Servo"
    //% weight=80
    export function moveServoGradually(angle: number, stepMs: number, pin: AnalogPin): void {
        const targetAngle = clampServoAngle(angle);
        let currentAngle = servoAngles[pin];

        if (currentAngle === undefined)
            currentAngle = 90;

        currentAngle = clampServoAngle(currentAngle);
        const delay = Math.max(0, stepMs);
        const direction = targetAngle >= currentAngle ? 1 : -1;

        while (currentAngle !== targetAngle) {
            currentAngle += direction;
            pins.servoWritePin(pin, currentAngle);
            basic.pause(delay);
        }

        servoAngles[pin] = targetAngle;
    }
}
