import React from 'react'
import { ImageTransformer } from '@/index.ts'
import { loadImage } from '@/utils/loaders.ts'
import { useQuery } from '@reactit/hooks'

const image = '/chameleon.jpg'

export function App() {
    const task = useQuery(async () => {
        const img = await loadImage(image)

        // const it = new ImageTransformer()
        // it.background = 'red'
        // it.resize({ size: { height: 400, width: 3000 }, mode: 'contain' })
        // it.saturate(200)
        // it.blur(4)
        // it.rotate(45)

        // Resize
        // const its = [
        //     { size: { height: 400, width: 400 }, mode: 'fill' },
        //     { size: { height: 400, width: 400 }, mode: 'contain' },
        //     { size: { height: 400, width: 300 }, mode: 'contain' },
        //     { size: { height: 400, width: 3000 }, mode: 'contain' },
        //     { size: { height: 400, width: 400 }, mode: 'cover' },
        //     { size: { height: 400, width: 300 }, mode: 'cover' },
        //     { size: { height: 400, width: 3000 }, mode: 'cover' },
        //     { size: { height: 200, width: 200 }, mode: 'none' },
        //     { size: { height: 200, width: 200 }, mode: 'none', position: 0 },
        //     { size: { height: 200, width: 200 }, mode: 'none', position: '100%' },
        //     { size: { height: 200, width: 200 }, mode: 'none', position: { x: 0, y: '100%' } },
        // ].map(v => {
        //     const it = new ImageTransformer()
        //     it.resize(v)
        //     it.saturate(200)
        //     return it
        // })

        // Rotate
        const its = [
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
            it.saturate(200)
            return it
        })

        return await Promise.all(its.map(it => it.transform(img)))
    }, [])

    return (
        <div className='flex flex-col gap-8 p-4'>
            <div className='grid grid-cols-3 items-center gap-4'>
                <img className='rounded-lg bg-gray-300' src={image} alt='Original' />
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
