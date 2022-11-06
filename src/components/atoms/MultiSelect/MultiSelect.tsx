import { ComponentProps, KeyboardEventHandler, useEffect, useState } from 'react'
import Creatable from 'react-select/creatable'
import colors from 'tailwindcss/colors'

import { useCurrentTheme } from '~/hooks/useCurrentTheme'

type Props = ComponentProps<typeof Creatable> & {
  values: string[]
  onChange: (values: string[]) => void
}

const HalfHex = '80'

const useStyles = () => {
  const currentTheme = useCurrentTheme()

  const style: Props['styles'] = {
    input: (styles) => ({
      ...styles,
      input: {
        ':focus': {
          boxShadow: 'none',
          outline: 'none',
        },
      },
    }),
    multiValueLabel: (styles) => ({
      ...styles,
      color: currentTheme === 'dark' ? colors.sky['300'] : colors.sky['600'],
    }),
    multiValue: (styles) => ({
      ...styles,
      backgroundColor:
        currentTheme === 'dark'
          ? `${colors.sky['700']}${HalfHex}`
          : `${colors.sky['300']}${HalfHex}`,
    }),
    multiValueRemove: (styles) => ({
      ...styles,
      color: currentTheme === 'dark' ? colors.sky['300'] : colors.sky['600'],
      ':hover': {
        color: currentTheme === 'dark' ? colors.white : colors.white,
        backgroundColor: currentTheme === 'dark' ? `${colors.sky['700']}` : `${colors.sky['300']}`,
      },
    }),
  }
  return style
}

const useTheme = () => {
  const currentTheme = useCurrentTheme()

  const theme: Props['theme'] = (theme) => ({
    borderRadius: 8,
    colors: {
      ...theme.colors,
      primary: currentTheme === 'dark' ? 'rgb(2 132 199)' : 'rgb(56 189 248)', // focus border
      neutral0: currentTheme === 'dark' ? 'rgb(39 39 42 / 0.6)' : '#ffffff', // background
      neutral10: currentTheme === 'dark' ? 'rgb(63 63 70 / 0.7)' : '#f3f4f6', // Card
      neutral20: currentTheme === 'dark' ? 'rgb(82 82 91)' : 'rgb(209 213 219)', // border
      neutral30: currentTheme === 'dark' ? '#71717a' : '#9ca3af', // hover border
      neutral50: theme.colors.neutral50, // Placeholder
      neutral80: currentTheme === 'dark' ? '#f4f4f5' : '#3f3f46', // "font color"
    },
    spacing: {
      ...theme.spacing,
    },
  })
  return theme
}

const components = {
  DropdownIndicator: null,
}

interface Option {
  readonly label: string
  readonly value: string
}

const createOption = (label: string) => ({
  label,
  value: label,
})

export const MultiSelect = ({ values: _values, onChange, ...props }: Props) => {
  const [inputValue, setInputValue] = useState('')
  const [value, setValue] = useState<readonly Option[]>([])
  const theme = useTheme()
  const styles = useStyles()

  const handleKeyDown: KeyboardEventHandler = (event) => {
    if (!inputValue) return
    switch (event.key) {
      case 'Enter':
      case 'Tab':
        setValue((prev) => [...prev, createOption(inputValue)])
        setInputValue('')
        event.preventDefault()
    }
  }

  useEffect(() => {
    onChange(value.map((data) => data.value))
  }, [onChange, value])

  return (
    <Creatable
      styles={styles}
      theme={theme}
      components={components}
      inputValue={inputValue}
      isClearable
      isMulti
      menuIsOpen={false}
      onChange={(newValue) => setValue(newValue as any)}
      onInputChange={(newValue) => setInputValue(newValue)}
      onKeyDown={handleKeyDown}
      placeholder="태그를 입력후 엔터를 눌러주세요"
      value={value}
      {...props}
    />
  )
}
