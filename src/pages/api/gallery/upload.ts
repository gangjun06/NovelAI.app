import { Prisma } from '@prisma/client'
import jwt from 'jsonwebtoken'
import { z } from 'zod'

import { BadRequestError, getMiddlewares, handler, UnauthorizedError } from '~/lib/api'
import prisma from '~/lib/prisma'
import { galleryUploadPostData, galleryUploadPostValidator } from '~/types/gallery'

const TagRegex = new RegExp('[A-Za-z0-9 _]{2,}', 'g')

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

    const imageList = (tokenData as any).imageList as string[]

    if (imageList.length !== list.length) throw new BadRequestError()

    const parseTags = (tag: string) => {
      const list = tag.match(TagRegex)
      if (!list) return []
      return Array.from(
        new Set([...list.map((tag) => tag.trim().replaceAll('_', ' ').toLowerCase())]),
      )
    }

    const formatData = (
      data: z.infer<typeof galleryUploadPostData>,
      imageUrl: string,
    ): Prisma.ImageCreateArgs['data'] => {
      return {
        title: data.title || null,
        content: data.content || null,
        status: 'PUBLIC',
        imageUrl,
        authorId: req.user.id,
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
        tags: {
          connectOrCreate: parseTags(data.imagePrompt).map((item) => ({
            create: {
              mean: '',
              tagId: item,
            },
            where: {
              tagId: item,
            },
          })),
        },
        ucTags: {
          connectOrCreate: parseTags(data.imageUCPrompt).map((item) => ({
            create: {
              mean: '',
              tagId: item,
            },
            where: {
              tagId: item,
            },
          })),
        },
      }
    }

    if (!uploadEach) {
      await prisma.image.create({
        data: {
          ...formatData(list[0], imageList[0]),
          title,
          content,
          images: {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
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
            authorId: req.user.id,
          })),
        ],
      })
    }

    res.json({})
    return
  },
)
