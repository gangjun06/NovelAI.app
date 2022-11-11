import { Fragment, useCallback, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import Image from 'next/image'
import { Dialog } from '@headlessui/react'
import { CheckIcon, PlusCircleIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { Collection, Image as ImageType } from '@prisma/client'
import axios from 'axios'
import classNames from 'classnames'
import { A11y, FreeMode, Navigation, Thumbs } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'

import { galleryCollectionManageURL } from '~/assets/urls'
import { Button } from '~/components/atoms'
import { Menu } from '~/components/molecule'
import { useMeCollectionList } from '~/hooks/useCollection'
import { useDisclosure } from '~/hooks/useDisclosure'

import { CollectionCreateModal } from '../CollectionCreateModal/CollectionCreateModal'

export const GalleryDetail = ({
  data,
  onClose,
  forDialog = false,
}: {
  data?:
    | (ImageType & {
        images: ImageType[]
        collections: Pick<Collection, 'id'>[]
      })
    | null
  onClose?: () => void
  forDialog?: boolean
}) => {
  const [thumbsSwiper, setThumbsSwiper] = useState<any>(undefined)
  const [currentIndex, setCurrentIndex] = useState<number>(0)
  const { data: collections } = useMeCollectionList()
  const [showCollectionCreate, handleShowCollectionCreate] = useDisclosure()
  const [updatedCollectaion, setUpdatedCollection] = useState<{ [key: string]: boolean }>({})

  const onSlideChanage = useCallback((index: number) => {
    setCurrentIndex(index)
  }, [])

  const handleManageCollection = useCallback(
    async (id: string) => {
      if (!data?.id) return
      const remove =
        typeof updatedCollectaion[id] === 'undefined'
          ? !!data?.collections.find((collection) => collection.id === id)
          : updatedCollectaion[id]

      const toastId = toast.loading(
        remove ? '컬렉션에서 제거하는 중이에요' : '컬렉션에 추가하는 중이에요',
      )
      try {
        await axios.post(galleryCollectionManageURL(data?.id ?? ''), {
          collectionId: id,
          remove,
        })
        setUpdatedCollection((prev) => ({ ...prev, [id]: !remove }))
        toast.success(remove ? '컬렉션에서 제거했어요' : '이미지를 컬렉션에 추가했어요', {
          id: toastId,
        })
      } catch (_e) {
        toast.error(`컬렉션에${remove ? '서 제거하는' : ' 추가하는'} 중 문제가 발생하였어요`, {
          id: toastId,
        })
      }
    },
    [data?.collections, data?.id, updatedCollectaion],
  )

  const curData = useMemo(() => {
    if (currentIndex === 0) {
      return data
    }
    return data?.images[currentIndex - 1]
  }, [currentIndex, data])

  if (!data) return <></>

  return (
    <>
      <CollectionCreateModal
        show={showCollectionCreate}
        onClose={handleShowCollectionCreate.close}
      />
      {forDialog && (
        <Dialog.Title
          as="h3"
          className="w-full px-6 pt-5 text-2xl font-medium leading-6 text-title-color flex justify-between items-center"
        >
          <div>{data.title ?? '이미지 상세보기'}</div>
          {onClose && (
            <Button forIcon variant="subtle" onClick={onClose}>
              <XMarkIcon className="w-5 h-5" />
            </Button>
          )}
        </Dialog.Title>
      )}

      <div
        className={classNames(
          forDialog && 'px-6 py-5',
          'text-base-color overflow-y-auto custom-scroll flex-1',
        )}
      >
        <div className="relative">
          <Swiper
            modules={[FreeMode, Navigation, A11y, Thumbs]}
            thumbs={{ swiper: thumbsSwiper }}
            spaceBetween={50}
            slidesPerView={1}
            navigation
            pagination={{ clickable: true }}
            scrollbar={{ draggable: true }}
            onSlideChange={(swiper) => onSlideChanage(swiper.activeIndex)}
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
        {curData && (
          <div className="w-full mt-8 flex flex-col gap-y-4">
            {collections && (
              <Menu>
                <Menu.Button>
                  <Button>컬렉션에 추가</Button>
                </Menu.Button>
                <Menu.Dropdown>
                  {collections.list.map(({ id, name }) => (
                    <Menu.Item
                      key={id}
                      icon={
                        typeof updatedCollectaion[id] === 'undefined'
                          ? data?.collections.find((collection) => collection.id === id)
                            ? CheckIcon
                            : undefined
                          : updatedCollectaion[id]
                          ? CheckIcon
                          : undefined
                      }
                      onClick={() => handleManageCollection(id)}
                    >
                      {name}
                    </Menu.Item>
                  ))}
                  <Menu.Item icon={PlusCircleIcon} onClick={handleShowCollectionCreate.open}>
                    컬렉션 만들기
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            )}
            {curData.title ||
              (curData.content && (
                <div>
                  {curData.title && <div className="text-title-color text-xl">{curData.title}</div>}
                  {curData.content && (
                    <div className="text-description-color">{curData.content}</div>
                  )}
                </div>
              ))}
            <div>
              <div className="text-subtitle-color">프롬프트</div>
              <div className="text-description-color">{curData.imagePrompt}</div>
            </div>
            <div>
              <div className="text-subtitle-color">부정 프롬프트</div>
              <div className="text-description-color">{curData.imageUCPrompt}</div>
            </div>
            <div className="flex gap-x-8">
              <div>
                <div className="text-subtitle-color">시드</div>
                <div className="text-description-color">{curData.imageSeed}</div>
              </div>
              <div>
                <div className="text-subtitle-color">스텝</div>
                <div className="text-description-color">{curData.imageSteps}</div>
              </div>
              <div>
                <div className="text-subtitle-color">스케일</div>
                <div className="text-description-color">{curData.imageScale}</div>
              </div>
            </div>
            <div className="flex gap-x-8">
              <div>
                <div className="text-subtitle-color">크기</div>
                <div className="text-description-color">{`${curData.imageWidth}x${curData.imageHeight}`}</div>
              </div>
              <div>
                <div className="text-subtitle-color">Noise</div>
                <div className="text-description-color">{curData.imageNoise}</div>
              </div>
              <div>
                <div className="text-subtitle-color">Strength</div>
                <div className="text-description-color">{curData.imageStrength}</div>
              </div>
            </div>

            <div className="flex gap-x-8">
              {curData.imageSampler && (
                <div>
                  <div className="text-subtitle-color">ImageSampler</div>
                  <div className="text-description-color">{curData.imageSampler}</div>
                </div>
              )}
              {curData.imageSource && (
                <div>
                  <div className="text-subtitle-color">ImageSource</div>
                  <div className="text-description-color">{curData.imageSource}</div>
                </div>
              )}
              {curData.imageModelHash && (
                <div>
                  <div className="text-subtitle-color">imageModelHash</div>
                  <div className="text-description-color">{curData.imageModelHash}</div>
                </div>
              )}
            </div>

            <div className="flex gap-x-8">
              {curData.imageSoftware && (
                <div>
                  <div className="text-subtitle-color">Software</div>
                  <div className="text-description-color">{curData.imageSoftware}</div>
                </div>
              )}
              {curData.imageModelHash && (
                <div>
                  <div className="text-subtitle-color">ClipSkip</div>
                  <div className="text-description-color">{curData.imageClipSkip}</div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  )
}
