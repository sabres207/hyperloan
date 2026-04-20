import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
} from 'typeorm'
import { Decimal, decimalTransformer } from '../../decimal.js'
import { Repayment } from './Repayment.js'

@Entity('loans')
export class Loan {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @CreateDateColumn({ type: 'datetime' })
  createdAt: Date

  @Column('text')
  name: string

  @Column({ type: 'text', transformer: decimalTransformer })
  principalAmount: Decimal

  @Column({ type: 'text', transformer: decimalTransformer })
  totalExpectedInterest: Decimal

  @Column('date')
  startDate: string

  @Column('date')
  endDate: string

  @OneToMany(() => Repayment, (repayment) => repayment.loan, {
    cascade: true,
  })
  repaymentSchedule: Repayment[]
}
