import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
} from 'typeorm'
import { Repayment } from './Repayment.js'

@Entity('loans')
export class Loan {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @CreateDateColumn({ type: 'datetime' })
  createdAt: Date

  @Column('text')
  name: string

  @Column('float')
  principalAmount: number

  @Column('date')
  startDate: Date

  @Column('date')
  endDate: Date

  @OneToMany(() => Repayment, (repayment) => repayment.loan, {
    cascade: true,
  })
  repaymentSchedule: Repayment[]
}
