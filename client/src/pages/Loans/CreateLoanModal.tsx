import { type Dispatch, type FC, type SetStateAction } from 'react'
import { useForm } from 'react-hook-form'
import { Modal } from '../../components/Modal'
import { Field } from '../../components/Field'
import { Button } from '../../components/Button'
import styled from 'styled-components'

type CreateLoanModalProps = {
  showModal: boolean
  setShowModal: Dispatch<SetStateAction<boolean>>
}

type FormValues = {
  name: string
  principalAmount: string
  startDate: string
  endDate: string
}

export const CreateLoanModal: FC<CreateLoanModalProps> = ({
  showModal,
  setShowModal,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<FormValues>({ mode: 'onTouched' })

  const startDate = watch('startDate')

  const close = () => {
    reset()
    setShowModal(false)
  }

  const onSubmit = (data: FormValues) => {
    // TODO: call createLoan mutation
    console.log('Create loan:', data)
    close()
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
          {...register('name', { required: 'Loan name is required' })}
        />
        <Field
          label="Principal amount (USD)"
          placeholder="500000"
          hint="Enter the full amount in USD"
          error={errors.principalAmount?.message}
          {...register('principalAmount', {
            required: 'Enter a valid principal amount greater than 0',
            validate: (v) => {
              const n = parseFloat(v.replace(/[^0-9.]/g, ''))
              return (!isNaN(n) && n > 0) ||
                'Enter a valid principal amount greater than 0'
            },
          })}
        />
        <FieldRow>
          <Field
            label="Start date"
            type="date"
            error={errors.startDate?.message}
            {...register('startDate', { required: 'Start date is required' })}
          />
          <Field
            label="Maturity date"
            type="date"
            min={startDate || undefined}
            error={errors.endDate?.message}
            {...register('endDate', {
              required: 'End date is required',
              validate: (v) =>
                !startDate ||
                v > startDate ||
                'Maturity must be after the start date',
            })}
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
