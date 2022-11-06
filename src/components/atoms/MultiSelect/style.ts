import colors from 'tailwindcss/colors'

import { useCurrentTheme } from '~/hooks/useCurrentTheme'

import { Props } from './types'

const HalfHex = '80'

export const useStyles = () => {
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

export const useTheme = () => {
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
