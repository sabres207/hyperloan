import { DateResolver } from 'graphql-scalars'
import { Resolvers } from './__generated__/resolvers-types.js'
import { AppDataSource } from './data-source.js'
import { Loan } from './entities/Loan.js'
import { createBulletLoan } from './services/loan.js'

const DEFAULT_PAGE = 0
const DEFAULT_PAGE_SIZE = 10
const MAX_PAGE_SIZE = 100

export const resolvers: Resolvers = {
  Date: DateResolver,
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
      return createBulletLoan(db, createLoanInput)
    },
  },
  Loan: {
    repaymentSchedule: async ({ id }, _, { loaders }) => {
      return loaders.repaymentsByLoanId.load(id)
    },
  },
}
