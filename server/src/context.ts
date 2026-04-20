import DataLoader from 'dataloader'
import { DataSource, In } from 'typeorm'

import { AppDataSource } from './db/data-source.js'
import { Repayment } from './db/entities/Repayment.js'

export interface Context {
  db: DataSource
  loaders: {
    repaymentsByLoanId: DataLoader<string, Repayment[]>
  }
}

export async function createContext(): Promise<Context> {
  const repaymentsByLoanId = new DataLoader<string, Repayment[]>(
    async (loanIds) => {
      const repayments = await AppDataSource.getRepository(Repayment).find({
        where: { loanId: In([...loanIds]) },
      })

      const loanToRepaymentsMap = new Map<string, Repayment[]>()
      for (const repayment of repayments) {
        const loanRepayments = loanToRepaymentsMap.get(repayment.loanId) || []
        loanToRepaymentsMap.set(repayment.loanId, [
          ...loanRepayments,
          repayment,
        ])
      }

      return loanIds.map((loanId) => loanToRepaymentsMap.get(loanId) || [])
    }
  )

  return {
    db: AppDataSource,
    loaders: { repaymentsByLoanId },
  }
}
