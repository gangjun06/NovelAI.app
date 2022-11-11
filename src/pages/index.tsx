import { useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'

import { Button } from '~/components/atoms'
import { MultiSelect } from '~/components/atoms/MultiSelect/MultiSelect'
import { GalleryDetailModalWrapper, GalleryList } from '~/components/organizm'
import { MainTemplate } from '~/components/template'
import { useGalleryList } from '~/hooks/useGallery'

const Loader = () => (
  <div className="w-full text-subtitle-color text-lg font-bold">데이터를 불러오고 있어요</div>
)

const GalleryPage = () => {
  const [searchQuery, setSearchQuery] = useState<string[]>([])

  const { data: images, hasNextPage, fetchNextPage, isLoading } = useGalleryList(searchQuery)

  return (
    <>
      <MainTemplate
        title="갤러리"
        description="인공지능으로 생성된 이미지들을 공유하세요"
        showTitle={false}
      >
        <div className="max-w-4xl mx-auto my-8 px-6">
          <div className="text-4xl text-title-color font-bold">AI 이미지 갤러리</div>
          <div className="mt-2 flex gap-x-2">
            <MultiSelect
              className="w-full"
              onChange={(query) => setSearchQuery(query)}
              maxValues={10}
              values={searchQuery}
            />
            <Button variant="primary">검색</Button>
          </div>
        </div>
        <GalleryDetailModalWrapper baseUrl="">
          {({ showDetail }) => (
            <InfiniteScroll
              className="h-full w-11/12 mx-auto"
              next={fetchNextPage}
              dataLength={images?.pages.reduce((prev, cur) => prev + cur.length, 0) ?? 0}
              hasMore={hasNextPage ?? false}
              loader={<Loader />}
            >
              <GalleryList
                images={
                  images?.pages.reduce((a, b) => {
                    a.push(...b)
                    return a
                  }, []) ?? []
                }
                loading={isLoading}
                showUpload={searchQuery.length < 1}
                onClickDetail={showDetail}
              />
            </InfiniteScroll>
          )}
        </GalleryDetailModalWrapper>
      </MainTemplate>
    </>
  )
}

export default GalleryPage
