import { ReactNode } from 'react'
import { NextSeo } from 'next-seo'
import classNames from 'classnames'

import { PageBack } from '~/components/molecule'
import { MainNav } from '~/components/organizm'
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
}

export const MainTemplate = ({
  title,
  description,
  children,
  container = false,
  tiny = false,
  pageBack,
}: Props) => {
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
            <div className="text-title-color font-bold text-4xl mt-2 mb-4">{title}</div>
            {children}
          </div>
        ) : (
          children
        )}
      </div>
      {/* <MainFooter /> */}
    </>
  )
}
