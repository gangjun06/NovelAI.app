import { Software } from '@prisma/client'
import { z } from 'zod'

import { customErrorMap } from '~/lib/form'

const titleValidator = z.string().min(10).max(150)
const contentValidator = z.string().max(10000).optional()

export const galleryPostBodyData = z.object({
  title: titleValidator,
  content: contentValidator,
  imageSoftware: z.nativeEnum(Software),
  imagePrompt: z.string().max(10000),
  imageUCPrompt: z.string().max(10000),
  imageSteps: z.number(),
  imageScale: z.number(),
  imageStrength: z.number(),
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

export const galleryPostBodyValidator = z
  .object({
    title: titleValidator,
    content: contentValidator,
    uploadEach: z.boolean(),
    list: z.array(galleryPostBodyData).min(1),
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
    if (list.length > 100) {
      ctx.addIssue({
        path: ['list'],
        code: 'custom',
        message: '최대 100개까지만 한번에 올릴 수 있어요',
      })
      return {}
    }
  })

z.setErrorMap(customErrorMap)
