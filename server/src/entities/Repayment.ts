import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm'
import { PaymentType } from '../__generated__/resolvers-types.js'
import { Loan } from './Loan.js'

@Entity('repayments')
export class Repayment {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column('date')
  paymentDate: Date

  @CreateDateColumn({ type: 'datetime' })
  createdAt: Date

  @Column({
    type: 'text',
    enum: PaymentType,
    default: PaymentType.Interest,
  })
  paymentType: PaymentType

  @Column('float')
  principalComponent: number

  @Column('float')
  interestComponent: number

  @Column('float')
  totalPayment: number

  @Column('float')
  remainingBalance: number

  @ManyToOne(() => Loan, (loan) => loan.repaymentSchedule, {
    onDelete: 'CASCADE',
  })
  loan: Loan

  @Column('text')
  loanId: string
}
