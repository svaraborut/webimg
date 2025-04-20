export type Downloadable = Blob | string

/**
 * Simple download util that will use a link element internally.
 * (!) Some browsers may require the element to be mounted to the DOm
 */
export function download(obj: Downloadable, filename?: string) {
    const objectUrl = typeof obj === 'string' ? undefined : URL.createObjectURL(obj)
    // Download
    const a = document.createElement('a')
    a.href = objectUrl || (obj as string)
    a.setAttribute('target', '_blank')
    if (filename) a.setAttribute('download', filename)
    a.click()
    // Revoke
    if (objectUrl) URL.revokeObjectURL(objectUrl)
}

/**
 * Common image types supported by all major browsers
 * https://developer.mozilla.org/en-US/docs/Web/Media/Guides/Formats/Image_types
 */
export const commonImageTypes = [
    'image/apng',
    'image/avif',
    'image/gif',
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/bmp',
] as const

export type ImageType = (typeof commonImageTypes)[number]

/**
 * Provides file extensions (without dot) for common image file formats
 */
export function getTypeFileExtension(type: ImageType): string {
    if (!commonImageTypes.includes(type)) {
        throw new Error('Not a supported image type')
    } else {
        return type.replace('image/', '')
    }
}
