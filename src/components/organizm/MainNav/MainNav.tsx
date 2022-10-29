import Link from 'next/link'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import { CogIcon } from '@heroicons/react/24/outline'
import { useSetAtom } from 'jotai'

import { Button, ButtonLink } from '~/components/atoms'
import { UserMenu } from '~/components/molecule'

import { SettingModal, showModalAtom } from '../SettingModal/SettingModal'

const NavItem = ({ name, href, isActive }: { name: string; href: string; isActive: boolean }) => {
  return (
    <Link passHref href={href}>
      <ButtonLink variant="subtle" active={isActive}>
        {name}
      </ButtonLink>
    </Link>
  )
}

export const MainNav = () => {
  const { pathname } = useRouter()
  const setShowSetting = useSetAtom(showModalAtom)
  const { data } = useSession()

  return (
    <>
      <SettingModal />
      <nav className="px-4 shadow fixed bg-white dark:bg-zinc-900 w-full z-10">
        <div className="sm:max-w-nav mx-auto flex justify-between items-center">
          <div className="flex gap-x-2 items-center overflow-x-scroll no-scroll py-4">
            <Link href="/" passHref>
              <a className="font-bold text-xl text-title-color pr-4">NovelAI.APP</a>
            </Link>
            <NavItem name="태그 생성기" href="/" isActive={pathname === '/'} />
            <NavItem name="EXIF 뷰어" href="/tools/exif" isActive={pathname === '/tools/exif'} />
            <NavItem name="정보" href="/about" isActive={pathname === '/about'} />
          </div>
          <div className="flex items-center gap-x-2">
            {data ? (
              <UserMenu {...data.user} openSetting={() => setShowSetting(true)} />
            ) : (
              <>
                <ButtonLink variant="light" className="my-4" href="/auth/signin">
                  로그인
                </ButtonLink>
                <Button
                  className="my-4"
                  variant="subtle"
                  forIcon
                  onClick={() => {
                    setShowSetting(true)
                  }}
                >
                  <CogIcon width={28} height={28} />
                </Button>
              </>
            )}
          </div>
        </div>
      </nav>
    </>
  )
}
