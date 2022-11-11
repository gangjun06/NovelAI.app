import { z } from 'zod'

import { getMiddlewares, handler } from '~/lib/api'
import { galleryCollectionPostValidator } from '~/types/gallery'

export default handler().post(
  ...getMiddlewares({
    auth: 'USER',
    schema: galleryCollectionPostValidator,
    query: z.object({ id: z.string().cuid() }),
  }),
  async (req, res) => {
    const { id: imageId } = req.queryData
    const { collectionId, remove } = req.data

    if (remove) {
      await prisma?.collection.update({
        where: {
          id: collectionId,
        },
        data: {
          images: {
            disconnect: {
              id: imageId,
            },
          },
        },
      })
      return res.json({})
    }

    await prisma?.collection.update({
      where: {
        id: collectionId,
      },
      data: {
        images: {
          connect: {
            id: imageId,
          },
        },
      },
    })
    res.json({})
  },
)
