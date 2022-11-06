import { useEffect, useState } from 'react'
import { useAtomValue } from 'jotai'

import { themeAtom } from './useSetting'

export const useCurrentTheme = () => {
  const themeSetting = useAtomValue(themeAtom)

  const [theme, setTheme] = useState(
    themeSetting === 'system'
      ? document.getElementsByTagName('html')[0].classList.contains('dark')
        ? 'dark'
        : 'light'
      : themeSetting,
  )

  useEffect(() => {
    const html = document.getElementsByTagName('html')[0]

    const observer = new MutationObserver(function (_event) {
      setTheme(
        themeSetting === 'system'
          ? document.getElementsByTagName('html')[0].classList.contains('dark')
            ? 'dark'
            : 'light'
          : themeSetting,
      )
    })

    observer.observe(html, {
      attributes: true,
      attributeFilter: ['class'],
      childList: false,
      characterData: false,
    })

    return () => observer.disconnect()
  }, [themeSetting])

  return theme
}
