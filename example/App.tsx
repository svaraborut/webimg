import React, { useMemo, useState } from 'react'
import { ImageTransformer } from '@/index.ts'
import { ImageType, commonImageTypes, getTypeFileExtension } from '@/utils/download.ts'
import { loadImage } from '@/utils/loaders.ts'
import { useAsync, useQuery } from '@reactit/hooks'

const image = '/chameleon.jpg'

const modes = ['demo', 'resize', 'rotate', 'flip', 'scale', 'translate', 'effects']

export function App() {
    const [mode, setMode] = useState<(typeof modes)[number]>(modes[0])
    const [type, setType] = useState<ImageType>('image/jpeg')

    // Create transformers
    const its = useMemo<ImageTransformer[]>(() => {
        const base = new ImageTransformer() //.saturate(2)

        // Examples
        if (mode === 'demo') {
            return [
                // base.resize({ width: 8_000 }), // load test
                base.saturate(2).resize({ size: 400, mode: 'none' }),
                base.grayscale(0.5).resize({ size: 400, mode: 'none' }),
                base.sepia(0.8).resize({ size: 400, mode: 'none' }),
                base.resize({ size: 200, mode: 'none' }),
                base.resize({ size: 200, mode: 'none' }).rotate({ angle: '45deg' }),
                base.rotate({ angle: '45deg' }).resize({ size: 200, mode: 'none' }),
                base.resize({ size: 200, mode: 'none' }).scale({ scale: 2 }),
                base.scale({ scale: 2 }).resize({ size: 200, mode: 'none' }).rotate({ angle: '45deg' }),
                base.rotate({ angle: '45deg' }).resize({ size: 200, mode: 'none' }).scale({ scale: 2 }),
                // .rotate({ angle: '45deg' }),
            ]
        }

        // Resize
        if (mode === 'resize') {
            return [
                { height: 400, width: 400, mode: 'fill' },
                { height: 400, width: 400, mode: 'contain' },
                { height: 400, width: 300, mode: 'contain' },
                { height: 400, width: 3000, mode: 'contain' },
                { height: 400, width: 400, mode: 'cover' },
                { height: 400, width: 300, mode: 'cover' },
                { height: 400, width: 3000, mode: 'cover' },
                { height: 200, width: 200, mode: 'none' },
                { height: 200, width: 200, mode: 'none', position: 0 },
                { height: 200, width: 200, mode: 'none', position: '100%' },
                { height: 200, width: 200, mode: 'none', position: { x: 0, y: '100%' } },
                { size: 200 },
                { height: 200 },
                { width: 200 },
                {},
            ].map(v => base.resize(v as any))
        }

        // Rotate
        if (mode === 'rotate') {
            return [
                { angle: '2deg' },
                { angle: '50grad' },
                { angle: '50grad', center: '0%' },
                { angle: '50grad', center: '100%' },
                { angle: '50grad', center: { x: '0%', y: '100%' } },
                { angle: '50grad', center: { x: '100%', y: '0%' } },
                { angle: '5deg' },
                { angle: '5deg', scaleMode: 'contain' },
                { angle: '5deg', scaleMode: 'cover' },
                { angle: '90deg' },
                { angle: '90deg', scaleMode: 'contain' },
                { angle: '90deg', scaleMode: 'cover' },
                { angle: '50grad' },
                { angle: '50grad', scaleMode: 'contain' },
                { angle: '50grad', scaleMode: 'cover' },
            ].map(v => base.rotate(v as any))
        }

        // Flip
        if (mode === 'flip') {
            return [
                { x: true },
                { y: true },
                { x: true, y: true },
                { axes: 'horizontal' },
                { axes: 'vertical' },
                { axes: 'both' },
            ].map(v => base.flip(v as any))
        }

        // Scale
        if (mode === 'scale') {
            return [
                { scale: 1 },
                { scale: 2 },
                { scale: 0.6 },
                { x: 0.5 },
                { y: 0.5 },
                { x: 2, y: 0.5 },
                { scale: 2, center: 0 },
                { scale: 2, center: '100%' },
                { scale: 2, center: { x: '50%', y: '100%' } },
            ].map(v => base.scale(v as any))
        }

        // Translate
        if (mode === 'translate') {
            return [{}, { x: '10px' }, { x: '50%' }, { x: '10px', y: '10px' }, { x: '50%', y: '50%' }].map(v =>
                base.translate(v as any)
            )
        }

        // Effects
        if (mode === 'effects') {
            return [
                (it: ImageTransformer) => it.blur(0),
                (it: ImageTransformer) => it.blur(1),
                (it: ImageTransformer) => it.blur(10),
                (it: ImageTransformer) => it.brightness(1),
                (it: ImageTransformer) => it.brightness('50%'),
                (it: ImageTransformer) => it.brightness(1.5),
                (it: ImageTransformer) => it.contrast(1),
                (it: ImageTransformer) => it.contrast('40%'),
                (it: ImageTransformer) => it.contrast(1.5),
                (it: ImageTransformer) => it.saturate(1),
                (it: ImageTransformer) => it.saturate(1.5),
                (it: ImageTransformer) => it.saturate('400%'),
                (it: ImageTransformer) => it.grayscale(0),
                (it: ImageTransformer) => it.grayscale(0.5),
                (it: ImageTransformer) => it.grayscale('100%'),
                (it: ImageTransformer) => it.hueRotation(0),
                (it: ImageTransformer) => it.hueRotation('45deg'),
                (it: ImageTransformer) => it.hueRotation('1turn'),
                (it: ImageTransformer) => it.invert(0),
                (it: ImageTransformer) => it.invert('40%'),
                (it: ImageTransformer) => it.invert(1),
                (it: ImageTransformer) => it.opacity(1),
                (it: ImageTransformer) => it.opacity('50%'),
                (it: ImageTransformer) => it.opacity(0.1),
                (it: ImageTransformer) => it.sepia(0),
                (it: ImageTransformer) => it.sepia('50%'),
                (it: ImageTransformer) => it.sepia(1),
            ].map(fn => fn(base))
        }

        return []
    }, [mode])

    const img = useQuery(() => {
        return loadImage(image)
    }, [])

    // Render preview images
    const task = useQuery(async () => {
        if (!img.result) return []
        return await Promise.all(its.map(it => it.apply(img.result!, 'image/webp', 0.2)))
    }, [img.result, its])

    // Download images
    const download = useAsync(async (ix: number) => {
        if (!img.result) return []
        // await its[ix].applyToDownload(img.result!, `example_${mode}_${ix}.jpg`, 'image/jpeg', 50)
        await its[ix].applyToDownload(img.result!, `example_${mode}_${ix}.${getTypeFileExtension(type)}`, type, 1)
    })

    return (
        <div className='flex flex-col gap-8 p-4'>
            <div className='sticky top-4 z-10 flex justify-between bg-gray-200 p-1 rounded font-mono'>
                <div className='flex'>
                    {modes.map(m => (
                        <div
                            key={m}
                            className={'px-2 py-1 rounded cursor-pointer' + (m === mode ? ' bg-white' : '')}
                            onClick={() => setMode(m)}
                        >
                            {m}
                        </div>
                    ))}
                </div>
                <div className='flex'>
                    {commonImageTypes.map(t => (
                        <div
                            key={t}
                            className={'px-2 py-1 rounded cursor-pointer' + (t === type ? ' bg-white' : '')}
                            onClick={() => setType(t)}
                        >
                            {getTypeFileExtension(t)}
                        </div>
                    ))}
                </div>
            </div>

            <div className='grid grid-cols-3 items-center gap-4'>
                <img className='rounded-lg bg-gray-300' src={image} alt='Original' />
            </div>
            <div className='grid grid-cols-3 items-center gap-4'>
                {task.result?.map((src, ix) => (
                    <div key={ix} className='flex justify-center'>
                        <div className='group rounded-lg bg-gray-300 overflow-hidden cursor-pointer relative'>
                            <img src={src} alt='Transformed' />
                            <div
                                className='opacity-0 group-hover:opacity-100 transition bg-black/30 inset-0 absolute font-mono flex items-center justify-center text-white'
                                onClick={() => download.run(ix)}
                            >
                                <span>DOWNLOAD</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            {!task.isSucceed && (
                <div>
                    {task.isLoading && 'Loading...'}
                    {task.isFailed && (task.error?.message ?? 'Failed')}
                </div>
            )}
        </div>
    )
}
