import { KeyboardEventHandler, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import Creatable from 'react-select/creatable'

import { useStyles, useTheme } from './style'
import { Props } from './types'

const components = {
  DropdownIndicator: null,
}

const createOption = (label: string) => ({
  label,
  value: `${Math.floor(Math.random() * 100000000000)}`,
})

export const MultiSelectContent = ({ values, onChange, maxValues = 100, ...props }: Props) => {
  const [inputValue, setInputValue] = useState('')
  const theme = useTheme()
  const styles = useStyles()

  const handleKeyDown: KeyboardEventHandler = (event) => {
    if (!inputValue) return
    switch (event.key) {
      case 'Enter':
      case 'Tab':
        if (values.length > maxValues) {
          setInputValue('')
          toast.error(`최대 ${maxValues}개 까지만 입력할 수 있어요.`)
          return
        }
        if (inputValue.length > 50) {
          setInputValue('')
          toast.error(`하나의 검색어당 50글자 까지만 입력할 수 있어요.`)
          return
        }
        onChange([...values, inputValue])
        setInputValue('')
        event.preventDefault()
    }
  }

  return (
    <Creatable
      styles={styles}
      theme={theme}
      components={components}
      inputValue={inputValue}
      isClearable
      isMulti
      menuIsOpen={false}
      onChange={(newValue) => onChange((newValue as any[]).map(({ label }) => label))}
      onInputChange={(newValue) => setInputValue(newValue)}
      onKeyDown={handleKeyDown}
      placeholder="태그를 입력후 엔터를 눌러주세요"
      value={values.map((label) => createOption(label))}
      {...props}
    />
  )
}
