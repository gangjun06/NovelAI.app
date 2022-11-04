import { Fragment, useCallback, useEffect, useMemo, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import Link from 'next/link'
import { CloudArrowUpIcon } from '@heroicons/react/24/outline'
import { Image as ImageType, User } from '@prisma/client'
import { useInfiniteQuery } from '@tanstack/react-query'
import axios from 'axios'

import { galleryURL } from '~/assets/urls'
import { Button, Input } from '~/components/atoms'
import { Modal } from '~/components/molecule'
import { ImageView } from '~/components/organizm/ImageView/ImageView'
import { MainTemplate } from '~/components/template'
import { useDisclosure } from '~/hooks/useDisclosure'

import Masonry from 'react-masonry-css'
import { atom, useAtom, useSetAtom } from 'jotai'
import { atomsWithQuery } from 'jotai-tanstack-query'

const Loader = () => (
  <div className="w-full text-subtitle-color text-lg font-bold">데이터를 불러오고 있어요</div>
)

const breakpointColumns = {
  default: 6,
  1500: 5,
  1300: 4,
  1100: 3,
  700: 2,
  500: 1,
}
// const imagesAtom = atom<(ImageType & { author: User; list?: ImageType[] })[]>([])
const selectedImageIdAtom = atom<string | null>(null)

const LIMIT = 50

const GalleryPage = () => {
  const [showDetailModal, handleShowDetailModal] = useDisclosure()
  const setSelectedImageId = useSetAtom(selectedImageIdAtom)

  const {
    data: images,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteQuery({
    queryKey: ['gallery-images'],
    refetchOnWindowFocus: false,
    queryFn: async ({ pageParam }) => {
      const res = await axios.get(galleryURL, {
        params: { cursor: pageParam, limit: LIMIT },
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

  const onClickInfo = useCallback(
    (id: string) => {
      setSelectedImageId(id)
      handleShowDetailModal.open()
    },
    [handleShowDetailModal, setSelectedImageId],
  )

  useEffect(() => {
    console.log(hasNextPage)
  }, [hasNextPage])

  return (
    <>
      <DetailModal show={showDetailModal} onClose={handleShowDetailModal.close} />
      <MainTemplate title="갤러리" description="인공지능으로 생성된 이미지들을 공유하세요">
        <div className="max-w-4xl mx-auto my-8 px-6">
          <div className="text-4xl text-title-color font-bold">AI 이미지 갤러리</div>
          <div className="mt-2 flex gap-x-2">
            <Input className="w-full" placeholder="검색어를 입력해주세요..." />
            <Button variant="primary">검색</Button>
          </div>
        </div>
        <InfiniteScroll
          className="h-full w-11/12 mx-auto"
          next={fetchNextPage}
          dataLength={images?.pages.reduce((prev, cur) => prev + cur.length, 0) ?? 0}
          hasMore={hasNextPage ?? false}
          loader={<Loader />}
        >
          <Masonry
            className="my-masonry-grid flex gap-4"
            columnClassName="my-masonry-grid_column flex flex-col gap-y-3"
            breakpointCols={breakpointColumns}
          >
            <Link href="/gallery/new" passHref>
              <a className="h-48 p-5 boarder border-2 border-base-color border-dashed text-subtitle-color flex items-center justify-center flex-col hover:brightness-70">
                <div>내 이미지 업로드하기</div>
                <CloudArrowUpIcon className="w-8 h-8" />
              </a>
            </Link>
            {images?.pages.map((page) =>
              page.map((item) => (
                <ImageView
                  key={item.id}
                  image={item}
                  author={item.author.name}
                  authorImage={item.author.image}
                  onClickInfo={() => onClickInfo(item.id)}
                />
              )),
            )}
          </Masonry>
        </InfiniteScroll>
      </MainTemplate>
    </>
  )
}

const [selectedDataAtom] = atomsWithQuery((get) => ({
  queryKey: ['images', get(selectedImageIdAtom)],
  queryFn: async ({ queryKey: [, id] }) => {
    if (!id) return undefined
    const res = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`)
    return res.json()
  },
}))

const DetailModal = ({ show, onClose }: { show: boolean; onClose: () => void }) => {
  const [selectedData] = useAtom(selectedDataAtom)

  return (
    <>
      <Modal show={show} onClose={onClose} title={'이미지 상세보기'}>
        <div>hello</div>
      </Modal>
    </>
  )
}

export default GalleryPage
