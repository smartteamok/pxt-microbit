//% block="Salidas"
//% icon="\uf0eb"
//% color="#D35400"
//% weight=45
namespace smartteamOutputs {
    /**
     * Enciende el LED conectado al pin seleccionado.
     */
    //% blockId=smartteam_outputs_led_on block="Prender el LED en %pin"
    //% weight=100
    export function turnLedOn(pin: DigitalPin): void {
        pins.digitalWritePin(pin, 1)
    }

    /**
     * Ajusta el brillo del LED con un valor entre 0 y 1023.
     */
    //% blockId=smartteam_outputs_set_led_brightness block="Ajustar el brillo del LED en %pin a %value"
    //% value.min=0 value.max=1023
    //% weight=90
    export function setLedBrightness(pin: AnalogPin, value: number): void {
        pins.analogWritePin(pin, value)
    }

    /**
     * Reproduce un tono en el pin y frecuencia indicados.
     */
    //% blockId=smartteam_outputs_play_tone block="Reproducir tono de %frequency Hz en %pin"
    //% frequency.min=31 frequency.max=20000 frequency.defl=440
    //% weight=80
    export function playTone(pin: AnalogPin, frequency: number): void {
        pins.analogSetPitchPin(pin)
        music.ringTone(frequency)
    }

    /**
     * Apaga el zumbador activo.
     */
    //% blockId=smartteam_outputs_stop_buzzer block="Apagar zumbador"
    //% weight=70
    export function stopBuzzer(): void {
        music.stopAllSounds()
    }
}
