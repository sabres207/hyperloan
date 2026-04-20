import { DataSource } from 'typeorm'
import {
  CreateLoanInput,
  PaymentType,
} from '../__generated__/resolvers-types.js'
import { Loan } from '../entities/Loan.js'
import { Repayment } from '../entities/Repayment.js'
import dayjs, { type Dayjs } from 'dayjs'
import { getRateTimeline, RateDataPoint } from './fred.js'

type RepaymentData = Omit<Repayment, 'id' | 'createdAt' | 'loan' | 'loanId'>
type MonthSegment = { rate: number; days: number }

const VIRTUAL_DAYS_IN_MONTH = 30
const VIRTUAL_DAYS_IN_YEAR = 360

export async function createBulletLoan(
  db: DataSource,
  input: CreateLoanInput
): Promise<Loan> {
  const repaymentSchedule = await buildBulletLoanSchedule(input)

  return db.getRepository(Loan).save({
    name: input.name,
    principalAmount: input.principalAmount,
    startDate: input.startDate,
    endDate: input.endDate,
    repaymentSchedule,
  })
}

async function buildBulletLoanSchedule(
  loan: CreateLoanInput
): Promise<RepaymentData[]> {
  const { startDate, endDate, principalAmount } = loan
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
        endOfMonth,
        isLastMonth,
        principalAmount,
        monthSegments
      )
    )

    currentDate = currentDate.add(1, 'month').startOf('month')
  }

  return repaymentSchedule
}

function buildRepayment(
  daysInMonth: number,
  endOfMonth: Dayjs,
  isLastMonth: boolean,
  principalAmount: number,
  monthSegments: MonthSegment[]
): RepaymentData {
  const monthlyRate = calculateMonthlyRatePercent(monthSegments, daysInMonth)
  const interestComponent = principalAmount * (monthlyRate / 100)
  const principalComponent = isLastMonth ? principalAmount : 0
  return {
    paymentDate: endOfMonth.toDate(),
    paymentType: isLastMonth
      ? PaymentType.PrincipalPlusInterest
      : PaymentType.Interest,
    principalComponent,
    interestComponent,
    totalPayment: interestComponent + principalComponent,
    remainingBalance: isLastMonth ? 0 : principalAmount,
  }
}

function buildMonthSegments(
  rateTimeline: RateDataPoint[],
  startOfMonth: Dayjs,
  endOfMonth: Dayjs,
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
): number {
  const totalDays = monthSegments.reduce(
    (acc, segment) => acc + segment.days,
    0
  )
  const weightedRateSum = monthSegments.reduce(
    (acc, monthRate) => acc + monthRate.rate * monthRate.days,
    0
  )

  const isFullMonth = totalDays === daysInMonth
  const virtualRateDays = isFullMonth
    ? (weightedRateSum * VIRTUAL_DAYS_IN_MONTH) / totalDays
    : weightedRateSum
  return virtualRateDays / VIRTUAL_DAYS_IN_YEAR
}
