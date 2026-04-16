import { Routes, Route, Navigate } from 'react-router-dom'
import { Loans } from './pages/Loans'
import { Loan } from './pages/Loan'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/loans" replace />} />
      <Route path="/loans" element={<Loans />} />
      <Route path="/loans/:id" element={<Loan />} />
    </Routes>
  )
}

export default App
