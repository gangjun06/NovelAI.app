import { getMiddlewares, handler } from '~/lib/api'
import prisma from '~/lib/prisma'
import { MeCollectionsGetRes } from '~/types/collection'

export default handler().get(
  ...getMiddlewares({ auth: 'USER', res: {} as MeCollectionsGetRes }),
  async (req, res) => {
    const collectionList = await prisma?.collection.findMany({
      where: {
        authorId: req.user.id,
      },
      select: {
        id: true,
        name: true,
      },
    })
    res.json({ list: collectionList })
    return
  },
)
