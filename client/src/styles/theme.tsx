import { createContext, useContext, type ReactNode } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import {
  createGlobalStyle,
  ThemeProvider as SCThemeProvider,
} from 'styled-components'

const lightColors = {
  bgPage: '#f5f7fc',
  surface: '#ffffff',
  subtle: '#f1f4fa',
  borderDefault: '#e2e8f2',
  borderStrong: '#c8d1e3',
  borderFocus: '#2457e8',
  text1: '#0e1420',
  text2: '#5d6b82',
  text3: '#9aa3b5',
  textInverse: '#ffffff',
  accent: '#2457e8',
  accentHover: '#1c46cc',
  accentSubtle: '#eef2fd',
  success: '#16a34a',
  successSubtle: '#f0fdf4',
  danger: '#dc2626',
  dangerSubtle: '#fef2f2',
} as const

const darkColors: { [K in keyof typeof lightColors]: string } = {
  bgPage: '#0e1420',
  surface: '#1a2233',
  subtle: '#222d3f',
  borderDefault: '#2a3650',
  borderStrong: '#3a4a66',
  borderFocus: '#4a7aff',
  text1: '#e8ecf2',
  text2: '#9aa3b5',
  text3: '#6b7a90',
  textInverse: '#0e1420',
  accent: '#4a7aff',
  accentHover: '#6090ff',
  accentSubtle: '#1c2a4a',
  success: '#22c55e',
  successSubtle: '#0f2a1a',
  danger: '#ef4444',
  dangerSubtle: '#2a1010',
}

const fonts = {
  sans: "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif",
  mono: "'JetBrains Mono', 'Fira Code', monospace",
} as const

const fontSizes = {
  '2xs': '10px',
  xs: '11px',
  sm: '13px',
  base: '14px',
  md: '16px',
  lg: '20px',
  xl: '24px',
  '2xl': '30px',
  '3xl': '38px',
} as const

const fontWeights = {
  regular: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
  extrabold: 800,
} as const

const space = {
  0: '0px',
  1: '4px',
  2: '8px',
  3: '12px',
  4: '16px',
  5: '20px',
  6: '24px',
  7: '28px',
  8: '32px',
  10: '40px',
  12: '48px',
  16: '64px',
  20: '80px',
} as const

const radii = {
  none: '0px',
  sm: '4px',
  md: '6px',
  lg: '10px',
  xl: '14px',
  '2xl': '20px',
  full: '9999px',
} as const

const shadows = {
  xs: '0 1px 2px rgba(14,20,32,0.05)',
  sm: '0 1px 3px rgba(14,20,32,0.06), 0 1px 2px rgba(14,20,32,0.04)',
  md: '0 4px 16px rgba(14,20,32,0.08), 0 2px 4px rgba(14,20,32,0.04)',
  lg: '0 12px 32px rgba(14,20,32,0.10), 0 4px 8px rgba(14,20,32,0.05)',
  xl: '0 20px 60px rgba(14,20,32,0.16), 0 4px 12px rgba(14,20,32,0.08)',
  nav: '0 1px 0 #e2e8f2',
} as const

const components = {
  navHeight: '64px',
  maxWidth: '1100px',
  rowHeight: '56px',
  modalWidth: '480px',
  modalRadius: '14px',
  inputHeight: '42px',
} as const

export interface AppTheme {
  colors: { [K in keyof typeof lightColors]: string }
  fonts: typeof fonts
  fontSizes: typeof fontSizes
  fontWeights: typeof fontWeights
  space: typeof space
  radii: typeof radii
  shadows: typeof shadows
  components: typeof components
}

declare module 'styled-components' {
  export interface DefaultTheme extends AppTheme {}
}

export const lightTheme: AppTheme = {
  colors: lightColors,
  fonts,
  fontSizes,
  fontWeights,
  space,
  radii,
  shadows,
  components,
}

export const darkTheme: AppTheme = {
  colors: darkColors,
  fonts,
  fontSizes,
  fontWeights,
  space,
  radii,
  shadows,
  components,
}

interface ThemeCtxValue {
  isDark: boolean
  toggle: () => void
}

const ThemeCtx = createContext<ThemeCtxValue>({
  isDark: false,
  toggle: () => {},
})

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [isDark, setIsDark] = useLocalStorage('hyperloan-dark-mode', false)
  const toggle = () => setIsDark((d: boolean) => !d)
  const theme = isDark ? darkTheme : lightTheme
  return (
    <ThemeCtx.Provider value={{ isDark, toggle }}>
      <SCThemeProvider theme={theme}>{children}</SCThemeProvider>
    </ThemeCtx.Provider>
  )
}

export function useThemeToggle() {
  return useContext(ThemeCtx)
}

export const GlobalStyles = createGlobalStyle`
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  html, body { height: 100%; -webkit-font-smoothing: antialiased; }

  body {
    font-family: ${({ theme }) => theme.fonts.sans};
    background: ${({ theme }) => theme.colors.bgPage};
    color: ${({ theme }) => theme.colors.text1};
    font-size: ${({ theme }) => theme.fontSizes.base};
    line-height: 1.5;
  }
`
