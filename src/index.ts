import { ImageTransformFn, Size } from '@/types.ts'
import { FlipOptions, flip } from '@/units/flip.ts'
import { ResizeOptions, resize } from '@/units/resize.ts'
import { RotateOptions, rotate } from '@/units/rotate.ts'
import { CSSUnit, toCss } from '@/utils/css.ts'

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
    }

    addFilter(filter: string) {
        this.filters.push(filter)
    }

    blur(length: CSSUnit) {
        this.addFilter(`blur(${toCss(length, 'px')})`)
    }

    brightness(percentage: CSSUnit) {
        this.addFilter(`brightness(${toCss(percentage)})`)
    }

    contrast(percentage: CSSUnit) {
        this.addFilter(`contrast(${toCss(percentage)})`)
    }

    grayscale(amount: CSSUnit) {
        this.addFilter(`grayscale(${toCss(amount)})`)
    }

    hueRotation(angle: CSSUnit) {
        this.addFilter(`hue-rotate(${toCss(angle, 'rad')})`)
    }

    invert(percentage: CSSUnit = 1.0) {
        this.addFilter(`invert(${toCss(percentage)})`)
    }

    opacity(percentage: CSSUnit) {
        this.addFilter(`opacity(${toCss(percentage)})`)
    }

    saturate(percentage: CSSUnit) {
        this.addFilter(`saturate(${toCss(percentage)})`)
    }

    sepia(percentage: CSSUnit) {
        this.addFilter(`sepia(${toCss(percentage)})`)
    }

    // Transforms
    private units: ImageTransformFn[] = []

    resetTransforms() {
        this.units = []
    }

    addTransform(transform: ImageTransformFn) {
        this.units.push(transform)
    }

    resize(options: ResizeOptions) {
        this.addTransform(resize(options))
    }

    rotate(options: RotateOptions) {
        this.addTransform(rotate(options))
    }

    flip(options: FlipOptions) {
        this.addTransform(flip(options))
    }

    // Common

    reset() {
        this.resetFilters()
        this.resetTransforms()
    }

    async transform(img: HTMLImageElement) {
        // Machinery
        const canvas = document.createElement('canvas')
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

        // Filter
        c2d.filter = this.filters.join(' ') || 'none'

        // Transform
        size = imageSize
        for (const unit of this.units) {
            const ret = unit({ size, c2d })
            if (ret) size = ret.size
        }

        // Clear
        c2d.fillStyle = this.background
        c2d.fillRect(0, 0, canvas.width, canvas.height)

        // Render
        c2d.drawImage(img, 0, 0)

        return canvas.toDataURL('image/jpeg', 80)
    }
}
