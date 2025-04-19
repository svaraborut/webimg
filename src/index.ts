import { ImageTransformFn } from '@/types.ts'
import { ResizeOptions, resize } from '@/units/resize.ts'

type Size = { width: number; height: number }

export type ImageTransformUnit = {
    filter?: string
    transform?: ImageTransformFn
}

export type CSSUnit = string | number

function toCSS(value: string | number, defaultUnit: string = 'px') {
    return typeof value === 'number' ? `${value}${defaultUnit}` : value
}

/**
 * Instance of a reusable image transformation pipeline. This class
 * will allow you to generically transform an image with an arbitrary
 * set of transformation procedures and utilities.
 */
export class ImageTransformer {
    units: ImageTransformUnit[] = []

    // Settings
    background: string | CanvasGradient | CanvasPattern = '#000'

    // Effects
    // https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/filter

    blur(length: CSSUnit) {
        this.units.push({ filter: `blur(${toCSS(length)})` })
    }

    saturate(percentage: CSSUnit) {
        this.units.push({ filter: `saturate(${toCSS(percentage, '%')})` })
    }

    // todo : other

    // Transforms

    resize(options: ResizeOptions) {
        this.units.push({
            transform: resize(options),
        })
    }

    // todo : rotation fit mode
    rotate(deg: number) {
        const rotRad = (deg * Math.PI) / 180
        this.units.push({
            transform: ({ size, c2d }) => {
                // Translate to rotate around the center
                c2d.translate(size.width / 2, size.height / 2)
                c2d.rotate(rotRad)
                c2d.translate(-size.width / 2, -size.height / 2)
            },
        })
    }

    flip(horizontal: boolean, vertical: boolean) {
        this.units.push({
            transform: ({ size, c2d }) => {
                // Translate to rotate around the center
                c2d.translate(size.width / 2, size.height / 2)
                c2d.scale(horizontal ? -1 : 1, vertical ? -1 : 1)
                c2d.translate(-size.width / 2, -size.height / 2)
            },
        })
    }

    // todo : other

    // Clipping

    // todo : image clip

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
            if (!unit.transform) continue
            const ret = unit.transform({ size, c2d })
            if (ret) size = ret.size
        }
        canvas.width = size.width
        canvas.height = size.height
        c2d.resetTransform() // just in case

        // Transform
        size = imageSize
        const filters = []
        for (const unit of this.units) {
            if (unit.filter) {
                filters.push(unit.filter)
            }
            if (unit.transform) {
                const ret = unit.transform({ size, c2d })
                if (ret) size = ret.size
            }
        }
        c2d.filter = filters.join(' ') || 'none'

        // Clear
        c2d.fillStyle = this.background
        c2d.fillRect(0, 0, canvas.width, canvas.height)

        // Render
        c2d.drawImage(img, 0, 0)

        return canvas.toDataURL('image/jpeg', 80)
    }
}
