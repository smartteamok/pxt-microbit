/**
 * Different byte orders for RGB NeoPixel strips.
 */
enum NeoPixelMode {
    //% block="RGB (GRB format)"
    RGB = 1,
    //% block="RGB (RGB format)"
    RGB_RGB = 3
}

/**
 * Minimal NeoPixel strip support for SmartTeam bundled blocks.
 */
namespace neopixel {
    /**
     * A NeoPixel strip.
     */
    export class Strip {
        private buf: Buffer;
        private pin: DigitalPin;
        private length: number;
        private mode: NeoPixelMode;

        init(pin: DigitalPin, numleds: number, mode: NeoPixelMode): void {
            this.pin = pin;
            this.length = Math.max(0, numleds | 0);
            this.mode = mode || NeoPixelMode.RGB;
            this.buf = pins.createBuffer(this.length * 3);
            pins.digitalWritePin(this.pin, 0);
        }

        showColor(rgb: number): void {
            for (let i = 0; i < this.length; i++)
                this.setPixelColor(i, rgb);
            this.show();
        }

        setPixelColor(pixeloffset: number, rgb: number): void {
            if (pixeloffset < 0 || pixeloffset >= this.length)
                return;

            const offset = (pixeloffset | 0) * 3;
            const red = (rgb >> 16) & 0xff;
            const green = (rgb >> 8) & 0xff;
            const blue = rgb & 0xff;

            if (this.mode === NeoPixelMode.RGB_RGB) {
                this.buf[offset] = red;
                this.buf[offset + 1] = green;
            } else {
                this.buf[offset] = green;
                this.buf[offset + 1] = red;
            }
            this.buf[offset + 2] = blue;
        }

        clear(): void {
            this.buf.fill(0);
        }

        show(): void {
            light.sendWS2812BufferWithBrightness(this.buf, this.pin, 0x100);
        }
    }

    /**
     * Create a new NeoPixel driver for a strip.
     * @param pin the pin where the NeoPixel strip is connected
     * @param numleds number of LEDs in the strip
     * @param mode RGB byte order
     */
    export function create(pin: DigitalPin, numleds: number, mode: NeoPixelMode): Strip {
        const strip = new Strip();
        strip.init(pin, numleds, mode);
        return strip;
    }

    /**
     * Convert red, green, and blue channels into an RGB color.
     * @param red red value from 0 to 255
     * @param green green value from 0 to 255
     * @param blue blue value from 0 to 255
     */
    export function rgb(red: number, green: number, blue: number): number {
        return ((red & 0xff) << 16) | ((green & 0xff) << 8) | (blue & 0xff);
    }
}
