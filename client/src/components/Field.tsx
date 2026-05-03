import { type InputHTMLAttributes, forwardRef } from 'react'

import styled from 'styled-components'

type FieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string
  error?: string
  hint?: string
}

export const Field = forwardRef<HTMLInputElement, FieldProps>(
  ({ label, error, hint, ...inputProps }, ref) => {
    return (
      <Wrapper>
        <Label>{label}</Label>
        <Input ref={ref} $hasError={!!error} {...inputProps} />
        {error && <ErrorMsg>{error}</ErrorMsg>}
        {!error && hint && <Hint>{hint}</Hint>}
      </Wrapper>
    )
  }
)

Field.displayName = 'Field'

const Wrapper = styled.div`
  margin-bottom: ${({ theme }) => theme.space[5]};
  &:last-child {
    margin-bottom: 0;
  }
`

export const Label = styled.label`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.text1};
  margin-bottom: ${({ theme }) => theme.space[1]};
  display: block;
`

const Input = styled.input<{ $hasError?: boolean }>`
  width: 100%;
  height: ${({ theme }) => theme.components.inputHeight};
  padding: 0 ${({ theme }) => theme.space[3]};
  border: 1.5px solid
    ${({ $hasError, theme }) =>
      $hasError ? theme.colors.danger : theme.colors.borderStrong};
  border-radius: ${({ theme }) => theme.radii.md};
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: ${({ theme }) => theme.fontSizes.base};
  color: ${({ theme }) => theme.colors.text1};
  background: ${({ theme }) => theme.colors.surface};
  transition:
    border-color 0.15s,
    box-shadow 0.15s;
  outline: none;
  appearance: none;

  &::placeholder {
    color: ${({ theme }) => theme.colors.text3};
  }

  &:focus {
    border-color: ${({ $hasError, theme }) =>
      $hasError ? theme.colors.danger : theme.colors.accent};
    box-shadow: ${({ $hasError, theme }) =>
      `${theme.shadows.focusRing} ${$hasError ? theme.colors.dangerSubtle : theme.colors.accentSubtle}`};
  }
`

const ErrorMsg = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.label};
  color: ${({ theme }) => theme.colors.danger};
  margin-top: ${({ theme }) => theme.space[1]};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
`

const Hint = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.label};
  color: ${({ theme }) => theme.colors.text3};
  margin-top: ${({ theme }) => theme.space[1]};
`
