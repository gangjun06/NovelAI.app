import { ReactNode } from 'react'
import classNames from 'classnames'

export interface FormBlockProps {
  label?: string
  error?: string
  children?: ReactNode
  required?: boolean
  name?: string
  customLabel?: any
}

export const FormBlock = ({
  label,
  children,
  error,
  customLabel: CustomLabel,
  required,
  name,
}: FormBlockProps) => {
  if (!label) return <>{children}</>
  return (
    <div>
      {CustomLabel ? (
        <CustomLabel htmlFor={name} className="text-subtitle-color">
          {label}
        </CustomLabel>
      ) : (
        <label htmlFor={name} className="text-subtitle-color">
          {label}
        </label>
      )}
      <div className={classNames('mt-1.5 mx-0.5 flex flex-col gap-1', error && 'mb-1')}>
        {children}
      </div>
      {error && <div className="text-red-500 dark:text-red-400 text-sm">{error}</div>}
    </div>
  )
}

export const formBlockPropsRemover = <T,>(props: T & Partial<FormBlockProps>) => {
  const {
    label: _label,
    required: _required,
    error: _error,
    children: _children,
    customLabel: _customLabel,
    ...otherProps
  } = props
  return otherProps
}
