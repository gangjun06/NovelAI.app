import { Collection, Image as ImageType, User } from '@prisma/client'
import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import axios from 'axios'

import { galleryDetailURL, galleryURL } from '~/assets/urls'

const LIMIT = 50

export const useGalleryList = (query: string[], authorId?: string) => {
  return useInfiniteQuery({
    queryKey: ['gallery-images', query],
    refetchOnWindowFocus: false,
    queryFn: async ({ pageParam }) => {
      const res = await axios.get(galleryURL, {
        params: { cursor: pageParam, limit: LIMIT, query, authorId },
      })

      return res.data.images as (ImageType & { author: User; list?: ImageType[] })[]
    },
    getNextPageParam: (lastPage, _pages) => {
      if (lastPage.length < LIMIT) {
        return undefined
      }
      return lastPage.at(-1)?.id ?? undefined
    },
  })
}

export const useGalleryDetail = (imageId?: string | null) => {
  return useQuery({
    queryKey: ['images', imageId],
    queryFn: async ({ queryKey: [, id] }) => {
      if (!id) return null
      const res = await axios.get(galleryDetailURL(id as string))

      return res.data as ImageType & { images: ImageType[]; collections: Pick<Collection, 'id'>[] }
    },
    suspense: true,
  })
}
