import * as React from 'react'
import { VariantProps, cva } from 'class-variance-authority'
import { cn } from './utils'

const buttonVariants = cva(
    'inline-flex items-center justify-center rounded-lg gap-2 font-medium transition-colors focus-visible:outline-none cursor-pointer focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background [&_svg]:pointer-events-none [&_svg]:size-6 [&_svg]:shrink-0',
    {
        variants: {
            variant: {
                default: 'bg-pink-600 text-zinc-900 hover:bg-pink-700',
                outline: 'border-2 border-pink-600 hover:bg-pink-600/20 text-pink-600',
                destructive: 'bg-rose-600 text-zinc-900 hover:bg-rose-700',
            },
            size: {
                default: 'h-12 py-4 px-6',
                icon: 'size-12',
            },
        },
        defaultVariants: {
            variant: 'default',
            size: 'default',
        },
    }
)

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
        VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant, size, ...props }, ref) => {
    return <button className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
})
Button.displayName = 'Button'

export { Button, buttonVariants }
