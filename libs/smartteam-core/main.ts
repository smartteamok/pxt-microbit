//% block="Control"
//% icon="\uf0e7"
//% color="#A0522D"
//% blockNamespace=loops
//% groups='["Tiempo","Configuracion"]'
namespace smartteamCore {
    /**
     * Espera la cantidad de milisegundos indicada.
     */
    //% blockId=smartteam_core_wait_ms block="Esperar (ms) %ms"
    //% group="Tiempo"
    //% weight=100
    export function waitMs(ms: number): void {
        basic.pause(ms)
    }

    /**
     * Desactiva la matriz LED para evitar interferencias con sensores en P10.
     */
    //% blockId=smartteam_core_disable_led_matrix block="Deshabilitar matriz LED"
    //% group="Configuracion"
    //% weight=90
    export function disableLedMatrix(): void {
        led.enable(false)
    }

    /**
     * Vuelve a activar la matriz LED de la micro:bit.
     */
    //% blockId=smartteam_core_enable_led_matrix block="Habilitar matriz LED"
    //% group="Configuracion"
    //% weight=80
    export function enableLedMatrix(): void {
        led.enable(true)
    }
}
