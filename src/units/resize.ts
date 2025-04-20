import { ImageTransformFn, Point, Size } from '@/types.ts'
import { CSSPoint, CSSUnit, fromCssPointToPx, fromCssUnitToPx } from '@/utils/css.ts'

export interface ResizeOptions {
    // Target image size. Can provide individual sides or `size` to define
    // them both. If is not possible to determine any of the sizes the image
    // aspect ratio is preserved.
    size?: CSSUnit
    width?: CSSUnit
    height?: CSSUnit
    // Resizing mode, same to CSS object-fit see
    // https://www.w3schools.com/css/css3_object-fit.asp
    // default 'fill'
    mode?: 'fill' | 'contain' | 'cover' | 'none'
    // Determines the transformation center same as object-position
    // https://developer.mozilla.org/en-US/docs/Web/CSS/object-position
    // default '50%'
    position?: CSSPoint
}

export function resize({
    size: _size,
    width: _width,
    height: _height,
    mode = 'fill',
    position: _targetPosition = '50%',
}: ResizeOptions): ImageTransformFn {
    _width ??= _size
    _height ??= _size
    return ({ size, c2d }) => {
        // [0] Compute individual target sizes for the image
        const imgAr = size.width / size.height
        const tmpWidth = _width !== undefined ? fromCssUnitToPx(_width, size.width) : undefined
        const tmpHeight = _height !== undefined ? fromCssUnitToPx(_height, size.height) : undefined
        const targetSize = {
            width: tmpWidth !== undefined ? tmpWidth : tmpHeight !== undefined ? tmpHeight * imgAr : size.width,
            height: tmpHeight !== undefined ? tmpHeight : tmpWidth !== undefined ? tmpWidth / imgAr : size.height,
        }

        // [1] Compute image patch size. Size of the image patch to be visible inside
        // the target expressed in IMAGE coordinates.
        // todo : review approach in rotate() may be simpler
        let imgPatch: Size
        const trgAr = targetSize.width / targetSize.height
        if (mode === 'fill') {
            imgPatch = size
        } else if (mode === 'contain') {
            imgPatch =
                imgAr >= trgAr
                    ? {
                          width: size.width,
                          height: size.width / trgAr,
                      }
                    : {
                          width: size.height * trgAr,
                          height: size.height,
                      }
        } else if (mode === 'cover') {
            imgPatch =
                imgAr >= trgAr
                    ? {
                          width: size.height * trgAr,
                          height: size.height,
                      }
                    : {
                          width: size.width,
                          height: size.width / trgAr,
                      }
        } else {
            imgPatch = targetSize
        }

        // [2] Compute image translation
        let imgOff: Point = fromCssPointToPx(_targetPosition, {
            x: size.width - imgPatch.width,
            y: size.height - imgPatch.height,
        })

        // [3] Compute image scale
        const imgScale: Point = {
            x: targetSize.width / imgPatch.width,
            y: targetSize.height / imgPatch.height,
        }

        // [3] Apply operation
        c2d.scale(imgScale.x, imgScale.y)
        c2d.translate(-imgOff.x, -imgOff.y)

        return {
            size: targetSize,
        }
    }
}
