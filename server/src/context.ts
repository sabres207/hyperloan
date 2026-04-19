import DataLoader from 'dataloader'
import { DataSource, In } from 'typeorm'
import { AppDataSource } from './data-source.js'
import { Repayment } from './entities/Repayment.js'

export interface Context {
  db: DataSource
  loaders: {
    repaymentsByLoanId: DataLoader<string, Repayment[]>
    totalInterestByLoanId: DataLoader<string, number>
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

  const totalInterestByLoanId = new DataLoader<string, number>(
    async (loanIds) => {
      const results = await AppDataSource.getRepository(Repayment)
        .createQueryBuilder('r')
        .select('r.loanId', 'loanId')
        .addSelect('SUM(r.interestComponent)', 'totalInterest')
        .where('r.loanId IN (:...loanIds)', { loanIds: [...loanIds] })
        .groupBy('r.loanId')
        .getRawMany<{ loanId: string; totalInterest: number }>()

      const loanToTotalInterestMap = new Map(
        results.map((r) => [r.loanId, r.totalInterest])
      )
      return loanIds.map((loanId) => loanToTotalInterestMap.get(loanId) || 0)
    }
  )

  return {
    db: AppDataSource,
    loaders: { repaymentsByLoanId, totalInterestByLoanId },
  }
}
