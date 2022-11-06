import Link from 'next/link'
import { CloudArrowUpIcon } from '@heroicons/react/24/outline'
import { Image as ImageType, User } from '@prisma/client'

import { ImageView } from '../ImageView/ImageView'

import Masonry from 'react-masonry-css'
import classNames from 'classnames'

const breakpointColumns = {
  default: 6,
  1500: 5,
  1300: 4,
  1100: 3,
  700: 2,
  500: 1,
}

interface Props {
  onClickDetail: (id: string) => void
  images: (ImageType & {
    author: User
    list?: ImageType[] | undefined
  })[]
  loading?: boolean
  showUpload?: boolean
}

export const GalleryList = ({ showUpload = false, images, onClickDetail, loading }: Props) => {
  return (
    <Masonry
      className={classNames('my-masonry-grid flex gap-4', loading && 'animate-pulse')}
      columnClassName="my-masonry-grid_column flex flex-col gap-y-3"
      breakpointCols={breakpointColumns}
    >
      {!loading && showUpload && (
        <Link href="/gallery/new" passHref>
          <a className="h-48 p-5 boarder border-2 border-base-color border-dashed text-subtitle-color flex items-center justify-center flex-col hover:brightness-70">
            <div>내 이미지 업로드하기</div>
            <CloudArrowUpIcon className="w-8 h-8" />
          </a>
        </Link>
      )}
      {images.map((item) => (
        <ImageView
          key={item.id}
          image={item}
          author={item.author.name}
          authorImage={item.author.image}
          onClickInfo={() => onClickDetail(item.id)}
        />
      ))}

      {loading &&
        new Array(40).fill({}).map((_, index) => {
          const sizes = ['h-40', 'h-48', 'h-56', 'h-64', 'h-72', 'h-80'][
            Math.floor(Math.random() * 6)
          ]
          return <div key={index} className={`${sizes} bg-zinc-800 rounded w-full`}></div>
        })}
    </Masonry>
  )
}
