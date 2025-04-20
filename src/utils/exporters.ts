/**
 * Converts a canvas to a Blob via the widely supported toBlob function
 */
export function canvasToBlob(canvas: HTMLCanvasElement, type?: string, quality?: number): Promise<Blob> {
    return new Promise((resolve, reject) => {
        canvas.toBlob(
            file => {
                if (file) {
                    resolve(file)
                } else {
                    // https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toBlob
                    reject(new Error('Failed to create Blob'))
                }
            },
            type,
            quality
        )
    })
}
