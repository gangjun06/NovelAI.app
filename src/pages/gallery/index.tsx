import { useCallback, useEffect, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import Image from 'next/image'
import { Image as ImageType } from '@prisma/client'
import axios from 'axios'

import { galleryURL } from '~/assets/urls'
import { Button, Input } from '~/components/atoms'
import { MainTemplate } from '~/components/template'

import Masonry from 'react-masonry-css'
import { CloudArrowUpIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'

const Loader = () => <div>데이터를 불러오고 있어요</div>

const breakpointColumns = {
  default: 6,
  1500: 5,
  1300: 4,
  1100: 3,
  700: 2,
  500: 1,
}

const GalleryPage = () => {
  const [images, setImages] = useState<ImageType[]>([])

  const [hasMore, setHasMore] = useState(true)

  const fetchNext = useCallback(async () => {
    console.log('fetch next')
    const lastImage = images.at(-1)
    const res = await axios.get(galleryURL, {
      params: { cursor: lastImage ? lastImage.id : undefined },
    })
    setImages((prev) => prev.concat(res.data.images))
    setHasMore(false)
  }, [images])

  useEffect(() => {
    console.log('Fetch')
    fetchNext()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
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
        next={fetchNext}
        dataLength={images.length}
        hasMore={hasMore}
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
          {images.map((item) => (
            <div key={item.id}>
              <Image
                src={`https://imagedelivery.net/${process.env.NEXT_PUBLIC_CLOUDFLARE_ACCOUNT_HASH}/${item.imageUrl}/public`}
                alt={item.id}
                width={item.imageWidth}
                height={item.imageHeight}
              />
            </div>
          ))}
        </Masonry>
      </InfiniteScroll>
    </MainTemplate>
  )
}

export default GalleryPage
