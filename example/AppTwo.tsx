import React, { useState } from 'react'
import { Trash2Icon } from 'lucide-react'
import { Button } from './ui/Button.tsx'
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from './ui/Select.tsx'

const modes = ['demo', 'resize', 'rotate', 'flip', 'scale', 'translate', 'effects']

export function AppTwo() {
    const [mode, setMode] = useState<(typeof modes)[number]>(modes[0])

    return (
        <div>
            <div className='flex gap-8 p-4'>
                <Button>Click Me</Button>
                <Button variant='outline'>Outline</Button>
                <Button variant='destructive'>
                    <Trash2Icon />
                    Destructive
                </Button>
                <Button variant='destructive' size='icon'>
                    <Trash2Icon />
                </Button>
            </div>
            <div className='flex gap-8 p-4'>
                <Select open={true}>
                    <SelectTrigger className='w-[180px]'>
                        <SelectValue placeholder='Select a fruit' />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel>Fruits</SelectLabel>
                            <SelectItem value='apple'>Apple</SelectItem>
                            <SelectItem value='banana'>Banana</SelectItem>
                            <SelectItem value='blueberry'>Blueberry</SelectItem>
                            <SelectItem value='grapes'>Grapes</SelectItem>
                            <SelectItem value='pineapple'>Pineapple</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>
        </div>
    )
}
