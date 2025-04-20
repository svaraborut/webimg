import { ImageTransformFn, Point } from '@/types.ts'
import { CSSPoint, CSSUnit, fromCssPointToPx, fromCssUnitToScale } from '@/utils/css.ts'

export interface ScaleOptions {
    // Scale on both axes
    scale?: CSSUnit
    // Scale on x axes
    x?: CSSUnit
    // Scale on y axes
    y?: CSSUnit
    // Determines the image center of scale
    // default '50%'
    center?: CSSPoint
}

export function scale({ scale = 1, x, y, center: _center = '50%' }: ScaleOptions): ImageTransformFn {
    x = x !== undefined ? x : scale
    y = y !== undefined ? y : scale
    return ({ size, c2d }) => {
        const center = fromCssPointToPx(_center, { x: size.width, y: size.height })

        // [1] Compute image scale
        const imgScale: Point = {
            x: fromCssUnitToScale(x ?? 1, size.width),
            y: fromCssUnitToScale(y ?? 1, size.height),
        }

        // Apply transform
        c2d.translate(center.x, center.y)
        c2d.scale(imgScale.x, imgScale.y)
        c2d.translate(-center.x, -center.y)
    }
}
