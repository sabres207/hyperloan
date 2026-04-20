import type { FC } from 'react'

import styled from 'styled-components'

import { Logo } from '~/components/Logo'

import { TEXT } from './textConsts'

export const EmptyState: FC = () => (
  <Wrap>
    <IconWrap>
      <Logo size={40} />
    </IconWrap>
    <Title>{TEXT.empty.title}</Title>
    <Description>{TEXT.empty.description}</Description>
  </Wrap>
)

const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: ${({ theme }) => theme.space[16]} ${({ theme }) => theme.space[6]};
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.radii.lg};
  box-shadow: ${({ theme }) => theme.shadows.sm};
`

const IconWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 72px;
  height: 72px;
  border-radius: ${({ theme }) => theme.radii.xl};
  background: ${({ theme }) => theme.colors.subtle};
  margin-bottom: ${({ theme }) => theme.space[6]};
`

const Title = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.text1};
  margin-bottom: ${({ theme }) => theme.space[2]};
`

const Description = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.base};
  color: ${({ theme }) => theme.colors.text2};
  text-align: center;
  max-width: 360px;
  line-height: 1.6;
`
