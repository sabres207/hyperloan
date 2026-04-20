import { DateResolver } from 'graphql-scalars'
import { Resolvers } from './__generated__/resolvers-types.js'
import { AppDataSource } from './data-source.js'
import { Loan } from './entities/Loan.js'
import { createBulletLoan } from './services/loan.js'

export const resolvers: Resolvers = {
  Date: DateResolver,
  Query: {
    loans: async () => {
      const loanRepository = AppDataSource.getRepository(Loan)
      return loanRepository.find()
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
    totalExpectedInterest: async ({ id }, _, { loaders }) => {
      return loaders.totalInterestByLoanId.load(id)
    },
    repaymentSchedule: async ({ id }, _, { loaders }) => {
      return loaders.repaymentsByLoanId.load(id)
    },
  },
}
