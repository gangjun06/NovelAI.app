import { getMiddlewares, handler } from '~/lib/api'
import prisma from '~/lib/prisma'
import { galleryDetailGetValidator } from '~/types/gallery'

export default handler().get(
  ...getMiddlewares({ auth: null, query: galleryDetailGetValidator }),
  async (req, res) => {
    const { id } = req.queryData
    const result = await prisma.image.findUniqueOrThrow({
      where: {
        id,
      },
      include: {
        author: true,
        images: true,
      },
    })

    res.json({ ...result })
    return
  },
)
