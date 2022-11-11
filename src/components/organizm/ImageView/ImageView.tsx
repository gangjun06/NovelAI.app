import Image from 'next/image'
import { InformationCircleIcon } from '@heroicons/react/24/outline'
import { Image as ImageType } from '@prisma/client'

interface Props {
  image: ImageType
  authorImage?: string | null
  author?: string | null
  onClickInfo: () => void
}

export const ImageView = ({ image, author, authorImage, onClickInfo }: Props) => {
  return (
    <div className="dark:bg-zinc-700/50 dark:border-base-dark text-gray-300 rounded galleryUploadCard relative flex items-center">
      <Image
        src={`https://imagedelivery.net/${process.env.NEXT_PUBLIC_CLOUDFLARE_ACCOUNT_HASH}/${image.imageUrl}/public`}
        alt={image.id}
        width={image.imageWidth}
        height={image.imageHeight}
      />

      <div className="overlay absolute w-full h-full top-0 left-0 transition-colors p-4">
        <div className="relative h-full w-full">
          <div className="flex flex-col gap-y-3 show-when-hover">
            {author && (
              <div className="text-ellipsis w-full top-10 flex gap-x-2 items-center">
                {authorImage && (
                  <Image
                    src={authorImage}
                    alt="profile image"
                    width={24}
                    height={24}
                    className="rounded-full"
                  />
                )}
                {author}
              </div>
            )}
            <div>{image.title}</div>
          </div>
          <div className="flex justify-end flex-row gap-2 absolute bottom-0 right-0 w-full">
            <span className="font-bold bg-black/50 p-2 rounded h-fit">{image.imageSoftware}</span>
            <button
              className="font-bold bg-black/50 hover:bg-black/80 p-2 rounded h-fit transition-all"
              onClick={onClickInfo}
              type="button"
            >
              <InformationCircleIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
