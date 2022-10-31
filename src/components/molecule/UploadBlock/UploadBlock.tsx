import { forwardRef } from 'react'
import classNames from 'classnames'

type Props = React.PropsWithoutRef<JSX.IntrinsicElements['button']> & { isDragging?: boolean }

export const UploadBlock = forwardRef<HTMLButtonElement, Props>((props, ref) => {
  return (
    <div className="card p-4">
      <button
        className={classNames(
          'border-4 border-dashed rounded-lg px-8 py-8 text-center text-subtitle-color w-full transition-colors',
          props.isDragging ? 'border-primary-color' : 'border-base-color ',
          props.className,
        )}
        ref={ref}
        {...props}
      >
        파일을 이곳으로 끌어오거나 클릭해서 불러올 수 있어요
      </button>
    </div>
  )
})

UploadBlock.displayName = 'UploadBlock'
