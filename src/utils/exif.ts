/* eslint-disable @typescript-eslint/ban-ts-comment */
import { DropEvent } from 'react-dropzone'
import toast from 'react-hot-toast'
import Exifr from 'exifr'
import { z } from 'zod'

import { galleryUploadPostData } from '~/types/gallery'

export type ParseExifErrorName = 'filetype' | 'nodata' | 'format'

export class ParseExifError extends Error {
  name: ParseExifErrorName

  constructor(name: ParseExifErrorName, message?: string | undefined) {
    super(message)
    this.name = name
  }
}

export type FileGetterWithExifResult = File & {
  info: z.infer<typeof galleryUploadPostData>
  dataURL: string
}

export const fileGetterWIthExif = async (
  event: DropEvent | any,
): Promise<FileGetterWithExifResult[]> => {
  let fileList: File[] | FileList

  if (event.dataTransfer) {
    fileList = event.dataTransfer.files
  } else if ((event as unknown as any).target) {
    fileList = event.target.files as FileList
  } else {
    fileList = await Promise.all(
      (event as unknown as FileSystemFileHandle[]).map(async (item) => await item.getFile()),
    )
  }

  if (!fileList || !fileList.length) return []

  const parsed = await Promise.allSettled(
    new Array(fileList.length).fill({}).map(
      (_, index) =>
        new Promise((resolve, reject) => {
          let file: FileGetterWithExifResult | null = null
          if (typeof (fileList as FileList).item === 'function') {
            file = (fileList as FileList).item(index) as FileGetterWithExifResult
          } else {
            file = (fileList[index] as FileGetterWithExifResult) ?? null
          }

          if (!file) return reject('error')

          const parse = async (dataURL: string) => {
            try {
              if (
                file!.type !== 'image/png' &&
                file!.type !== 'image/jpeg' &&
                file!.type !== 'image/jpg'
              )
                throw new ParseExifError('filetype')

              Object.defineProperty(file, 'dataURL', {
                value: dataURL,
              })

              const imageData = await Exifr.parse(dataURL, {})

              if (!imageData) return reject(new ParseExifError('nodata'))

              if (imageData.Comment) {
                const decoded = JSON.parse(imageData.Comment)
                const info: z.infer<typeof galleryUploadPostData> = {
                  imageSoftware: 'NOVEL_AI',
                  imageWidth: imageData.ImageWidth,
                  imageHeight: imageData.ImageHeight,
                  imagePrompt: imageData.Description,
                  imageUCPrompt: decoded.uc,
                  imageNoise: decoded.noise,
                  imageSampler: decoded.sampler,
                  imageScale: decoded.scale,
                  imageSeed: decoded.seed,
                  imageSteps: decoded.steps,
                  imageStrength: decoded.strength,
                  imageSource: imageData.Source,
                }
                Object.defineProperty(file, 'info', {
                  value: info,
                })
                return resolve(file)
              }

              if (!imageData.parameters) return reject(new ParseExifError('format'))

              const splited = imageData.parameters.split('\n')
              if (splited.length !== 3) return reject(new ParseExifError('format'))
              const info: z.infer<typeof galleryUploadPostData> = {} as never
              info.imageSoftware = 'WEB_UI'
              info.imagePrompt = splited[0]
              info.imageWidth = imageData.ImageWidth
              info.imageHeight = imageData.ImageHeight
              info.imageUCPrompt = splited[1].replace('Negative prompt: ', '')
              const splited2 = splited[2].split(', ') as string[]
              for (const item of splited2) {
                if (item.startsWith('Steps: ')) {
                  info.imageSteps = parseInt(item.replace('Steps: ', ''))
                } else if (item.startsWith('Sampler: ')) {
                  info.imageSampler = item.replace('Sampler: ', '')
                } else if (item.startsWith('CFG scale: ')) {
                  info.imageScale = parseInt(item.replace('CFG scale: ', ''))
                } else if (item.startsWith('Seed: ')) {
                  info.imageSeed = parseInt(item.replace('Seed: ', ''))
                } else if (item.startsWith('Model hash: ')) {
                  info.imageModelHash = item.replace('Model hash: ', '')
                } else if (item.startsWith('Clip skip: ')) {
                  info.imageClipSkip = parseInt(item.replace('Clip skip: ', ''))
                }
              }

              file!.info = info
              return resolve(file)
            } catch (e) {
              reject(e)
            }
          }

          if (!file.dataURL) {
            const reader = new FileReader()
            reader.onabort = () => reject('file reading was aborted')
            reader.onerror = () => reject('file reading has failed')
            reader.onload = () => parse(reader.result as string)

            reader.readAsDataURL(file)
          } else {
            parse(file.dataURL)
          }
        }),
    ),
  )

  const result: FileGetterWithExifResult[] = []
  const errors = { filetype: 0, format: 0, nodata: 0, unknown: 0 }

  parsed.forEach((data) => {
    if (data.status === 'rejected') {
      if (data.reason instanceof ParseExifError) {
        errors[data.reason.name]++
        return
      }
      errors['unknown']++
      return
    }
    result.push(data.value as FileGetterWithExifResult)
  })

  if (result.length !== parsed.length) {
    const { filetype, format, nodata, unknown } = errors
    if (filetype || format || nodata || unknown) {
      if (result.length + 1 === parsed.length) {
        toast.error(
          filetype
            ? 'png, jpg 포멧의 파일만 업로드 가능합니다'
            : format
            ? '파일에서 태그를 분석할 수 없습니다'
            : nodata
            ? '파일에 exif태그가 존재하지 않습니다'
            : '알 수 없는 에러가 발생하였습니다',
        )
      } else {
        const failStrArr = [
          filetype ? `확장자: ${filetype}` : null,
          format || nodata ? `데이터: ${format + nodata}` : null,
          unknown ? `알 수 없음: ${unknown}` : null,
        ]

        toast.error(`성공: ${result.length}, 실패: [${failStrArr.filter((d) => d).join(', ')}]`)
      }
    } else {
      toast.success(`${result.length}개의 이미지를 성공적으로 불러왔어요`)
    }
  }

  return result
}

export const dataURLtoBlob = (dataurl: string) => {
  const arr = dataurl.split(',')
  const mime = (arr[0].match(/:(.*?);/) ?? ['', ''])[1]
  const bstr = Buffer.from(arr[1], 'base64').toString('base64')
  let n = bstr.length
  const u8arr = new Uint8Array(n)
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  return new Blob([u8arr], { type: mime })
}
