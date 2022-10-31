/* eslint-disable @next/next/no-img-element */
import { useState } from 'react'
import { Control, Controller, useFieldArray, useForm, UseFormWatch } from 'react-hook-form'
import ImageUploading, { ImageListType, ImageType } from 'react-images-uploading'
import { useSession } from 'next-auth/react'
import { InformationCircleIcon, PencilIcon } from '@heroicons/react/24/outline'
import { Software } from '@prisma/client'
import { z } from 'zod'

import { Button, FormBlock, Input, TabSelect, Textarea } from '~/components/atoms'
import { Form, UploadBlock, UseFormRegister } from '~/components/molecule'
import { MainTemplate } from '~/components/template'
import { galleryPostBodyData, galleryPostBodyValidator } from '~/types/gallery'
import { ImageInfo } from '~/types/image'
import { replaceText } from '~/utils'

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
      <Form
        schema={galleryPostBodyValidator}
        onSubmit={(data) => {
          console.log('ON SUBMIT')
          console.log(data)
        }}
      >
        {({ registerForm, control, watch }) => (
          <>
            <Content register={registerForm} control={control} watch={watch} />
            <div className="flex justify-end">
              <Button variant="primary" type="submit">
                업로드
              </Button>
            </div>
          </>
        )}
      </Form>
    </MainTemplate>
  )
}

const Content = ({
  control,
  watch,
}: {
  control: Control<z.infer<typeof galleryPostBodyValidator>>
  watch: UseFormWatch<z.infer<typeof galleryPostBodyValidator>>
  register: UseFormRegister<z.infer<typeof galleryPostBodyValidator>>
}) => {
  const { fields, append, replace, prepend, remove, swap, move, insert } = useFieldArray({
    control,
    name: 'list',
  })
  const [images, setImages] = useState<(ImageType & { info: ImageInfo })[]>([])

  const uploadEach = watch('uploadEach')

  const onChange = async (imageList: ImageListType) => {
    const list = await onChangeImage(imageList)
    setImages(list)
    replace(
      list.map(({ info }) => {
        return {
          imageSoftware: info.program === 'novelAI' ? Software.NOVEL_AI : Software.WEB_UI,
          imagePrompt: info.prompt,
          imageUCPrompt: info.negativePrompt,
          imageSteps: info.steps,
          imageScale: info.scale,
          imageStrength: info.strength,
          imageNoise: info.noise,
          imageSeed: info.seed,
          imageSampler: info.sampler,
          imageWidth: info.width,
          imageHeight: info.height,
          imageClipSkip: info.clipSkip,
          imageModelHash: info.modelHash,
          imageSource: (info as any).source ?? '',
        }
      }),
    )
  }

  return (
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
          <Controller
            control={control}
            name="uploadEach"
            defaultValue={false}
            render={({ field: { value, onChange } }) => (
              <TabSelect
                list={[
                  { label: '묶어서 업로드', value: false },
                  { label: '각각 업로드', value: true },
                ]}
                onChange={onChange}
                selected={value}
              />
            )}
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
                      {/* <span className="font-bold bg-black/50 p-2 rounded h-fit">
                        {`${image.info.seed}`}
                      </span> */}
                      {/* <span className="font-bold bg-black/50 p-2 rounded h-fit">
                        <PencilIcon className="w-5 h-5" />
                      </span> */}
                      <span className="font-bold bg-black/50 p-2 rounded h-fit">
                        <InformationCircleIcon className="w-5 h-5" />
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
  )
}

export default NewImage
