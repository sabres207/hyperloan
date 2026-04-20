import type { ReactNode } from 'react'

import type { ApolloError } from '@apollo/client'

type QueryResultProps = {
  loading: boolean

  error?: ApolloError
  children: ReactNode
}

export const QueryResult = ({
  loading,
  error,

  children,
}: QueryResultProps) => {
  if (loading) return <p>Loading...</p>
  if (error) return <p>Error: {error.message}</p>

  return <>{children}</>
}
