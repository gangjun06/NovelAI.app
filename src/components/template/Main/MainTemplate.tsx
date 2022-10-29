import { ReactNode } from 'react'
import { NextSeo } from 'next-seo'
import classNames from 'classnames'

import { MainNav } from '~/components/organizm'
// import { MainFooter } from "~/components/organizm";

interface Props {
  title: string
  description: string
  children: ReactNode
  container?: boolean
}

export const MainTemplate = ({ title, description, children, container = false }: Props) => {
  return (
    <>
      <NextSeo title={`${title} | NovelAI.APP`} description={description} />
      <MainNav />
      <div className={'h-full pt-[70px]'}>
        {container ? <div className="container mx-auto mt-4">{children}</div> : children}
      </div>
      {/* <MainFooter /> */}
    </>
  )
}
