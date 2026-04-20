import { GraphQLError } from 'graphql'
import { DateTimeResolver, LocalDateResolver } from 'graphql-scalars'

import { Resolvers } from './__generated__/resolvers-types.js'
import { AppDataSource } from './db/data-source.js'
import { Loan } from './db/entities/Loan.js'
import { createBulletLoan } from './services/loan.js'

const DEFAULT_PAGE = 0
const DEFAULT_PAGE_SIZE = 10
const MAX_PAGE_SIZE = 100

export const resolvers: Resolvers = {
  Date: LocalDateResolver,
  DateTime: DateTimeResolver,
  Query: {
    loans: async (_, { loansPageInput }) => {
      const page = loansPageInput?.page || DEFAULT_PAGE
      const pageSize = Math.min(
        loansPageInput?.pageSize ?? DEFAULT_PAGE_SIZE,
        MAX_PAGE_SIZE
      )
      const loanRepository = AppDataSource.getRepository(Loan)
      const [items, total] = await loanRepository.findAndCount({
        skip: page * pageSize,
        take: pageSize,
        order: { createdAt: 'DESC' },
      })
      return { items, total }
    },
    loan: async (_, { id }) => {
      const loanRepository = AppDataSource.getRepository(Loan)
      return loanRepository.findOne({ where: { id } })
    },
  },
  Mutation: {
    createLoan: async (_, { createLoanInput }, { db }) => {
      const { startDate, endDate } = createLoanInput
      if (endDate <= startDate) {
        throw new GraphQLError('endDate must be after startDate')
      }
      return createBulletLoan(db, createLoanInput)
    },
  },
  Loan: {
    repaymentSchedule: async ({ id }, _, { loaders }) => {
      return loaders.repaymentsByLoanId.load(id)
    },
  },
}
