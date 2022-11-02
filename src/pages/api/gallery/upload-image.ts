import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { Image, Prisma } from '@prisma/client'
import cuid from 'cuid'
import jwt from 'jsonwebtoken'
import { z } from 'zod'

import { getMiddlewares, handler } from '~/lib/api'
import { getImagesDirectURL } from '~/lib/cloudflare'
import prisma from '~/lib/prisma'
import GalleryPage from '~/pages/gallery'
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

    // const formatData = (data: z.infer<typeof galleryPostBodyData>): prismaDataType => {
    //   return {
    //     title: data.title || null,
    //     content: data.content || null,
    //     originalTitle: null,
    //     originalURL: null,
    //     status: 'PUBLIC',
    //     imageUrl: '',
    //     other: {},
    //     author: {
    //       connect: {
    //         id: req.user.id,
    //       },
    //     },
    //     imageSoftware: data.imageSoftware,
    //     imagePrompt: data.imagePrompt,
    //     imageUCPrompt: data.imageUCPrompt,
    //     imageSteps: data.imageSteps,
    //     imageScale: data.imageScale,
    //     imageStrength: data.imageStrength,
    //     imageNoise: data.imageNoise,
    //     imageSeed: data.imageSeed,
    //     imageSampler: data.imageSampler,
    //     imageWidth: data.imageWidth,
    //     imageHeight: data.imageHeight,
    //     imageClipSkip: data.imageClipSkip,
    //     imageModelHash: data.imageModelHash,
    //     imageSource: data.imageSource,
    //   }
    // }

    // const data: Prisma.ImageCreateArgs = {
    //   data: {
    //     ...formatData(list[0]),
    //   },
    // }

    const imageListIds = imageList.map(({ id }) => id)
    const uploadURL = imageList.map(({ uploadURL }) => uploadURL)

    const token = jwt.sign({ imageList: imageListIds }, process.env.JWT_SECRET, {
      expiresIn: 60 * 30,
      subject: req.user.id,
    })

    return res.json({ token, uploadURL })
  },
)
