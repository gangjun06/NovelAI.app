/* eslint-disable @next/next/no-img-element */
import { useState } from 'react'
import ImageUploading, { ImageListType } from 'react-images-uploading'
import { NextPage } from 'next'
import classNames from 'classnames'

import { MainTemplate } from '~/components/template'
import { Button } from '~/components/atoms'

const ExifViewer: NextPage = () => {
  const [images, setImages] = useState([])
  const maxNumber = 69

  const onChange = (imageList: ImageListType, addUpdateIndex: number[] | undefined) => {
    // data for submit
    console.log(imageList, addUpdateIndex)
    setImages(imageList as never[])
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
            onImageUpdate,
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
              {imageList.map((image, index) => (
                <div key={index} className="card flex gap-x-2">
                  <div>
                    <img src={image['data_url']} alt="" width="200" />
                    <div className="image-item__btn-wrapper flex gap-x-2 mt-2 w-full">
                      <Button onClick={() => onImageUpdate(index)}>업데이트</Button>
                      <Button onClick={() => onImageRemove(index)}>삭제</Button>
                    </div>
                  </div>
                  <div>
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
                        <tr>
                          <td className="p-2 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="font-medium text-subtitle-color">프롬프트</div>
                            </div>
                          </td>
                          <td className="p-2 whitespace-nowrap">
                            <div className="text-left">Lorem ipsum</div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ImageUploading>
      </div>
    </MainTemplate>
  )
}

export default ExifViewer
