import e from 'cors'
import dayjs from 'dayjs'

export type RateDataPoint = {
  date: Date
  rate: number
}

type FredResponse = {
  observations: Array<{
    date: string
    value: string
  }>
}

const FRED_BASE_URL = 'https://api.stlouisfed.org/fred/series/observations'
const DEFAULT_DAYS_TO_LOOKBACK = 7
const DAYS_TO_LOOKBACK_ON_RETRY = 30

function getFredApiKey(): string {
  const key = process.env.FRED_API_KEY
  if (!key) throw new Error('FRED_API_KEY environment variable is not set')
  return key
}

function fredUrl(
  seriesId: 'PRIME' | 'DPRIME',
  startDate: string,
  endDate: string
): string {
  const params = new URLSearchParams({
    series_id: seriesId,
    api_key: getFredApiKey(),
    file_type: 'json',
    observation_start: startDate,
    observation_end: endDate,
  })
  return `${FRED_BASE_URL}?${params}`
}

async function fetchObservations(
  seriesId: 'PRIME' | 'DPRIME',
  startDate: string,
  endDate: string
): Promise<RateDataPoint[]> {
  const url = fredUrl(seriesId, startDate, endDate)
  console.log(url)
  const res = await fetch(url)
  if (!res.ok) {
    throw new Error(`FRED API error: ${res.status} ${res.statusText}`)
  }

  const data = (await res.json()) as FredResponse
  return data.observations.map((o) => ({
    date: new Date(o.date),
    rate: parseFloat(o.value),
  }))
}

export async function getPrimeRateAt(date: Date): Promise<number> {
  const endDate = dayjs(date).format('YYYY-MM-DD')

  for (const lookbackDays of [
    DEFAULT_DAYS_TO_LOOKBACK,
    DAYS_TO_LOOKBACK_ON_RETRY,
  ]) {
    const startDate = dayjs(date)
      .subtract(lookbackDays, 'day')
      .format('YYYY-MM-DD')
    const observations = await fetchObservations('DPRIME', startDate, endDate)
    if (observations.length > 0) {
      return observations[observations.length - 1].rate
    }
  }

  throw new Error(`No prime rate data found for date ${date.toString()}`)
}

export async function getPrimeRateChanges(
  startDate: Date,
  endDate: Date
): Promise<RateDataPoint[]> {
  const start = dayjs(startDate).add(1, 'day').format('YYYY-MM-DD')
  const end = dayjs(endDate).format('YYYY-MM-DD')
  return fetchObservations('PRIME', start, end)
}

export async function getRateTimeline(
  startDate: Date,
  endDate: Date
): Promise<RateDataPoint[]> {
  const today = dayjs().startOf('day')
  const start = dayjs(startDate).startOf('day')
  const end = dayjs(endDate).startOf('day')

  if (!start.isBefore(today)) {
    const rate = await getPrimeRateAt(today.toDate())
    return [{ date: startDate, rate }]
  }

  const initialRate = await getPrimeRateAt(startDate)
  const initialPoint: RateDataPoint = { date: startDate, rate: initialRate }

  const changesEndDate = end.isBefore(today) ? endDate : today.toDate()
  const changes = await getPrimeRateChanges(startDate, changesEndDate)

  return [initialPoint, ...changes]
}
