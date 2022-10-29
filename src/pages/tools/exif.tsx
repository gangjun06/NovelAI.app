/* eslint-disable @next/next/no-img-element */
import { useState } from 'react'
import toast from 'react-hot-toast'
import ImageUploading, { ImageListType } from 'react-images-uploading'
import { NextPage } from 'next'
import classNames from 'classnames'
import Exifr from 'exifr'

import { Button } from '~/components/atoms'
import { MainTemplate } from '~/components/template'

interface ImageData {
  program: 'novelAI' | 'webUI'
  prompt: string
  negativePrompt: string
  steps: number
  strength: number
  seed: number
  scale: number
  sampler: string
  noise?: number
  clipSkip?: number
  width: number
  height: number
  modelHash: string
}

const ExifViewer: NextPage = () => {
  const [images, setImages] = useState<ImageListType & { info: ImageData }[]>([])
  // const [metadata, setMetadata] = useState<{ [key: string]: ImageData }>({})
  const maxNumber = 69

  const onChange = async (imageList: ImageListType) => {
    const parsed: ImageListType & { info: ImageData }[] = (
      await Promise.all(
        imageList.map(async (data) => {
          if (typeof data['data_url'] !== 'string' || !data.file) return

          const { type } = data.file
          if (type !== 'image/png' && type !== 'image/jpeg' && type !== 'image/jpg') {
            toast.error('png, jpg형태의 파일만 업로드 가능합니다')
            return null
          }

          const imageData = await Exifr.parse(data['data_url'], {})

          if (!imageData) {
            return null
          }

          let info: ImageData = {} as never

          console.log(imageData)

          if (imageData.Comment) {
            const decoded = JSON.parse(imageData.Comment)
            info = decoded
            info.program = 'novelAI'
            info.negativePrompt = decoded.uc
            info.prompt = imageData.Description
            info.width = imageData.ImageWidth
            info.height = imageData.ImageHeight
          } else if (imageData.parameters) {
            const splited = imageData.parameters.split('\n')
            if (splited.length !== 3) return null
            info.program = 'webUI'
            info.prompt = splited[0]
            info.width = imageData.ImageWidth
            info.height = imageData.ImageHeight
            info.negativePrompt = splited[1].replace('Negative prompt: ', '')
            const splited2 = splited[2].split(', ') as string[]
            for (const item of splited2) {
              console.log(item)
              if (item.startsWith('Steps: ')) {
                info.steps = parseInt(item.replace('Steps: ', ''))
              } else if (item.startsWith('Sampler: ')) {
                info.sampler = item.replace('Sampler: ', '')
              } else if (item.startsWith('CFG scale: ')) {
                info.scale = parseInt(item.replace('CFG scale: ', ''))
              } else if (item.startsWith('Seed: ')) {
                info.seed = parseInt(item.replace('Seed: ', ''))
              } else if (item.startsWith('Model hash: ')) {
                info.modelHash = item.replace('Model hash: ', '')
              } else if (item.startsWith('Clip skip: ')) {
                info.clipSkip = parseInt(item.replace('Clip skip: ', ''))
              }
            }
          } else {
            return null
          }

          return {
            ...data,
            info,
          }
        }),
      )
    ).filter((data) => data) as never[]

    setImages(parsed)
  }

  return (
    <MainTemplate
      title="EXIF 태그 뷰어"
      description="AI로 생성된 이미지의 메타데이터 정보를 확인합니다"
      container
    >
      <div className="max-w-4xl mx-auto">
        <ImageUploading
          multiple
          value={images}
          onChange={onChange}
          maxNumber={maxNumber}
          dataURLKey="data_url"
        >
          {({
            imageList,
            onImageUpload,
            onImageRemoveAll,
            onImageRemove,
            isDragging,
            dragProps,
          }) => (
            <div className="upload__image-wrapper">
              <div className="card">
                <button
                  className={classNames(
                    'border-4 border-dashed rounded-lg px-8 py-8 text-center text-subtitle-color w-full transition-colors',
                    isDragging ? 'border-primary-color' : 'border-base-color ',
                  )}
                  onClick={onImageUpload}
                  {...dragProps}
                >
                  이미지을 여기로 드래그 또는 클릭하여 파일을 추가하세요
                </button>
              </div>
              &nbsp;
              <div className="flex justify-between items-center mt-4 mb-2">
                <div className="text-xl text-title-color">파일목록</div>
                <Button onClick={onImageRemoveAll}>전체 삭제</Button>
              </div>
              <div className="flex gap-y-4 flex-col">
                {imageList.map((image, index) => (
                  <div key={index} className="card flex flex-col sm:flex-row items-center gap-x-2">
                    <div className="">
                      <img src={image['data_url']} alt="" className="w-48 h-auto" />
                      <div className="image-item__btn-wrapper mt-2 w-full flex justify-center">
                        <Button onClick={() => onImageRemove(index)}>삭제</Button>
                      </div>
                    </div>
                    <div className="flex w-full">
                      <table className="table-auto w-full">
                        <thead className="text-xs font-semibold uppercase text-subtitle-color">
                          <tr>
                            <th className="p-2 whitespace-nowrap">
                              <div className="font-semibold text-left">이름</div>
                            </th>
                            <th className="p-2 whitespace-nowrap">
                              <div className="font-semibold text-left">내용</div>
                            </th>
                          </tr>
                        </thead>
                        <tbody className="text-sm divide-y divide-gray-100 text-description-color">
                          {Object.entries((image as never as any).info as ImageData).map(
                            ([k, v]) => (
                              <tr key={k}>
                                <td className="p-2 whitespace-nowrap">
                                  <div className="flex items-center">
                                    <div className="font-medium text-subtitle-color">{k}</div>
                                  </div>
                                </td>
                                <td className="p-2 flex flex-wrap">
                                  <div className="text-left text-description-color">{v}</div>
                                </td>
                              </tr>
                            ),
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </ImageUploading>
      </div>
    </MainTemplate>
  )
}

export default ExifViewer
