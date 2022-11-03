import React, { forwardRef } from 'react'
import classNames from 'classnames'

interface Props extends React.PropsWithoutRef<JSX.IntrinsicElements['div']> {
  isDragging?: boolean
  inputProps?: React.PropsWithRef<JSX.IntrinsicElements['input']>
}

export const UploadBlock = forwardRef<HTMLInputElement, Props>(
  ({ isDragging, className, inputProps, ...props }, ref) => {
    return (
      <div className="card p-4">
        <div
          ref={ref}
          {...props}
          className={classNames(
            'border-4 border-dashed rounded-lg px-8 py-8 text-center text-subtitle-color w-full transition-colors',
            isDragging ? 'border-primary-color' : 'border-base-color',
            className,
          )}
        >
          <input style={{ display: 'none' }} {...inputProps} />
          파일을 이곳으로 끌어오거나 클릭해서 불러올 수 있어요
        </div>
      </div>
    )
  },
)

UploadBlock.displayName = 'UploadBlock'
