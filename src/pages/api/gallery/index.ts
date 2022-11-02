import { getMiddlewares, handler } from '~/lib/api'
import { galleryUploadPostValidator } from '~/types/gallery'

export default handler().post(
  ...getMiddlewares({ auth: 'USER', schema: galleryUploadPostValidator }),
  (req, res) => {
    res.json({})
    return
  },
)
