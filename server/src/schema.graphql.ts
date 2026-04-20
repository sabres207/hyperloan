import { gql } from 'graphql-tag'

export const typeDefs = gql`
  scalar Date

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
    name: String!
    principalAmount: Float!
    startDate: Date!
    endDate: Date!
    totalExpectedInterest: Float!
    repaymentSchedule: [Repayment!]!
  }

  type Repayment {
    id: ID!
    paymentDate: Date!
    paymentType: PaymentType!
    principalComponent: Float!
    interestComponent: Float!
    totalPayment: Float!
    remainingBalance: Float!
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
    principalAmount: Float!
    startDate: Date!
    endDate: Date!
  }
`
