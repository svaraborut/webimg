type Size = { width: number; height: number }

export type ImageTransformUnit = {
    filter?: string
    transform?: (size: Size, ctx: CanvasRenderingContext2D) => void | Size
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

    resize(width: number, height: number) {
        this.units.push({
            transform: (size, ctx) => {
                return { width, height }
            },
        })
    }

    // todo : rotation fit mode
    rotate(deg: number) {
        const rotRad = (deg * Math.PI) / 180
        this.units.push({
            transform: (size, ctx) => {
                // Translate to rotate around the center
                ctx.translate(size.width / 2, size.height / 2)
                ctx.rotate(rotRad)
                ctx.translate(-size.width / 2, -size.height / 2)
            },
        })
    }

    flip(horizontal: boolean, vertical: boolean) {
        this.units.push({
            transform: (size, ctx) => {
                // Translate to rotate around the center
                ctx.translate(size.width / 2, size.height / 2)
                ctx.scale(horizontal ? -1 : 1, vertical ? -1 : 1)
                ctx.translate(-size.width / 2, -size.height / 2)
            },
        })
    }

    // todo : other

    // Clipping

    // todo : image clip

    async transform(img: HTMLImageElement) {
        // Machinery
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        if (!ctx) {
            throw new Error('Failed to create a 2D context')
        }

        // (?) Compute canvas size as the transformation is cleared when the
        // canvas is resized, then re-apply everything
        const imageSize: Size = { width: img.width, height: img.height }
        let size = imageSize
        for (const unit of this.units) {
            if (!unit.transform) continue
            size = unit.transform(size, ctx) ?? size
        }
        canvas.width = size.width
        canvas.height = size.height
        ctx.resetTransform() // just in case

        // Transform
        size = imageSize
        const filters = []
        for (const unit of this.units) {
            if (unit.filter) {
                // todo : dedupe
                filters.push(unit.filter)
            }
            if (unit.transform) {
                size = unit.transform(size, ctx) ?? size
            }
        }
        ctx.filter = filters.join(' ') || 'none'

        // Clear
        ctx.fillStyle = this.background
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        // Render
        ctx.drawImage(img, 0, 0)

        return canvas.toDataURL('image/jpeg', 80)
    }
}
