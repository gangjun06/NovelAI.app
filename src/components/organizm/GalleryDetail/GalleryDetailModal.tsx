import { Fragment, ReactNode, Suspense, useCallback, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import classNames from 'classnames'

import { TransitionChild } from '~/components/atoms'
import { GalleryDetail } from '~/components/organizm/GalleryDetail/GalleryDetail'
import { useDisclosure } from '~/hooks/useDisclosure'
import { useGalleryDetail } from '~/hooks/useGallery'

export const GalleryDetailModalWrapper = ({
  children,
  baseUrl,
}: {
  children: ({ showDetail }: { showDetail: (id: string) => void }) => ReactNode
  baseUrl: string
}) => {
  const [showDetailModal, handleShowDetailModal] = useDisclosure()
  const [id, setId] = useState<string | null>(null)

  const showDetail = useCallback(
    (id: string) => {
      setId(id)
      window.history.pushState(null, '', `/gallery/${id}`)
      handleShowDetailModal.open()
    },
    [handleShowDetailModal],
  )

  const onClose = useCallback(() => {
    handleShowDetailModal.close()
    window.history.pushState(null, '', baseUrl)
  }, [baseUrl, handleShowDetailModal])

  return (
    <>
      <GalleryDetailModal show={showDetailModal} onClose={onClose} id={id} />
      {children({ showDetail })}
    </>
  )
}

export const GalleryDetailModal = ({
  id,
  show,
  onClose,
}: {
  id?: string | null
  show: boolean
  onClose: () => void
}) => {
  return (
    <Transition appear show={show} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <TransitionChild type="overlay">
          <div className="fixed inset-0 bg-black bg-opacity-50" />
        </TransitionChild>

        <div className="fixed inset-0 flex items-center justify-center overflow-y-auto sm:p-5">
          <div className="flex items-center justify-center text-center h-full min-h-full w-full">
            <TransitionChild type="modal">
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
                  <DetailContent id={id} onClose={onClose} />
                </Suspense>
              </Dialog.Panel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}

const DetailContent = ({ id, onClose }: { id?: string | null; onClose: () => void }) => {
  const { data } = useGalleryDetail(id)

  return <GalleryDetail forDialog data={data} onClose={onClose} />
}
