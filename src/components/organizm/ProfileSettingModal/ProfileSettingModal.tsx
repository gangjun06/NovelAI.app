import { ChangeEventHandler, useRef, useState } from 'react'
import AvatarEditor from 'react-avatar-editor'
import Image from 'next/image'
import { useSession } from 'next-auth/react'
import classNames from 'classnames'
import { atom, useAtom } from 'jotai'

import { Button, Input } from '~/components/atoms'
import { Modal } from '~/components/molecule'
import { useDisclosure } from '~/hooks/useDisclosure'
import toast from 'react-hot-toast'
import axios from 'axios'
import { profileImageURL } from '~/assets/urls'

export const showProfileModalAtom = atom(false)

export const ProfileSettingModal = () => {
  const { data, status } = useSession()
  const editor = useRef<AvatarEditor>(null)

  const fileRef = useRef<HTMLInputElement>(null)
  const [show, setShow] = useAtom(showProfileModalAtom)
  const [profileEdit, handleProfileEdit] = useDisclosure()
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [scale, setScale] = useState<number>(1)

  if (status === 'unauthenticated') return <></>

  const onChangeFile: ChangeEventHandler<HTMLInputElement> = async (event) => {
    const files = fileRef.current?.files
    if (!files || files.length !== 1) {
      return
    }
    const file = files[0]
    setSelectedFile(file)
    handleProfileEdit.open()
  }

  const profileChange = async () => {
    handleProfileEdit.close()
    if (!editor.current) return
    const image = editor.current.getImage()
    const blob: Blob | null = await new Promise((resolve) => image.toBlob((blob) => resolve(blob)))
    if (!blob) {
      toast.error('이미지를 편집할 수 없습니다')
      return
    }
    const toastId = toast.loading('이미지를 올리는 중이에요')

    try {
      const formData = new FormData()
      formData.append('file', blob)

      const result = await axios.post(profileImageURL, formData)
      console.log(result)

      toast.success('성공적으로 프로필 이미지을 저장했어요. (새로고침후 확인가능)', { id: toastId })
    } catch (e) {
      toast.error('이미지를 저장하는 중 문제가 발생하였어요', { id: toastId })
    }
  }

  return (
    <>
      <Modal show={show} title="프로필 설정" closeBtn onClose={() => setShow(false)}>
        <input ref={fileRef} type="file" className="hidden" onChange={onChangeFile} />
        <div className={classNames('flex flex-col gap-4', status === 'loading' && 'animate-pulse')}>
          {status === 'loading' ? (
            <>
              <div className="h-24 bg-zinc-800 rounded w-full"></div>
              <div className="h-24 bg-zinc-800 rounded w-full"></div>
              <div className="h-24 bg-zinc-800 rounded w-full"></div>
            </>
          ) : (
            <>
              {profileEdit && selectedFile ? (
                <div className="flex justify-center flex-col items-center gap-y-2">
                  <AvatarEditor
                    ref={editor}
                    image={selectedFile}
                    width={250}
                    height={250}
                    border={50}
                    color={[0, 0, 0, 0.4]} // RGBA
                    scale={scale}
                    rotate={0}
                  />
                  <input
                    type="range"
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                    min={1}
                    step={0.05}
                    max={2.5}
                    value={scale}
                    onChange={(e) => setScale(parseFloat(e.currentTarget.value))}
                  />
                  <div className="flex gap-x-2 justify-end w-full">
                    <Button variant="subtle" onClick={handleProfileEdit.close}>
                      취소
                    </Button>
                    <Button variant="light" onClick={profileChange}>
                      프로필 변경
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex gap-x-3 items-center">
                    <Image
                      src={data?.user?.image ?? ''}
                      width={48}
                      height={48}
                      alt="profile iamge"
                      className="rounded-full"
                    />
                    <Button variant="light" onClick={() => fileRef.current?.click()}>
                      프로필 변경
                    </Button>
                  </div>
                  <Input label="이름" value={data?.user.name ?? ''} disabled></Input>
                  <Input label="이메일" value={data?.user.email ?? ''} disabled></Input>
                </>
              )}
            </>
          )}
        </div>
      </Modal>
    </>
  )
}
