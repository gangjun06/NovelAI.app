import { useEffect } from 'react'
import React from 'react'
import { Toaster } from 'react-hot-toast'
import type { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import { SessionProvider } from 'next-auth/react'
import { Hydrate, QueryClient, QueryClientProvider } from '@tanstack/react-query'

import '~/styles/globals.scss'
import 'swiper/css'

import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/scrollbar'
import 'swiper/css/effect-fade'
import 'swiper/css/free-mode'
import 'swiper/css/thumbs'

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter()
  const [queryClient] = React.useState(() => new QueryClient())

  useEffect(() => {
    const handleRouteChange = (url: any) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      if (typeof gtag !== 'undefined' && typeof gtag.pageview === 'function') {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        gtag.pageview(url)
      }
    }
    router.events.on('routeChangeComplete', handleRouteChange)
    router.events.on('hashChangeComplete', handleRouteChange)
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange)
      router.events.off('hashChangeComplete', handleRouteChange)
    }
  }, [router.events])

  return (
    <QueryClientProvider client={queryClient}>
      <Hydrate state={(pageProps as any).dehydratedState}>
        <SessionProvider session={(pageProps as any).session}>
          <Toaster />
          <Component {...pageProps} />
        </SessionProvider>
      </Hydrate>
    </QueryClientProvider>
  )
}

export default MyApp
