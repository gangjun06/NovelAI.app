import { forwardRef, useMemo, useState } from 'react'
import classNames from 'classnames'

import { FormBlock, FormBlockProps, formBlockPropsRemover } from '~/components/atoms'

interface Props extends React.PropsWithoutRef<JSX.IntrinsicElements['textarea']>, FormBlockProps {
  type?: 'text' | 'password' | 'email' | 'number'
}

export const Textarea = forwardRef<HTMLTextAreaElement, Props>(
  ({ className, maxLength: max, ...props }, ref) => {
    const [value, setValue] = useState('')
    const inputProps = formBlockPropsRemover(props)

    const labelRight = useMemo(() => {
      if (!max) return <></>
      const maxNum = typeof max === 'number' ? max : parseInt(max)
      const strLen = value.length ?? 0
      if (maxNum && strLen >= maxNum * 0.9) {
        return (
          <div
            className={classNames(strLen > maxNum ? 'text-error-color' : 'text-description-color')}
          >{`${strLen} / ${max}`}</div>
        )
      }
      return <></>
    }, [value, max])

    return (
      <FormBlock {...props} labelRight={labelRight}>
        <textarea
          ref={ref}
          {...inputProps}
          onChange={(e) => {
            if (typeof inputProps.onChange === 'function') inputProps.onChange(e)
            setValue(e.target.value)
          }}
          className={classNames(
            'block px-4 py-2 rounded-lg border',
            'dark:bg-zinc-800/60 dark:text-white',
            props.error ? 'border-error-color error-ring' : 'border-base-color default-ring',
            className,
          )}
        />
      </FormBlock>
    )
  },
)

Textarea.displayName = 'Textarea'
