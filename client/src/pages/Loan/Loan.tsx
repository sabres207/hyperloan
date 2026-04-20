import type { FC } from 'react'
import { useParams, Link } from 'react-router-dom'
import { graphql } from '../../__generated__'
import { useQuery } from '@apollo/client'
import { QueryResult } from '../../components/QueryResult'
import { Badge } from '../../components/Badge'
import { formatCurrency, formatCurrencyExact, formatDate } from '../../utils'
import { TEXT } from './textConsts'
import styled from 'styled-components'

const GET_LOAN = graphql(`
  query Loan($id: ID!) {
    loan(id: $id) {
      id
      name
      principalAmount
      startDate
      endDate
      totalExpectedInterest
      repaymentSchedule {
        id
        paymentDate
        paymentType
        principalComponent
        interestComponent
        totalPayment
        remainingBalance
      }
    }
  }
`)

export const Loan: FC = () => {
  const { id } = useParams()
  const { loading, error, data } = useQuery(GET_LOAN, {
    variables: { id: id! },
    skip: !id,
  })

  const loan = data?.loan
  const repayments = loan?.repaymentSchedule ?? []
  const totalPayments = repayments.length

  return (
    <QueryResult loading={loading} error={error}>
      {loan && (
        <div>
          <Breadcrumb>
            <BcLink to="/loans">{TEXT.breadcrumbParent}</BcLink>
            <BcSep>/</BcSep>
            <span>{loan.name}</span>
          </Breadcrumb>

          <PageHeader>
            <div>
              <Title>{loan.name}</Title>
              <Subtitle>{TEXT.subtitle(totalPayments)}</Subtitle>
            </div>
          </PageHeader>

          <SumGrid>
            <SumCard>
              <SumLabel>{TEXT.cards.principal}</SumLabel>
              <SumValue>{formatCurrency(loan.principalAmount)}</SumValue>
            </SumCard>
            <SumCard>
              <SumLabel>{TEXT.cards.totalInterest}</SumLabel>
              <SumValue>{formatCurrency(loan.totalExpectedInterest)}</SumValue>
            </SumCard>
            <SumCard>
              <SumLabel>{TEXT.cards.startDate}</SumLabel>
              <SumValue>{formatDate(loan.startDate)}</SumValue>
            </SumCard>
            <SumCard>
              <SumLabel>{TEXT.cards.maturity}</SumLabel>
              <SumValue>{formatDate(loan.endDate)}</SumValue>
            </SumCard>
          </SumGrid>

          <TableWrap>
            <Table>
              <thead>
                <tr>
                  <Th style={{ width: 56, paddingLeft: 24 }}>{TEXT.columns.number}</Th>
                  <Th>{TEXT.columns.paymentDate}</Th>
                  <Th>{TEXT.columns.type}</Th>
                  <ThR>{TEXT.columns.principal}</ThR>
                  <ThR>{TEXT.columns.interest}</ThR>
                  <ThR>{TEXT.columns.totalDue}</ThR>
                  <ThR style={{ paddingRight: 24 }}>{TEXT.columns.remainingBalance}</ThR>
                </tr>
              </thead>
              <tbody>
                {repayments.map((r, i) => {
                  const isLast = i === repayments.length - 1
                  return (
                    <Tr key={r.id} $highlight={isLast}>
                      <TdNum style={{ paddingLeft: 24 }}>{i + 1}</TdNum>
                      <Td>{formatDate(r.paymentDate)}</Td>
                      <Td>
                        <Badge
                          variant={
                            r.paymentType === 'PRINCIPAL_PLUS_INTEREST'
                              ? 'principal'
                              : 'interest'
                          }
                        />
                      </Td>
                      <TdR>
                        {r.principalComponent > 0 ? (
                          <strong>
                            {formatCurrencyExact(r.principalComponent)}
                          </strong>
                        ) : (
                          <Dash>—</Dash>
                        )}
                      </TdR>
                      <TdR>{formatCurrencyExact(r.interestComponent)}</TdR>
                      <TdR $bold={isLast}>
                        {formatCurrencyExact(r.totalPayment)}
                      </TdR>
                      <TdR
                        style={{ paddingRight: 24 }}
                        $bold={isLast}
                        $success={isLast}
                      >
                        {formatCurrencyExact(r.remainingBalance)}
                      </TdR>
                    </Tr>
                  )
                })}
              </tbody>
            </Table>
          </TableWrap>
        </div>
      )}
    </QueryResult>
  )
}

