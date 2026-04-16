import { Routes, Route, Navigate } from 'react-router-dom'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/loans" replace />} />
      <Route path="/loans" element={<div>Loans Page</div>} />
      <Route path="/loan/:id" element={<div>Loan Detail Page</div>} />
    </Routes>
  )
}

export default App
