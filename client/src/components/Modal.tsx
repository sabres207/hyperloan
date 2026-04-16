import { useEffect, type FC, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import styled from 'styled-components'
import { X } from 'lucide-react'

type ModalProps = {
  isOpen: boolean
  onClose: () => void
  children: ReactNode
  title?: string
}

export const Modal: FC<ModalProps> = ({ isOpen, onClose, children, title }) => {
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key == 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', onKeyDown)
    }

    return () => {
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return createPortal(
    <Overlay onClick={onClose}>
      <ModalContainer onClick={(event) => event.stopPropagation()}>
        <Header>
          <CloseButton onClick={onClose} width={24} height={24} />
          {!!title && <Title>{title}</Title>}
        </Header>
        {children}
      </ModalContainer>
    </Overlay>,
    document.body
  )
}

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
`

const ModalContainer = styled.div`
  background: white;
  border-radius: 12px;
  width: min(500px, 80vw);
  height: min(400px, 80vh);
  padding: 24px;
  box-shadow: 0 0 30px rgba(0, 0, 0, 0.2);
`

const Header = styled.div`
  display: flex;
  flex-direction: row-reverse;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-bottom: 24px;
`

const Title = styled.h2`
  font-size: 24px;
  color: #333;
  font-weight: bold;
  margin: 0;
`

const CloseButton = styled(X)`
  font-size: 20px;
  cursor: pointer;
  color: #666;
  &:hover {
    color: #000;
  }
`
