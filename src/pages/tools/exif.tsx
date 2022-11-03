/* eslint-disable @next/next/no-img-element */
import { useCallback, useState } from 'react'
import Dropzone, { DropEvent } from 'react-dropzone'
import { NextPage } from 'next'

import { Button } from '~/components/atoms'
import { UploadBlock } from '~/components/molecule'
import { MainTemplate } from '~/components/template'
import { fileGetterWIthExif, FileGetterWithExifResult } from '~/utils/exif'

const ExifViewer: NextPage = () => {
  const [images, setImages] = useState<FileGetterWithExifResult[]>([])

  const onImageRemoveAll = useCallback(() => {
    setImages([])
  }, [])

  const onImageRemove = useCallback((index: number) => {
    setImages((prev) => {
      const cloned = [...prev]
      cloned.splice(index, 1)
      return cloned
    })
  }, [])

  return (
    <MainTemplate
      title="EXIF 태그 뷰어"
      description="AI로 생성된 이미지의 메타데이터 정보를 확인합니다"
      container
      tiny
    >
      <Dropzone
        onDrop={(acceptedFiles) => {
          setImages((prev) => [
            ...prev,
            ...(acceptedFiles as unknown as FileGetterWithExifResult[]),
          ])
        }}
        getFilesFromEvent={(event: DropEvent) => fileGetterWIthExif(event)}
        maxSize={10000000}
        maxFiles={40}
        accept={{
          'image/*': ['.png', '.jpeg', '.jpg'],
        }}
      >
        {({ getRootProps, getInputProps, isDragActive }) => (
          <UploadBlock {...getRootProps()} inputProps={getInputProps()} isDragging={isDragActive} />
        )}
      </Dropzone>

      <div className="flex justify-between items-center mt-4 mb-2">
        <div className="text-xl text-title-color">파일목록</div>
        <Button onClick={onImageRemoveAll}>전체 삭제</Button>
      </div>
      <div className="flex gap-y-4 flex-col">
        {images.map((image, index) => (
          <div key={index} className="card p-4 flex flex-col sm:flex-row items-center gap-x-2">
            <div className="">
              <img src={image.dataURL} alt="" className="w-48 h-auto" />
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
    </MainTemplate>
  )
}

export default ExifViewer
