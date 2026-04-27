//% block="Entradas"
//% icon="\uf192"
//% color="#2980B9"
//% weight=50
//% groups='["Linea","Distancia","Analogicas","Color","Joystick","Digitales","DHT11"]'
namespace smartteamInputs {
    const LINE_THRESHOLD = 30
    const TCS34725_ADDR = 0x29
    const TCS34725_COMMAND = 0x80
    const TCS34725_ENABLE = 0x00
    const TCS34725_ATIME = 0x01
    const TCS34725_CONTROL = 0x0f
    const TCS34725_STATUS = 0x13
    const TCS34725_RDATAL = 0x16
    const TCS34725_GDATAL = 0x18
    const TCS34725_BDATAL = 0x1a
    let tcs34725Initialized = false

    /**
     * Detecta la posicion de una linea usando el sensor conectado a P10, P1 y P2.
     */
    //% blockId=smartteam_inputs_line_at block="Siguelineas %position en %port"
    //% port.defl=smartteamShield.DigitalPort.Port1
    //% group="Linea"
    //% weight=90
    export function isLineAt(position: smartteamShield.LinePosition, port: smartteamShield.DigitalPort): boolean {
        const left = pins.analogReadPin(AnalogPin.P10)
        const center = pins.analogReadPin(AnalogPin.P1)
        const right = pins.analogReadPin(AnalogPin.P2)

        switch (position) {
            case smartteamShield.LinePosition.Left:
                return left <= LINE_THRESHOLD && right > LINE_THRESHOLD && center > LINE_THRESHOLD
            case smartteamShield.LinePosition.Center:
                return center <= LINE_THRESHOLD && left > LINE_THRESHOLD && right > LINE_THRESHOLD
            case smartteamShield.LinePosition.Right:
                return right <= LINE_THRESHOLD && left > LINE_THRESHOLD && center > LINE_THRESHOLD
            case smartteamShield.LinePosition.None:
                return right > LINE_THRESHOLD && left > LINE_THRESHOLD && center > LINE_THRESHOLD
            default:
                return assertUnreachableLinePosition(position)
        }
    }

    /**
     * Lee distancia en centimetros con ultrasonido en P2 (trigger) y P1 (echo).
     */
    //% blockId=smartteam_inputs_distance_cm block="Distancia (cm) en %port"
    //% port.defl=smartteamShield.DigitalPort.Port1
    //% group="Distancia"
    //% weight=80
    export function readDistanceCm(port: smartteamShield.DigitalPort): number {
        pins.digitalWritePin(DigitalPin.P2, 0)
        control.waitMicros(2)
        pins.digitalWritePin(DigitalPin.P2, 1)
        control.waitMicros(10)
        pins.digitalWritePin(DigitalPin.P2, 0)

        const duration = pins.pulseIn(DigitalPin.P1, PulseValue.High, 25000)
        if (duration === 0) return 0
        return Math.floor(duration / 58)
    }

    /**
     * Lee humedad de suelo en el puerto analogico seleccionado.
     */
    //% blockId=smartteam_inputs_soil_moisture block="Humedad de suelo en %port"
    //% port.defl=smartteamShield.AnalogPort.Port0
    //% group="Analogicas"
    //% weight=70
    export function readSoilMoisture(port: smartteamShield.AnalogPort): number {
        return pins.analogReadPin(smartteamShield.analogPin(port))
    }

    /**
     * Lee intensidad luminosa en el puerto analogico seleccionado.
     */
    //% blockId=smartteam_inputs_light_level block="Intensidad luminosa en %port"
    //% port.defl=smartteamShield.AnalogPort.Port0
    //% group="Analogicas"
    //% weight=68
    export function readLightLevel(port: smartteamShield.AnalogPort): number {
        return pins.analogReadPin(smartteamShield.analogPin(port))
    }

    /**
     * Lee la posicion de un potenciometro.
     */
    //% blockId=smartteam_inputs_potentiometer block="Posicion potenciometro en %port"
    //% port.defl=smartteamShield.AnalogPort.Port0
    //% group="Analogicas"
    //% weight=66
    export function readPotentiometer(port: smartteamShield.AnalogPort): number {
        return pins.analogReadPin(smartteamShield.analogPin(port))
    }

