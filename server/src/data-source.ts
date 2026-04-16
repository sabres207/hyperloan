import 'reflect-metadata'
import { DataSource } from 'typeorm'

export const AppDataSource = new DataSource({
  type: 'better-sqlite3',
  database: './data/hyperloan.db',
  synchronize: true,
  logging: false,
  entities: [],
})
