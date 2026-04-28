//% block="Control"
//% icon="\uf0e7"
//% color="#FF9800"
//% blockNamespace=loops
namespace smartteamCore {
    let stopwatchStartMs = 0

    /**
     * Espera la cantidad de milisegundos indicada.
     */
    //% blockId=smartteam_core_wait_ms block="Esperar (ms) %ms"
    //% weight=100
    //% ms.shadow=timePicker ms.defl=100
    export function waitMs(ms: number): void {
        basic.pause(ms)
    }

    /**
     * Ejecuta el codigo si se cumple la condicion.
     */
    //% blockId=smartteam_control_if_then block="Si %condition , entonces"
    //% weight=90
    //% condition.shadow=logic_compare
    export function ifThen(condition: boolean, handler: () => void): void {
        if (condition) {
            handler()
        }
    }

    /**
     * Repite el codigo la cantidad de veces indicada.
     */
    //% blockId=smartteam_control_repeat_times block="Repetir %times veces"
    //% weight=80
    //% times.min=0 times.defl=10
    export function repeatTimes(times: number, handler: () => void): void {
        for (let index = 0; index < times; index++) {
            handler()
        }
    }

    /**
     * Ejecuta el codigo cuando se presiona el boton seleccionado.
     */
    //% blockId=smartteam_control_on_button_pressed block="Al presionar el boton %button"
    //% weight=70
    export function onButtonPressed(button: Button, handler: () => void): void {
        input.onButtonPressed(button, handler)
    }

    /**
     * Ejecuta el codigo cuando se detecta el gesto seleccionado.
     */
    //% blockId=smartteam_control_on_gesture block="Al %gesture"
    //% weight=60
    //% gesture.fieldEditor="gestures" gesture.fieldOptions.columns=4
    export function onGesture(gesture: Gesture, handler: () => void): void {
        input.onGesture(gesture, handler)
    }

    /**
     * Ejecuta el codigo cuando se presiona el logo de la micro:bit.
     */
    //% blockId=smartteam_control_on_logo_pressed block="Al presionar el logo"
    //% weight=50
    //% parts="logotouch"
    export function onLogoPressed(handler: () => void): void {
        input.onLogoEvent(TouchButtonEvent.Pressed, handler)
    }

    /**
     * Reinicia el cronometro.
     */
    //% blockId=smartteam_control_start_stopwatch block="Iniciar cronometro"
    //% weight=30
    export function startStopwatch(): void {
        stopwatchStartMs = control.millis()
    }

    /**
     * Devuelve los milisegundos transcurridos desde que se inicio el cronometro.
     */
    //% blockId=smartteam_control_stopwatch block="Cronometro"
    //% weight=20
    export function stopwatch(): number {
        return control.millis() - stopwatchStartMs
    }

    /**
     * Desactiva la matriz LED para evitar interferencias con sensores en P10.
     */
    //% blockId=smartteam_core_disable_led_matrix block="Deshabilitar matriz LED"
    //% blockHidden=true
    //% weight=90
    export function disableLedMatrix(): void {
        led.enable(false)
    }

    /**
     * Vuelve a activar la matriz LED de la micro:bit.
     */
    //% blockId=smartteam_core_enable_led_matrix block="Habilitar matriz LED"
    //% blockHidden=true
    //% weight=80
    export function enableLedMatrix(): void {
        led.enable(true)
    }
}
