//% block="Motores"
//% icon="\uf1b9"
//% color="#42A5F5"
//% weight=35
//% groups='["Motor DC","Robot","Servo","Ventilador"]'
namespace smartteamMotors {
    const servoPositions = [90, 90, 90, 90]

    /**
     * Gira un motor DC con velocidad de -100 a 100.
     */
    //% blockId=smartteam_motors_turn_dc_motor block="Girar el MOTOR DC en %pin con velocidad %speed"
    //% speed.min=-100 speed.max=100
    //% group="Motor DC"
    //% weight=100
    export function turnDcMotor(pin: AnalogPin, speed: number): void {
        const clamped = Math.clamp(-100, 100, speed)
        const duty = Math.idiv((clamped + 100) * 1023, 200)
        pins.analogWritePin(pin, duty)
    }

    /**
     * Mueve el robot en la direccion indicada a velocidad media.
     */
    //% blockId=smartteam_motors_robot_move block="Mover %direction %motor"
    //% motor.defl=smartteamShield.DcMotor.Both
    //% group="Robot"
    //% weight=90
    export function moveRobot(direction: smartteamShield.Direction, motor: smartteamShield.DcMotor): void {
        moveRobotWithSpeed(direction, motor, 50)
    }

    /**
     * Mueve el robot controlando direccion, motor y velocidad.
     */
    //% blockId=smartteam_motors_robot_move_speed block="Mover %direction %motor con velocidad %speed"
    //% motor.defl=smartteamShield.DcMotor.Both
    //% speed.min=0 speed.max=100 speed.defl=100
    //% group="Robot"
    //% weight=80
    export function moveRobotWithSpeed(direction: smartteamShield.Direction, motor: smartteamShield.DcMotor, speed: number): void {
        const pwm = Math.idiv(smartteamShield.clamp(speed, 0, 100) * 1023, 100)
        let leftDirection = 0
        let rightDirection = 0

        switch (direction) {
            case smartteamShield.Direction.Forward:
                leftDirection = 1
                rightDirection = 0
                break
            case smartteamShield.Direction.Backward:
                leftDirection = 0
                rightDirection = 1
                break
            case smartteamShield.Direction.Left:
                leftDirection = 0
                rightDirection = 0
                break
            case smartteamShield.Direction.Right:
                leftDirection = 1
                rightDirection = 1
                break
            default:
                assertUnreachableDirection(direction)
        }

        if (motor === smartteamShield.DcMotor.Both || motor === smartteamShield.DcMotor.Left) {
            pins.digitalWritePin(DigitalPin.P13, leftDirection)
            pins.analogWritePin(AnalogPin.P14, pwm)
        }

        if (motor === smartteamShield.DcMotor.Both || motor === smartteamShield.DcMotor.Right) {
            pins.digitalWritePin(DigitalPin.P15, rightDirection)
            pins.analogWritePin(AnalogPin.P16, pwm)
        }
    }

    /**
     * Detiene uno o ambos motores del robot.
     */
    //% blockId=smartteam_motors_robot_stop block="Parar %motor"
    //% motor.defl=smartteamShield.DcMotor.Both
    //% group="Robot"
    //% weight=70
    export function stopRobot(motor: smartteamShield.DcMotor): void {
        if (motor === smartteamShield.DcMotor.Both || motor === smartteamShield.DcMotor.Left) {
            pins.analogWritePin(AnalogPin.P14, 0)
        }

        if (motor === smartteamShield.DcMotor.Both || motor === smartteamShield.DcMotor.Right) {
            pins.analogWritePin(AnalogPin.P16, 0)
        }
    }

    /**
     * Controla el ventilador conectado al puerto de referencia P1/P2.
     */
    //% blockId=smartteam_motors_fan_control block="Ventilador %action"
    //% action.defl=smartteamShield.FanAction.Stop
    //% group="Ventilador"
    //% weight=85
    export function controlFan(action: smartteamShield.FanAction): void {
        switch (action) {
            case smartteamShield.FanAction.Left:
                pins.digitalWritePin(DigitalPin.P2, 1)
                pins.digitalWritePin(DigitalPin.P1, 0)
                break
            case smartteamShield.FanAction.Right:
                pins.digitalWritePin(DigitalPin.P2, 0)
                pins.digitalWritePin(DigitalPin.P1, 1)
                break
            case smartteamShield.FanAction.Stop:
                pins.digitalWritePin(DigitalPin.P2, 0)
                pins.digitalWritePin(DigitalPin.P1, 0)
                break
            default:
                assertUnreachableFanAction(action)
        }
    }

    /**
     * Posiciona un servo en el puerto seleccionado.
     */
    //% blockId=smartteam_motors_servo_set_angle block="Posicionar servo en %port a %degrees grados"
    //% degrees.min=0 degrees.max=180 degrees.defl=90
    //% port.defl=smartteamShield.DigitalPort.Port0
    //% group="Servo"
    //% weight=78
    export function setServoAngle(port: smartteamShield.DigitalPort, degrees: number): void {
        const angle = smartteamShield.clamp(degrees, 0, 180)
        pins.servoWritePin(smartteamShield.servoPin(port), angle)
        servoPositions[smartteamShield.portIndex(port)] = angle
    }

    /**
     * Mueve un servo gradualmente hasta el angulo deseado.
     */
    //% blockId=smartteam_motors_servo_move_gradually block="Mover servo en %port a %degrees grados gradualmente cada %ms ms"
    //% degrees.min=0 degrees.max=180 degrees.defl=90
    //% ms.min=1 ms.defl=10
    //% port.defl=smartteamShield.DigitalPort.Port0
    //% group="Servo"
    //% weight=75
    export function moveServoGradually(port: smartteamShield.DigitalPort, degrees: number, ms: number): void {
        const pin = smartteamShield.servoPin(port)
        const target = smartteamShield.clamp(degrees, 0, 180)
        const index = smartteamShield.portIndex(port)
        let current = servoPositions[index]
        const delay = Math.max(1, ms)

        if (current === target) {
            pins.servoWritePin(pin, target)
            return
        }

        const step = current < target ? 1 : -1
        for (let position = current; position !== target; position += step) {
            pins.servoWritePin(pin, position)
            basic.pause(delay)
        }

        pins.servoWritePin(pin, target)
        servoPositions[index] = target
    }

    function assertUnreachableDirection(value: never): never {
        control.fail("Direccion SmartTEAM no soportada: " + value)
        return value
    }

    function assertUnreachableFanAction(value: never): never {
        control.fail("Accion de ventilador SmartTEAM no soportada: " + value)
        return value
    }
}
