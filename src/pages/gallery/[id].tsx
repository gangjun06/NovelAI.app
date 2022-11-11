import { GetServerSideProps } from 'next'
import { unstable_getServerSession } from 'next-auth'
import { NotFoundError } from '@prisma/client/runtime'

import { GalleryDetail } from '~/components/organizm/GalleryDetail/GalleryDetail'
import { MainTemplate } from '~/components/template'

import { authOptions } from '../api/auth/[...nextauth]'
import { getGalleryDetail } from '../api/gallery/[id]'

const GalleryImageDetail = ({ data }: SSRProps) => {
  return (
    <MainTemplate
      title={data.title || '이미지 상세보기'}
      description={
        data.content
          ? `${data.content.substring(300, 0)}${data.content.length > 300 ? '...' : ''}`
          : 'AI로 생성된 이미지의 상세 페이지입니다'
      }
      container
      tiny
      pageBack={{ to: '/', label: '갤러리' }}
    >
      <GalleryDetail data={data as any} />
    </MainTemplate>
  )
}

interface SSRProps {
  data: Awaited<ReturnType<typeof getGalleryDetail>>
}

export const getServerSideProps: GetServerSideProps<SSRProps> = async (context) => {
  const id = context.query['id']
  if (typeof id !== 'string')
    return {
      notFound: true,
    }

  const session = await unstable_getServerSession(context.req, context.res, authOptions)

  try {
    const result = await getGalleryDetail(id, session?.user.id)

    return {
      props: { data: result },
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

export default GalleryImageDetail
