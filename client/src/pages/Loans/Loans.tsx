import type { FC } from 'react'
import { CreateLoanModal } from './CreateLoanModal'
import { graphql } from '../../__generated__'
import { useQuery } from '@apollo/client'
import { QueryResult } from '../../components/QueryResult'

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

  return (
    <div>
      <h1>Loans Page</h1>
      <CreateLoanModal />
      <QueryResult loading={loading} error={error}>
        {data?.loans.map((loan) => (
          <div key={loan.id}>{loan.name}</div>
        ))}
      </QueryResult>
    </div>
  )
}
