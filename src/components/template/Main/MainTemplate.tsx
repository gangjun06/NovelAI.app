import { ReactNode } from 'react'
import { NextSeo } from 'next-seo'

import { MainNav } from '~/components/organizm'
// import { MainFooter } from "~/components/organizm";

interface Props {
  title: string
  description: string
  children: ReactNode
}

export const MainTemplate = ({ title, description, children }: Props) => {
  return (
    <>
      <NextSeo title={`${title} | NovelAI.APP`} description={description} />
      <MainNav />
      <div className="h-full pt-[70px]">{children}</div>
      {/* <MainFooter /> */}
    </>
  )
}
