import { Software } from '@prisma/client'
import { z } from 'zod'

import { customErrorMap } from '~/lib/form'

const titleValidator = z.string().max(150).optional()
const contentValidator = z.string().max(2500).optional()

export const galleryUploadImagePostValidator = z.object({
  count: z.number().min(1).max(50),
})
export interface GalleryUploadImagePostRes {
  token: string
  uploadURL: string[]
}

export const galleryUploadPostData = z.object({
  title: titleValidator,
  content: contentValidator,
  imageSoftware: z.nativeEnum(Software),
  imagePrompt: z.string().max(5000),
  imageUCPrompt: z.string().max(5000),
  imageSteps: z.number(),
  imageScale: z.number(),
  imageStrength: z.number().optional(),
  imageNoise: z.number().positive().optional(),
  imageSeed: z.number().int().positive(),
  imageSampler: z.string(),
  imageWidth: z.number().int().positive(),
  imageHeight: z.number().int().positive(),
  imageClipSkip: z.number().int().positive().optional(),
  imageModelHash: z.string().max(30).optional(),
  imageSource: z.string().max(100).optional(),
  // other:       z.object(})
})
export const galleryUploadPostValidator = z
  .object({
    title: titleValidator,
    content: contentValidator,
    uploadEach: z.boolean(),
    list: z.array(galleryUploadPostData).nonempty(),
  })
  .superRefine(({ list, uploadEach }, ctx) => {
    if (uploadEach && list.length > 2) {
      ctx.addIssue({
        path: ['list'],
        code: 'custom',
        message: '최대 20개까지만 묶어서 올릴 수 있어요',
      })
      return
    }
    if (list.length > 50) {
      ctx.addIssue({
        path: ['list'],
        code: 'custom',
        message: '최대 50개까지만 한번에 올릴 수 있어요',
      })
      return {}
    }
  })

z.setErrorMap(customErrorMap)
