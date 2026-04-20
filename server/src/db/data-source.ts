import 'reflect-metadata'
import { DataSource } from 'typeorm'

import { Loan } from './entities/Loan.js'
import { Repayment } from './entities/Repayment.js'
import { RepaymentSubscriber } from './subscribers/RepaymentSubscriber.js'

export const AppDataSource = new DataSource({
  type: 'better-sqlite3',
  database: './data/hyperloan.db',
  synchronize: false,
  logging: false,
  entities: [Loan, Repayment],
  subscribers: [RepaymentSubscriber],
  migrations: ['src/db/migrations/*.ts'],
})
