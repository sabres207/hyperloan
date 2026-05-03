import type { PaymentOnNonWorkDays } from './__generated__/graphql'

export const formatCurrency = (n: string | number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(n))

export const formatDate = (s: string) =>
  new Date(s + 'T12:00:00').toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })

export const formatPaymentOnNonWorkDays = (
  paymentType: PaymentOnNonWorkDays
): string => {
  if (paymentType === 'ALLOWED') {
    return 'Allowed'
  } else if (paymentType === 'MOVE_TO_PREV_WORK_DAY') {
    return 'Previous work day'
  } else if (paymentType === 'MOVE_TO_NEXT_WORK_DAY') {
    return 'Next work day'
  } else {
    return 'Unknown'
  }
}
