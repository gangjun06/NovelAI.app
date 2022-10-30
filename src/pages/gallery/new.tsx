/* eslint-disable @next/next/no-img-element */
import { useState } from 'react'
import ImageUploading, { ImageListType, ImageType } from 'react-images-uploading'
import { useSession } from 'next-auth/react'

import { FormBlock, TabSelect, Textarea, Button, Input } from '~/components/atoms'
import { UploadBlock } from '~/components/molecule'
import { MainTemplate } from '~/components/template'
import { ImageInfo } from '~/types/image'

import { onChangeImage } from '../tools/exif'

const maxNumber = 15

const NewImage = () => {
  const [images, setImages] = useState<(ImageType & { info: ImageInfo })[]>([])
  const [uploadEach, setUploadEach] = useState(false)

  const onChange = async (imageList: ImageListType) => {
    setImages(await onChangeImage(imageList))
  }

  return (
    <MainTemplate
      title="이미지 업로드"
      description="갤러리에 이미지를 업로드합니다"
      container
      pageBack={{ label: '갤러리', to: '/gallery' }}
      tiny
      requireAuth
    >
      <ImageUploading
        multiple
        value={images}
        onChange={onChange}
        maxNumber={maxNumber}
        dataURLKey="data_url"
      >
        {({ imageList, onImageUpload, onImageRemoveAll, onImageRemove, isDragging, dragProps }) => (
          <div className="flex flex-col gap-y-4">
            <UploadBlock isDragging={isDragging} onClick={onImageUpload} {...dragProps} />
            <TabSelect
              list={[
                { label: '묶어서 업로드', value: false },
                { label: '각각 업로드', value: true },
              ]}
              onChange={setUploadEach}
              selected={uploadEach}
            />
            {!uploadEach && (
              <div className="flex flex-col gap-y-2">
                <Input label="제목" className="w-full" />
                  <Textarea label="내용" className="w-full" />
              </div>
            )}
            <div className="grid grid-cols-2 gap-4">
              {(imageList as unknown as (ImageType & { info: ImageInfo })[]).map((image, index) => (
                <div
                  key={index}
                  className="dark:bg-zinc-700/50 dark:border-base-dark dark:text-gray-300 rounded galleryUploadCard relative flex items-center"
                >
                  <img src={image['data_url']} alt="" className="w-full h-auto" />
                  <div className="overlay absolute w-full h-full top-0 left-0 transition-colors p-4">
                    <div className="relative h-full w-full">
                      {!uploadEach && index === 0 && (
                        <span className="bg-primary-300/30 p-2">대표 이미지</span>
                      )}
                      <div className="flex justify-end flex-row gap-2 absolute bottom-0 right-0 w-full">
                        <span className="font-bold bg-black/50 p-2 rounded h-fit">
                          {image.info.program}
                        </span>
                        <span className="font-bold bg-black/50 p-2 rounded h-fit">
                          {`${image.info.width}x${image.info.height}`}
                        </span>
                        <span className="font-bold bg-black/50 p-2 rounded h-fit">
                          {`${image.info.seed}`}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </ImageUploading>
      <div className="mt-2 flex justify-end">
        <Button type="submit" variant="primary" disabled={images.length < 1}>
          업로드
        </Button>
      </div>
    </MainTemplate>
  )
}

export default NewImage
