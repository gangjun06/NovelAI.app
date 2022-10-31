/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import {
  Control,
  Controller,
  useFieldArray,
  useForm,
  UseFormGetValues,
  UseFormWatch,
} from 'react-hook-form'
import toast from 'react-hot-toast'
import ImageUploading, { ImageListType, ImageType } from 'react-images-uploading'
import { useSession } from 'next-auth/react'
import { InformationCircleIcon, PencilIcon } from '@heroicons/react/24/outline'
import { Software } from '@prisma/client'
import { z } from 'zod'

import { Button, FormBlock, Input, TabSelect, Textarea } from '~/components/atoms'
import { Form, Modal, TableModal, UploadBlock, UseFormRegister } from '~/components/molecule'
import { MainTemplate } from '~/components/template'
import { useDisclosure } from '~/hooks/useDisclosure'
import { galleryPostBodyData, galleryPostBodyValidator } from '~/types/gallery'
import { ImageInfo } from '~/types/image'
import { replaceText } from '~/utils'

import { onChangeImage } from '../tools/exif'

const maxNumber = 15

const NewImage = () => {
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
        onInvalid={(errors) => {
          console.log(errors)
          toast.error('입력한 내용을 다시 확인해주세요')
        }}
        initialValues={{ list: [] }}
      >
        {({ registerForm, control, watch, getValues }) => (
          <>
            <Content
              register={registerForm}
              control={control}
              watch={watch}
              getValues={getValues}
            />
            <div className="flex justify-end gap-x-3">
              <Button variant="primary" type="submit" disabled={watch('list').length < 1}>
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
  getValues,
  register,
}: {
  control: Control<z.infer<typeof galleryPostBodyValidator>>
  watch: UseFormWatch<z.infer<typeof galleryPostBodyValidator>>
  register: UseFormRegister<z.infer<typeof galleryPostBodyValidator>>
  getValues: UseFormGetValues<z.infer<typeof galleryPostBodyValidator>>
}) => {
  const { fields, append, replace, prepend, remove, swap, move, insert } = useFieldArray({
    control,
    name: 'list',
  })
  const [images, setImages] = useState<(ImageType & { info: ImageInfo })[]>([])

  const [showModal, handleShowModal] = useDisclosure()
  const [modalData, setModalData] = useState<string[][] | null>(null)

  const [showEditModal, setShowEditModal] = useState<number | null>(null)

  const uploadEach = watch('uploadEach')

  const listData = watch('list')
  useEffect(() => {
    console.log(listData)
  }, [listData])

  const onChange = async (imageList: ImageListType) => {
    const list = await onChangeImage(imageList)
    console.log(list)
    setImages(list)
    replace(
      list.map(({ info }) => {
        return {
          title: 'Lorem ipsum ...',
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

  const handleShowInfoModal = (index: number) => {
    const { list } = getValues()
    if (list.length < index) return
    const target = list[index]
    setModalData([
      ['소프트웨어', target.imageSoftware === Software.NOVEL_AI ? 'NovelAI' : 'WebUI'],
      ['프롬프트', target.imagePrompt],
      ['부정 프롬프트', target.imageUCPrompt],
      ['크기', `${target.imageWidth ?? '?'}x${target.imageHeight ?? '?'}`],
      ['Steps', (target.imageSteps ?? 'X').toString()],
      ['Scale', (target.imageScale ?? 'X').toString()],
      ['Strength', (target.imageStrength ?? 'X').toString()],
      ['Noise', (target.imageNoise ?? 'X').toString()],
      ['Seed', (target.imageSeed ?? 'X').toString()],
      ['Sampler', target.imageSampler ?? 'X'],
      ['ClipSkip', (target.imageClipSkip ?? 'X').toString()],
      ['ModelHash', target.imageModelHash ?? 'X'],
      ['Source', target.imageSource ?? 'X'],
    ])
    handleShowModal.open()
  }

  const handleEditModal = (index: number) => {
    setShowEditModal(index)
  }

  return (
    <>
      {createPortal(
        <>
          <TableModal
            title="그림 정보"
            show={showModal}
            onClose={handleShowModal.close}
            headData={['이름', '내용']}
            bodyData={modalData ?? []}
          />
          <EditModal
            show={showEditModal !== null}
            onClose={() => setShowEditModal(null)}
            index={showEditModal}
            register={register}
          />
        </>,
        document.body,
      )}
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
                    { label: '개별 업로드', value: true },
                  ]}
                  onChange={onChange}
                  selected={value}
                />
              )}
            />
            <div className="text-description-color">
              {!uploadEach
                ? '하나의 글에 여러개의 이미지가 올라가요. 같은 프롬프트에 다른 시드를 사용한 이미지를 올릴때 사용할 수 있어요'
                : '여러개의 이미지가 개별 글로 올라가요. 관련이 없는 다양한 이미지를 한번에 올릴때 유용해요.'}
            </div>

            {!uploadEach && (
              <div className="flex flex-col gap-y-2">
                <Input label="제목" className="w-full" {...register('title')} />
                <Textarea label="내용" className="w-full" {...register('content')} />
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
                        <>
                          <span className="bg-primary-300/30 p-2">대표 이미지</span>
                        </>
                      )}
                      <span className="ml-2 text-ellipsis w-full top-10 show-when-hover">
                        {!uploadEach && index === 0 ? watch('title') : watch(`list.${index}.title`)}
                      </span>
                      <div className="flex justify-end flex-row gap-2 absolute bottom-0 right-0 w-full">
                        <span className="font-bold bg-black/50 p-2 rounded h-fit">
                          {image.info.program}
                        </span>
                        <span className="font-bold bg-black/50 p-2 rounded h-fit">
                          {`${image.info.width}x${image.info.height}`}
                        </span>
                        {(uploadEach || index !== 0) && (
                          <button
                            className="font-bold bg-black/50 p-2 rounded h-fit"
                            onClick={() => handleEditModal(index)}
                          >
                            <PencilIcon className="w-5 h-5" />
                          </button>
                        )}
                        <button
                          className="font-bold bg-black/50 hover:bg-black/80 p-2 rounded h-fit transition-all"
                          onClick={() => handleShowInfoModal(index)}
                        >
                          <InformationCircleIcon className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </ImageUploading>
    </>
  )
}

const EditModal = ({
  show,
  onClose,
  register,
  index,
}: {
  show: boolean
  onClose: () => void
  register: UseFormRegister<z.infer<typeof galleryPostBodyValidator>>
  index: number | null
}) => {
  return (
    <Modal show={show} onClose={onClose} title="이미지 제목 수정" closeBtn>
      {index !== null && (
        <>
          <Input label="제목" {...register(`list.${index}.title`)} />
          <Textarea label="내용" {...register(`list.${index}.content`)} />
        </>
      )}
    </Modal>
  )
}

export default NewImage
