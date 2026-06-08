/**
 * SmartTeam output blocks.
 */
//% block="Outputs"
//% color="#E91E63"
//% icon="\uf2db"
//% weight=90
//% groups=["External", "RGB", "Buzzer"]
namespace smartteamOutputs {
    const rgbLedCount = 6;
    let rgbStrips: neopixel.Strip[] = [];

    export enum SmartTeamLedState {
        //% block="On"
        On,
        //% block="Off"
        Off
    }

    export enum SmartTeamRgbColor {
        //% block="red"
        Red,
        //% block="green"
        Green,
        //% block="blue"
        Blue,
        //% block="yellow"
        Yellow,
        //% block="purple"
        Purple,
        //% block="cyan"
        Cyan,
        //% block="white"
        White,
        //% block="off"
        Off
    }

    export enum SmartTeamRgbLedSelection {
        //% block="all"
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

    function clamp(value: number, min: number, max: number): number {
        return Math.min(max, Math.max(min, Math.round(value)));
    }

    function rgbColorValue(color: SmartTeamRgbColor): number {
        switch (color) {
            case SmartTeamRgbColor.Red: return neopixel.rgb(255, 0, 0);
            case SmartTeamRgbColor.Green: return neopixel.rgb(0, 255, 0);
            case SmartTeamRgbColor.Blue: return neopixel.rgb(0, 0, 255);
            case SmartTeamRgbColor.Yellow: return neopixel.rgb(255, 255, 0);
            case SmartTeamRgbColor.Purple: return neopixel.rgb(128, 0, 255);
            case SmartTeamRgbColor.Cyan: return neopixel.rgb(0, 255, 255);
            case SmartTeamRgbColor.White: return neopixel.rgb(255, 255, 255);
            case SmartTeamRgbColor.Off:
            default: return neopixel.rgb(0, 0, 0);
        }
    }

    function rgbStrip(port: smartteamShield.SmartTeamPort): neopixel.Strip {
        const index = smartteamShield.portIndex(port);
        let strip = rgbStrips[index];

        if (!strip) {
            strip = neopixel.create(smartteamShield.digitalPinForPort(port), rgbLedCount, NeoPixelMode.RGB);
            rgbStrips[index] = strip;
        }

        return strip;
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
     * Set all RGB LEDs or one RGB LED on a SmartTeam shield port to a preset color.
     * @param port SmartTeam shield port
     * @param color preset RGB color
     * @param led RGB LED to set
     */
    //% blockId=smartteam_outputs_rgb_leds_color
    //% block="Set RGB LEDs on $port to $color at $led"
    //% port.defl=smartteamShield.SmartTeamPort.Port0
    //% color.defl=smartteamOutputs.SmartTeamRgbColor.Red
    //% led.defl=smartteamOutputs.SmartTeamRgbLedSelection.All
    //% group="RGB"
    //% weight=85
    export function setRgbLedsColor(port: smartteamShield.SmartTeamPort, color: SmartTeamRgbColor, led: SmartTeamRgbLedSelection): void {
        const strip = rgbStrip(port);
        const colorValue = rgbColorValue(color);

        if (led === SmartTeamRgbLedSelection.All)
            strip.showColor(colorValue);
        else {
            strip.setPixelColor(clamp(<number>led, 0, rgbLedCount - 1), colorValue);
            strip.show();
        }
    }

    /**
     * Set one RGB LED on a SmartTeam shield port with red, green, and blue values.
     * @param port SmartTeam shield port
     * @param led RGB LED to set
     * @param red red value from 0 to 255
     * @param green green value from 0 to 255
     * @param blue blue value from 0 to 255
     */
    //% blockId=smartteam_outputs_rgb_leds_rgb
    //% block="Set RGB LED on $port LED $led red $red green $green blue $blue"
    //% port.defl=smartteamShield.SmartTeamPort.Port0
    //% led.defl=smartteamOutputs.SmartTeamRgbLedSelection.Led0
    //% red.shadow=math_number
    //% red.defl=255
    //% red.min=0
    //% red.max=255
    //% green.shadow=math_number
    //% green.defl=0
    //% green.min=0
    //% green.max=255
    //% blue.shadow=math_number
    //% blue.defl=0
    //% blue.min=0
    //% blue.max=255
    //% group="RGB"
    //% weight=84
    export function setRgbLed(port: smartteamShield.SmartTeamPort, led: SmartTeamRgbLedSelection, red: number, green: number, blue: number): void {
        const strip = rgbStrip(port);
        const index = clamp(<number>led, 0, rgbLedCount - 1);

        strip.setPixelColor(index, neopixel.rgb(clamp(red, 0, 255), clamp(green, 0, 255), clamp(blue, 0, 255)));
        strip.show();
    }

    /**
     * Turn off the RGB LED strip on a SmartTeam shield port.
     * @param port SmartTeam shield port
     */
    //% blockId=smartteam_outputs_rgb_leds_clear
    //% block="Turn off RGB LEDs on $port"
    //% port.defl=smartteamShield.SmartTeamPort.Port0
    //% group="RGB"
    //% weight=83
    export function clearRgbLeds(port: smartteamShield.SmartTeamPort): void {
        const strip = rgbStrip(port);
        strip.clear();
        strip.show();
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
