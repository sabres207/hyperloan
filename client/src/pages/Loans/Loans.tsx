import { useState, type FC } from 'react'
import { useNavigate } from 'react-router-dom'
import { CreateLoanModal } from './CreateLoanModal'
import { graphql } from '../../__generated__'
import { useQuery } from '@apollo/client'
import { QueryResult } from '../../components/QueryResult'
import styled from 'styled-components'

const PAGE_SIZE = 3
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

export const Loans: FC<{}> = () => {
  const [page, setPage] = useState(0)
  const [showModal, setShowModal] = useState(false)

  const { loading, error, data } = useQuery(GET_LOANS, {
    variables: { page, pageSize: PAGE_SIZE },
  })

  const navigate = useNavigate()
  const handleLoanClick = (loanId: string) => () => {
    navigate(`/loans/${loanId}`)
  }

  const total = data?.loans.total ?? 0
  const totalPages = Math.ceil(total / PAGE_SIZE)
  const items = data?.loans.items ?? []

  const handleNextClick = () => {
    if (page >= totalPages - 1) {
      return
    }
    setPage((p) => p + 1)
  }

  const handlePrevClick = () => {
    if (page === 0) {
      return
    }
    setPage((p) => p - 1)
  }

  return (
    <div>
      <Title>Loans Page</Title>
      <QueryResult loading={loading} error={error}>
        <div>total loans: {total}</div>
        {items.map((loan) => (
          <LoanItem key={loan.id} onClick={handleLoanClick(loan.id)}>
            <p>name: {loan.name}</p>
            <p>principalAmount: {loan.principalAmount}</p>
            <p>startDate: {loan.startDate}</p>
            <p>endDate: {loan.endDate}</p>
            <p>totalExpectedInterest: {loan.totalExpectedInterest}</p>
          </LoanItem>
        ))}
        <div>pages: {totalPages}</div>
        <div>curr page: {page + 1}</div>
        <button onClick={handlePrevClick}>prev</button>
        <button onClick={handleNextClick}>next</button>
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
