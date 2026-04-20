import type { FC } from 'react'
import styled from 'styled-components'

type PaginationProps = {
  page: number
  pageSize: number
  totalPages: number
  total: number
  onPageChange: (page: number) => void
}

export const Pagination: FC<PaginationProps> = ({
  page,
  pageSize,
  totalPages,
  total,
  onPageChange,
}) => {
  const startItem = page * pageSize + 1
  const endItem = Math.min(startItem + pageSize - 1, total)
  return (
    <Bar>
      <Info>
        Showing {startItem}&ndash;{endItem} of {total} loans
      </Info>
      <Buttons>
        <PageBtn onClick={() => onPageChange(page - 1)} disabled={page === 0}>
          &lsaquo;
        </PageBtn>
        {Array.from({ length: totalPages }, (_, i) => (
          <PageBtn key={i} $active={i === page} onClick={() => onPageChange(i)}>
            {i + 1}
          </PageBtn>
        ))}
        <PageBtn
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages - 1}
        >
          &rsaquo;
        </PageBtn>
      </Buttons>
    </Bar>
  )
}

const Bar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => theme.space[4]} ${({ theme }) => theme.space[5]};
  border-top: 1px solid ${({ theme }) => theme.colors.borderDefault};
`

const Info = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.text2};
`

const Buttons = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.space[1]};
`

const PageBtn = styled.button<{ $active?: boolean }>`
  width: ${({ theme }) => theme.components.pageBtnSize};
  height: ${({ theme }) => theme.components.pageBtnSize};
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: ${({ theme }) => theme.radii.md};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  font-family: ${({ theme }) => theme.fonts.sans};
  cursor: pointer;
  border: 1px solid
    ${({ $active, theme }) =>
      $active ? theme.colors.accent : theme.colors.borderDefault};
  background: ${({ $active, theme }) =>
    $active ? theme.colors.accent : theme.colors.surface};
  color: ${({ $active, theme }) =>
    $active ? theme.colors.textInverse : theme.colors.text2};

  &:hover:not(:disabled):not([class*='active']) {
    border-color: ${({ $active, theme }) =>
      $active ? theme.colors.accent : theme.colors.borderStrong};
    color: ${({ $active, theme }) =>
      $active ? theme.colors.textInverse : theme.colors.text1};
  }

  &:disabled {
    opacity: 0.35;
    cursor: not-allowed;
  }
`
