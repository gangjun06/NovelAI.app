import { ImageType } from 'react-images-uploading'
import Exifr from 'exifr'

import { ImageInfo } from '~/types/image'

export type ParseExifErrorName = 'filetype' | 'nodata' | 'format'

export class ParseExifError extends Error {
  name: ParseExifErrorName

  constructor(name: ParseExifErrorName, message?: string | undefined) {
    super(message)
    this.name = name
  }
}

export const parseExif = async (data: ImageType): Promise<ImageInfo> => {
  if (typeof data['data_url'] !== 'string' || !data.file) throw new ParseExifError('nodata')

  const { type } = data.file
  if (type !== 'image/png' && type !== 'image/jpeg' && type !== 'image/jpg')
    throw new ParseExifError('format')

  const imageData = await Exifr.parse(data['data_url'], {})

  if (!imageData) throw new ParseExifError('nodata')

  if (imageData.Comment) {
    const decoded = JSON.parse(imageData.Comment)
    const info: ImageInfo = decoded
    info.program = 'novelAI'
    info.negativePrompt = decoded.uc
    info.prompt = imageData.Description
    info.width = imageData.ImageWidth
    info.height = imageData.ImageHeight
    return info
  }

  if (!imageData.parameters) throw new ParseExifError('format')

  const splited = imageData.parameters.split('\n')
  if (splited.length !== 3) throw new ParseExifError('format')
  const info: ImageInfo = {} as never
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
  return info
}
