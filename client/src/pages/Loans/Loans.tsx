import { type FC, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { useQuery } from '@apollo/client'
import { ArrowRight } from 'lucide-react'
import styled from 'styled-components'

import { graphql } from '~/__generated__'
import { Pagination } from '~/components/Pagination'
import { QueryResult } from '~/components/QueryResult'
import { formatCurrency, formatDate } from '~/utils'

import { TEXT } from './textConsts'

const PAGE_SIZE = 10
const GET_LOANS = graphql(`
  query Loans($page: Int, $pageSize: Int) {
    loans(loansPageInput: { page: $page, pageSize: $pageSize }) {
      items {
        id
        name
        principalAmount
        startDate
        endDate
        totalExpectedInterest
      }
      total
    }
  }
`)

export const Loans: FC = () => {
  const [page, setPage] = useState(0)

  const { loading, error, data } = useQuery(GET_LOANS, {
    variables: { page, pageSize: PAGE_SIZE },
  })

  const navigate = useNavigate()

  const total = data?.loans.total ?? 0
  const totalPages = Math.ceil(total / PAGE_SIZE)
  const items = data?.loans.items ?? []

  return (
    <div>
      <PageHeader>
        <div>
          <Title>{TEXT.title}</Title>
          <Subtitle>{TEXT.subtitle(total)}</Subtitle>
        </div>
      </PageHeader>

      <QueryResult loading={loading} error={error}>
        <TableWrap>
          <Table>
            <thead>
              <tr>
                <Th $first>{TEXT.columns.loanName}</Th>
                <Th $right>{TEXT.columns.principal}</Th>
                <Th>{TEXT.columns.startDate}</Th>
                <Th>{TEXT.columns.maturity}</Th>
                <Th $right>{TEXT.columns.totalInterest}</Th>
                <Th style={{ width: 52 }} />
              </tr>
            </thead>
            <tbody>
              {items.map((loan) => (
                <ClickRow
                  key={loan.id}
                  onClick={() => navigate(`/loans/${loan.id}`)}
                >
                  <Td $headline>{loan.name}</Td>
                  <Td $right>{formatCurrency(loan.principalAmount)}</Td>
                  <Td $muted>{formatDate(loan.startDate)}</Td>
                  <Td $muted>{formatDate(loan.endDate)}</Td>
                  <Td $right>{formatCurrency(loan.totalExpectedInterest)}</Td>
                  <Td>
                    <Arrow>
                      <ArrowRight size={16} />
                    </Arrow>
                  </Td>
                </ClickRow>
              ))}
            </tbody>
          </Table>
          <Pagination
            page={page}
            pageSize={PAGE_SIZE}
            totalPages={totalPages}
            total={total}
            onPageChange={setPage}
          />
        </TableWrap>
      </QueryResult>
    </div>
  )
}

const PageHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.space[8]};
`

const Title = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  font-weight: ${({ theme }) => theme.fontWeights.extrabold};
  color: ${({ theme }) => theme.colors.text1};
`

const Subtitle = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.base};
  color: ${({ theme }) => theme.colors.text2};
  margin-top: ${({ theme }) => theme.space[1]};
`

const TableWrap = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.radii.lg};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  overflow: hidden;
`

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`

const Th = styled.th<{ $right?: boolean; $first?: boolean }>`
  padding: 0 ${({ theme }) => theme.space[5]};
  padding-left: ${({ $first, theme }) =>
    $first ? theme.space[6] : theme.space[5]};
  height: ${({ theme }) => theme.components.headerHeight};
  font-size: ${({ theme }) => theme.fontSizes.xs};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  text-transform: uppercase;
  letter-spacing: ${({ theme }) => theme.letterSpacings.wide};
  color: ${({ theme }) => theme.colors.text3};
  text-align: ${({ $right }) => ($right ? 'right' : 'left')};
  border-bottom: 1px solid ${({ theme }) => theme.colors.borderDefault};
  background: ${({ theme }) => theme.colors.subtle};
  white-space: nowrap;
`

const ClickRow = styled.tr`
  cursor: pointer;

  &:last-child td {
    border-bottom: none;
  }

  &:hover td {
    background: ${({ theme }) => theme.colors.subtle};
  }

  &:hover .arrow {
    opacity: 1;
    transform: translateY(${({ theme }) => theme.space[1]});
  }
`

const Td = styled.td<{
  $right?: boolean
  $muted?: boolean
  $headline?: boolean
}>`
  padding: 0 ${({ theme }) => theme.space[5]};
  padding-left: ${({ $headline, theme }) =>
    $headline ? theme.space[6] : theme.space[5]};
  height: ${({ theme }) => theme.components.rowHeight};
  border-bottom: 1px solid ${({ theme }) => theme.colors.borderDefault};
  font-size: ${({ theme }) => theme.fontSizes.base};
  vertical-align: middle;
  text-align: ${({ $right }) => ($right ? 'right' : 'left')};
  font-variant-numeric: ${({ $right }) => ($right ? 'tabular-nums' : 'normal')};
  color: ${({ $muted, theme }) =>
    $muted ? theme.colors.text2 : theme.colors.text1};
  font-weight: ${({ $headline, theme }) =>
    $headline ? theme.fontWeights.semibold : theme.fontWeights.regular};
`

const Arrow = styled.span.attrs({ className: 'arrow' })`
  opacity: 0;
  transition:
    opacity 0.15s,
    transform 0.15s;
  color: ${({ theme }) => theme.colors.text3};
  display: block;
  text-align: right;
`
