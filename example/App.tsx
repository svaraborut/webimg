import React from 'react'
import { ImageTransformer } from '@/index.ts'
import { loadImage } from '@/utils.ts'
import { useQuery } from '@reactit/hooks'

const image = '/chameleon.jpg'

export function App() {
    const task = useQuery(async () => {
        const it = new ImageTransformer()
        // it.background = 'red'
        it.resize(400, 400)
        it.saturate(200)
        // it.blur(4)
        it.rotate(45)
        const img = await loadImage(image)
        return await it.transform(img)
    }, [])

    return (
        <div className='flex flex-col gap-8 p-4'>
            <div className='grid grid-cols-2 gap-4'>
                <img className='rounded-lg bg-gray-300' src={image} alt='Original' />
                <img className='rounded-lg bg-gray-300' src={task.result} alt='Transformed' />
            </div>
            <div>
                {task.isLoading && 'Loading...'}
                {task.isFailed && (task.error?.message ?? 'Failed')}
                {task.isSucceed && 'Ok'}
            </div>
        </div>
    )
}
