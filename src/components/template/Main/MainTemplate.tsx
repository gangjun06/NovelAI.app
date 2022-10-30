import { ReactNode } from 'react'
import Router from 'next/router'
import { useSession } from 'next-auth/react'
import { NextSeo } from 'next-seo'
import classNames from 'classnames'

import { Button, ButtonLink } from '~/components/atoms'
import { PageBack } from '~/components/molecule'
import { ErrorPage, MainNav } from '~/components/organizm'
import { setRedirect } from '~/lib/auth'
// import { MainFooter } from "~/components/organizm";

interface Props {
  title: string
  description: string
  children: ReactNode
  container?: boolean
  tiny?: boolean
  pageBack?: {
    label: string
    to: string
  }
  requireAuth?: boolean
  showTitle?: boolean
}

export const MainTemplate = ({
  title,
  description,
  children,
  container = false,
  tiny = false,
  pageBack,
  requireAuth = false,
  showTitle = true,
}: Props) => {
  const { data: session } = useSession()
  return (
    <>
      <NextSeo title={`${title} | NovelAI.APP`} description={description} />
      <MainNav />

      <div className={'h-full pt-[70px]'}>
        {container ? (
          <div
            className={classNames('container mx-auto pt-4 pb-8 px-4 h-full', tiny && 'max-w-4xl')}
          >
            {pageBack && <PageBack label={pageBack.label} to={pageBack.to} />}
            {showTitle && (
              <div
                className={classNames(
                  'text-title-color font-bold text-4xl mt-2 mb-4',
                  requireAuth && !session && 'brightness-50',
                )}
              >
                {title}
              </div>
            )}
            {requireAuth && !session ? (
              <div className="text-center mt-48 text-title-color">
                <div className="text-5xl font-bold mb-6">로그인이 필요합니다</div>
                <Button
                  onClick={() => {
                    setRedirect()
                    Router.push('/auth/signin')
                  }}
                  variant="primary"
                >
                  로그인
                </Button>
              </div>
            ) : (
              children
            )}
          </div>
        ) : (
          children
        )}
      </div>
      {/* <MainFooter /> */}
    </>
  )
}
