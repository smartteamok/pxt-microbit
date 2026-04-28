//% block="Salidas"
//% icon="\uf0eb"
//% color="#F44336"
//% weight=45
//% groups='["Externos"]'
namespace smartteamOutputs {
    const RGB_LED_COUNT = 6
    const rgbBuffers: Buffer[] = []

    /**
     * Accion para un LED externo.
     */
    export enum LedAction {
        //% block="Prender"
        On = 1,
        //% block="Apagar"
        Off = 0
    }

    /**
     * Modo de reproduccion para melodias.
     */
    export enum MelodyMode {
        //% block="hasta el final"
        UntilDone = 1,
        //% block="en segundo plano"
        InBackground = 4,
        //% block="para siempre"
        Forever = 2
    }

    /**
     * LED RGB a modificar en una tira de 6 LEDs.
     */
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

    /**
     * Prende o apaga un LED externo conectado al pin seleccionado.
     */
    //% blockId=smartteam_outputs_set_led block="| %action el LED en el pin %pin"
    //% pin.defl=DigitalPin.P0
    //% group="Externos"
    //% weight=100
    export function setLed(action: LedAction, pin: DigitalPin): void {
        pins.digitalWritePin(pin, <number>action)
    }

    /**
     * Ajusta el brillo de un LED externo con un valor entre 0 y 1023.
     */
    //% blockId=smartteam_outputs_set_led_brightness block="| Ajustar el brillo a %value del LED en el pin %pin"
    //% value.min=0 value.max=1023 value.defl=1023
    //% pin.defl=AnalogPin.P0
    //% group="Externos"
    //% weight=90
    export function setLedBrightness(pin: AnalogPin, value: number): void {
        pins.analogWritePin(pin, value)
    }

    /**
     * Prende los LEDs RGB externos con el color seleccionado.
     */
    //% blockId=smartteam_outputs_rgb_leds_color block="| Prender de color %color el LED RGB %led en el pin %pin"
    //% color.shadow="colorNumberPicker"
    //% led.defl=smartteamOutputs.RgbLedSelection.All
    //% pin.defl=DigitalPin.P0
    //% group="Externos"
    //% weight=80
    export function setRgbLedsColor(color: number, led: RgbLedSelection, pin: DigitalPin): void {
        const buffer = rgbBuffer(pin)
        setRgbSelection(buffer, led, color)
        showRgbBuffer(pin, buffer)
    }

    /**
     * Ajusta el color RGB de uno o todos los LEDs del modulo externo.
     */
    //% blockId=smartteam_outputs_rgb_leds_rgb block="| Ajustar el color a:|R %red|G %green|B %blue|del módulo de LED RGB %led en el pin %pin"
    //% red.min=0 red.max=255 red.defl=255
    //% green.min=0 green.max=255 green.defl=255
    //% blue.min=0 blue.max=255 blue.defl=255
    //% led.defl=smartteamOutputs.RgbLedSelection.All
    //% pin.defl=DigitalPin.P0
    //% group="Externos"
    //% weight=70
    //% blockExternalInputs=1
    export function setRgbLedsRgb(red: number, green: number, blue: number, led: RgbLedSelection, pin: DigitalPin): void {
        const color = (
            clamp(red, 0, 255) << 16
        ) | (
            clamp(green, 0, 255) << 8
        ) | clamp(blue, 0, 255)
        setRgbLedsColor(color, led, pin)
    }

    /**
     * Reproduce una nota en el zumbador integrado.
     */
    //% blockId=smartteam_outputs_play_note block="| Reproducir nota %note con duración [ms] %duration en el ZUMBADOR integrado"
    //% note.shadow=device_note
    //% duration.min=0 duration.max=10000 duration.defl=1000
    //% group="Externos"
    //% weight=60
    export function playNote(note: number, duration: number): void {
        pins.analogSetPitchPin(AnalogPin.P0)
        music.playTone(note, duration)
    }

    /**
     * Reproduce un tono en el zumbador integrado.
     */
    //% blockId=smartteam_outputs_play_tone block="| Reproducir tono %frequency con duración [ms] %duration en el ZUMBADOR integrado"
    //% frequency.min=31 frequency.max=20000 frequency.defl=440
    //% duration.min=0 duration.max=10000 duration.defl=1000
    //% group="Externos"
    //% weight=50
    export function playTone(frequency: number, duration: number): void {
        pins.analogSetPitchPin(AnalogPin.P0)
        music.playTone(frequency, duration)
    }

    /**
     * Comienza una melodia integrada.
     */
    //% blockId=smartteam_outputs_start_melody block="| Comenzar melodía %melody %mode"
    //% melody.defl=Melodies.Dadadadum
    //% mode.defl=smartteamOutputs.MelodyMode.UntilDone
    //% group="Externos"
    //% weight=40
    export function startMelody(melody: Melodies, mode: MelodyMode): void {
        pins.analogSetPitchPin(AnalogPin.P0)
        music.beginMelody(music.builtInMelody(melody), <number>mode)
    }

    /**
     * Apaga el zumbador integrado.
     */
    //% blockId=smartteam_outputs_stop_buzzer block="| Apagar ZUMBADOR integrado"
    //% group="Externos"
    //% weight=30
    export function stopBuzzer(): void {
        music.stopAllSounds()
    }

    function setPixel(buffer: Buffer, led: number, color: number): void {
        const index = led * 3
        const red = (color >> 16) & 0xff
        const green = (color >> 8) & 0xff
        const blue = color & 0xff
        buffer[index] = green
        buffer[index + 1] = red
        buffer[index + 2] = blue
    }

    function setRgbSelection(buffer: Buffer, led: RgbLedSelection, color: number): void {
        if (led === RgbLedSelection.All) {
            for (let i = 0; i < RGB_LED_COUNT; i++) {
                setPixel(buffer, i, color)
            }
            return
        }

        setPixel(buffer, <number>led, color)
    }

    function showRgbBuffer(pin: DigitalPin, buffer: Buffer): void {
        light.sendWS2812Buffer(buffer, <number>pin)
    }

    function rgbBuffer(pin: DigitalPin): Buffer {
        const index = <number>pin
        let buffer = rgbBuffers[index]
        if (!buffer) {
            buffer = pins.createBuffer(RGB_LED_COUNT * 3)
            rgbBuffers[index] = buffer
        }
        return buffer
    }

    function clamp(value: number, min: number, max: number): number {
        return Math.max(min, Math.min(max, value))
    }
}
