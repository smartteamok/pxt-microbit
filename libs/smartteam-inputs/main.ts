/**
 * SmartTeam digital input blocks.
 */
//% block="Inputs (D)"
//% color="#009688"
//% icon="\uf2db"
//% weight=70
//% groups=["micro:bit", "External"]
namespace smartteamDigitalInputs {
    /**
     * Check whether a micro:bit button is pressed.
     * @param button button to read
     */
    //% blockId=smartteam_inputs_microbit_button_pressed
    //% block="Button $button is pressed"
    //% button.defl=Button.A
    //% group="micro:bit"
    //% weight=100
    export function microbitButtonPressed(button: Button): boolean {
        return input.buttonIsPressed(button);
    }

    /**
     * Check whether the micro:bit logo is pressed.
     */
    //% blockId=smartteam_inputs_logo_is_pressed
    //% block="Logo is pressed"
    //% group="micro:bit"
    //% weight=90
    export function logoIsPressed(): boolean {
        return input.logoIsPressed();
    }

    /**
     * Read an external push button connected to a digital pin.
     * @param pin input pin
     */
    //% blockId=smartteam_inputs_button_pin
    //% block="Button on pin $pin"
    //% pin.shadow=digital_pin_shadow
    //% pin.defl=DigitalPin.P0
    //% group="External"
    //% weight=80
    export function buttonPin(pin: DigitalPin): boolean {
        return pins.digitalReadPin(pin) === 1;
    }

    /**
     * Read an external obstacle sensor connected to a digital pin.
     * @param pin input pin
     */
    //% blockId=smartteam_inputs_obstacle_pin
    //% block="Obstacle on pin $pin"
    //% pin.shadow=digital_pin_shadow
    //% pin.defl=DigitalPin.P0
    //% group="External"
    //% weight=70
    export function obstaclePin(pin: DigitalPin): boolean {
        return pins.digitalReadPin(pin) === 1;
    }
}

/**
 * SmartTeam analog input blocks.
 */
//% block="Inputs (~A)"
//% color="#00A3A3"
//% icon="\uf1ec"
//% weight=65
//% groups=["micro:bit", "External"]
namespace smartteamAnalogInputs {
    /**
     * Read the micro:bit light level.
     */
    //% blockId=smartteam_inputs_microbit_light_level
    //% block="Light level on micro:bit sensor"
    //% group="micro:bit"
    //% weight=100
    export function microbitLightLevel(): number {
        return input.lightLevel();
    }
}
