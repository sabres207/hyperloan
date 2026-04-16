import { DateResolver } from 'graphql-scalars'
import { PaymentType, Resolvers } from './__generated__/resolvers-types.js'

export const resolvers: Resolvers = {
  Date: DateResolver,
  Query: {
    loans: () => MOCK_LOANS,
    loan: (_, { id }) => MOCK_LOANS.find((loan) => loan.id === id) ?? null,
  },
  Mutation: {
    createLoan: (
      _,
      { createLoanInput: { name, principalAmount, startDate, endDate } }
    ) => {
      return {
        id: '1',
        name,
        principalAmount,
        startDate,
        endDate,
        totalExpectedInterest: 0,
        repaymentSchedule: [],
      }
    },
  },
  Loan: {},
  Repayment: {},
}

const MOCK_LOANS = [
  {
    id: '1',
    name: 'Loan 1',
    principalAmount: 10000,
    startDate: new Date('2026-01-01'),
    endDate: new Date('2026-02-15'),
    totalExpectedInterest: 80,
    repaymentSchedule: [
      {
        id: '1',
        paymentDate: new Date('2026-01-30'),
        paymentType: PaymentType.Interest,
        principalComponent: 0,
        interestComponent: 50,
        totalPayment: 50,
        remainingBalance: 10000,
      },
      {
        id: '2',
        paymentDate: new Date('2026-02-15'),
        paymentType: PaymentType.PrincipalPlusInterest,
        principalComponent: 10000,
        interestComponent: 30,
        totalPayment: 10030,
        remainingBalance: 0,
      },
    ],
  },
  {
    id: '2',
    name: 'Loan 2',
    principalAmount: 500,
    startDate: new Date('2026-05-15'),
    endDate: new Date('2026-07-31'),
    totalExpectedInterest: 10,
    repaymentSchedule: [
      {
        id: '3',
        paymentDate: new Date('2026-05-31'),
        paymentType: PaymentType.Interest,
        principalComponent: 0,
        interestComponent: 2,
        totalPayment: 2,
        remainingBalance: 500,
      },
      {
        id: '4',
        paymentDate: new Date('2026-06-30'),
        paymentType: PaymentType.Interest,
        principalComponent: 0,
        interestComponent: 4,
        totalPayment: 4,
        remainingBalance: 500,
      },
      {
        id: '5',
        paymentDate: new Date('2026-07-31'),
        paymentType: PaymentType.PrincipalPlusInterest,
        principalComponent: 500,
        interestComponent: 4,
        totalPayment: 504,
        remainingBalance: 0,
      },
    ],
  },
]
