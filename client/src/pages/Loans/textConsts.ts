export const TEXT = {
  title: 'Loans',
  subtitle: (total: number) =>
    `All active bullet loans${total > 0 ? ` · ${total} total` : ''}`,
  columns: {
    loanName: 'Loan name',
    principal: 'Principal',
    startDate: 'Start date',
    maturity: 'Maturity',
    totalInterest: 'Total interest',
  },
  empty: {
    title: 'No loans yet',
    description:
      'Create your first bullet loan to get started. The repayment schedule will be generated automatically.',
  },
} as const
