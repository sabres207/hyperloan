import 'reflect-metadata'
import { DataSource } from 'typeorm'
import { Loan } from './entities/Loan.js'
import { Repayment } from './entities/Repayment.js'

export const AppDataSource = new DataSource({
  type: 'better-sqlite3',
  database: './data/hyperloan.db',
  synchronize: true,
  logging: false,
  entities: [Loan, Repayment],
})
