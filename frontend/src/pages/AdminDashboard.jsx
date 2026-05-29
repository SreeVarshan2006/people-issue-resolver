import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import ComplaintCard from '../components/ComplaintCard'
import BASE_URL from '../api'

function AdminDashboard() {
  const navigate = useNavigate()
  const [complaints, setComplaints] = useState([])
  const [stats, setStats] = useState({ total: 0, pending: 0, inProgress: 0, resolved: 0, rejected: 0 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [filterAuthority, setFilterAuthority] = useState('')
  const [search, setSearch] = useState('')
  const [confirmDelete, setConfirmDelete] = useState(null)

  useEffect(() => {
    fetchStats()
    fetchComplaints()
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => fetchComplaints(), 400)
    return () => clearTimeout(timer)
  }, [filterStatus, filterAuthority, search])

  const fetchStats = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/complaints/stats/summary`)
      setStats(res.data.data)
    } catch {}
  }

  const fetchComplaints = async () => {
    try {
      setLoading(true)
      const params = {}
      if (filterStatus) params.status = filterStatus
      if (filterAuthority) params.authority = filterAuthority
      if (search) params.search = search
      const res = await axios.get(`${BASE_URL}/api/complaints`, { params })
      setComplaints(res.data.data)
    } catch (err) {
      setError('Failed to load complaints.')
    } finally { setLoading(false) }
  }

  const handleStatusChange = async (id, newStatus) => {
    try {
      await axios.put(`${BASE_URL}/api/complaints/${id}`, { status: newStatus })
      setComplaints((prev) => prev.map((c) => (c._id === id ? { ...c, status: newStatus } : c)))
      fetchStats()
    } catch { setError('Failed to update status.') }
  }

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/api/complaints/${id}`)
      setComplaints((prev) => prev.filter((c) => c._id !== id))
      setConfirmDelete(null)
      fetchStats()
    } catch { setError('Failed to delete complaint.') }
  }

  const statCards = [
    { label: 'Total', value: stats.total, cls: 'stat-total', icon: '📋' },
    { label: 'Pending', value: stats.pending, cls: 'stat-pending', icon: '⏳' },
    { label: 'In Progress', value: stats.inProgress, cls: 'stat-progress', icon: '🔄' },
    { label: 'Resolved', value: stats.resolved, cls: 'stat-resolved', icon: '✅' },
    { label: 'Rejected', value: stats.rejected, cls: 'stat-rejected', icon: '❌' },
  ]

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <div>
          <h1>Admin Dashboard</h1>
          <p>Manage all citizen complaints — review, update status, and process grievances.</p>
        </div>
      </div>

      <div className="stats-row">
        {statCards.map((s, i) => (
          <div className={`stat-card ${s.cls}`} key={i}>
            <span className="stat-icon">{s.icon}</span>
            <span className="stat-val">{s.value}</span>
            <span className="stat-lbl">{s.label}</span>
          </div>
        ))}
      </div>

      <div className="filters-bar">
        <input type="text" placeholder="🔍 Search by name, Aadhaar, or mobile..." value={search}
          onChange={(e) => setSearch(e.target.value)} className="search-input" />
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="filter-select">
          <option value="">All Status</option>
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Resolved">Resolved</option>
          <option value="Rejected">Rejected</option>
        </select>
        <select value={filterAuthority} onChange={(e) => setFilterAuthority(e.target.value)} className="filter-select">
          <option value="">All Authorities</option>
          <option value="Collector">Collector</option>
          <option value="MLA">MLA</option>
          <option value="Counsellor">Counsellor</option>
        </select>
        <button className="btn btn-outline" onClick={() => { setSearch(''); setFilterStatus(''); setFilterAuthority('') }}>Reset</button>
      </div>

      {error && <div className="error-banner">{error}</div>}

      {loading ? (
        <div className="loading-state"><div className="spinner"></div><p>Loading complaints...</p></div>
      ) : complaints.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">📭</span>
          <h3>No Complaints Found</h3>
          <p>No complaints match your current filters.</p>
        </div>
      ) : (
        <div>
          <div className="section-label">Showing {complaints.length} complaint{complaints.length !== 1 ? 's' : ''}</div>
          <div className="complaints-grid">
            {complaints.map((c) => (
              <ComplaintCard key={c._id} complaint={c} isAdmin={true}
                onDelete={(id) => setConfirmDelete(id)} onStatusChange={handleStatusChange} />
            ))}
          </div>
        </div>
      )}

      {confirmDelete && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Confirm Delete</h3>
            <p>Are you sure you want to delete this complaint? This action cannot be undone.</p>
            <div className="modal-actions">
              <button className="btn btn-outline" onClick={() => setConfirmDelete(null)}>Cancel</button>
              <button className="btn btn-delete" onClick={() => handleDelete(confirmDelete)}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminDashboard
