import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { Image, Prisma } from '@prisma/client'
import cuid from 'cuid'
import jwt from 'jsonwebtoken'
import { z } from 'zod'

import { getMiddlewares, handler } from '~/lib/api'
import { getImagesDirectURL } from '~/lib/cloudflare'
import prisma from '~/lib/prisma'
import GalleryPage from '~/pages'
import { GalleryUploadImagePostRes, galleryUploadImagePostValidator } from '~/types/gallery'

export default handler().post(
  ...getMiddlewares({
    auth: 'USER',
    schema: galleryUploadImagePostValidator,
    res: {} as GalleryUploadImagePostRes,
  }),
  async (req, res) => {
    const { count } = req.data

    const imageList = await getImagesDirectURL(count)

    const imageListIds = imageList.map(({ id }) => id)
    const uploadURL = imageList.map(({ uploadURL }) => uploadURL)

    const token = jwt.sign({ imageList: imageListIds }, process.env.JWT_SECRET, {
      expiresIn: 60 * 30,
      subject: req.user.id,
    })

    return res.json({ token, uploadURL })
  },
)
