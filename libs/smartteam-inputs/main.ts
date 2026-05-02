/**
 * SmartTeam digital input blocks.
 */
//% block="Entradas (D)"
//% color="#009688"
//% icon="\uf2db"
//% weight=70
//% groups=["micro:bit", "Externos"]
namespace smartteamDigitalInputs {
    /**
     * Check whether a micro:bit button is pressed.
     * @param button button to read
     */
    //% blockId=smartteam_inputs_microbit_button_pressed
    //% block="Boton $button esta presionado"
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
    //% block="LOGO esta presionado"
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
    //% block="BOTON en el pin $pin"
    //% pin.shadow=digital_pin_shadow
    //% pin.defl=DigitalPin.P0
    //% group="Externos"
    //% weight=80
    export function buttonPin(pin: DigitalPin): boolean {
        return pins.digitalReadPin(pin) === 1;
    }

    /**
     * Read an external obstacle sensor connected to a digital pin.
     * @param pin input pin
     */
    //% blockId=smartteam_inputs_obstacle_pin
    //% block="OBSTACULO en el pin $pin"
    //% pin.shadow=digital_pin_shadow
    //% pin.defl=DigitalPin.P0
    //% group="Externos"
    //% weight=70
    export function obstaclePin(pin: DigitalPin): boolean {
        return pins.digitalReadPin(pin) === 1;
    }
}

/**
 * SmartTeam analog input blocks.
 */
//% block="Entradas (~A)"
//% color="#00A3A3"
//% icon="\uf1ec"
//% weight=65
//% groups=["micro:bit", "Externos"]
namespace smartteamAnalogInputs {
    /**
     * Read the micro:bit light level.
     */
    //% blockId=smartteam_inputs_microbit_light_level
    //% block="NIVEL DE LUZ en el sensor de microbit"
    //% group="micro:bit"
    //% weight=100
    export function microbitLightLevel(): number {
        return input.lightLevel();
    }
}
