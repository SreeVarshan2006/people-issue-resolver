import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import StatusBadge from '../components/StatusBadge'
import BASE_URL from '../api'

function ComplaintDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isAdmin } = useAuth()
  const [complaint, setComplaint] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [adminNote, setAdminNote] = useState('')
  const [status, setStatus] = useState('')
  const [saving, setSaving] = useState(false)
  const [saveMsg, setSaveMsg] = useState('')

  useEffect(() => {
    fetchComplaint()
  }, [id])

  const fetchComplaint = async () => {
    try {
      setLoading(true)
      const res = await axios.get(`${BASE_URL}/api/complaints/${id}`)
      setComplaint(res.data.data)
      setAdminNote(res.data.data.adminNote || '')
      setStatus(res.data.data.status)
    } catch {
      setError('Complaint not found or failed to load.')
    } finally { setLoading(false) }
  }

  const handleUpdate = async () => {
    try {
      setSaving(true)
      await axios.put(`${BASE_URL}/api/complaints/${id}`, { status, adminNote })
      setSaveMsg('✅ Complaint updated successfully!')
      setComplaint((prev) => ({ ...prev, status, adminNote }))
      setTimeout(() => setSaveMsg(''), 3000)
    } catch { setSaveMsg('❌ Failed to update complaint.') }
    finally { setSaving(false) }
  }

  const formatDate = (d) => {
    if (!d) return 'N/A'
    return new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })
  }

  if (loading) return <div className="loading-state"><div className="spinner"></div><p>Loading...</p></div>
  if (error) return <div className="error-page"><h2>⚠️ Error</h2><p>{error}</p><button className="btn btn-outline" onClick={() => navigate(-1)}>Go Back</button></div>

  return (
    <div className="details-page">
      <div className="details-container">
        <div className="details-nav">
          <button className="btn btn-ghost" onClick={() => navigate(-1)}>← Back</button>
          <StatusBadge status={complaint.status} />
        </div>

        <div className="details-header">
          <h1>Complaint Details</h1>
          <p className="details-id">ID: {complaint._id}</p>
          <p className="details-date">Submitted: {formatDate(complaint.createdAt)}</p>
        </div>

        <div className="details-grid">
          <div className="details-main">
            <section className="detail-section">
              <h3>👤 Citizen Information</h3>
              <div className="detail-rows">
                <div className="detail-row"><span className="detail-label">Name</span><span>{complaint.citizenName}</span></div>
                <div className="detail-row"><span className="detail-label">Aadhaar</span><span>XXXX-XXXX-{complaint.aadhaarNumber.slice(-4)}</span></div>
                <div className="detail-row"><span className="detail-label">Age</span><span>{complaint.age} years</span></div>
                <div className="detail-row"><span className="detail-label">Mobile</span><span>{complaint.mobileNumber}</span></div>
                {complaint.citizenEmail && <div className="detail-row"><span className="detail-label">Email</span><span>{complaint.citizenEmail}</span></div>}
                <div className="detail-row"><span className="detail-label">Address</span><span>{complaint.address}</span></div>
              </div>
            </section>

            <section className="detail-section">
              <h3>📋 Complaint Information</h3>
              <div className="detail-rows">
                <div className="detail-row"><span className="detail-label">Authority</span><span className="authority-tag">{complaint.authority}</span></div>
                <div className="detail-row"><span className="detail-label">Date of Issue</span><span>{formatDate(complaint.dateOfIssue)}</span></div>
                <div className="detail-row"><span className="detail-label">Status</span><StatusBadge status={complaint.status} /></div>
              </div>
              <div className="issue-statement">
                <h4>Issue Statement</h4>
                <p>{complaint.issueStatement}</p>
              </div>
            </section>

            {complaint.issuePhoto && (
              <section className="detail-section">
                <h3>📷 Issue Photo</h3>
                <img src={`${BASE_URL}/uploads/${complaint.issuePhoto}`} alt="Issue Evidence" className="issue-photo"
                  onError={(e) => { e.target.style.display = 'none' }} />
              </section>
            )}

            {complaint.adminNote && (
              <section className="detail-section">
                <h3>🗒️ Admin Note</h3>
                <p className="admin-note">{complaint.adminNote}</p>
              </section>
            )}
          </div>

          {isAdmin && (
            <div className="details-sidebar">
              <div className="admin-panel">
                <h3>⚙️ Admin Actions</h3>
                <div className="form-group">
                  <label>Update Status</label>
                  <select value={status} onChange={(e) => setStatus(e.target.value)}>
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Admin Note</label>
                  <textarea value={adminNote} onChange={(e) => setAdminNote(e.target.value)} placeholder="Add note for the citizen..." rows={4} />
                </div>
                {saveMsg && <p className="save-msg">{saveMsg}</p>}
                <button className="btn btn-primary btn-full" onClick={handleUpdate} disabled={saving}>
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ComplaintDetails
