import React, { useState } from 'react'
import { ImageTransformer } from '@/index.ts'
import { loadImage } from '@/utils/loaders.ts'
import { useQuery } from '@reactit/hooks'

const image = '/chameleon.jpg'

const modes = ['demo', 'resize', 'rotate', 'flip', 'effects', 'scale', 'translate']

export function App() {
    const [mode, setMode] = useState<(typeof modes)[number]>(modes[0])

    const task = useQuery(async () => {
        const img = await loadImage(image)
        let its: ImageTransformer[] = []

        // const it = new ImageTransformer()
        // it.background = 'red'
        // it.resize({ size: { height: 400, width: 3000 }, mode: 'contain' })
        // it.saturate(2)
        // it.blur(4)
        // it.rotate(45)

        // Resize
        if (mode === 'resize') {
            its = [
                { size: { height: 400, width: 400 }, mode: 'fill' },
                { size: { height: 400, width: 400 }, mode: 'contain' },
                { size: { height: 400, width: 300 }, mode: 'contain' },
                { size: { height: 400, width: 3000 }, mode: 'contain' },
                { size: { height: 400, width: 400 }, mode: 'cover' },
                { size: { height: 400, width: 300 }, mode: 'cover' },
                { size: { height: 400, width: 3000 }, mode: 'cover' },
                { size: { height: 200, width: 200 }, mode: 'none' },
                { size: { height: 200, width: 200 }, mode: 'none', position: 0 },
                { size: { height: 200, width: 200 }, mode: 'none', position: '100%' },
                { size: { height: 200, width: 200 }, mode: 'none', position: { x: 0, y: '100%' } },
            ].map(v => {
                const it = new ImageTransformer()
                it.resize(v)
                it.saturate(2)
                return it
            })
        }

        // Rotate
        if (mode === 'rotate') {
            its = [
                { angle: '2deg' },
                { angle: '50grad' },
                { angle: '50grad', center: '0%' },
                { angle: '50grad', center: '100%' },
                { angle: '50grad', center: { x: '0%', y: '100%' } },
                { angle: '50grad', center: { x: '100%', y: '0%' } },
                { angle: '2deg' },
                { angle: '2deg', scaleMode: 'contain' },
                { angle: '2deg', scaleMode: 'cover' },
                { angle: '90deg' },
                { angle: '90deg', scaleMode: 'contain' },
                { angle: '90deg', scaleMode: 'cover' },
                { angle: '50grad' },
                { angle: '50grad', scaleMode: 'contain' },
                { angle: '50grad', scaleMode: 'cover' },
            ].map(v => {
                const it = new ImageTransformer()
                it.rotate(v)
                it.saturate(2)
                return it
            })
        }

        // Flip
        if (mode === 'flip') {
            its = [
                { x: true },
                { y: true },
                { x: true, y: true },
                { axes: 'horizontal' },
                { axes: 'vertical' },
                { axes: 'both' },
            ].map(v => {
                const it = new ImageTransformer()
                it.flip(v)
                it.saturate(2)
                return it
            })
        }

        // Scale
        if (mode === 'scale') {
            its = [
                { scale: 1 },
                { scale: 2 },
                { scale: 0.6 },
                { x: 0.5 },
                { y: 0.5 },
                { x: 2, y: 0.5 },
                { scale: 2, center: 0 },
                { scale: 2, center: '100%' },
                { scale: 2, center: { x: '50%', y: '100%' } },
            ].map(v => {
                const it = new ImageTransformer()
                it.scale(v)
                it.saturate(2)
                return it
            })
        }

        // Translate
        if (mode === 'translate') {
            its = [{}, { x: '10px' }, { x: '50%' }, { x: '10px', y: '10px' }, { x: '50%', y: '50%' }].map(v => {
                const it = new ImageTransformer()
                it.translate(v)
                it.saturate(2)
                return it
            })
        }

        // Effects
        if (mode === 'effects') {
            its = [
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
                (it: ImageTransformer) => it.invert('50%'),
                (it: ImageTransformer) => it.invert(1),
                (it: ImageTransformer) => it.opacity(1),
                (it: ImageTransformer) => it.opacity('50%'),
                (it: ImageTransformer) => it.opacity(0.1),
                (it: ImageTransformer) => it.sepia(0),
                (it: ImageTransformer) => it.sepia('50%'),
                (it: ImageTransformer) => it.sepia(1),
            ].map(fn => {
                const it = new ImageTransformer()
                fn(it)
                return it
            })
        }

        return await Promise.all(its.map(it => it.transform(img)))
    }, [mode])

    return (
        <div className='flex flex-col gap-8 p-4'>
            <div className='flex bg-gray-200 p-1 rounded font-mono'>
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

            <div className='grid grid-cols-3 items-center gap-4'>
                <img className='rounded-lg bg-gray-300' src={image} alt='Original' />
            </div>
            <div className='grid grid-cols-3 items-center gap-4'>
                {task.result?.map((src, ix) => (
                    <img key={ix} className='rounded-lg bg-gray-300' src={src} alt='Transformed' />
                ))}
            </div>
            <div>
                {task.isLoading && 'Loading...'}
                {task.isFailed && (task.error?.message ?? 'Failed')}
                {task.isSucceed && 'Ok'}
            </div>
        </div>
    )
}
