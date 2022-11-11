import { useQuery } from '@tanstack/react-query'
import axios, { AxiosError } from 'axios'

import { meCollectionsURL } from '~/assets/urls'
import { MeCollectionsGetRes } from '~/types/collection'

export const useMeCollectionList = () => {
  return useQuery({
    queryKey: ['collections', 'me'],
    queryFn: async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}${meCollectionsURL}`)
        return res.data as MeCollectionsGetRes
      } catch (e) {
        if (e instanceof AxiosError) {
          if (e.status !== 401) console.error(e)
        }
      }
      return { list: [] }
    },
  })
}
