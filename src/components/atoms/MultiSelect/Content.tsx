import { KeyboardEventHandler, useState } from 'react'
import Creatable from 'react-select/creatable'

import { useStyles, useTheme } from './style'
import { Props } from './types'

const components = {
  DropdownIndicator: null,
}

const createOption = (label: string) => ({
  label,
  value: label,
})

export const MultiSelectContent = ({ values, onChange, ...props }: Props) => {
  const [inputValue, setInputValue] = useState('')
  const theme = useTheme()
  const styles = useStyles()

  const handleKeyDown: KeyboardEventHandler = (event) => {
    if (!inputValue) return
    switch (event.key) {
      case 'Enter':
      case 'Tab':
        console.log(inputValue)
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
      onChange={(newValue) =>
        onChange((newValue as any).map(({ value }: { value: string }) => value))
      }
      onInputChange={(newValue) => setInputValue(newValue)}
      onKeyDown={handleKeyDown}
      placeholder="태그를 입력후 엔터를 눌러주세요"
      value={values.map((data: any) => createOption(data))}
      {...props}
    />
  )
}
