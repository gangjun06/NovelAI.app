import InfiniteScroll from 'react-infinite-scroll-component'
import { GetServerSideProps } from 'next'
import Image from 'next/image'
import { NotFoundError } from '@prisma/client/runtime'

import { GalleryDetailModalWrapper, GalleryList } from '~/components/organizm'
import { MainTemplate } from '~/components/template'
import { useGalleryList } from '~/hooks/useGallery'

const Loader = () => (
  <div className="w-full text-subtitle-color text-lg font-bold">데이터를 불러오고 있어요</div>
)

export const ProfilePage = ({ data: { id, image, name } }: SSRProps) => {
  const { data: images, hasNextPage, fetchNextPage, isLoading } = useGalleryList([], id)

  return (
    <MainTemplate
      title={`${name ?? '익명'}님의 프로필`}
      description="프로필 페이지"
      tiny
      showTitle={false}
    >
      <div className="flex gap-x-4 w-11/12 mx-auto items-center text-title-color mb-4">
        {image && (
          <Image src={image} alt="profile image" width={64} height={64} className="rounded-full" />
        )}
        <div className="font-bold text-2xl">{name ?? '익명'}</div>
      </div>
      <div>
        <GalleryDetailModalWrapper baseUrl={`/profile/${id}`}>
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
                showUpload={false}
                onClickDetail={showDetail}
              />
            </InfiniteScroll>
          )}
        </GalleryDetailModalWrapper>
      </div>
    </MainTemplate>
  )
}

interface SSRProps {
  data: {
    id: string
    name: string | null
    image: string | null
  }
}

export const getServerSideProps: GetServerSideProps<SSRProps> = async (context) => {
  const id = context.query['id']
  if (typeof id !== 'string')
    return {
      notFound: true,
    }

  try {
    const result = await prisma?.user.findUniqueOrThrow({
      where: {
        id,
      },
      select: {
        id: true,
        name: true,
        image: true,
      },
    })

    return {
      props: { data: result! },
    }
  } catch (e) {
    if (e instanceof NotFoundError) {
      return {
        notFound: true,
      }
    }
    throw e
  }
}

export default ProfilePage
