import { useCallback, useState } from 'react'

export const useDisclosure = (): [
  boolean,
  { open: () => void; close: () => void; toggle: () => void },
] => {
  const [opened, setOpened] = useState<boolean>(false)

  const open = useCallback(() => {
    setOpened(true)
  }, [setOpened])
  const close = useCallback(() => {
    setOpened(false)
  }, [setOpened])
  const toggle = useCallback(() => {
    setOpened((prev) => !prev)
  }, [setOpened])

  return [opened, { open, close, toggle }]
}
