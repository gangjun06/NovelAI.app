import { getMiddlewares, handler } from '~/lib/api'
import prisma from '~/lib/prisma'
import { galleryGetValidator } from '~/types/gallery'

export default handler().get(
  ...getMiddlewares({ auth: null, query: galleryGetValidator }),
  async (req, res) => {
    const { cursor, limit, query } = req.queryData
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
      orderBy: {
        createdAt: 'desc',
      },
      where: {
        rootId: {
          equals: null,
        },
        ...(query && {
          tags: {
            hasEvery: query.map((item) => item.replace(/_/g, ' ').toLowerCase()),
          },
        }),
      },
      select: {
        id: true,
        title: true,
        imageUrl: true,
        imageWidth: true,
        imageHeight: true,
        imageSoftware: true,
        createdAt: true,
        images: {
          select: {
            id: true,
            imageUrl: true,
            imageWidth: true,
            imageHeight: true,
          },
        },
        author: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    })
    res.json({ images: result })
    return
  },
)
