import { useState } from 'react'
import ImageUploading, { ImageListType } from 'react-images-uploading'

import { UploadBlock } from '~/components/molecule'
import { MainTemplate } from '~/components/template'

const maxNumber = 15

const NewImage = () => {
  const [images, setImages] = useState<ImageListType & { info: ImageData }[]>([])

  const onChange = async (imageList: ImageListType) => {}

  return (
    <MainTemplate
      title="이미지 업로드"
      description="갤러리에 이미지를 업로드합니다"
      container
      pageBack={{ label: '갤러리', to: '/gallery' }}
      tiny
    >
      <ImageUploading value={images} onChange={onChange}>
        {({ imageList, onImageUpload, onImageRemoveAll, onImageRemove, isDragging, dragProps }) => (
          <UploadBlock isDragging={isDragging} {...dragProps} />
        )}
      </ImageUploading>
    </MainTemplate>
  )
}

export default NewImage
