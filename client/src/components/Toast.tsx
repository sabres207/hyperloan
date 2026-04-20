import { useEffect, type FC } from 'react'
import { createPortal } from 'react-dom'
import styled, { keyframes } from 'styled-components'

type ToastProps = {
  message: string
  onDismiss: () => void
  duration?: number
}

export const Toast: FC<ToastProps> = ({ message, onDismiss, duration = 3000 }) => {
  useEffect(() => {
    const timer = setTimeout(onDismiss, duration)
    return () => clearTimeout(timer)
  }, [onDismiss, duration])

  return createPortal(
    <ToastContainer role="status" aria-live="polite">
      <CheckIcon>&#10003;</CheckIcon>
      {message}
    </ToastContainer>,
    document.body
  )
}

const slideUp = keyframes`
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
`

const ToastContainer = styled.div`
  position: fixed;
  bottom: ${({ theme }) => theme.space[6]};
  left: 50%;
  transform: translateX(-50%);
  z-index: 400;
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[2]};
  background: ${({ theme }) => theme.colors.success};
  color: #fff;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  padding: ${({ theme }) => theme.space[3]} ${({ theme }) => theme.space[4]};
  border-radius: ${({ theme }) => theme.radii.full};
  box-shadow: ${({ theme }) => theme.shadows.lg};
  animation: ${slideUp} 0.2s ease-out;
  white-space: nowrap;
`

const CheckIcon = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  border-radius: ${({ theme }) => theme.radii.full};
  background: rgba(255, 255, 255, 0.25);
  font-size: 10px;
  line-height: 1;
  flex-shrink: 0;
`
