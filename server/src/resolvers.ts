import { DateResolver } from 'graphql-scalars'
import { Resolvers } from './__generated__/resolvers-types.js'
import { AppDataSource } from './data-source.js'
import { Loan } from './entities/Loan.js'
import { Repayment } from './entities/Repayment.js'

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
    createLoan: async (
      _,
      { createLoanInput: { name, principalAmount, startDate, endDate } }
    ) => {
      // TODO: use loan service logic for repayment schedule creation
      const loanRepository = AppDataSource.getRepository(Loan)
      const loan = loanRepository.create({
        name,
        principalAmount,
        startDate,
        endDate,
      })
      return loanRepository.save(loan)
    },
  },
  Loan: {
    totalExpectedInterest: async ({ id }, _, { db }) => {
      const repaymentRepository = db.getRepository(Repayment)
      const totalInterst = await repaymentRepository.sum('interestComponent', {
        loanId: id,
      })
      return totalInterst || 0
    },
    repaymentSchedule: async ({ id }, _, { db }) => {
      const repaymentRepository = db.getRepository(Repayment)
      return repaymentRepository.find({ where: { loanId: id } })
    },
  },
}
