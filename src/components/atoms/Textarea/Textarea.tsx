import { forwardRef } from 'react'
import classNames from 'classnames'
import { FormBlock, FormBlockProps, formBlockPropsRemover } from '../FormBlock/FormBlock'

type Props = React.PropsWithoutRef<JSX.IntrinsicElements['textarea']> & FormBlockProps

export const Textarea = forwardRef<HTMLTextAreaElement, Props>(({ className, ...props }, ref) => {
  const inputProps = formBlockPropsRemover(props)
  return (
    <FormBlock {...props}>
      <textarea
        ref={ref}
        {...inputProps}
        className={classNames(
          'block px-4 py-2 rounded-lg border-base-light border focus:outline-none focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50',
          'dark:bg-zinc-800/60 dark:border-base-dark dark:text-white',
          className,
        )}
      />
    </FormBlock>
  )
})

Textarea.displayName = 'Input'
