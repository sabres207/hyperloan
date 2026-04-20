import type { FC } from 'react'
import styled from 'styled-components'

type BadgeProps = {
  variant: 'interest' | 'principal'
}

export const Badge: FC<BadgeProps> = ({ variant }) => {
  return variant === 'principal' ? (
    <PrincipalBadge>Principal + Interest</PrincipalBadge>
  ) : (
    <InterestBadge>Interest only</InterestBadge>
  )
}

const BaseBadge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: ${({ theme }) => theme.space[1]} ${({ theme }) => theme.space[2]};
  border-radius: ${({ theme }) => theme.radii.sm};
  font-size: ${({ theme }) => theme.fontSizes.xs};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
`

const InterestBadge = styled(BaseBadge)`
  background: ${({ theme }) => theme.colors.accentSubtle};
  color: ${({ theme }) => theme.colors.accent};
`

const PrincipalBadge = styled(BaseBadge)`
  background: ${({ theme }) => theme.colors.successSubtle};
  color: ${({ theme }) => theme.colors.success};
`
