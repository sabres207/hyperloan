import styled, { css } from 'styled-components'

const base = css`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[1]};
  border-radius: ${({ theme }) => theme.radii.md};
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: ${({ theme }) => theme.fontSizes.base};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  cursor: pointer;
  border: 1.5px solid transparent;
  white-space: nowrap;
  outline: none;
`

export const Button = styled.button<{
  $variant?: 'primary' | 'outline' | 'ghost'
  $size?: 'sm' | 'md'
}>`
  ${base}

  height: ${({ $size, theme }) => ($size === 'sm' ? theme.space[8] : theme.components.controlHeight)};
  padding: 0
    ${({ $size, theme }) => ($size === 'sm' ? theme.space[3] : theme.space[4])};
  font-size: ${({ $size, theme }) =>
    $size === 'sm' ? theme.fontSizes.sm : theme.fontSizes.base};

  ${({ $variant = 'primary', theme }) => {
    switch ($variant) {
      case 'outline':
        return css`
          background: transparent;
          color: ${theme.colors.text1};
          border-color: ${theme.colors.borderStrong};
          &:hover {
            border-color: ${theme.colors.text1};
          }
        `
      case 'ghost':
        return css`
          background: transparent;
          color: ${theme.colors.text2};
          border-color: transparent;
          &:hover {
            background: ${theme.colors.subtle};
            color: ${theme.colors.text1};
          }
        `
      default:
        return css`
          background: ${theme.colors.accent};
          color: ${theme.colors.textInverse};
          border-color: ${theme.colors.accent};
          &:hover {
            background: ${theme.colors.accentHover};
            border-color: ${theme.colors.accentHover};
          }
        `
    }
  }}

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`
