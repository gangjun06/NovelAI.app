import { Swiper, SwiperSlide } from 'swiper/react'

import { getMiddlewares, handler } from '~/lib/api'
import prisma from '~/lib/prisma'
import { GalleryGetRes, galleryGetValidator, galleryUploadPostValidator } from '~/types/gallery'

export default handler().get(
  ...getMiddlewares({ auth: null, query: galleryGetValidator }),
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
      where: {
        rootId: {
          equals: null,
        },
      },
      select: {
        id: true,
        title: true,
        imageUrl: true,
        imageWidth: true,
        imageHeight: true,
        imageSoftware: true,
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
