/**
 * SmartTeam output blocks.
 */
//% block="Outputs"
//% color="#E91E63"
//% icon="\uf2db"
//% weight=90
//% groups=["External", "RGB", "Buzzer"]
namespace smartteamOutputs {
    export enum SmartTeamLedState {
        //% block="On"
        On,
        //% block="Off"
        Off
    }

    /**
     * Turn an external LED on or off.
     * @param state LED state
     * @param pin output pin
     */
    //% blockId=smartteam_outputs_set_led
    //% block="$state LED on pin $pin"
    //% pin.shadow=digital_pin_shadow
    //% pin.defl=DigitalPin.P0
    //% state.defl=smartteamOutputs.SmartTeamLedState.On
    //% group="External"
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
    //% block="Set LED brightness to $brightness on pin $pin"
    //% brightness.shadow=math_number
    //% brightness.defl=1023
    //% brightness.min=0
    //% brightness.max=1023
    //% pin.shadow=analog_pin_shadow
    //% pin.defl=AnalogPin.P0
    //% group="External"
    //% weight=90
    export function setLedBrightness(brightness: number, pin: AnalogPin): void {
        pins.analogWritePin(pin, Math.min(Math.max(0, brightness), 1023));
    }

    /**
     * Play a musical note on the built-in buzzer.
     * @param note note to play
     * @param duration duration in milliseconds
     */
    //% blockId=smartteam_outputs_play_note
    //% block="Play note $note with duration (ms) $duration on integrated buzzer"
    //% note.shadow=device_note
    //% note.defl=Note.E
    //% duration.shadow=timePicker
    //% duration.defl=1000
    //% duration.min=0
    //% group="Buzzer"
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
    //% block="Play tone $frequency with duration (ms) $duration on integrated buzzer"
    //% frequency.shadow=math_number
    //% frequency.defl=440
    //% frequency.min=0
    //% duration.shadow=timePicker
    //% duration.defl=1000
    //% duration.min=0
    //% group="Buzzer"
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
    //% block="Start melody $melody $mode"
    //% melody.shadow=device_builtin_melody
    //% melody.defl=Melodies.Dadadadum
    //% mode.defl=MelodyOptions.Once
    //% group="Buzzer"
    //% weight=60
    export function startMelody(melody: Melodies, mode: MelodyOptions): void {
        music.startMelody(music.builtInMelody(melody), mode);
    }

    /**
     * Stop all sounds on the built-in buzzer.
     */
    //% blockId=smartteam_outputs_stop_buzzer
    //% block="Stop integrated buzzer"
    //% group="Buzzer"
    //% weight=50
    export function stopBuzzer(): void {
        music.stopAllSounds();
    }
}
