//% block="Pantallas"
//% icon="\uf108"
//% color="#16A085"
//% weight=40
//% groups='["LCD","Tira RGB"]'
namespace smartteamDisplay {
    const LCD_ADDR = 0x27
    const LCD_BACKLIGHT = 0x08
    const LCD_ENABLE = 0x04
    const NEOPIXEL_COUNT = 6
    const rgbBuffers: Buffer[] = [null, null, null, null]
    let lcdInitialized = false

    /**
     * Borra la pantalla LCD 16x2 conectada por I2C.
     */
    //% blockId=smartteam_display_lcd_clear block="Borrar pantalla LCD"
    //% group="LCD"
    //% weight=90
    export function clearLcd(): void {
        lcdEnsureInit()
        lcdCommand(0x01)
        basic.pause(2)
    }

    /**
     * Muestra texto en la pantalla LCD en la posicion indicada.
     */
    //% blockId=smartteam_display_lcd_show block="Pantalla LCD mostrar %text en x %x y %y"
    //% x.min=0 x.max=15 x.defl=0
    //% y.min=0 y.max=1 y.defl=0
    //% group="LCD"
    //% weight=80
    export function showLcdText(text: string, x: number, y: number): void {
        lcdEnsureInit()
        lcdSetCursor(x, y)
        const limit = 16
        for (let i = 0; i < text.length && i < limit; i++) {
            lcdData(text.charCodeAt(i))
        }
    }

    /**
     * Enciende toda la tira RGB o un LED con un color.
     */
    //% blockId=smartteam_display_rgb_strip_color block="Tira RGB en %port mostrar color %color en %led"
    //% color.shadow="colorNumberPicker"
    //% led.defl=smartteamShield.RgbLedSelection.All
    //% port.defl=smartteamShield.DigitalPort.Port0
    //% group="Tira RGB"
    //% weight=70
    export function showRgbColor(port: smartteamShield.DigitalPort, color: number, led: smartteamShield.RgbLedSelection): void {
        if (led === smartteamShield.RgbLedSelection.All) {
            const buffer = rgbBuffer(port)
            for (let i = 0; i < NEOPIXEL_COUNT; i++) {
                setPixel(buffer, i, color)
            }
            showRgbBuffer(port, buffer)
            return
        }
        const buffer = rgbBuffer(port)
        setPixel(buffer, <number>led, color)
        showRgbBuffer(port, buffer)
    }

    /**
     * Ajusta el color RGB de un LED individual.
     */
    //% blockId=smartteam_display_rgb_strip_led block="Tira RGB en %port LED %led R %red G %green B %blue"
    //% led.defl=smartteamShield.RgbLedIndex.Led0
    //% red.min=0 red.max=255 red.defl=255
    //% green.min=0 green.max=255 green.defl=0
    //% blue.min=0 blue.max=255 blue.defl=0
    //% port.defl=smartteamShield.DigitalPort.Port0
    //% group="Tira RGB"
    //% weight=60
    export function setRgbLed(port: smartteamShield.DigitalPort, led: smartteamShield.RgbLedIndex, red: number, green: number, blue: number): void {
        const color = (
            smartteamShield.clamp(red, 0, 255) << 16
        ) | (
            smartteamShield.clamp(green, 0, 255) << 8
        ) | smartteamShield.clamp(blue, 0, 255)
        const buffer = rgbBuffer(port)
        setPixel(buffer, <number>led, color)
        showRgbBuffer(port, buffer)
    }

    /**
     * Apaga la tira RGB del puerto seleccionado.
     */
    //% blockId=smartteam_display_rgb_strip_clear block="Tira RGB en %port apagar"
    //% port.defl=smartteamShield.DigitalPort.Port0
    //% group="Tira RGB"
    //% weight=50
    export function clearRgbStrip(port: smartteamShield.DigitalPort): void {
        const buffer = rgbBuffer(port)
        buffer.fill(0)
        showRgbBuffer(port, buffer)
    }

    function setPixel(buffer: Buffer, led: number, color: number): void {
        const index = smartteamShield.clamp(led, 0, NEOPIXEL_COUNT - 1) * 3
        const red = (color >> 16) & 0xff
        const green = (color >> 8) & 0xff
        const blue = color & 0xff
        buffer[index] = green
        buffer[index + 1] = red
        buffer[index + 2] = blue
    }

    function showRgbBuffer(port: smartteamShield.DigitalPort, buffer: Buffer): void {
        light.sendWS2812Buffer(buffer, <number>smartteamShield.digitalPin(port))
    }

    function rgbBuffer(port: smartteamShield.DigitalPort): Buffer {
        const index = smartteamShield.portIndex(port)
        let buffer = rgbBuffers[index]
        if (!buffer) {
            buffer = pins.createBuffer(NEOPIXEL_COUNT * 3)
            rgbBuffers[index] = buffer
        }
        return buffer
    }

    function lcdEnsureInit(): void {
        if (lcdInitialized) return
        lcdInitialized = true
        basic.pause(50)
        lcdWrite4(0x30, 0)
        control.waitMicros(4500)
        lcdWrite4(0x30, 0)
        control.waitMicros(4500)
        lcdWrite4(0x30, 0)
        control.waitMicros(150)
        lcdWrite4(0x20, 0)
        lcdCommand(0x28)
        lcdCommand(0x0c)
        lcdCommand(0x06)
        lcdCommand(0x01)
        basic.pause(2)
    }

    function lcdWrite4(data: number, mode: number): void {
        const value = data | mode | LCD_BACKLIGHT
        pins.i2cWriteNumber(LCD_ADDR, value | LCD_ENABLE, NumberFormat.Int8LE)
        control.waitMicros(1)
        pins.i2cWriteNumber(LCD_ADDR, value & ~LCD_ENABLE, NumberFormat.Int8LE)
        control.waitMicros(50)
    }

    function lcdSend(value: number, mode: number): void {
        const high = value & 0xf0
        const low = (value << 4) & 0xf0
        lcdWrite4(high, mode)
        lcdWrite4(low, mode)
    }

    function lcdCommand(command: number): void {
        lcdSend(command, 0)
    }

    function lcdData(data: number): void {
        lcdSend(data, 1)
    }

    function lcdSetCursor(x: number, y: number): void {
        const column = smartteamShield.clamp(x, 0, 15)
        const row = smartteamShield.clamp(y, 0, 1)
        const rowOffsets = [0x00, 0x40]
        lcdCommand(0x80 | (column + rowOffsets[row]))
    }
}
