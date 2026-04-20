import 'reflect-metadata'

import { PaymentType } from './__generated__/resolvers-types.js'
import { AppDataSource } from './db/data-source.js'
import { Loan } from './db/entities/Loan.js'
import { Repayment } from './db/entities/Repayment.js'
import { Decimal } from './decimal.js'

async function seed() {
  await AppDataSource.initialize()

  const loanRepository = AppDataSource.getRepository(Loan)
  const repaymentRepository = AppDataSource.getRepository(Repayment)

  // Clear existing data
  await repaymentRepository.clear()
  await loanRepository.clear()

  // Create loans
  const loan1 = loanRepository.create({
    id: '1',
    name: 'Loan 1',
    principalAmount: new Decimal(10000),
    totalExpectedInterest: new Decimal(80),
    startDate: '2026-01-01',
    endDate: '2026-02-15',
  })
  await loanRepository.save(loan1)

  const loan2 = loanRepository.create({
    id: '2',
    name: 'Loan 2',
    principalAmount: new Decimal(500),
    totalExpectedInterest: new Decimal(10),
    startDate: '2026-05-15',
    endDate: '2026-07-31',
  })
  await loanRepository.save(loan2)

  // Create repayments
  await repaymentRepository.save([
    repaymentRepository.create({
      id: '1',
      loanId: '1',
      paymentDate: '2026-01-30',
      paymentType: PaymentType.Interest,
      principalComponent: new Decimal(0),
      interestComponent: new Decimal(50),
      totalPayment: new Decimal(50),
      remainingBalance: new Decimal(10000),
    }),
    repaymentRepository.create({
      id: '2',
      loanId: '1',
      paymentDate: '2026-02-15',
      paymentType: PaymentType.PrincipalPlusInterest,
      principalComponent: new Decimal(10000),
      interestComponent: new Decimal(30),
      totalPayment: new Decimal(10030),
      remainingBalance: new Decimal(0),
    }),
    repaymentRepository.create({
      id: '3',
      loanId: '2',
      paymentDate: '2026-05-31',
      paymentType: PaymentType.Interest,
      principalComponent: new Decimal(0),
      interestComponent: new Decimal(2),
      totalPayment: new Decimal(2),
      remainingBalance: new Decimal(500),
    }),
    repaymentRepository.create({
      id: '4',
      loanId: '2',
      paymentDate: '2026-06-30',
      paymentType: PaymentType.Interest,
      principalComponent: new Decimal(0),
      interestComponent: new Decimal(4),
      totalPayment: new Decimal(4),
      remainingBalance: new Decimal(500),
    }),
    repaymentRepository.create({
      id: '5',
      loanId: '2',
      paymentDate: '2026-07-31',
      paymentType: PaymentType.PrincipalPlusInterest,
      principalComponent: new Decimal(500),
      interestComponent: new Decimal(4),
      totalPayment: new Decimal(504),
      remainingBalance: new Decimal(0),
    }),
  ])

  console.log('Database seeded successfully!')
  await AppDataSource.destroy()
}

seed().catch(console.error)
