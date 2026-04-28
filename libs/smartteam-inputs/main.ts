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

    export function readSoilMoisture(port: smartteamShield.AnalogPort): number {
        return pins.analogReadPin(smartteamShield.analogPin(port))
    }

    export function readLightLevel(port: smartteamShield.AnalogPort): number {
        return pins.analogReadPin(smartteamShield.analogPin(port))
    }

    export function readPotentiometer(port: smartteamShield.AnalogPort): number {
        return pins.analogReadPin(smartteamShield.analogPin(port))
    }

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

    export function readTouchButton(port: smartteamShield.DigitalPort): boolean {
        return pins.digitalReadPin(smartteamShield.digitalPin(port)) === 1
    }

    export function readPushButton(port: smartteamShield.DigitalPort): boolean {
        return pins.digitalReadPin(smartteamShield.digitalPin(port)) === 0
    }

    export function readDht11Temperature(port: smartteamShield.DigitalPort): number {
        const data = dht11Read(smartteamShield.digitalPin(port))
        if (data.length < 5) return -1
        return data[2]
    }

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

//% block="Entradas (D)"
//% icon="\uf192"
//% color="#9C27B0"
//% weight=50
//% groups='["Microbit","Externos"]'
namespace smartteamDigitalInputs {
    /**
     * Indica si el boton A, B o A+B de la micro:bit esta presionado.
     */
    //% blockId=smartteam_digital_button_pressed block="| Boton %button esta presionado"
    //% group="Microbit"
    //% weight=100
    export function buttonIsPressed(button: Button): boolean {
        return input.buttonIsPressed(button)
    }

    /**
     * Indica si el logo de la micro:bit esta presionado.
     */
    //% blockId=smartteam_digital_logo_pressed block="| LOGO esta presionado"
    //% group="Microbit"
    //% weight=90
    //% parts="logotouch"
    export function logoIsPressed(): boolean {
        return input.logoIsPressed()
    }

    /**
     * Lee un boton externo conectado al puerto digital seleccionado.
     */
    //% blockId=smartteam_digital_push_button block="| BOTON en el pin %port"
    //% port.defl=smartteamShield.DigitalPort.Port0
    //% group="Externos"
    //% weight=80
    export function readPushButton(port: smartteamShield.DigitalPort): boolean {
        return smartteamInputs.readPushButton(port)
    }

    /**
     * Lee un sensor tactil externo conectado al puerto digital seleccionado.
     */
    //% blockId=smartteam_digital_touch_button block="| TACTIL en el pin %port"
    //% port.defl=smartteamShield.DigitalPort.Port0
    //% group="Externos"
    //% weight=70
    export function readTouchButton(port: smartteamShield.DigitalPort): boolean {
        return smartteamInputs.readTouchButton(port)
    }

    /**
     * Lee la temperatura desde un DHT11 externo.
     */
    //% blockId=smartteam_digital_temperature block="| TEMPERATURA en el pin %port"
    //% port.defl=smartteamShield.DigitalPort.Port0
    //% group="Externos"
    //% weight=60
    export function readTemperature(port: smartteamShield.DigitalPort): number {
        return smartteamInputs.readDht11Temperature(port)
    }

    /**
     * Lee distancia en centimetros con ultrasonido.
     */
    //% blockId=smartteam_digital_ultrasonic block="| ULTRASONIDO en el pin %port"
    //% port.defl=smartteamShield.DigitalPort.Port1
    //% group="Externos"
    //% weight=50
    export function readUltrasonic(port: smartteamShield.DigitalPort): number {
        return smartteamInputs.readDistanceCm(port)
    }

    /**
     * Lee un sensor de obstaculo digital.
     */
    //% blockId=smartteam_digital_obstacle block="| OBSTACULO en el pin %port"
    //% port.defl=smartteamShield.DigitalPort.Port0
    //% group="Externos"
    //% weight=40
    export function readObstacle(port: smartteamShield.DigitalPort): boolean {
        return pins.digitalReadPin(smartteamShield.digitalPin(port)) === 0
    }

    /**
     * Lee el nivel del canal seleccionado del sensor de color IIC.
     */
    //% blockId=smartteam_digital_color_level block="| COLOR %channel en el pin IIC"
    //% channel.defl=smartteamShield.ColorChannel.Red
    //% group="Externos"
    //% weight=30
    export function readColorLevel(channel: smartteamShield.ColorChannel): number {
        return smartteamInputs.readColorLevel(channel)
    }

