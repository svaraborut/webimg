import { ImageTransformFn, Point, Size } from '@/types.ts'
import { CSSPoint, CSSSize, fromCssPointToPx, fromCssSizeToPx } from '@/utils/css.ts'

export interface ResizeOptions {
    // Target image size
    size: CSSSize
    // Resizing mode, same to CSS object-fit see
    // https://www.w3schools.com/css/css3_object-fit.asp
    // default 'fill'
    mode?: 'fill' | 'contain' | 'cover' | 'none'
    // Determines the transformation center same as object-position
    // https://developer.mozilla.org/en-US/docs/Web/CSS/object-position
    // default '50% 50%'
    position?: CSSPoint
}

export function resize({
    size: _targetSize,
    mode = 'fill',
    position: _targetPosition = '50%',
}: ResizeOptions): ImageTransformFn {
    return ({ size, c2d }) => {
        // [1] Compute image patch size. Size of the image patch to be visible inside
        // the target expressed in IMAGE coordinates
        const targetSize = fromCssSizeToPx(_targetSize, size)
        let imgPatch: Size
        const imgAr = size.width / size.height
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
