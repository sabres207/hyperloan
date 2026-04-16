import { useState, type FC } from 'react'
import { useNavigate } from 'react-router-dom'
import { CreateLoanModal } from './CreateLoanModal'
import { graphql } from '../../__generated__'
import { useQuery } from '@apollo/client'
import { QueryResult } from '../../components/QueryResult'
import styled from 'styled-components'

const GET_LOANS = graphql(`
  query Loans {
    loans {
      id
      name
      principalAmount
      startDate
      endDate
      totalExpectedInterest
    }
  }
`)

export const Loans: FC<{}> = () => {
  const { loading, error, data } = useQuery(GET_LOANS)
  const [showModal, setShowModal] = useState(false)
  const navigate = useNavigate()
  const handleLoanClick = (loanId: string) => () => {
    navigate(`/loans/${loanId}`)
  }

  return (
    <div>
      <Title>Loans Page</Title>
      <QueryResult loading={loading} error={error}>
        {data?.loans.map((loan) => (
          <LoanItem key={loan.id} onClick={handleLoanClick(loan.id)}>
            <p>name: {loan.name}</p>
            <p>principalAmount: {loan.principalAmount}</p>
            <p>startDate: {loan.startDate}</p>
            <p>endDate: {loan.endDate}</p>
            <p>totalExpectedInterest: {loan.totalExpectedInterest}</p>
          </LoanItem>
        ))}
      </QueryResult>
      <button onClick={() => setShowModal(true)}>Create Loan</button>
      <CreateLoanModal showModal={showModal} setShowModal={setShowModal} />
    </div>
  )
}

const Title = styled.h1``
const LoanItem = styled.div`
  cursor: pointer;
  display: flex;
  gap: 4px;
`
