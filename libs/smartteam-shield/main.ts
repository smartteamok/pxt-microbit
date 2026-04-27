namespace smartteamShield {
    /**
     * Puertos digitales del shield SmartTEAM.
     */
    export enum DigitalPort {
        //% block="Puerto 0"
        Port0 = 0,
        //% block="Puerto 1"
        Port1 = 1,
        //% block="Puerto 2"
        Port2 = 2,
        //% block="Puerto 3"
        Port3 = 3
    }

    /**
     * Puertos analogicos disponibles del shield SmartTEAM.
     */
    export enum AnalogPort {
        //% block="Puerto 0"
        Port0 = 0,
        //% block="Puerto 1"
        Port1 = 1
    }

    /**
     * Puerto fijo usado por el joystick del kit de referencia.
     */
    export enum JoystickPort {
        //% block="Puerto 1"
        Port1 = 1
    }

    export enum DcMotor {
        //% block="ambos"
        Both = 0,
        //% block="motor izquierdo"
        Left = 1,
        //% block="motor derecho"
        Right = 2
    }

    export enum Direction {
        //% block="adelante"
        Forward = 0,
        //% block="atras"
        Backward = 1,
        //% block="izquierda"
        Left = 2,
        //% block="derecha"
        Right = 3
    }

    export enum LinePosition {
        //% block="izquierda"
        Left = 0,
        //% block="centro"
        Center = 1,
        //% block="derecha"
        Right = 2,
        //% block="ninguna (todos negro)"
        None = 3
    }

    export enum FanAction {
        //% block="girar izquierda"
        Left = 0,
        //% block="girar derecha"
        Right = 1,
        //% block="parar"
        Stop = 2
    }

    export enum JoystickAxis {
        //% block="eje X"
        X = 0,
        //% block="eje Y"
        Y = 1,
        //% block="pulsador"
        Button = 2
    }

    export enum ColorChannel {
        //% block="R"
        Red = 0,
        //% block="G"
        Green = 1,
        //% block="B"
        Blue = 2
    }

    export enum DetectedColor {
        //% block="rojo"
        Red = 0,
        //% block="verde"
        Green = 1,
        //% block="azul"
        Blue = 2
    }

    export enum RgbLedIndex {
        //% block="0"
        Led0 = 0,
        //% block="1"
        Led1 = 1,
        //% block="2"
        Led2 = 2,
        //% block="3"
        Led3 = 3,
        //% block="4"
        Led4 = 4,
        //% block="5"
        Led5 = 5
    }

    export enum RgbLedSelection {
        //% block="todos"
        All = -1,
        //% block="0"
        Led0 = 0,
        //% block="1"
        Led1 = 1,
        //% block="2"
        Led2 = 2,
        //% block="3"
        Led3 = 3,
        //% block="4"
        Led4 = 4,
        //% block="5"
        Led5 = 5
    }

    export function digitalPin(port: DigitalPort): DigitalPin {
        switch (port) {
            case DigitalPort.Port0:
                return DigitalPin.P0
            case DigitalPort.Port1:
                return DigitalPin.P2
            case DigitalPort.Port2:
                return DigitalPin.P11
            case DigitalPort.Port3:
                return DigitalPin.P5
            default:
                return assertUnreachable(port)
        }
    }

    export function analogPin(port: AnalogPort): AnalogPin {
        switch (port) {
            case AnalogPort.Port0:
                return AnalogPin.P0
            case AnalogPort.Port1:
                return AnalogPin.P2
            default:
                return assertUnreachable(port)
        }
    }

    export function servoPin(port: DigitalPort): AnalogPin {
        return <AnalogPin><number>digitalPin(port)
    }

    export function portIndex(port: DigitalPort): number {
        switch (port) {
            case DigitalPort.Port0:
                return 0
            case DigitalPort.Port1:
                return 1
            case DigitalPort.Port2:
                return 2
            case DigitalPort.Port3:
                return 3
            default:
                return assertUnreachable(port)
        }
    }

    export function clamp(value: number, min: number, max: number): number {
        if (value < min) return min
        if (value > max) return max
        return value
    }

    function assertUnreachable(value: never): never {
        control.fail("SmartTEAM enum no soportado: " + value)
        return value
    }
}
