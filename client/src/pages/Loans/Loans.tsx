import { useState, type FC } from 'react'
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
    }
  }
`)

export const Loans: FC<{}> = () => {
  const { loading, error, data } = useQuery(GET_LOANS)
  const [showModal, setShowModal] = useState(false)

  return (
    <div>
      <Title>Loans Page</Title>
      <QueryResult loading={loading} error={error}>
        {data?.loans.map((loan) => (
          <div key={loan.id}>{loan.name}</div>
        ))}
      </QueryResult>
      <button onClick={() => setShowModal(true)}>Create Loan</button>
      <CreateLoanModal showModal={showModal} setShowModal={setShowModal} />
    </div>
  )
}

const Title = styled.h1``
