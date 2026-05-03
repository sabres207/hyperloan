import dayjs from 'dayjs'
import { DataSource } from 'typeorm'

import {
  CreateLoanInput,
  PaymentOnNonWorkDays,
  PaymentType,
} from '../__generated__/resolvers-types.js'
import { Loan } from '../db/entities/Loan.js'
import { Repayment } from '../db/entities/Repayment.js'
import { Decimal } from '../decimal.js'
import { RateDataPoint, getRateTimeline } from './fred.js'

type RepaymentData = Omit<Repayment, 'id' | 'createdAt' | 'loan' | 'loanId'>
type MonthSegment = {
  rate: Decimal
  daysInPrevMonth: number
  daysInNextMonth: number
  daysInMonth: number
}

const VIRTUAL_DAYS_IN_MONTH = 30
const VIRTUAL_DAYS_IN_YEAR = 360

export async function createBulletLoan(
  db: DataSource,
  input: CreateLoanInput
): Promise<Loan> {
  const { repaymentSchedule, totalExpectedInterest } =
    await buildBulletLoanSchedule(input)

  return db.getRepository(Loan).save({
    name: input.name,
    principalAmount: new Decimal(input.principalAmount),
    startDate: input.startDate,
    endDate: input.endDate,
    totalExpectedInterest,
    repaymentSchedule,
    paymentOnNonWorkDays: input.paymentOnNonWorkDays,
  })
}

async function buildBulletLoanSchedule(loan: CreateLoanInput): Promise<{
  repaymentSchedule: RepaymentData[]
  totalExpectedInterest: Decimal
}> {
  const { startDate, endDate, principalAmount, paymentOnNonWorkDays } = loan
  const principal = new Decimal(principalAmount)
  const rateTimeline = await getRateTimeline(startDate, endDate)
  const maturityDate = dayjs(endDate)

  const repaymentSchedule: RepaymentData[] = []
  let currentRateIndex = 0
  let currentDate = dayjs(startDate)

  while (!currentDate.isAfter(maturityDate, 'month')) {
    const isLastMonth = currentDate.isSame(maturityDate, 'month')
    const endOfMonth = getEndOfMonth(
      currentDate,
      maturityDate,
      isLastMonth,
      paymentOnNonWorkDays
    )
    const startOfMonth = getStartOfMonth(currentDate, repaymentSchedule)

    const { monthSegments, nextRateIndex } = buildMonthSegments(
      rateTimeline,
      startOfMonth,
      endOfMonth,
      currentRateIndex,
      currentDate
    )
    currentRateIndex = nextRateIndex

    repaymentSchedule.push(
      buildRepayment(
        currentDate.daysInMonth(),
        endOfMonth.format('YYYY-MM-DD'),
        isLastMonth,
        principal,
        monthSegments
      )
    )

    currentDate = currentDate.add(1, 'month').startOf('month')
  }

  const totalExpectedInterest = repaymentSchedule.reduce(
    (sum, r) => sum.plus(r.interestComponent),
    new Decimal(0)
  )

  let balance = principal.plus(totalExpectedInterest).toDecimalPlaces(2)
  for (const repayment of repaymentSchedule) {
    balance = balance.minus(repayment.totalPayment).toDecimalPlaces(2)
    repayment.remainingBalance = balance
  }

  return { repaymentSchedule, totalExpectedInterest }
}

function getEndOfMonth(
  currentDate: dayjs.Dayjs,
  maturityDate: dayjs.Dayjs,
  isLastMonth: boolean,
  paymentOnNonWorkDays: PaymentOnNonWorkDays
): dayjs.Dayjs {
  const endOfMonth = isLastMonth
    ? maturityDate
    : currentDate.endOf('month').startOf('day')
  const dayOfWeek = endOfMonth.day()
  const isSunday = dayOfWeek === 0
  const isSaturday = dayOfWeek === 6
  const isWeekend = isSunday || isSaturday

  if (paymentOnNonWorkDays === 'ALLOWED' || !isWeekend) {
    return endOfMonth
  } else if (paymentOnNonWorkDays === 'MOVE_TO_PREV_WORK_DAY') {
    const daysToSubtract = isSunday ? 2 : 1
    return endOfMonth.subtract(daysToSubtract, 'day')
  } else if (paymentOnNonWorkDays === 'MOVE_TO_NEXT_WORK_DAY') {
    const daysToAdd = isSunday ? 1 : 2
    return endOfMonth.add(daysToAdd, 'day')
  } else {
    return endOfMonth
  }
}

const getStartOfMonth = (
  currentDate: dayjs.Dayjs,
  repaymentSchedule: RepaymentData[]
): dayjs.Dayjs => {
  return repaymentSchedule.length > 0
    ? dayjs(repaymentSchedule[repaymentSchedule.length - 1].paymentDate).add(
        1,
        'day'
      )
    : dayjs(currentDate)
}

