import { ChangeEventHandler, useCallback, useRef } from 'react'
import Image from 'next/image'
import { useSession } from 'next-auth/react'
import classNames from 'classnames'
import { atom, useAtom } from 'jotai'

import { Button, Input } from '~/components/atoms'
import { Modal } from '~/components/molecule'
import toast from 'react-hot-toast'
import axios from 'axios'
import { profileImageURL } from '~/assets/urls'

export const showProfileModalAtom = atom(false)

export const ProfileSettingModal = () => {
  const { data, status } = useSession()

  const fileRef = useRef<HTMLInputElement>(null)
  const [show, setShow] = useAtom(showProfileModalAtom)

  if (status === 'unauthenticated') return <></>

  const onChangeFile: ChangeEventHandler<HTMLInputElement> = async (event) => {
    const files = fileRef.current?.files
    if (!files || files.length !== 1) {
      return
    }
    const file = files[0]
    const blob = new Blob([file], { type: file.type })

    const toastId = toast.loading('이미지를 올리는 중이에요')

    try {
      const formData = new FormData()
      formData.append('file', blob)

      const result = await axios.post(profileImageURL, formData)
      console.log(result)

      toast.success('성공적으로 프로필 이미지을 저장했어요.', { id: toastId })
    } catch (e) {
      toast.error('이미지를 저장하는 중 문제가 발생하였어요', { id: toastId })
    }

    console.log(event)
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
        </div>
      </Modal>
    </>
  )
}
