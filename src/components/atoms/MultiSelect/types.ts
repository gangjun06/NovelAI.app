import { ComponentProps } from 'react'
import Creatable from 'react-select/creatable'

export type Props = Omit<Partial<ComponentProps<typeof Creatable>>, 'onChange'> & {
  values: string[]
  onChange: (values: string[]) => void
}
