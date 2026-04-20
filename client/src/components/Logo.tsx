import type { FC } from 'react'

import { useTheme } from 'styled-components'

type LogoProps = {
  size?: number
}

export const Logo: FC<LogoProps> = ({ size = 28 }) => {
  const theme = useTheme()
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 28 28"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M14 2.5L23.5 8v12L14 25.5 4.5 20V8L14 2.5z"
        fill={theme.colors.accent}
      />
      <path
        d="M10.5 9h2.2v3.8h2.6V9H17.5v10h-2.2v-4H12.7v4H10.5V9z"
        fill={theme.colors.textInverse}
      />
    </svg>
  )
}
