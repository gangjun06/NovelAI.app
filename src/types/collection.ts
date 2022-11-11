import { Collection, CollectionVisibility } from '@prisma/client'
import { z } from 'zod'

import { customErrorMap } from '~/lib/form'

export interface MeCollectionsGetRes {
  list: Pick<Collection, 'id' | 'name'>[]
}

export const collectionPostValidator = z.object({
  name: z.string().max(50).min(1),
  description: z.string().max(2000).optional(),
  status: z.nativeEnum(CollectionVisibility).optional().default(CollectionVisibility.PUBLIC),
})

z.setErrorMap(customErrorMap)
