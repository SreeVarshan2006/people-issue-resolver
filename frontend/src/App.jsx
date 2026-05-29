import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import ComplaintForm from './pages/ComplaintForm'
import CitizenDashboard from './pages/CitizenDashboard'
import AdminDashboard from './pages/AdminDashboard'
import ComplaintDetails from './pages/ComplaintDetails'

function ProtectedRoute({ children, adminOnly = false, citizenOnly = false }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="loading-state"><div className="spinner"></div></div>
  if (!user) return <Navigate to="/login" replace />
  if (adminOnly && user.role !== 'admin') return <Navigate to="/" replace />
  if (citizenOnly && user.role !== 'citizen') return <Navigate to="/admin-dashboard" replace />
  return children
}

function AppRoutes() {
  return (
    <>
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/register-complaint" element={
            <ProtectedRoute citizenOnly>
              <ComplaintForm />
            </ProtectedRoute>
          } />
          <Route path="/citizen-dashboard" element={
            <ProtectedRoute citizenOnly>
              <CitizenDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin-dashboard" element={
            <ProtectedRoute adminOnly>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/complaint/:id" element={
            <ProtectedRoute>
              <ComplaintDetails />
            </ProtectedRoute>
          } />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </>
  )
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  )
}

export default App
