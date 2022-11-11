import dynamic from 'next/dynamic'

export const CollectionCreateModal = dynamic(
  () =>
    import('./Content').then(({ CollectionCreateModalContent }) => CollectionCreateModalContent),
  { ssr: false },
)
