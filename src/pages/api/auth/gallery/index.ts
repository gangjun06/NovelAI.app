import { getMiddlewares, handler } from '~/lib/api'
import { galleryPostBodyValidator } from '~/types/gallery'

export default handler().post(
  ...getMiddlewares({ auth: 'USER', schema: galleryPostBodyValidator }),
  (req, res) => {
    res.json({})
    return
  },
)
