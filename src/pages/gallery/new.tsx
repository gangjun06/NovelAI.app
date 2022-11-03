/* eslint-disable @next/next/no-img-element */
import { useCallback, useState } from 'react'
import { createPortal } from 'react-dom'
import Dropzone, { DropEvent } from 'react-dropzone'
import { Control, Controller, useFieldArray, UseFormGetValues, UseFormWatch } from 'react-hook-form'
import toast from 'react-hot-toast'
import { InformationCircleIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline'
import { Software } from '@prisma/client'
import axios, { AxiosResponse } from 'axios'
import classNames from 'classnames'
import { atom, useAtom, useAtomValue } from 'jotai'
import { z } from 'zod'

import { galleryUploadImageURL } from '~/assets/urls'
import { Button, Input, TabSelect, Textarea } from '~/components/atoms'
import { Form, Modal, TableModal, UploadBlock, UseFormRegister } from '~/components/molecule'
import { MainTemplate } from '~/components/template'
import { useDisclosure } from '~/hooks/useDisclosure'
import {
  GalleryUploadImagePostRes,
  galleryUploadImagePostValidator,
  galleryUploadPostValidator,
} from '~/types/gallery'
import { delay } from '~/utils'
import { dataURLtoBlob, fileGetterWIthExif, FileGetterWithExifResult } from '~/utils/exif'

const imagesAtom = atom<FileGetterWithExifResult[]>([])

const NewImage = () => {
  const images = useAtomValue(imagesAtom)
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
        schema={galleryUploadPostValidator}
        onSubmit={async (data) => {
          const toastId = toast.loading('이미지 업로드를 요청하고 있어요')
          try {
            const res = await axios.post<
              z.infer<typeof galleryUploadImagePostValidator>,
              AxiosResponse<GalleryUploadImagePostRes>
            >(galleryUploadImageURL, {
              count: data.list.length,
            })

            for (let i = 0; i < res.data.uploadURL.length; i++) {
              toast.loading(`이미지를 업로드하고 있어요 ${1} / ${data.list.length}`, {
                id: toastId,
              })
              const formData = new FormData()
              formData.append('file', dataURLtoBlob(images[i].dataURL))
              axios.post(res.data.uploadURL[i], formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
              })
            }
          } catch (e) {
            console.error(e)
            toast.error('요청을 실패하였어요 :(', { id: toastId })
            return
          }

          toast.loading(`갤러리에 글을 올리고 있어요`, { id: toastId })
          toast.success(`성공적으로 게시글을 올렸어요`, { id: toastId })
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
  control: Control<z.infer<typeof galleryUploadPostValidator>>
  watch: UseFormWatch<z.infer<typeof galleryUploadPostValidator>>
  register: UseFormRegister<z.infer<typeof galleryUploadPostValidator>>
  getValues: UseFormGetValues<z.infer<typeof galleryUploadPostValidator>>
}) => {
  const [images, setImages] = useAtom(imagesAtom)
  const { fields, append, replace, prepend, remove, swap, move, insert } = useFieldArray({
    control,
    name: 'list',
  })

  const [showModal, handleShowModal] = useDisclosure()
  const [modalData, setModalData] = useState<string[][] | null>(null)

  const [showEditModal, setShowEditModal] = useState<number | null>(null)

  const uploadEach = watch('uploadEach')

  const handleShowInfoModal = (index: number) => {
    const { list } = getValues()
    if (list.length <= index) return
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

  const onImageRemoveAll = useCallback(() => {
    console.log('Remove all')
    setImages([])
    replace([])
  }, [replace, setImages])

  const onImageRemove = useCallback(
    (index: number) => {
      setImages((prev) => {
        const cloned = [...prev]
        cloned.splice(index, 1)
        return cloned
      })
      remove(index)
    },
    [remove, setImages],
  )

  const onDrop = useCallback(
    (acceptedFiles: FileGetterWithExifResult[]) => {
      setImages((prev) => [...prev, ...acceptedFiles])
      const list = acceptedFiles.map(({ info }) => info)
      try {
        append(list)
      } catch (e) {
        console.error(e)
      }
    },
    [append, setImages],
  )

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

      <div className="flex flex-col gap-y-4">
        <Dropzone
          onDrop={(d) => onDrop(d as unknown as FileGetterWithExifResult[])}
          getFilesFromEvent={(event: DropEvent) => fileGetterWIthExif(event)}
          maxSize={10000000}
          maxFiles={50}
          accept={{
            'image/*': ['.png', '.jpeg', '.jpg'],
          }}
        >
          {({ getRootProps, getInputProps, isDragActive }) => (
            <UploadBlock
              {...getRootProps()}
              inputProps={getInputProps()}
              isDragging={isDragActive}
            />
          )}
        </Dropzone>
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
          <div className={classNames('flex flex-col gap-y-2')}>
            <Input
              label="제목"
              className="w-full"
              {...register('title')}
              placeholder="(선택) 올라갈 글의 제목을 작성해주세요"
            />
            <Textarea
              label="내용"
              className="w-full"
              {...register('content')}
              placeholder="(선택) 올라갈 이미지들을 설명해주는 내용을 적어주세요 "
            />
          </div>
        )}
        {images.length > 0 && (
          <>
            <div className="flex justify-between items-center">
              <div className="text-xl text-title-color">파일목록</div>
              <Button onClick={onImageRemoveAll} disabled={images.length < 1}>
                전체 삭제
              </Button>
            </div>
          </>
        )}
        <div className="grid grid-cols-2 gap-4">
          {images.map((image, index) => (
            <div
              key={index}
              className="dark:bg-zinc-700/50 dark:border-base-dark dark:text-gray-300 rounded galleryUploadCard relative flex items-center"
            >
              <img src={image.dataURL} alt="" className="w-full h-auto" />
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
                      {image.info.imageSoftware}
                    </span>
                    <span className="font-bold bg-black/50 p-2 rounded h-fit">
                      {`${image.info.imageWidth}x${image.info.imageHeight}`}
                    </span>
                    {(uploadEach || index !== 0) && (
                      <button
                        className="font-bold bg-black/50 p-2 rounded h-fit"
                        onClick={() => handleEditModal(index)}
                        type="button"
                      >
                        <PencilIcon className="w-5 h-5" />
                      </button>
                    )}
                    <button
                      className="font-bold bg-black/50 hover:bg-black/80 p-2 rounded h-fit transition-all"
                      onClick={() => handleShowInfoModal(index)}
                      type="button"
                    >
                      <InformationCircleIcon className="w-5 h-5" />
                    </button>
                    <button
                      className="font-bold bg-black/50 hover:bg-black/80 p-2 rounded h-fit transition-all"
                      onClick={() => onImageRemove(index)}
                      type="button"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
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
  register: UseFormRegister<z.infer<typeof galleryUploadPostValidator>>
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
