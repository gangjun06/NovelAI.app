import { getMiddlewares, handler } from '~/lib/api'
import { GalleryGetRes, galleryGetValidator, galleryUploadPostValidator } from '~/types/gallery'
import prisma from '~/lib/prisma'

export default handler().get(
  ...getMiddlewares({ auth: null, query: galleryGetValidator, res: {} as GalleryGetRes }),
  async (req, res) => {
    const { cursor, limit } = req.queryData
    console.log(cursor, limit)
    const result = await prisma.image.findMany({
      ...(cursor
        ? {
            cursor: {
              id: cursor,
            },
            skip: 1,
          }
        : {}),
      take: limit,
      include: {
        images: true,
      },
      where: {
        rootId: {
          equals: null,
        },
      },
    })
    res.json({ images: result })
    return
  },
)