const Breadcrumb = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[2]};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.text2};
  margin-bottom: ${({ theme }) => theme.space[5]};
`

const BcLink = styled(Link)`
  color: ${({ theme }) => theme.colors.accent};
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`

const BcSep = styled.span`
  color: ${({ theme }) => theme.colors.text3};
`

const PageHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.space[8]};
`

const Title = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes.display};
  font-weight: ${({ theme }) => theme.fontWeights.extrabold};
  letter-spacing: ${({ theme }) => theme.letterSpacings.tight};
  line-height: 1.15;
  color: ${({ theme }) => theme.colors.text1};
`

const Subtitle = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.base};
  color: ${({ theme }) => theme.colors.text2};
  margin-top: ${({ theme }) => theme.space[1]};
`

const SumGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: ${({ theme }) => theme.space[4]};
  margin-bottom: ${({ theme }) => theme.space[7]};
`

const SumCard = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.radii.lg};
  padding: ${({ theme }) => theme.space[5]} ${({ theme }) => theme.space[5]};
  box-shadow: ${({ theme }) => theme.shadows.sm};
`

const SumLabel = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.xs};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  text-transform: uppercase;
  letter-spacing: ${({ theme }) => theme.letterSpacings.wide};
  color: ${({ theme }) => theme.colors.text3};
  margin-bottom: ${({ theme }) => theme.space[2]};
`

const SumValue = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  letter-spacing: ${({ theme }) => theme.letterSpacings.snug};
  font-variant-numeric: tabular-nums;
  color: ${({ theme }) => theme.colors.text1};
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

const Th = styled.th`
  padding: 0 ${({ theme }) => theme.space[5]};
  height: ${({ theme }) => theme.components.headerHeight};
  font-size: ${({ theme }) => theme.fontSizes.xs};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  text-transform: uppercase;
  letter-spacing: ${({ theme }) => theme.letterSpacings.wide};
  color: ${({ theme }) => theme.colors.text3};
  text-align: left;
  border-bottom: 1px solid ${({ theme }) => theme.colors.borderDefault};
  background: ${({ theme }) => theme.colors.subtle};
  white-space: nowrap;
`

const ThR = styled(Th)`
  text-align: right;
`

const Tr = styled.tr<{ $highlight?: boolean }>`
  background: ${({ $highlight, theme }) =>
    $highlight ? theme.colors.accentSubtle : 'transparent'};

  &:last-child td {
    border-bottom: none;
  }
`

const Td = styled.td`
  padding: 0 ${({ theme }) => theme.space[5]};
  height: ${({ theme }) => theme.components.rowHeight};
  border-bottom: 1px solid ${({ theme }) => theme.colors.borderDefault};
  font-size: ${({ theme }) => theme.fontSizes.base};
  vertical-align: middle;
  color: ${({ theme }) => theme.colors.text1};
`

const TdNum = styled(Td)`
  color: ${({ theme }) => theme.colors.text3};
  font-size: ${({ theme }) => theme.fontSizes.sm};
`

const TdR = styled(Td)<{ $bold?: boolean; $success?: boolean }>`
  text-align: right;
  font-variant-numeric: tabular-nums;
  font-weight: ${({ $bold }) => ($bold ? 700 : 400)};
  color: ${({ $success, theme }) =>
    $success ? theme.colors.success : theme.colors.text1};
`

const Dash = styled.span`
  color: ${({ theme }) => theme.colors.text3};
`
