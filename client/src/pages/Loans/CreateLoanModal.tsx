import { type Dispatch, type FC, type SetStateAction } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Modal } from '../../components/Modal'
import { Field } from '../../components/Field'
import { Button } from '../../components/Button'
import styled from 'styled-components'
import { graphql } from '../../__generated__'
import { useMutation } from '@apollo/client'

type CreateLoanModalProps = {
  showModal: boolean
  setShowModal: Dispatch<SetStateAction<boolean>>
}

const schema = z
  .object({
    name: z.string().min(1, 'Loan name is required'),
    principalAmount: z.string().refine(
      (v) => {
        const n = parseFloat(v.replace(/[^0-9.]/g, ''))
        return !isNaN(n) && n > 0
      },
      { message: 'Enter a valid principal amount greater than 0' }
    ),
    startDate: z.string().min(1, 'Start date is required'),
    endDate: z.string().min(1, 'End date is required'),
  })
  .refine((d) => !d.startDate || d.endDate > d.startDate, {
    message: 'Maturity must be after the start date',
    path: ['endDate'],
  })

type FormValues = z.infer<typeof schema>

const CREATE_LOAN = graphql(`
  mutation CreateLoan($input: CreateLoanInput!) {
    createLoan(createLoanInput: $input) {
      id
      name
      principalAmount
      startDate
      endDate
    }
  }
`)

export const CreateLoanModal: FC<CreateLoanModalProps> = ({
  showModal,
  setShowModal,
}) => {
  const [createLoan] = useMutation(CREATE_LOAN)
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<FormValues>({ mode: 'onTouched', resolver: zodResolver(schema) })

  const startDate = watch('startDate')

  const close = () => {
    reset()
    setShowModal(false)
  }

  const onSubmit = ({ name, startDate, endDate, principalAmount }: FormValues) => {
    createLoan({
      variables: {
        input: {
          name,
          startDate,
          endDate,
          principalAmount: Number(principalAmount),
        },
      },
      refetchQueries: ['Loans'],
    })
  }

  return (
    <Modal
      isOpen={showModal}
      onClose={close}
      title="New Loan"
      footer={
        <>
          <Button $variant="outline" $size="sm" type="button" onClick={close}>
            Cancel
          </Button>
          <Button $size="sm" type="button" onClick={handleSubmit(onSubmit)}>
            Create Loan
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Field
          label="Loan name"
          placeholder="e.g. Acme Corp Term Loan"
          autoFocus
          error={errors.name?.message}
          {...register('name')}
        />
        <Field
          label="Principal amount (USD)"
          placeholder="500000"
          hint="Enter the full amount in USD"
          error={errors.principalAmount?.message}
          {...register('principalAmount')}
        />
        <FieldRow>
          <Field
            label="Start date"
            type="date"
            error={errors.startDate?.message}
            {...register('startDate')}
          />
          <Field
            label="Maturity date"
            type="date"
            min={startDate || undefined}
            error={errors.endDate?.message}
            {...register('endDate')}
          />
        </FieldRow>
      </form>
    </Modal>
  )
}

const FieldRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.space[3]};
`
