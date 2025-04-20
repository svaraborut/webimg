# 🖼 Web Image Rendering utility

Quick start

```shell
npm i web-image
```

The ultimate web transformation image library. Uses native Web standards to convert and transform an image inside your
browser, without sending your data anywhere.

## Supported Operations

- File manipulation
    - [Change Format](https://developer.mozilla.org/en-US/docs/Web/Media/Guides/Formats/Image_types)
    - Change Compression
- Transform
    - ✅ `resize()`
    - ✅ `rotate()`
    - ✅ `flip()`
    - ✅ `scale()`
    - ✅ `translate()`
    - ❌ `shear()` use `transform(fn)`
    - ❌ `transform()` use `transform(fn)`
- Filter
    - ✅ `blur()`
    - ✅ `brightness()`
    - ✅ `contrast()`
    - ✅ `grayscale()`
    - ✅ `hueRotate()`
    - ✅ `invert()`
    - ✅ `opacity()`
    - ✅ `saturate()`
    - ✅ `sepia()`

## Todo

- ✅ Make chainable
- ✅ ⚠️ Transform composition has issues (see demo)
- Better `resize()` options signature
- ✅ Make immutable
