import { ImageBackground, ImageTransformFn, Size } from '@/types.ts'
import { FlipOptions, flip } from '@/units/flip.ts'
import { ResizeOptions, resize } from '@/units/resize.ts'
import { RotateOptions, rotate } from '@/units/rotate.ts'
import { ScaleOptions, scale } from '@/units/scale.ts'
import { TranslateOptions, translate } from '@/units/translate.ts'
import { CSSUnit, toCss } from '@/utils/css.ts'
import { download } from '@/utils/download.ts'
import { canvasToBlob } from '@/utils/exporters.ts'

// (?) From empiric testing, this size does already become critical on many browsers
// so for now will be kept as a safeguard. In future may be deemed too restrictive
// and increased or completely removed.
const MAX_CANVAS = 8_192

/**
 * Instance of a reusable image transformation pipeline. This class
 * will allow you to generically transform an image with an arbitrary
 * set of transformation procedures and utilities.
 */
export class ImageTransformer {
    readonly background: ImageBackground
    private filters: string[]
    private units: ImageTransformFn[]

    constructor(background: ImageBackground = '#000', filters: string[] = [], units: ImageTransformFn[] = []) {
        this.background = background
        this.filters = filters
        this.units = units
    }

    reset() {
        return new ImageTransformer(this.background, [], [])
    }

    resetFilters() {
        return new ImageTransformer(this.background, [], this.units)
    }

    addFilter(filter: string) {
        return new ImageTransformer(this.background, [...this.filters, filter], this.units)
    }

    blur(length: CSSUnit) {
        return this.addFilter(`blur(${toCss(length, 'px')})`)
    }

    brightness(percentage: CSSUnit) {
        return this.addFilter(`brightness(${toCss(percentage)})`)
    }

    contrast(percentage: CSSUnit) {
        return this.addFilter(`contrast(${toCss(percentage)})`)
    }

    grayscale(amount: CSSUnit) {
        return this.addFilter(`grayscale(${toCss(amount)})`)
    }

    hueRotation(angle: CSSUnit) {
        return this.addFilter(`hue-rotate(${toCss(angle, 'rad')})`)
    }

    invert(percentage: CSSUnit = 1.0) {
        return this.addFilter(`invert(${toCss(percentage)})`)
    }

    opacity(percentage: CSSUnit) {
        return this.addFilter(`opacity(${toCss(percentage)})`)
    }

    saturate(percentage: CSSUnit) {
        return this.addFilter(`saturate(${toCss(percentage)})`)
    }

    sepia(percentage: CSSUnit) {
        return this.addFilter(`sepia(${toCss(percentage)})`)
    }

    resetTransforms() {
        return new ImageTransformer(this.background, this.filters, [])
    }

    transform(fn: ImageTransformFn) {
        return new ImageTransformer(this.background, this.filters, [...this.units, fn])
    }

    resize(options: ResizeOptions) {
        return this.transform(resize(options))
    }

    rotate(options: RotateOptions) {
        return this.transform(rotate(options))
    }

    flip(options: FlipOptions) {
        return this.transform(flip(options))
    }

    scale(options: ScaleOptions) {
        return this.transform(scale(options))
    }

    translate(options: TranslateOptions) {
        return this.transform(translate(options))
    }

    /**
     * Apply the transformation by rendering the result on a user provided canvas
     */
    async applyOnCanvas(canvas: HTMLCanvasElement, img: HTMLImageElement) {
        // Init
        const c2d = canvas.getContext('2d')
        if (!c2d) {
            throw new Error('Failed to create a 2D context')
        }

        const imageSize: Size = { width: img.width, height: img.height }

        // (?) Compute canvas size as the transformation is cleared when the
        // canvas is resized, then re-apply everything
        let size = imageSize
        let t = c2d.getTransform()
        for (const unit of this.units) {
            // (!) Extract the current transform and re-apply it after the operation
            // this will cause the units to behave as they were performed on an image
            // of the current size that has already undergone the transformations that
            // lead to this point and behave in the current coordinate system.
            t = c2d.getTransform()
            c2d.resetTransform()
            const ret = unit({ size, c2d })
            c2d.transform(t.a, t.b, t.c, t.d, t.e, t.f)
            if (ret) size = ret.size
        }

        // (!) When resized the canvas is reset to teh original transformation so extract
        // the transform prior to the resizing action
        t = c2d.getTransform()
        c2d.resetTransform() // just in case

        // Resize
        // (!) attempting to use a large canvas https://stackoverflow.com/questions/6081483
        // will fail or render a black image, so is better to fail immediately
        if (size.width > MAX_CANVAS || size.height > MAX_CANVAS) {
            throw new Error(`Output image cannot exceed ${MAX_CANVAS}x${MAX_CANVAS}`)
        }
        canvas.width = size.width
        canvas.height = size.height

        // Clear the background
        c2d.fillStyle = this.background
        c2d.fillRect(0, 0, canvas.width, canvas.height)

        // Apply modifiers
        c2d.filter = this.filters.join(' ') || 'none'
        c2d.setTransform(t)

        // Render
        c2d.drawImage(img, 0, 0)
    }

    /**
     * Apply the transformation of the image returning a new canvas
     */
    async applyToCanvas(img: HTMLImageElement): Promise<HTMLCanvasElement> {
        const canvas = document.createElement('canvas')
        await this.applyOnCanvas(canvas, img)
        return canvas
    }

    /**
     * Apply the transformation of the image and returns a Blob containing the new image
     */
    async applyToBlob(img: HTMLImageElement, type?: string, quality?: number): Promise<Blob> {
        const canvas = await this.applyToCanvas(img)
        return canvasToBlob(canvas, type, quality)
    }

    /**
     * Apply the transformation of the image and returns a Data URL containing the new image
     */
    async applyToDataUrl(img: HTMLImageElement, type?: string, quality?: number): Promise<string> {
        const canvas = await this.applyToCanvas(img)
        return canvas.toDataURL(type, quality)
    }

    /**
     * Alias for `applyToDataUrl()`
     */
    apply(img: HTMLImageElement, type?: string, quality?: number) {
        return this.applyToDataUrl(img, type, quality)
    }

    /**
     * Apply the transformation of the image and downloads it to the user
     */
    async applyToDownload(img: HTMLImageElement, filename?: string, type?: string, quality?: number) {
        const blob = await this.applyToBlob(img, type, quality)
        download(blob, filename)
    }
}
