/* eslint-disable @next/next/no-img-element */
import { useState } from 'react'
import toast from 'react-hot-toast'
import ImageUploading, { ImageListType } from 'react-images-uploading'
import { NextPage } from 'next'

import { Button } from '~/components/atoms'
import { UploadBlock } from '~/components/molecule'
import { MainTemplate } from '~/components/template'
import { ImageInfo } from '~/types/image'
import { parseExif, ParseExifError, ParseExifErrorName } from '~/utils/exif'

export const onChangeImage = async (imageList: ImageListType) => {
  const errors: { [key in ParseExifErrorName]?: number } = {}
  let [unknownError, success, error] = [0, 0, 0]

  const parsed: ImageListType & { info: ImageInfo }[] = (
    await Promise.all(
      imageList.map(async (data) => {
        if (data.info) return data
        try {
          const info = await parseExif(data)
          success += 1
          return { ...data, info }
        } catch (e) {
          error += 1
          if (e instanceof ParseExifError) {
            errors[e.name] = typeof errors[e.name] === 'number' ? (errors[e.name] as number) + 1 : 1
            return null
          }
          unknownError += 1
        }
      }),
    )
  ).filter((data) => data) as never[]

  if (error + success !== 0) {
    const { filetype, format, nodata } = errors
    if (filetype || format || nodata || unknownError) {
      if (error === 1) {
        toast.error(
          filetype
            ? 'png, jpg 포멧의 파일만 업로드 가능합니다'
            : format
            ? '파일에서 태그를 분석할 수 없습니다'
            : nodata
            ? '파일에 exif태그가 존재하지 않습니다'
            : '알 수 없는 에러가 발생하였습니다',
        )
        return parsed
      }
      toast.error(
        `성공: ${success}, 실패: [확장자: ${format ?? 0}, 데이터: ${
          (format ?? 0) + (nodata ?? 0)
        }, 알 수 없음: ${unknownError ?? 0}]`,
      )
    } else {
      toast.success(`${success}개의 이미지를 성공적으로 불러왔습니다`)
    }
  }

  return parsed
}

const ExifViewer: NextPage = () => {
  const [images, setImages] = useState<ImageListType & { info: ImageInfo }[]>([])

  const onChange = async (imageList: ImageListType) => {
    setImages(await onChangeImage(imageList))
  }

  return (
    <MainTemplate
      title="EXIF 태그 뷰어"
      description="AI로 생성된 이미지의 메타데이터 정보를 확인합니다"
      container
      tiny
    >
      <ImageUploading
        multiple
        value={images}
        onChange={onChange}
        maxNumber={30}
        dataURLKey="data_url"
      >
        {({ imageList, onImageUpload, onImageRemoveAll, onImageRemove, isDragging, dragProps }) => (
          <div className="upload__image-wrapper">
            <UploadBlock isDragging={isDragging} onClick={onImageUpload} {...dragProps} />
            <div className="flex justify-between items-center mt-4 mb-2">
              <div className="text-xl text-title-color">파일목록</div>
              <Button onClick={onImageRemoveAll}>전체 삭제</Button>
            </div>
            <div className="flex gap-y-4 flex-col">
              {imageList.map((image, index) => (
                <div
                  key={index}
                  className="card p-4 flex flex-col sm:flex-row items-center gap-x-2"
                >
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
                        {Object.entries((image as never as any).info as ImageData).map(([k, v]) => (
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
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </ImageUploading>
    </MainTemplate>
  )
}

export default ExifViewer
