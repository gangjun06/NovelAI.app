import { ImageStatus, Prisma } from '@prisma/client'
import jwt from 'jsonwebtoken'
import { z } from 'zod'

import { BadRequestError, getMiddlewares, handler, UnauthorizedError } from '~/lib/api'
import prisma from '~/lib/prisma'
import AuthError from '~/pages/auth/error'
import { galleryUploadPostData, galleryUploadPostValidator } from '~/types/gallery'

const TagRegex = new RegExp('[A-Za-z0-9 _]{2,40}', 'g')

export default handler().post(
  ...getMiddlewares({ auth: 'USER', schema: galleryUploadPostValidator }),
  async (req, res) => {
    const { title, content, uploadEach, list } = req.data
    if (!req.user) throw new Error('Server error')

    const token = req.headers['x-images-token']
    if (!token || typeof token !== 'string') throw new BadRequestError()

    const tokenData = await new Promise((resolve, reject) => {
      jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) reject(new UnauthorizedError('Bad token'))
        else resolve(decoded)
      })
    })
    console.log(tokenData)

    const imageList = (tokenData as any).imageList as string[]

    if (imageList.length !== list.length) throw new BadRequestError()

    const parseTags = (tag: string) => {
      const list = tag.match(TagRegex)
      if (!list) return []
      return Array.from(
        new Set([
          ...list.filter((tag) => tag).map((tag) => tag.trim().replace(/_/g, ' ').toLowerCase()),
        ]),
      )
    }

    const formatData = (data: z.infer<typeof galleryUploadPostData>, imageUrl: string) => {
      return {
        title: data.title || null,
        content: data.content || null,
        status: ImageStatus.PUBLIC,
        imageUrl,
        author: {
          connect: {
            id: req.user.id,
          },
        },
        imageSoftware: data.imageSoftware,
        imagePrompt: data.imagePrompt,
        imageUCPrompt: data.imageUCPrompt,
        imageSteps: data.imageSteps,
        imageScale: data.imageScale,
        imageStrength: data.imageStrength,
        imageNoise: data.imageNoise,
        imageSeed: data.imageSeed,
        imageSampler: data.imageSampler,
        imageWidth: data.imageWidth,
        imageHeight: data.imageHeight,
        imageClipSkip: data.imageClipSkip,
        imageModelHash: data.imageModelHash,
        imageSource: data.imageSource,
        imageBatchPos: data.imageBatchPos,
        imageBatchSize: data.imageBatchSize,
        imageEta: data.imageEta,
        imageHypernet: data.imageHypernet,
        imageMaskBlur: data.imageMaskBlur,
        tags: parseTags(data.imagePrompt),
        ucTags: parseTags(data.imageUCPrompt),
      }
    }

    if (!uploadEach) {
      const root = await prisma.image.create({
        data: {
          ...formatData(list[0], imageList[0]),
          title,
          content,
          images: {
            create: list
              .slice(1)
              .map((data, index) => ({ ...formatData(data, imageList[index + 1]) })),
          },
        },
      })
    } else {
      await prisma.image.createMany({
        data: [
          ...list.map((item, index) => ({
            ...formatData(item, imageList[index]),
            author: undefined,
            authorId: req.user.id,
          })),
        ],
      })
    }

    res.json({})
    return
  },
)
