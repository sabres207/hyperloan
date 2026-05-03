import { type Dispatch, type FC, type SetStateAction, useState } from 'react'
import { useForm } from 'react-hook-form'

import { useMutation } from '@apollo/client'
import { zodResolver } from '@hookform/resolvers/zod'
import styled from 'styled-components'
import { z } from 'zod'

import { graphql } from '~/__generated__'
import { Button } from '~/components/Button'
import { Field, Label } from '~/components/Field'
import { Modal } from '~/components/Modal'
import { Toast } from '~/components/Toast'

import { TEXT } from './textConsts'

type CreateLoanModalProps = {
  showModal: boolean
  setShowModal: Dispatch<SetStateAction<boolean>>
  onCreated: (id: string) => void
}

const schema = z
  .object({
    name: z.string().min(1, TEXT.createModal.validation.nameRequired),
    principalAmount: z.string().refine(
      (v) => {
        const n = parseFloat(v.replace(/[^0-9.]/g, ''))
        return !isNaN(n) && n > 0
      },
      { message: TEXT.createModal.validation.invalidPrincipal }
    ),
    startDate: z.string().min(1, TEXT.createModal.validation.startDateRequired),
    endDate: z.string().min(1, TEXT.createModal.validation.endDateRequired),
    // TODO: maybe use enums or consts to validate
    paymentOnNonWorkDays: z.enum([
      'ALLOWED',
      'MOVE_TO_PREV_WORK_DAY',
      'MOVE_TO_NEXT_WORK_DAY',
    ]),
  })
  .refine((d) => !d.startDate || d.endDate > d.startDate, {
    message: TEXT.createModal.validation.maturityAfterStart,
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
  onCreated,
}) => {
  const [showToast, setShowToast] = useState(false)
  const [createLoan, { loading }] = useMutation(CREATE_LOAN)
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

  const onSubmit = ({
    name,
    startDate,
    endDate,
    principalAmount,
    paymentOnNonWorkDays,
  }: FormValues) => {
    // TODO: remove
    console.log({
      name,
      startDate,
      endDate,
      principalAmount,
      paymentOnNonWorkDays,
    })

    createLoan({
      variables: {
        input: {
          name,
          startDate,
          endDate,
          principalAmount: principalAmount.replace(/[^0-9.]/g, ''),
          paymentOnNonWorkDays,
        },
      },
      refetchQueries: ['Loans'],
    }).then((result) => {
      close()
      setShowToast(true)
      if (result.data?.createLoan.id) {
        onCreated(result.data.createLoan.id)
      }
    })
  }

  return (
    <>
      {showToast && (
        <Toast
          message={TEXT.createModal.toast}
          onDismiss={() => setShowToast(false)}
        />
      )}
      <Modal
        isOpen={showModal}
        onClose={close}
        disableClose={loading}
        title={TEXT.createModal.title}
        footer={
          <>
            <Button
              $variant="outline"
              $size="sm"
              type="button"
              onClick={close}
              disabled={loading}
            >
              {TEXT.createModal.cancel}
            </Button>
            <Button
              $size="sm"
              type="button"
              onClick={handleSubmit(onSubmit)}
              disabled={loading}
            >
              {loading ? TEXT.createModal.creating : TEXT.createModal.submit}
            </Button>
          </>
        }
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <Field
            label={TEXT.createModal.fields.name.label}
            placeholder={TEXT.createModal.fields.name.placeholder}
            autoFocus
            error={errors.name?.message}
            {...register('name')}
          />
          <Field
            label={TEXT.createModal.fields.principal.label}
            placeholder={TEXT.createModal.fields.principal.placeholder}
            hint={TEXT.createModal.fields.principal.hint}
            error={errors.principalAmount?.message}
            {...register('principalAmount')}
          />
          {/* TODO: maybe use enums or consts to validate */}
          <Label>Payments on non work days</Label>
          <Select {...register('paymentOnNonWorkDays')}>
            <option value="ALLOWED">Allowed</option>
            <option value="MOVE_TO_PREV_WORK_DAY">
              Move to previous work day
            </option>
            <option value="MOVE_TO_NEXT_WORK_DAY">Move to next work day</option>
          </Select>
          <FieldRow>
            <Field
              label={TEXT.createModal.fields.startDate.label}
              type="date"
              error={errors.startDate?.message}
              {...register('startDate')}
            />
            <Field
              label={TEXT.createModal.fields.maturityDate.label}
              type="date"
              min={startDate || undefined}
              error={errors.endDate?.message}
              {...register('endDate')}
            />
          </FieldRow>
        </form>
      </Modal>
    </>
  )
}

const FieldRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.space[3]};
`

// TODO: create component SelectField, or make Field expect both types
const Select = styled.select`
  width: 100%;
  height: ${({ theme }) => theme.components.inputHeight};
  padding: 0 ${({ theme }) => theme.space[3]};
  border: 1.5px solid ${({ theme }) => theme.colors.borderStrong};
  border-radius: ${({ theme }) => theme.radii.md};
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: ${({ theme }) => theme.fontSizes.base};
  color: ${({ theme }) => theme.colors.text1};
  background: ${({ theme }) => theme.colors.surface};
  transition:
    border-color 0.15s,
    box-shadow 0.15s;
  outline: none;
  appearance: none;
  &::placeholder {
    color: ${({ theme }) => theme.colors.text3};
  }

  &:focus {
    border-color: ${({ theme }) => theme.colors.accent};
    box-shadow: ${({ theme }) =>
      `${theme.shadows.focusRing} ${theme.colors.accentSubtle}`};
  }

  margin-bottom: ${({ theme }) => theme.space[5]};
`
