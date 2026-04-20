import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

import { Moon, Sun } from 'lucide-react'
import styled from 'styled-components'

import { useThemeToggle } from '~/styles/theme'

import { Logo } from './Logo'

type LayoutProps = {
  children: ReactNode
  onNewLoan?: () => void
}

export const Layout = ({ children, onNewLoan }: LayoutProps) => {
  const { isDark, toggle } = useThemeToggle()

  return (
    <Wrapper>
      <Nav>
        <NavLogo to="/loans">
          <Logo />
          <Wordmark>Hyperloan</Wordmark>
        </NavLogo>
        <Spacer />
        {onNewLoan && (
          <NewLoanBtn onClick={onNewLoan}>
            <span style={{ fontSize: 17, lineHeight: 1, marginTop: -1 }}>
              +
            </span>{' '}
            New Loan
          </NewLoanBtn>
        )}
        <ThemeButton onClick={toggle} title="Toggle theme">
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </ThemeButton>
      </Nav>
      <Page>{children}</Page>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  min-height: 100vh;
`

const Nav = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: ${({ theme }) => theme.components.navHeight};
  background: ${({ theme }) => theme.colors.surface};
  border-bottom: 1px solid ${({ theme }) => theme.colors.borderDefault};
  z-index: 100;
  display: flex;
  align-items: center;
  padding: 0 ${({ theme }) => theme.space[10]};
  gap: ${({ theme }) => theme.space[2]};
`

const NavLogo = styled(Link)`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[2]};
  text-decoration: none;
  padding: ${({ theme }) => theme.space[1]} ${({ theme }) => theme.space[2]};
  border-radius: ${({ theme }) => theme.radii.md};
  transition: background 0.15s;
  margin-right: ${({ theme }) => theme.space[4]};

  &:hover {
    background: ${({ theme }) => theme.colors.subtle};
  }
`

const Wordmark = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.md};
  font-weight: ${({ theme }) => theme.fontWeights.extrabold};
  letter-spacing: ${({ theme }) => theme.letterSpacings.tight};
  color: ${({ theme }) => theme.colors.text1};
`

const Spacer = styled.div`
  flex: 1;
`

const NewLoanBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[1]};
  height: ${({ theme }) => theme.components.controlHeight};
  padding: 0 ${({ theme }) => theme.space[4]};
  border-radius: ${({ theme }) => theme.radii.md};
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: ${({ theme }) => theme.fontSizes.base};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  background: ${({ theme }) => theme.colors.accent};
  color: ${({ theme }) => theme.colors.textInverse};
  border: 1.5px solid ${({ theme }) => theme.colors.accent};
  cursor: pointer;
  transition: all 0.15s;
  white-space: nowrap;

  &:hover {
    background: ${({ theme }) => theme.colors.accentHover};
    border-color: ${({ theme }) => theme.colors.accentHover};
  }
`

const ThemeButton = styled.button`
  width: ${({ theme }) => theme.components.iconBtnSizeLg};
  height: ${({ theme }) => theme.components.iconBtnSizeLg};
  background: transparent;
  color: ${({ theme }) => theme.colors.text2};
  border: 1.5px solid ${({ theme }) => theme.colors.borderDefault};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: ${({ theme }) => theme.space[3]};
  flex-shrink: 0;
  cursor: pointer;
  transition: all 0.15s;

  &:hover {
    color: ${({ theme }) => theme.colors.text1};
    border-color: ${({ theme }) => theme.colors.borderStrong};
    background: ${({ theme }) => theme.colors.subtle};
  }
`

const Page = styled.main`
  padding-top: calc(
    ${({ theme }) => theme.components.navHeight} +
      ${({ theme }) => theme.space[10]}
  );
  padding-bottom: ${({ theme }) => theme.space[20]};
  min-height: 100vh;
  max-width: ${({ theme }) => theme.components.maxWidth};
  margin: 0 auto;
  padding-left: ${({ theme }) => theme.space[10]};
  padding-right: ${({ theme }) => theme.space[10]};
`
