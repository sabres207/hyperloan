import { gql } from 'graphql-tag'

export const typeDefs = gql`
  scalar Date
  scalar DateTime

  type Query {
    loans(loansPageInput: LoansPageInput): LoansPage!
    loan(id: ID!): Loan
  }

  type LoansPage {
    items: [Loan!]!
    total: Int!
  }

  type Mutation {
    createLoan(createLoanInput: CreateLoanInput!): Loan!
  }

  type Loan {
    id: ID!
    createdAt: DateTime!
    name: String!
    principalAmount: String!
    startDate: Date!
    endDate: Date!
    totalExpectedInterest: String!
    repaymentSchedule: [Repayment!]!
  }

  type Repayment {
    id: ID!
    createdAt: DateTime!
    paymentDate: Date!
    paymentType: PaymentType!
    principalComponent: String!
    interestComponent: String!
    totalPayment: String!
    remainingBalance: String!
  }

  enum PaymentType {
    INTEREST
    PRINCIPAL_PLUS_INTEREST
  }

  input LoansPageInput {
    page: Int
    pageSize: Int
  }

  input CreateLoanInput {
    name: String!
    principalAmount: String!
    startDate: Date!
    endDate: Date!
  }

  enum PaymentOnNonWorkDays {
    ALLOWED
    MOVE_TO_PREV_WORK_DAY
    MOVE_TO_NEXT_WORK_DAY
  }
`
