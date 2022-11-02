import jwt from 'jsonwebtoken'

import { BadRequestError, getMiddlewares, handler, UnauthorizedError } from '~/lib/api'
import { galleryUploadPostValidator } from '~/types/gallery'

export default handler().post(
  ...getMiddlewares({ auth: 'USER', schema: galleryUploadPostValidator }),
  (req, res) => {
    const token = req.headers['X-Images-Token']
    if (!token || typeof token !== 'string') throw new BadRequestError()

    const tokenData = jwt.verify(token, process.env.JWT_SECRET, {}, () => {
      throw new UnauthorizedError('Bad token')
    })

    res.json({})
    return
  },
)