    /**
     * Lee el nivel R, G o B del sensor de color TCS34725.
     */
    //% blockId=smartteam_inputs_color_level block="Nivel de %channel en sensor de color"
    //% channel.defl=smartteamShield.ColorChannel.Red
    //% group="Color"
    //% weight=65
    export function readColorLevel(channel: smartteamShield.ColorChannel): number {
        const rgb = tcs34725ReadRgb()
        switch (channel) {
            case smartteamShield.ColorChannel.Red:
                return tcs34725ToAnalog(rgb[0])
            case smartteamShield.ColorChannel.Green:
                return tcs34725ToAnalog(rgb[1])
            case smartteamShield.ColorChannel.Blue:
                return tcs34725ToAnalog(rgb[2])
            default:
                return assertUnreachableColorChannel(channel)
        }
    }

    /**
     * Detecta si el color dominante coincide con la seleccion.
     */
    //% blockId=smartteam_inputs_color_detected block="Color detectado es %color"
    //% color.defl=smartteamShield.DetectedColor.Red
    //% group="Color"
    //% weight=63
    export function isColorDetected(color: smartteamShield.DetectedColor): boolean {
        const rgb = tcs34725ReadRgb()
        const red = tcs34725ToAnalog(rgb[0])
        const green = tcs34725ToAnalog(rgb[1])
        const blue = tcs34725ToAnalog(rgb[2])
        const min = 100

        switch (color) {
            case smartteamShield.DetectedColor.Red:
                return red > min && red > green && red > blue
            case smartteamShield.DetectedColor.Green:
                return green > min && green > red && green > blue
            case smartteamShield.DetectedColor.Blue:
                return blue > min && blue > red && blue > green
            default:
                return assertUnreachableDetectedColor(color)
        }
    }

    /**
     * Lee el joystick conectado a P1, P2 y P10.
     */
    //% blockId=smartteam_inputs_joystick block="Joystick %axis en %port"
    //% axis.defl=smartteamShield.JoystickAxis.X
    //% port.defl=smartteamShield.JoystickPort.Port1
    //% group="Joystick"
    //% weight=64
    export function readJoystick(axis: smartteamShield.JoystickAxis, port: smartteamShield.JoystickPort): number {
        switch (axis) {
            case smartteamShield.JoystickAxis.X:
                return pins.analogReadPin(AnalogPin.P1)
            case smartteamShield.JoystickAxis.Y:
                return pins.analogReadPin(AnalogPin.P2)
            case smartteamShield.JoystickAxis.Button:
                pins.setPull(DigitalPin.P10, PinPullMode.PullUp)
                return pins.digitalReadPin(DigitalPin.P10) === 0 ? 1 : 0
            default:
                return assertUnreachableJoystickAxis(axis)
        }
    }

    /**
     * Lee el estado de un boton tactil digital.
     */
    //% blockId=smartteam_inputs_touch_button block="Tactil en %port"
    //% port.defl=smartteamShield.DigitalPort.Port0
    //% group="Digitales"
    //% weight=60
    export function readTouchButton(port: smartteamShield.DigitalPort): boolean {
        return pins.digitalReadPin(smartteamShield.digitalPin(port)) === 1
    }

    /**
     * Lee el estado de un pulsador digital activo en bajo.
     */
    //% blockId=smartteam_inputs_push_button block="Pulsador en %port"
    //% port.defl=smartteamShield.DigitalPort.Port0
    //% group="Digitales"
    //% weight=59
    export function readPushButton(port: smartteamShield.DigitalPort): boolean {
        return pins.digitalReadPin(smartteamShield.digitalPin(port)) === 0
    }

    /**
     * Lee temperatura en grados Celsius de un DHT11.
     */
    //% blockId=smartteam_inputs_dht11_temperature block="Temperatura DHT11 (C) en %port"
    //% port.defl=smartteamShield.DigitalPort.Port0
    //% group="DHT11"
    //% weight=58
    export function readDht11Temperature(port: smartteamShield.DigitalPort): number {
        const data = dht11Read(smartteamShield.digitalPin(port))
        if (data.length < 5) return -1
        return data[2]
    }