    /**
     * Indica si el color dominante del sensor IIC coincide con el color seleccionado.
     */
    //% blockId=smartteam_digital_color_detected block="| COLOR en el pin IIC es %color"
    //% color.defl=smartteamShield.DetectedColor.Red
    //% group="Externos"
    //% weight=20
    export function isColorDetected(color: smartteamShield.DetectedColor): boolean {
        return smartteamInputs.isColorDetected(color)
    }

    /**
     * Detecta la posicion de una linea usando el sensor seguidor de lineas.
     */
    //% blockId=smartteam_digital_line_at block="| Seguidor de lineas en el pin %port %position"
    //% port.defl=smartteamShield.DigitalPort.Port1
    //% position.defl=smartteamShield.LinePosition.Right
    //% group="Externos"
    //% weight=10
    export function isLineAt(port: smartteamShield.DigitalPort, position: smartteamShield.LinePosition): boolean {
        return smartteamInputs.isLineAt(position, port)
    }
}

//% block="Entradas (A~)"
//% icon="\uf192"
//% color="#9C27B0"
//% weight=49
//% groups='["Microbit","Externos"]'
namespace smartteamAnalogInputs {
    /**
     * Lee el nivel de luz del sensor integrado de la micro:bit.
     */
    //% blockId=smartteam_analog_microbit_light block="| NIVEL DE LUZ en el sensor de microbit"
    //% group="Microbit"
    //% weight=100
    export function microbitLightLevel(): number {
        return input.lightLevel()
    }

    /**
     * Lee la temperatura del sensor integrado de la micro:bit.
     */
    //% blockId=smartteam_analog_microbit_temperature block="| Temperatura en el sensor de microbit"
    //% group="Microbit"
    //% weight=90
    export function microbitTemperature(): number {
        return input.temperature()
    }

    /**
     * Lee la aceleracion de la micro:bit en el eje seleccionado.
     */
    //% blockId=smartteam_analog_acceleration block="| Aceleracion en el eje %dimension"
    //% dimension.defl=Dimension.X
    //% group="Microbit"
    //% weight=80
    export function acceleration(dimension: Dimension): number {
        return input.acceleration(dimension)
    }

    /**
     * Lee la fuerza magnetica de la micro:bit en el eje seleccionado.
     */
    //% blockId=smartteam_analog_magnetic_force block="| Fuerza magnetica en el eje %dimension"
    //% dimension.defl=Dimension.X
    //% group="Microbit"
    //% weight=70
    export function magneticForce(dimension: Dimension): number {
        return input.magneticForce(dimension)
    }

    /**
     * Lee el nivel de sonido del sensor integrado de la micro:bit.
     */
    //% blockId=smartteam_analog_sound_level block="| Nivel de sonido en el sensor microbit"
    //% group="Microbit"
    //% weight=60
    //% parts="microphone"
    export function soundLevel(): number {
        return input.soundLevel()
    }

    /**
     * Lee un sensor de luz externo.
     */
    //% blockId=smartteam_analog_light block="| LUZ en el pin %port"
    //% port.defl=smartteamShield.AnalogPort.Port0
    //% group="Externos"
    //% weight=50
    export function readLightLevel(port: smartteamShield.AnalogPort): number {
        return smartteamInputs.readLightLevel(port)
    }

    /**
     * Lee un sensor de humedad de suelo externo.
     */
    //% blockId=smartteam_analog_soil block="| SUELO en el pin %port"
    //% port.defl=smartteamShield.AnalogPort.Port0
    //% group="Externos"
    //% weight=40
    export function readSoilMoisture(port: smartteamShield.AnalogPort): number {
        return smartteamInputs.readSoilMoisture(port)
    }

    /**
     * Lee un potenciometro externo.
     */
    //% blockId=smartteam_analog_potentiometer block="| POTENCIOMETRO en el pin %port"
    //% port.defl=smartteamShield.AnalogPort.Port0
    //% group="Externos"
    //% weight=30
    export function readPotentiometer(port: smartteamShield.AnalogPort): number {
        return smartteamInputs.readPotentiometer(port)
    }

    /**
     * Lee el eje seleccionado del joystick externo.
     */
    //% blockId=smartteam_analog_joystick block="| Eje %axis del JOYSTICK en el pin %port"
    //% axis.defl=smartteamShield.JoystickAxis.X
    //% port.defl=smartteamShield.JoystickPort.Port1
    //% group="Externos"
    //% weight=20
    export function readJoystick(axis: smartteamShield.JoystickAxis, port: smartteamShield.JoystickPort): number {
        return smartteamInputs.readJoystick(axis, port)
    }
}
