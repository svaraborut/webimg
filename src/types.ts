export type Point<T = number> = { x: T; y: T }
export type Size<T = number> = { width: T; height: T }

export function isPoint<T>(value: any): value is Point<T> {
    return (
        typeof value === 'object' && typeof (value as any).x !== 'undefined' && typeof (value as any).y !== 'undefined'
    )
}

export function isSize<T>(value: any): value is Size<T> {
    return (
        typeof value === 'object' &&
        typeof (value as any).width !== 'undefined' &&
        typeof (value as any).height !== 'undefined'
    )
}

export interface ImageTransformContext {
    // Size of the image being processed
    size: Size
    // The rendering context
    c2d: CanvasRenderingContext2D
}

export type ImageTransformReturn = void | { size: Size }

export type ImageTransformFn = (context: ImageTransformContext) => ImageTransformReturn
