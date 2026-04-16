import type { FC } from 'react'
import { useParams } from 'react-router-dom'
import { graphql } from '../../__generated__'
import { useQuery } from '@apollo/client'
import { QueryResult } from '../../components/QueryResult'

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

export const Loan: FC<{}> = () => {
  const { id } = useParams()
  const { loading, error, data } = useQuery(GET_LOAN, {
    variables: { id: id! },
    skip: !id,
  })

  return (
    <div>
      <h1>Loan Page</h1>
      <QueryResult loading={loading} error={error}>
        {data?.loan && (
          <div>
            <h2>{data.loan.name}</h2>
            <p>Principal: {data.loan.principalAmount}</p>
            <p>Start Date: {data.loan.startDate}</p>
            <p>End Date: {data.loan.endDate}</p>
            <p>Total Expected Interest: {data.loan.totalExpectedInterest}</p>
            <h3>Repayment Schedule</h3>
            {data.loan.repaymentSchedule.map((repayment) => (
              <div key={repayment.id}>
                <p>Payment Date: {repayment.paymentDate}</p>
                <p>Payment Type: {repayment.paymentType}</p>
                <p>Principal Component: {repayment.principalComponent}</p>
                <p>Interest Component: {repayment.interestComponent}</p>
                <p>Total Payment: {repayment.totalPayment}</p>
                <p>Remaining Balance: {repayment.remainingBalance}</p>
              </div>
            ))}
          </div>
        )}
      </QueryResult>
    </div>
  )
}
