import React from 'react'
import { useNavigate } from 'react-router-dom'
import StatusBadge from './StatusBadge'

function ComplaintCard({ complaint, onDelete, onStatusChange, isAdmin }) {
  const navigate = useNavigate()

  const formatDate = (d) => {
    if (!d) return 'N/A'
    return new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
  }

  return (
    <div className="complaint-card">
      <div className="card-header">
        <div className="card-meta">
          <span className="card-authority">{complaint.authority}</span>
          <StatusBadge status={complaint.status} />
        </div>
        <h3 className="card-name">{complaint.citizenName}</h3>
        <p className="card-date">Filed: {formatDate(complaint.dateOfIssue)}</p>
      </div>

      <div className="card-body">
        <p className="card-issue">{complaint.issueStatement.substring(0, 120)}{complaint.issueStatement.length > 120 ? '...' : ''}</p>
        <div className="card-info-row">
          <span>📞 {complaint.mobileNumber}</span>
          <span>📍 {complaint.address.substring(0, 40)}{complaint.address.length > 40 ? '...' : ''}</span>
        </div>
      </div>

      <div className="card-actions">
        <button className="btn btn-view" onClick={() => navigate(`/complaint/${complaint._id}`)}>
          View Details
        </button>
        {isAdmin && (
          <>
            <select
              className="status-select"
              value={complaint.status}
              onChange={(e) => onStatusChange(complaint._id, e.target.value)}
            >
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
              <option value="Rejected">Rejected</option>
            </select>
            <button className="btn btn-delete" onClick={() => onDelete(complaint._id)}>
              Delete
            </button>
          </>
        )}
      </div>
    </div>
  )
}

export default ComplaintCard
