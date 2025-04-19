import { ImageTransformFn, Size } from '@/types.ts'
import { CSSPoint, CSSUnit, fromCssPointToPx, fromCssUnitToRad } from '@/utils/css.ts'

export interface RotateOptions {
    // Rotation angle
    angle: CSSUnit
    // Determines the image center of rotation
    // default '50%'
    center?: CSSPoint
    // When the image is rotated the image may be scaled to either cover the
    // whole canvas or be contained within it. default none
    scaleMode?: 'none' | 'contain' | 'cover'
}

export function rotate({
    angle: _angle,
    center: _center = '50%',
    scaleMode = 'none',
}: RotateOptions): ImageTransformFn {
    const angle = fromCssUnitToRad(_angle)
    return ({ size, c2d }) => {
        const center = fromCssPointToPx(_center, { x: size.width, y: size.height })

        // [1] Compute new image size due to rotation
        const targetSize: Size = {
            width: size.width * Math.cos(angle) + size.height * Math.sin(angle),
            height: size.width * Math.sin(angle) + size.height * Math.cos(angle),
        }
        let scale: number
        if (scaleMode === 'contain') {
            scale = Math.min(size.width / targetSize.width, size.height / targetSize.height)
        } else if (scaleMode === 'cover') {
            scale = Math.max(targetSize.width / size.width, targetSize.height / size.height)
        } else {
            scale = 1.0
        }

        // Apply transform
        c2d.translate(center.x, center.y)
        c2d.rotate(angle)
        c2d.scale(scale, scale)
        c2d.translate(-center.x, -center.y)
        return { size }
    }
}
