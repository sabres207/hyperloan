export const TEXT = {
  breadcrumbParent: 'Loans',
  subtitle: (payments: number) =>
    `Repayment schedule · ${payments} payments · Bullet loan`,
  cards: {
    principal: 'Principal',
    totalInterest: 'Total interest',
    startDate: 'Start date',
    maturity: 'Maturity',
  },
  columns: {
    number: '#',
    paymentDate: 'Payment date',
    type: 'Type',
    principal: 'Principal',
    interest: 'Interest',
    totalDue: 'Total due',
    remainingBalance: 'Rem. balance',
  },
} as const
