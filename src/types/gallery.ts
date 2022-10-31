import { Software } from '@prisma/client'
import { z } from 'zod'

export const galleryPostBodyData = z.object({
  title: z.string().optional(),
  content: z.string().optional(),
  imageSoftware: z.nativeEnum(Software),
  imagePrompt: z.string().max(2000),
  imageUCPrompt: z.string().max(2000),
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

export const galleryPostBodyValidator = z.object({
  title: z.string().optional(),
  content: z.string().optional(),
  uploadEach: z.boolean(),
  list: z.array(galleryPostBodyData),
})
