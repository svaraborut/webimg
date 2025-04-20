import { ImageTransformFn, Size } from '@/types.ts'
import { FlipOptions, flip } from '@/units/flip.ts'
import { ResizeOptions, resize } from '@/units/resize.ts'
import { RotateOptions, rotate } from '@/units/rotate.ts'
import { ScaleOptions, scale } from '@/units/scale.ts'
import { TranslateOptions, translate } from '@/units/translate.ts'
import { CSSUnit, toCss } from '@/utils/css.ts'
import { download } from '@/utils/download.ts'
import { canvasToBlob } from '@/utils/exporters.ts'

/**
 * Instance of a reusable image transformation pipeline. This class
 * will allow you to generically transform an image with an arbitrary
 * set of transformation procedures and utilities.
 */
export class ImageTransformer {
    // Settings
    background: string | CanvasGradient | CanvasPattern = '#000'

    // Effects
    // https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/filter
    private filters: string[] = []

    resetFilters() {
        this.filters = []
        return this
    }

    addFilter(filter: string) {
        this.filters.push(filter)
        return this
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

    // Transforms
    private units: ImageTransformFn[] = []

    resetTransforms() {
        this.units = []
        return this
    }

    transform(transform: ImageTransformFn) {
        this.units.push(transform)
        return this
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

    // Common

    reset() {
        this.resetFilters()
        this.resetTransforms()
        return this
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
        for (const unit of this.units) {
            const ret = unit({ size, c2d })
            if (ret) size = ret.size
        }
        canvas.width = size.width
        canvas.height = size.height
        c2d.resetTransform() // just in case

        // Clear
        c2d.fillStyle = this.background
        c2d.fillRect(0, 0, canvas.width, canvas.height)

        // Filter
        c2d.filter = this.filters.join(' ') || 'none'

        // Transform
        size = imageSize
        for (const unit of this.units) {
            const ret = unit({ size, c2d })
            if (ret) size = ret.size
        }

        // Render
        c2d.drawImage(img, 0, 0)

        return canvas.toDataURL('image/jpeg', 80)
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
