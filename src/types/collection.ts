import { Collection } from '@prisma/client'
import { z } from 'zod'

export interface MeCollectionsGetRes {
  list: Pick<Collection, 'id' | 'title'>[]
}

export const collectionPostValidator = z.object({
  name: z.string().max(50).min(1),
})
