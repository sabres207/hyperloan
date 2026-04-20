import type { ReactNode } from 'react'

import type { ApolloError } from '@apollo/client'

import { TEXT } from './textConsts'

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
  if (loading) return <p>{TEXT.loading}</p>
  if (error) return <p>{TEXT.errorPrefix}{error.message}</p>

  return <>{children}</>
}
