import { useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Loans } from './pages/Loans'
import { Loan } from './pages/Loan'
import { Layout } from './components/Layout'
import { CreateLoanModal } from './pages/Loans/CreateLoanModal'

function App() {
  const [showModal, setShowModal] = useState(false)

  return (
    <Layout onNewLoan={() => setShowModal(true)}>
      <Routes>
        <Route path="/" element={<Navigate to="/loans" replace />} />
        <Route path="/loans" element={<Loans />} />
        <Route path="/loans/:id" element={<Loan />} />
      </Routes>
      <CreateLoanModal
        showModal={showModal}
        setShowModal={setShowModal}
      />
    </Layout>
  )
}

export default App
