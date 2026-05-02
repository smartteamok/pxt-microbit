/**
 * SmartTeam output blocks.
 */
//% block="Salidas"
//% color="#E91E63"
//% icon="\uf2db"
//% weight=90
//% groups=["Externos", "RGB", "Zumbador"]
namespace smartteamOutputs {
    export enum SmartTeamLedState {
        //% block="Prender"
        On,
        //% block="Apagar"
        Off
    }

    /**
     * Turn an external LED on or off.
     * @param state LED state
     * @param pin output pin
     */
    //% blockId=smartteam_outputs_set_led
    //% block="$state el LED en el pin $pin"
    //% pin.shadow=digital_pin_shadow
    //% pin.defl=DigitalPin.P0
    //% state.defl=smartteamOutputs.SmartTeamLedState.On
    //% group="Externos"
    //% weight=100
    export function setLed(state: SmartTeamLedState, pin: DigitalPin): void {
        pins.digitalWritePin(pin, state === SmartTeamLedState.On ? 1 : 0);
    }

    /**
     * Set external LED brightness with a PWM value from 0 to 1023.
     * @param brightness brightness value from 0 to 1023
     * @param pin output pin
     */
    //% blockId=smartteam_outputs_set_led_brightness
    //% block="Ajustar el brillo a $brightness del LED en el pin $pin"
    //% brightness.shadow=math_number
    //% brightness.defl=1023
    //% brightness.min=0
    //% brightness.max=1023
    //% pin.shadow=analog_pin_shadow
    //% pin.defl=AnalogPin.P0
    //% group="Externos"
    //% weight=90
    export function setLedBrightness(brightness: number, pin: AnalogPin): void {
        pins.analogWritePin(pin, Math.constrain(brightness, 0, 1023));
    }

    /**
     * Play a musical note on the built-in buzzer.
     * @param note note to play
     * @param duration duration in milliseconds
     */
    //% blockId=smartteam_outputs_play_note
    //% block="Reproducir nota $note con duracion (ms) $duration en el ZUMBADOR integrado"
    //% note.shadow=device_note
    //% note.defl=Note.E
    //% duration.shadow=timePicker
    //% duration.defl=1000
    //% duration.min=0
    //% group="Zumbador"
    //% weight=80
    export function playNote(note: Note, duration: number): void {
        music.playTone(note, Math.max(0, duration));
    }

    /**
     * Play a tone on the built-in buzzer.
     * @param frequency tone frequency in Hz
     * @param duration duration in milliseconds
     */
    //% blockId=smartteam_outputs_play_tone
    //% block="Reproducir tono $frequency con duracion (ms) $duration en el ZUMBADOR integrado"
    //% frequency.shadow=math_number
    //% frequency.defl=440
    //% frequency.min=0
    //% duration.shadow=timePicker
    //% duration.defl=1000
    //% duration.min=0
    //% group="Zumbador"
    //% weight=70
    export function playTone(frequency: number, duration: number): void {
        music.playTone(Math.max(0, frequency), Math.max(0, duration));
    }

    /**
     * Start a built-in melody on the built-in buzzer.
     * @param melody melody to start
     * @param mode playback mode
     */
    //% blockId=smartteam_outputs_start_melody
    //% block="Comenzar melodia $melody $mode"
    //% melody.shadow=device_builtin_melody
    //% melody.defl=Melodies.Dadadadum
    //% mode.defl=MelodyOptions.Once
    //% group="Zumbador"
    //% weight=60
    export function startMelody(melody: Melodies, mode: MelodyOptions): void {
        music.startMelody(music.builtInMelody(melody), mode);
    }

    /**
     * Stop all sounds on the built-in buzzer.
     */
    //% blockId=smartteam_outputs_stop_buzzer
    //% block="Apagar ZUMBADOR integrado"
    //% group="Zumbador"
    //% weight=50
    export function stopBuzzer(): void {
        music.stopAllSounds();
    }
}
