import { ImageTransformFn } from '@/types.ts'

export type FlipAxes = 'horizontal' | 'vertical' | 'both'

export interface FlipOptions {
    // Flip axis
    axes?: FlipAxes
    // Flip on x axes
    x?: boolean
    // Flip on y axes
    y?: boolean
}

export function flip({ axes, x, y }: FlipOptions): ImageTransformFn {
    x = x !== undefined ? x : axes === 'horizontal' || axes === 'both'
    y = y !== undefined ? y : axes === 'vertical' || axes === 'both'
    return ({ size, c2d }) => {
        c2d.translate(size.width / 2, size.height / 2)
        c2d.scale(x ? -1 : 1, y ? -1 : 1)
        c2d.translate(-size.width / 2, -size.height / 2)
    }
}
