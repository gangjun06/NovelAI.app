import { forwardRef } from 'react'

export interface CheckboxProps extends React.PropsWithoutRef<JSX.IntrinsicElements['input']> {
  label: React.ReactNode
  outerProps?: React.PropsWithoutRef<JSX.IntrinsicElements['div']>
  labelProps?: React.ComponentPropsWithoutRef<'label'>
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, outerProps, labelProps, id, ...props }, ref) => {
    return (
      <div {...outerProps} className="checkboxWrapper">
        <input {...props} type="checkbox" id={id ?? `check_${props.name}`} ref={ref} />
        <label {...labelProps} htmlFor={id ?? `check_${props.name}`}>
          {label}
        </label>
      </div>
    )
  },
)

Checkbox.displayName = 'Checkbox'
