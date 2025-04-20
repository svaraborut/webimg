import { ImageTransformFn } from '@/types.ts'
import { CSSUnit, fromCssPointToPx } from '@/utils/css.ts'

export interface TranslateOptions {
    // Translate on x axes
    x?: CSSUnit
    // Translate on y axes
    y?: CSSUnit
}

export function translate({ x, y }: TranslateOptions): ImageTransformFn {
    return ({ size, c2d }) => {
        const off = fromCssPointToPx({ x: x ?? 0, y: y ?? 0 }, { x: size.width, y: size.height })

        // Apply transform
        c2d.translate(off.x, off.y)
    }
}
