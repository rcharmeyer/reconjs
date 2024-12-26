import React, {createContext, ReactNode, useContext} from 'react'

import {ThemeName} from '@/bsky/alf/types'
import {darkTheme, defaultTheme, dimTheme} from './themes'
import { Theme } from './types'

export interface ThemeProviderProps {
  children?: ReactNode
  theme: ThemeName
}

export const ThemeContext = createContext <Theme> (defaultTheme)

export const useTheme = () => useContext(ThemeContext)

function getTheme(theme: ThemeName) {
  switch (theme) {
    case 'light':
      return defaultTheme
    case 'dim':
      return dimTheme
    case 'dark':
      return darkTheme
    default:
      return defaultTheme
  }
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  theme,
  children,
}) => {
  const themeValue = getTheme(theme)

  return (
    <ThemeContext.Provider value={themeValue}>{children}</ThemeContext.Provider>
  )
}