    /**
     * Lee humedad porcentual de un DHT11.
     */
    //% blockId=smartteam_inputs_dht11_humidity block="Humedad DHT11 en %port"
    //% port.defl=smartteamShield.DigitalPort.Port0
    //% group="DHT11"
    //% weight=56
    export function readDht11Humidity(port: smartteamShield.DigitalPort): number {
        const data = dht11Read(smartteamShield.digitalPin(port))
        if (data.length < 5) return -1
        return data[0]
    }

    function tcs34725Init(): void {
        if (tcs34725Initialized) return
        tcs34725Initialized = true
        tcs34725Write(TCS34725_ATIME, 0xeb)
        tcs34725Write(TCS34725_CONTROL, 0x01)
        tcs34725Write(TCS34725_ENABLE, 0x01)
        control.waitMicros(3000)
        tcs34725Write(TCS34725_ENABLE, 0x03)
        basic.pause(60)
    }

    function tcs34725Write(register: number, value: number): void {
        const buffer = pins.createBuffer(2)
        buffer[0] = TCS34725_COMMAND | register
        buffer[1] = value & 0xff
        pins.i2cWriteBuffer(TCS34725_ADDR, buffer)
    }

    function tcs34725Read8(register: number): number {
        pins.i2cWriteNumber(TCS34725_ADDR, TCS34725_COMMAND | register, NumberFormat.UInt8BE)
        return pins.i2cReadNumber(TCS34725_ADDR, NumberFormat.UInt8BE)
    }

    function tcs34725Read16(register: number): number {
        pins.i2cWriteNumber(TCS34725_ADDR, TCS34725_COMMAND | register, NumberFormat.UInt8BE)
        return pins.i2cReadNumber(TCS34725_ADDR, NumberFormat.UInt16LE)
    }

    function tcs34725ReadRgb(): number[] {
        tcs34725Init()
        if ((tcs34725Read8(TCS34725_STATUS) & 0x01) === 0) {
            basic.pause(5)
        }
        const red = tcs34725Read16(TCS34725_RDATAL)
        const green = tcs34725Read16(TCS34725_GDATAL)
        const blue = tcs34725Read16(TCS34725_BDATAL)
        return [red, green, blue]
    }

    function tcs34725ToAnalog(value: number): number {
        return smartteamShield.clamp(Math.floor((value * 1023) / 65535), 0, 1023)
    }

    function dht11Read(pin: DigitalPin): number[] {
        const data = [0, 0, 0, 0, 0]

        pins.digitalWritePin(pin, 0)
        basic.pause(18)
        pins.digitalWritePin(pin, 1)
        control.waitMicros(30)
        pins.setPull(pin, PinPullMode.PullUp)

        if (pins.pulseIn(pin, PulseValue.Low, 1000) === 0) return []
        if (pins.pulseIn(pin, PulseValue.High, 1000) === 0) return []

        for (let i = 0; i < 40; i++) {
            if (pins.pulseIn(pin, PulseValue.Low, 1000) === 0) return []
            const high = pins.pulseIn(pin, PulseValue.High, 1000)
            if (high === 0) return []

            const index = i >> 3
            data[index] <<= 1
            if (high > 40) data[index] |= 1
        }

        const checksum = (data[0] + data[1] + data[2] + data[3]) & 0xff
        if (checksum !== data[4]) return []
        return data
    }

    function assertUnreachableLinePosition(value: never): never {
        control.fail("Posicion de linea SmartTEAM no soportada: " + value)
        return value
    }

    function assertUnreachableColorChannel(value: never): never {
        control.fail("Canal de color SmartTEAM no soportado: " + value)
        return value
    }

    function assertUnreachableDetectedColor(value: never): never {
        control.fail("Color SmartTEAM no soportado: " + value)
        return value
    }

    function assertUnreachableJoystickAxis(value: never): never {
        control.fail("Eje de joystick SmartTEAM no soportado: " + value)
        return value
    }
}
