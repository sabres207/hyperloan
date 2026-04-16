import { type Dispatch, type FC, type SetStateAction } from 'react'
import { Modal } from '../../components/Modal'

type CreateLoanModalProps = {
  showModal: boolean
  setShowModal: Dispatch<SetStateAction<boolean>>
}

export const CreateLoanModal: FC<CreateLoanModalProps> = ({
  showModal,
  setShowModal,
}) => {
  return (
    <Modal
      isOpen={showModal}
      onClose={() => setShowModal(false)}
      title="Create new loan"
    >
      <div>TODO: create loan form</div>
    </Modal>
  )
}
