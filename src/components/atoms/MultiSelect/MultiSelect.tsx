import dynamic from 'next/dynamic'

export const MultiSelect = dynamic(
  () => import('./Content').then(({ MultiSelectContent }) => MultiSelectContent),
  {
    ssr: false,
  },
)
