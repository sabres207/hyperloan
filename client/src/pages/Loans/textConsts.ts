export const TEXT = {
  title: 'Loans',
  subtitle: (total: number) =>
    `All active bullet loans${total > 0 ? ` · ${total} total` : ''}`,
  columns: {
    loanName: 'Loan name',
    principal: 'Principal',
    startDate: 'Start date',
    maturity: 'Maturity',
    paymentOnNonWeekDays: 'Non week days payment',
    totalInterest: 'Total interest',
  },
  empty: {
    title: 'No loans yet',
    description:
      'Create your first bullet loan to get started. The repayment schedule will be generated automatically.',
  },
  createModal: {
    title: 'New Loan',
    cancel: 'Cancel',
    creating: 'Creating…',
    submit: 'Create Loan',
    toast: 'Loan created successfully',
    fields: {
      name: { label: 'Loan name', placeholder: 'e.g. Acme Corp Term Loan' },
      principal: {
        label: 'Principal amount (USD)',
        placeholder: '500000',
        hint: 'Enter the full amount in USD',
      },
      startDate: { label: 'Start date' },
      maturityDate: { label: 'Maturity date' },
    },
    validation: {
      nameRequired: 'Loan name is required',
      invalidPrincipal: 'Enter a valid principal amount greater than 0',
      startDateRequired: 'Start date is required',
      endDateRequired: 'End date is required',
      maturityAfterStart: 'Maturity must be after the start date',
    },
  },
} as const
