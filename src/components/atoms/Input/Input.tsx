import { forwardRef } from 'react'
import classNames from 'classnames'

type Props = React.PropsWithoutRef<JSX.IntrinsicElements['input']>

export const Input = forwardRef<HTMLInputElement, Props>(({ className, ...props }, ref) => {
  return (
    <input
      ref={ref}
      {...props}
      className={classNames(
        'block px-4 py-2 rounded-lg border-base-light border focus:outline-none focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50 w-72',
        'dark:bg-zinc-700 dark:border-base-dark dark:text-white',
        className,
      )}
    />
  )
})

Input.displayName = 'Input'
