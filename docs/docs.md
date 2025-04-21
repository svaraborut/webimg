## Documentation

The ultimate web transformation image library. Uses native Web standards to convert and transform an image inside your
browser, without sending your data anywhere.

## Effects

Full support of [Canvas Filters](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/filter)

- ✅ `blur()`
- ✅ `brightness()`
- ✅ `contrast()`
- ✅ `grayscale()`
- ✅ `hueRotate()`
- ✅ `invert()`
- ✅ `opacity()`
- ✅ `saturate()`
- ✅ `sepia()`

## Transform

- ✅ `resize()`
- ✅ `rotate()`
- ✅ `flip()`
- ✅ `scale()`
- ✅ `translate()`
- ✅ `transform(fn)`

## Export

- `applyOnCanvas()`
- `applyToCanvas()`
- `applyToBlob()`
- `applyToDataUrl()`
- `applyToDownload()`

## Formats

The transformer supports various export formats and also supports
variable (`quality`)[https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toDataURL#quality]

- `image/apng`
- `image/avif`
- `image/gif`
- `image/jpeg`
- `image/png`
- `image/webp`
- `image/bmp`

> The supported formats are available on all major browsers. Some exotic formats like `apng` may not be supported on
> older browsers or particular implementations. If you are planning to support such formats handle properly conversion
> exceptions.
