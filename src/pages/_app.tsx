import { useEffect } from 'react'
import { Toaster } from 'react-hot-toast'
import type { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import { SessionProvider } from 'next-auth/react'

import '~/styles/globals.scss'

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter()

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
    <SessionProvider session={(pageProps as any).session}>
      <Toaster />
      <Component {...pageProps} />
    </SessionProvider>
  )
}

export default MyApp
