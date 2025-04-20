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
