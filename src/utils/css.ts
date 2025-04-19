import { Point, Size, isPoint, isSize } from '@/types.ts'

export type CSSUnit = string | number
export type CSSPoint = Point<CSSUnit> | CSSUnit
export type CSSSize = Size<CSSUnit> | CSSUnit

// https://stackoverflow.com/questions/2671427
const cssParser = /^([+-]?(?:\d+|\d*\.\d+))([a-z]*|%)$/

/**
 * Parse a generic css unit to a tuple
 */
function parseCss(value: CSSUnit): [number, string | undefined] {
    if (typeof value === 'number') {
        return [value, undefined]
    } else if (typeof value === 'string') {
        const parts = value.match(cssParser)
        if (parts) {
            return [parseFloat(parts[1]), parts[2]?.toLowerCase() || undefined]
        }
    }
    throw new Error(`Cannot parse ${value}`)
}

export function toCss(value: CSSUnit, unit: string): string {
    const [num, valueUnit] = parseCss(value)
    if (!(valueUnit || unit)) {
        throw new Error(`Unknown value unit`)
    }
    return `${num}${valueUnit || unit}`
}

/**
 * Processes any css unit value to a pixel size, it also supports % value
 * https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Styling_basics/Values_and_units
 */
export function fromCssUnitToPx(value: CSSUnit, baseValue?: number): number {
    const [num, unit] = parseCss(value)
    if (!unit || unit == 'px') {
        return num
    } else if (unit === '%' && typeof baseValue === 'number') {
        return num * 0.01 * baseValue
    }
    throw new Error(`Unsupported unit ${unit}`)
}

/**
 * Converts css angles to radians. Missing unit is assumed to be radians
 * https://developer.mozilla.org/en-US/docs/Web/CSS/angle
 */
export function fromCssUnitToRad(value: CSSUnit): number {
    const [num, unit] = parseCss(value)
    if (!unit || unit == 'rad') {
        return num
    } else if (unit === 'deg') {
        return (num / 180) * Math.PI
    } else if (unit === 'grad') {
        return (num / 200) * Math.PI
    } else if (unit === 'turn') {
        return num * 2 * Math.PI
    }
    throw new Error(`Unsupported unit ${unit}`)
}

export function fromCssSizeToPx(value: CSSSize, baseValue?: Size): Size {
    if (isSize(value)) {
        return {
            width: fromCssUnitToPx(value.width, (baseValue as any)?.width),
            height: fromCssUnitToPx(value.height, (baseValue as any)?.height),
        }
    } else {
        return {
            width: fromCssUnitToPx(value, (baseValue as any)?.width),
            height: fromCssUnitToPx(value, (baseValue as any)?.height),
        }
    }
}

export function fromCssPointToPx(value: CSSPoint, baseValue?: Point): Point {
    if (isPoint(value)) {
        return {
            x: fromCssUnitToPx(value.x, (baseValue as any)?.x),
            y: fromCssUnitToPx(value.y, (baseValue as any)?.y),
        }
    } else {
        return {
            x: fromCssUnitToPx(value, (baseValue as any)?.x),
            y: fromCssUnitToPx(value, (baseValue as any)?.y),
        }
    }
}