function buildRepayment(
  daysInMonth: number,
  paymentDate: string,
  isLastMonth: boolean,
  principalAmount: Decimal,
  monthSegments: MonthSegment[]
): RepaymentData {
  const monthlyRate = calculateMonthlyRatePercent(monthSegments, daysInMonth)
  const interestComponent = principalAmount
    .mul(monthlyRate.div(100))
    .toDecimalPlaces(2)
  const principalComponent = isLastMonth ? principalAmount : new Decimal(0)
  return {
    paymentDate,
    paymentType: isLastMonth
      ? PaymentType.PrincipalPlusInterest
      : PaymentType.Interest,
    principalComponent,
    interestComponent,
    totalPayment: interestComponent.plus(principalComponent),
    remainingBalance: new Decimal(0), // set after full schedule is built
  }
}

function buildMonthSegments(
  rateTimeline: RateDataPoint[],
  startOfMonth: dayjs.Dayjs,
  paymentDate: dayjs.Dayjs,
  rateIndex: number,
  currentDate: dayjs.Dayjs
): { monthSegments: MonthSegment[]; nextRateIndex: number } {
  const monthSegments: MonthSegment[] = []
  let segmentStart = startOfMonth

  while (rateIndex < rateTimeline.length - 1) {
    const nextRateDate = dayjs(rateTimeline[rateIndex + 1].date)
    if (nextRateDate.isAfter(paymentDate)) {
      break
    }

    const daysInPrevMonth = getDaysOrZero(
      currentDate.startOf('month').diff(segmentStart, 'day')
    )
    const daysInNextMonth = getDaysOrZero(
      nextRateDate.diff(currentDate.endOf('month'), 'day')
    )
    const totalDays = nextRateDate.diff(segmentStart, 'day')
    monthSegments.push({
      rate: rateTimeline[rateIndex].rate,
      daysInPrevMonth,
      daysInNextMonth,
      daysInMonth: totalDays - daysInPrevMonth - daysInNextMonth,
    })
    rateIndex++
    segmentStart = dayjs(rateTimeline[rateIndex].date)
  }

  const daysInPrevMonth = getDaysOrZero(
    currentDate.startOf('month').diff(segmentStart, 'day')
  )
  const daysInNextMonth = getDaysOrZero(
    paymentDate.diff(currentDate.endOf('month'), 'day')
  )
  const totalDays = paymentDate.diff(segmentStart, 'day') + 1
  monthSegments.push({
    rate: rateTimeline[rateIndex].rate,
    daysInPrevMonth,
    daysInNextMonth,
    daysInMonth: totalDays - daysInPrevMonth - daysInNextMonth,
  })

  return { monthSegments, nextRateIndex: rateIndex }
}

function getDaysOrZero(days: number): number {
  return days > 0 ? days : 0
}

function calculateMonthlyRatePercent(
  monthSegments: MonthSegment[],
  daysInMonth: number
): Decimal {
  const currMonthRate = getCurrentMonthRate(daysInMonth, monthSegments)
  const prevMonthStubRate = getStubPrevMonth(monthSegments)
  const nextMonthStubRate = getStubNextMonth(monthSegments)

  return currMonthRate.plus(prevMonthStubRate).plus(nextMonthStubRate)
}

function getCurrentMonthRate(
  daysInMonth: number,
  monthSegments: MonthSegment[]
): Decimal {
  const totalDaysInMonth = monthSegments.reduce(
    (acc, seg) => acc + seg.daysInMonth,
    0
  )
  const weightedRateSum = monthSegments.reduce(
    (acc, seg) => acc.plus(seg.rate.mul(seg.daysInMonth)),
    new Decimal(0)
  )

  const isFullMonth = totalDaysInMonth === daysInMonth
  const virtualRateDays = isFullMonth
    ? weightedRateSum.mul(VIRTUAL_DAYS_IN_MONTH).div(totalDaysInMonth)
    : weightedRateSum
  return virtualRateDays.div(VIRTUAL_DAYS_IN_YEAR)
}

function getStubPrevMonth(monthSegments: MonthSegment[]): Decimal {
  const weightedRateSum = monthSegments.reduce(
    (acc, seg) => acc.plus(seg.rate.mul(seg.daysInPrevMonth)),
    new Decimal(0)
  )

  return weightedRateSum.div(VIRTUAL_DAYS_IN_YEAR)
}

function getStubNextMonth(monthSegments: MonthSegment[]): Decimal {
  const weightedRateSum = monthSegments.reduce(
    (acc, seg) => acc.plus(seg.rate.mul(seg.daysInNextMonth)),
    new Decimal(0)
  )

  return weightedRateSum.div(VIRTUAL_DAYS_IN_YEAR)
}
