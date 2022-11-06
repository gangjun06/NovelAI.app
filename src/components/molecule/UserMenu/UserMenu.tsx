import Image from 'next/image'
import { signOut } from 'next-auth/react'

import { Transition } from '~/components/atoms'
import { Menu } from '~/components/molecule'

interface Props {
  id?: string
  name?: string | null
  image?: string | null
  email?: string | null
  openSetting?: () => void
}

export const UserMenu = ({ id, name, image, email, openSetting }: Props) => {
  return (
    <Menu>
      <Menu.Button>
        <button className="flex items-center rounded-xl px-2 py-1.5 transition-all duration-300 hover:bg-black/5 dark:hover:bg-white/5 text-subtitle-color">
          <span className="sr-only">유저메뉴 열기</span>
          <Image className="rounded-full" src={image || ''} alt="avatar" width={32} height={32} />
          <div className="ml-2 font-bold leading-tight">{name}</div>
        </button>
      </Menu.Button>
      <Transition type="size">
        <Menu.Dropdown>
          <Menu.ItemLink href={`/profile/${id}`}>프로필</Menu.ItemLink>
          <Menu.Item onClick={openSetting}>설정</Menu.Item>
          <Menu.Item onClick={() => signOut()}>로그아웃</Menu.Item>
        </Menu.Dropdown>
      </Transition>
    </Menu>
  )
}
