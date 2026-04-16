import { DataSource } from 'typeorm'
import { AppDataSource } from './data-source.js'

export interface Context {
  db: DataSource
}

export async function createContext(): Promise<Context> {
  return {
    db: AppDataSource,
  }
}
