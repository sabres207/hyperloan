import { useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'

import { Layout } from './components/Layout'
import { Loan } from './pages/Loan'
import { Loans } from './pages/Loans'
import { CreateLoanModal } from './pages/Loans/CreateLoanModal'

function App() {
  const [showModal, setShowModal] = useState(false)
  const [newLoanId, setNewLoanId] = useState<string | null>(null)

  return (
    <Layout onNewLoan={() => setShowModal(true)}>
      <Routes>
        <Route path="/" element={<Navigate to="/loans" replace />} />
        <Route path="/loans" element={<Loans newLoanId={newLoanId} />} />
        <Route path="/loans/:id" element={<Loan />} />
      </Routes>
      <CreateLoanModal
        showModal={showModal}
        setShowModal={setShowModal}
        onCreated={setNewLoanId}
      />
    </Layout>
  )
}

export default App
