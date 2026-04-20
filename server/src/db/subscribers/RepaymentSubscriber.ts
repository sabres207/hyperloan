import {
  EntitySubscriberInterface,
  EventSubscriber,
  RemoveEvent,
  UpdateEvent,
} from 'typeorm'
import { Decimal } from '../../decimal.js'
import { Loan } from '../entities/Loan.js'
import { Repayment } from '../entities/Repayment.js'

@EventSubscriber()
export class RepaymentSubscriber implements EntitySubscriberInterface<Repayment> {
  listenTo() {
    return Repayment
  }

  async afterUpdate(event: UpdateEvent<Repayment>): Promise<void> {
    const loanId = event.entity?.loanId ?? event.databaseEntity?.loanId
    if (!loanId) return

    const newInterest: Decimal | undefined = event.entity?.interestComponent
    const oldInterest: Decimal | undefined =
      event.databaseEntity?.interestComponent

    if (newInterest && oldInterest) {
      const delta = newInterest.minus(oldInterest)
      if (delta.isZero()) return
      const loan = await event.manager.findOneOrFail(Loan, {
        where: { id: loanId },
      })
      await event.manager.update(Loan, loanId, {
        totalExpectedInterest: loan.totalExpectedInterest.plus(delta),
      })
    } else {
      await recomputeTotalInterest(loanId, event.manager)
    }
  }

  async afterRemove(event: RemoveEvent<Repayment>): Promise<void> {
    const loanId = event.databaseEntity?.loanId
    if (!loanId) return
    const removedInterest: Decimal = event.databaseEntity.interestComponent
    const loan = await event.manager.findOneOrFail(Loan, {
      where: { id: loanId },
    })
    await event.manager.update(Loan, loanId, {
      totalExpectedInterest: loan.totalExpectedInterest.minus(removedInterest),
    })
  }
}

async function recomputeTotalInterest(
  loanId: string,
  manager: UpdateEvent<Repayment>['manager']
): Promise<void> {
  const repayments = await manager.find(Repayment, { where: { loanId } })
  const totalExpectedInterest = repayments.reduce(
    (sum, r) => sum.plus(r.interestComponent),
    new Decimal(0)
  )
  await manager.update(Loan, loanId, { totalExpectedInterest })
}
