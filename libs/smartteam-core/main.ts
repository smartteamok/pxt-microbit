//% color="#A0522D" icon="" block="SmartTEAM Core"
namespace smartteamCore {
    /**
     * Espera la cantidad de milisegundos indicada.
     */
    //% blockId=smartteam_core_wait_ms block="Esperar (ms) %ms"
    //% weight=100
    export function waitMs(ms: number): void {
        basic.pause(ms)
    }
}
