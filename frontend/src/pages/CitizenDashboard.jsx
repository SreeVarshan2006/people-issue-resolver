import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import ComplaintCard from '../components/ComplaintCard'
import BASE_URL from '../api'

function CitizenDashboard() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [complaints, setComplaints] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchComplaints()
  }, [])

  const fetchComplaints = async () => {
    try {
      setLoading(true)
      const res = await axios.get(`${BASE_URL}/api/complaints/my`)
      setComplaints(res.data.data)
    } catch (err) {
      setError('Failed to load your complaints. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const statusCounts = complaints.reduce((acc, c) => {
    acc[c.status] = (acc[c.status] || 0) + 1
    return acc
  }, {})

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <div>
          <h1>Welcome, {user?.name}!</h1>
          <p>Mobile: {user?.mobile} | Track and manage your complaints below.</p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/register-complaint')}>+ New Complaint</button>
      </div>

      <div className="stats-row">
        {[
          { label: 'Total', value: complaints.length, cls: 'stat-total' },
          { label: 'Pending', value: statusCounts['Pending'] || 0, cls: 'stat-pending' },
          { label: 'In Progress', value: statusCounts['In Progress'] || 0, cls: 'stat-progress' },
          { label: 'Resolved', value: statusCounts['Resolved'] || 0, cls: 'stat-resolved' },
        ].map((s, i) => (
          <div className={`stat-card ${s.cls}`} key={i}>
            <span className="stat-val">{s.value}</span>
            <span className="stat-lbl">{s.label}</span>
          </div>
        ))}
      </div>

      {error && <div className="error-banner">{error}</div>}

      {loading ? (
        <div className="loading-state"><div className="spinner"></div><p>Loading your complaints...</p></div>
      ) : complaints.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">📭</span>
          <h3>No Complaints Filed Yet</h3>
          <p>You haven't submitted any complaints. Click below to file your first one.</p>
          <button className="btn btn-primary" onClick={() => navigate('/register-complaint')}>File a Complaint</button>
        </div>
      ) : (
        <div>
          <div className="section-label">Your Complaints ({complaints.length})</div>
          <div className="complaints-grid">
            {complaints.map((c) => (
              <ComplaintCard key={c._id} complaint={c} isAdmin={false} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default CitizenDashboard
