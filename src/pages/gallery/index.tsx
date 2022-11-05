import { Fragment, Suspense, useCallback, useEffect, useMemo, useState } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import InfiniteScroll from 'react-infinite-scroll-component'
import Image from 'next/image'
import Link from 'next/link'
import { Dialog, Transition } from '@headlessui/react'
import { CloudArrowUpIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { Image as ImageType, ImageStatus, User } from '@prisma/client'
import { useInfiniteQuery } from '@tanstack/react-query'
import axios from 'axios'
import classNames from 'classnames'
import { atom, useAtom, useSetAtom } from 'jotai'
import { atomsWithQuery } from 'jotai-tanstack-query'
import { A11y, EffectFade, FreeMode, Navigation, Pagination, Thumbs } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'

import { galleryDetailURL, galleryURL } from '~/assets/urls'
import { Button, Input } from '~/components/atoms'
import { ImageView } from '~/components/organizm/ImageView/ImageView'
import { MainTemplate } from '~/components/template'
import { useDisclosure } from '~/hooks/useDisclosure'
import { delay } from '~/utils'

import Masonry from 'react-masonry-css'

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
      window.history.pushState(null, '', `/gallery/${id}`)
      setSelectedImageId(id)
      handleShowDetailModal.open()
    },
    [handleShowDetailModal, setSelectedImageId],
  )

  return (
    <>
      <MainTemplate title="갤러리" description="인공지능으로 생성된 이미지들을 공유하세요">
        <ErrorBoundary
          FallbackComponent={() => <>Error :(</>}
          onError={(error) => console.log(error)}
        >
          <DetailModal show={showDetailModal} onClose={handleShowDetailModal.close} />
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
        </ErrorBoundary>
      </MainTemplate>
    </>
  )
}

const [selectedDataAtom] = atomsWithQuery((get) => ({
  queryKey: ['images', get(selectedImageIdAtom)],
  queryFn: async ({ queryKey: [, id] }) => {
    if (!id) return null
    const res = await axios.get(galleryDetailURL(id as string))

    return res.data as ImageType & { images: ImageType[] }
  },
}))

const DetailModal = ({ show, onClose }: { show: boolean; onClose: () => void }) => {
  return (
    <Transition appear show={show} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-50" />
        </Transition.Child>

        <div className="fixed inset-0 flex items-center justify-center overflow-y-auto sm:p-5">
          <div className="flex items-center justify-center text-center h-full min-h-full w-full">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel
                className={classNames(
                  'bg-base h-full text-base-color w-full max-w-full xl:max-w-5xl transform sm:rounded-xl text-left align-middle shadow-xl backdrop-blur-md transition-all flex flex-col',
                )}
              >
                <Suspense
                  fallback={
                    <>
                      <div className="animate-pulse flex flex-col px-8 mt-8">
                        <div className="h-12 bg-zinc-800 rounded w-24"></div>
                        <div className="h-96 bg-zinc-800 rounded w-full mt-8"></div>
                        <div className="flex gap-x-4 mt-2">
                          <div className="h-24 bg-zinc-800 rounded w-full"></div>
                          <div className="h-24 bg-zinc-800 rounded w-full"></div>
                          <div className="h-24 bg-zinc-800 rounded w-full"></div>
                          <div className="h-24 bg-zinc-800 rounded w-full"></div>
                        </div>
                        <div className="ml-0 mt-8 h-12 bg-zinc-800 rounded-full w-full"></div>
                        <div className="ml-0 mt-6 h-12 bg-zinc-800 rounded-full w-full"></div>
                        <div className="ml-0 mt-6 h-12 bg-zinc-800 rounded-full w-full"></div>
                        <div className="ml-0 mt-6 h-12 bg-zinc-800 rounded-full w-full"></div>
                        <div className="ml-0 mt-6 h-12 bg-zinc-800 rounded-full w-full"></div>
                      </div>
                    </>
                  }
                >
                  <DetailContent onClose={onClose} />
                </Suspense>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}

const DetailContent = ({ onClose }: { onClose: () => void }) => {
  const [thumbsSwiper, setThumbsSwiper] = useState<any>(undefined)
  const [data] = useAtom(selectedDataAtom)

  if (!data) return <></>
  return (
    <>
      <Dialog.Title
        as="h3"
        className="w-full px-6 pt-5 text-2xl font-medium leading-6 text-title-color flex justify-between items-center"
      >
        <div>{data.title ?? '이미지 상세보기'}</div>
        <Button forIcon variant="subtle" onClick={onClose}>
          <XMarkIcon className="w-5 h-5" />
        </Button>
      </Dialog.Title>
      <div className="px-6 py-5 text-base-color overflow-y-auto custom-scroll flex-1">
        <div className="relative">
          <Swiper
            modules={[FreeMode, Navigation, A11y, Thumbs]}
            thumbs={{ swiper: thumbsSwiper }}
            spaceBetween={50}
            slidesPerView={1}
            navigation
            pagination={{ clickable: true }}
            scrollbar={{ draggable: true }}
            onSwiper={(swiper) => console.log(swiper)}
            onSlideChange={() => console.log('slide change')}
            className="max-h-[30%]"
          >
            <SwiperSlide>
              <Image
                src={`https://imagedelivery.net/${process.env.NEXT_PUBLIC_CLOUDFLARE_ACCOUNT_HASH}/${data.imageUrl}/public`}
                alt={data.id}
                width={data.imageWidth}
                height={data.imageHeight}
              />
            </SwiperSlide>
            {data.images.map((item) => (
              <SwiperSlide key={item.id}>
                <div>
                  <Image
                    src={`https://imagedelivery.net/${process.env.NEXT_PUBLIC_CLOUDFLARE_ACCOUNT_HASH}/${item.imageUrl}/public`}
                    alt={item.id}
                    width={item.imageWidth}
                    height={item.imageHeight}
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
          {data.images.length > 0 && (
            <Swiper
              onSwiper={setThumbsSwiper}
              spaceBetween={10}
              slidesPerView={5}
              freeMode={true}
              watchSlidesProgress={true}
              modules={[FreeMode, Navigation, Thumbs]}
              className="thumb-swiper"
            >
              <SwiperSlide>
                <Image
                  src={`https://imagedelivery.net/${process.env.NEXT_PUBLIC_CLOUDFLARE_ACCOUNT_HASH}/${data.imageUrl}/public`}
                  alt={data.id}
                  width={data.imageWidth}
                  height={data.imageHeight}
                />
              </SwiperSlide>
              {data.images.map((item) => (
                <SwiperSlide key={item.id}>
                  <Image
                    src={`https://imagedelivery.net/${process.env.NEXT_PUBLIC_CLOUDFLARE_ACCOUNT_HASH}/${item.imageUrl}/public`}
                    alt={item.id}
                    width={item.imageWidth}
                    height={item.imageHeight}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </div>
        <div className="w-full mt-8 flex flex-col gap-y-4">
          <div>
            {data.title && <div className="text-title-color text-xl">{data.title}</div>}
            {data.content && <div className="text-description-color">{data.content}</div>}
          </div>
          <div>
            <div className="text-subtitle-color">프롬프트</div>
            <div className="text-description-color">{data.imagePrompt}</div>
          </div>
          <div>
            <div className="text-subtitle-color">부정 프롬프트</div>
            <div className="text-description-color">{data.imageUCPrompt}</div>
          </div>
          <div>
            <div className="text-subtitle-color">시드</div>
            <div className="text-description-color">{data.imageSeed}</div>
          </div>
        </div>
      </div>
    </>
  )
}

export default GalleryPage
