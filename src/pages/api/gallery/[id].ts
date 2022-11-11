import { getMiddlewares, handler } from '~/lib/api'
import prisma from '~/lib/prisma'
import { galleryDetailGetValidator } from '~/types/gallery'

export const getGalleryDetail = async (id: string, userId?: string) => {
  const result = await prisma.image.findUniqueOrThrow({
    where: {
      id,
    },
    select: {
      id: true,
      title: true,
      content: true,
      imageSoftware: true,
      imagePrompt: true,
      imageUCPrompt: true,
      imageSteps: true,
      imageScale: true,
      imageStrength: true,
      imageNoise: true,
      imageUrl: true,
      imageSeed: true,
      imageSampler: true,
      imageWidth: true,
      imageHeight: true,
      imageClipSkip: true,
      imageModelHash: true,
      imageSource: true,
      imageBatchPos: true,
      imageBatchSize: true,
      imageEta: true,
      imageHypernet: true,
      imageMaskBlur: true,
      author: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
      images: true,
      createdAt: true,
      ...(userId
        ? {
            collections: {
              where: {
                authorId: userId,
              },
              select: {
                id: true,
              },
            },
          }
        : {}),
    },
  })
  return result
}

export default handler().get(
  ...getMiddlewares({ auth: null, query: galleryDetailGetValidator }),
  async (req, res) => {
    const { id } = req.queryData
    const result = await getGalleryDetail(id, req.user.id)

    res.json({ ...result })
    return
  },
)
