import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm'
import { PaymentType } from '../../__generated__/resolvers-types.js'
import { Decimal, decimalTransformer } from '../../decimal.js'
import { Loan } from './Loan.js'

@Entity('repayments')
export class Repayment {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column('date')
  paymentDate: string

  @CreateDateColumn({ type: 'datetime' })
  createdAt: Date

  @Column({
    type: 'text',
    enum: PaymentType,
    default: PaymentType.Interest,
  })
  paymentType: PaymentType

  @Column({ type: 'text', transformer: decimalTransformer })
  principalComponent: Decimal

  @Column({ type: 'text', transformer: decimalTransformer })
  interestComponent: Decimal

  @Column({ type: 'text', transformer: decimalTransformer })
  totalPayment: Decimal

  @Column({ type: 'text', transformer: decimalTransformer })
  remainingBalance: Decimal

  @ManyToOne(() => Loan, (loan) => loan.repaymentSchedule, {
    onDelete: 'CASCADE',
  })
  loan: Loan

  @Column('text')
  loanId: string
}
