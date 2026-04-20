import { DataSource } from 'typeorm'
import {
  CreateLoanInput,
  PaymentType,
} from '../__generated__/resolvers-types.js'
import { Loan } from '../db/entities/Loan.js'
import { Repayment } from '../db/entities/Repayment.js'
import dayjs from 'dayjs'
import { Decimal } from '../decimal.js'
import { getRateTimeline, RateDataPoint } from './fred.js'

type RepaymentData = Omit<Repayment, 'id' | 'createdAt' | 'loan' | 'loanId'>
type MonthSegment = { rate: Decimal; days: number }

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
  })
}

async function buildBulletLoanSchedule(loan: CreateLoanInput): Promise<{
  repaymentSchedule: RepaymentData[]
  totalExpectedInterest: Decimal
}> {
  const { startDate, endDate, principalAmount } = loan
  const principal = new Decimal(principalAmount)
  const rateTimeline = await getRateTimeline(startDate, endDate)
  const maturityDate = dayjs(endDate)

  const repaymentSchedule: RepaymentData[] = []
  let currentRateIndex = 0
  let currentDate = dayjs(startDate)

  while (!currentDate.isAfter(maturityDate, 'month')) {
    const isLastMonth = currentDate.isSame(maturityDate, 'month')
    const endOfMonth = isLastMonth
      ? maturityDate
      : currentDate.endOf('month').startOf('day')
    const { monthSegments, nextRateIndex } = buildMonthSegments(
      rateTimeline,
      currentDate,
      endOfMonth,
      currentRateIndex
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
  endOfMonth: dayjs.Dayjs,
  rateIndex: number
): { monthSegments: MonthSegment[]; nextRateIndex: number } {
  const monthSegments: MonthSegment[] = []
  let segmentStart = startOfMonth

  while (rateIndex < rateTimeline.length - 1) {
    const nextRateDate = dayjs(rateTimeline[rateIndex + 1].date)
    if (nextRateDate.isAfter(endOfMonth)) {
      break
    }

    monthSegments.push({
      rate: rateTimeline[rateIndex].rate,
      days: nextRateDate.diff(segmentStart, 'day'),
    })
    rateIndex++
    segmentStart = dayjs(rateTimeline[rateIndex].date)
  }

  monthSegments.push({
    rate: rateTimeline[rateIndex].rate,
    days: endOfMonth.diff(segmentStart, 'day') + 1,
  })

  return { monthSegments, nextRateIndex: rateIndex }
}

function calculateMonthlyRatePercent(
  monthSegments: MonthSegment[],
  daysInMonth: number
): Decimal {
  const totalDays = monthSegments.reduce((acc, seg) => acc + seg.days, 0)
  const weightedRateSum = monthSegments.reduce(
    (acc, seg) => acc.plus(seg.rate.mul(seg.days)),
    new Decimal(0)
  )

  const isFullMonth = totalDays === daysInMonth
  const virtualRateDays = isFullMonth
    ? weightedRateSum.mul(VIRTUAL_DAYS_IN_MONTH).div(totalDays)
    : weightedRateSum
  return virtualRateDays.div(VIRTUAL_DAYS_IN_YEAR)
}
