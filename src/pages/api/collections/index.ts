import { getMiddlewares, handler } from '~/lib/api'
import { collectionPostValidator } from '~/types/collection'

export default handler().post(
  ...getMiddlewares({ auth: 'USER', schema: collectionPostValidator }),
  async (req, res) => {
    const { name, description, status } = req.data
    await prisma?.collection.create({
      data: {
        name,
        description: description ?? '',
        author: {
          connect: {
            id: req.user.id,
          },
        },
        status,
      },
    })
    res.json({})
  },
)
