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
        이미지을 여기로 드래그 또는 클릭하여 파일을 추가하세요
      </button>
    </div>
  )
})

UploadBlock.displayName = 'UploadBlock'
