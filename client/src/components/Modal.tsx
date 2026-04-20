import { type FC, type ReactNode, useCallback, useEffect } from 'react'
import { createPortal } from 'react-dom'

import styled from 'styled-components'

import { TEXT } from './textConsts'

type ModalProps = {
  isOpen: boolean
  onClose: () => void
  title: string
  children: ReactNode
  footer?: ReactNode
  disableClose?: boolean
}

export const Modal: FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  disableClose = false,
}) => {
  const handleClose = useCallback(() => {
    if (!disableClose) {
      onClose()
    }
  }, [disableClose, onClose])

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        handleClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', onKeyDown)
    }

    return () => {
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [isOpen, handleClose])

  if (!isOpen) return null

  return createPortal(
    <Overlay
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          handleClose()
        }
      }}
      $open={isOpen}
    >
      <ModalContainer>
        <Header>
          <Title>{title}</Title>
          <CloseBtn
            onClick={handleClose}
            aria-label={TEXT.close}
            disabled={disableClose}
          >
            &times;
          </CloseBtn>
        </Header>
        <Body>{children}</Body>
        {footer && <Footer>{footer}</Footer>}
      </ModalContainer>
    </Overlay>,
    document.body
  )
}

const Overlay = styled.div<{ $open: boolean }>`
  position: fixed;
  inset: 0;
  background: rgba(14, 20, 32, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
`

const ModalContainer = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.components.modalRadius};
  box-shadow: ${({ theme }) => theme.shadows.xl};
  width: ${({ theme }) => theme.components.modalWidth};
  max-width: calc(100vw - ${({ theme }) => theme.space[8]});
`

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => `${theme.space[5]} ${theme.space[6]}`};
  border-bottom: 1px solid ${({ theme }) => theme.colors.borderDefault};
`

const Title = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.subtitle};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  letter-spacing: ${({ theme }) => theme.letterSpacings.snug};
  color: ${({ theme }) => theme.colors.text1};
`

const CloseBtn = styled.button`
  width: ${({ theme }) => theme.components.iconBtnSize};
  height: ${({ theme }) => theme.components.iconBtnSize};
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: ${({ theme }) => theme.radii.md};
  color: ${({ theme }) => theme.colors.text2};
  cursor: pointer;
  font-size: ${({ theme }) => theme.fontSizes.lg};
  line-height: 1;
  border: none;
  background: none;
  font-family: ${({ theme }) => theme.fonts.sans};
  transition: all 0.15s;

  &:hover {
    background: ${({ theme }) => theme.colors.subtle};
    color: ${({ theme }) => theme.colors.text1};
  }
`

const Body = styled.div`
  padding: ${({ theme }) => theme.space[6]};
`

const Footer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.space[2]};
  padding: ${({ theme }) => theme.space[4]} ${({ theme }) => theme.space[6]};
  border-top: 1px solid ${({ theme }) => theme.colors.borderDefault};
`
