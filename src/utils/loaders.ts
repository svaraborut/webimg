/**
 * Create a new Image object from an url and resolve when the image has been loaded
 */
export function loadImageFromUrl(url: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        const image = new Image()
        image.addEventListener('load', () => resolve(image))
        image.addEventListener('error', error => reject(error))
        // needed to avoid cross-origin issues on CodeSandbox
        image.setAttribute('crossOrigin', 'anonymous')
        image.src = url
    })
}

/**
 * Create a new Image object by loading the image from a File
 */
export function loadImageFromFile(file: File): Promise<HTMLImageElement> {
    // todo : maybe is better to use a FileReader as the object URLs are not garbage collected
    return loadImageFromUrl(URL.createObjectURL(file))
}

/**
 * Create a new Image object by loading the image from a Blob
 */
export async function loadImageFromBlob(blob: Blob): Promise<HTMLImageElement> {
    const url = URL.createObjectURL(blob)
    try {
        return await loadImageFromUrl(url)
    } finally {
        URL.revokeObjectURL(url)
    }
}

export type ImageSource = string | HTMLImageElement | File | Blob

/**
 * Load an image from any type of browser based resource
 */
export async function loadImage(mix: ImageSource): Promise<HTMLImageElement> {
    if (typeof mix === 'string') {
        return loadImageFromUrl(mix)
    } else if (mix instanceof HTMLImageElement) {
        return mix
    } else if (mix instanceof File) {
        return loadImageFromFile(mix)
    } else if (mix instanceof Blob) {
        return loadImageFromBlob(mix)
    } else {
        throw new Error(`Cannot load image from unknown type ${mix}`)
    }
}
