import { NextPage } from 'next'
import dynamic from 'next/dynamic'

const HomeContent = dynamic(() => import('~/components/pages/Home').then((d) => d.Home), {
  ssr: false,
})

const Tags: NextPage = () => {
  return <HomeContent />
}

export default Tags
