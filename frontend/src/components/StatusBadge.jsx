import React from 'react'

function StatusBadge({ status }) {
  const map = {
    Pending: 'badge-pending',
    'In Progress': 'badge-progress',
    Resolved: 'badge-resolved',
    Rejected: 'badge-rejected',
  }
  return <span className={`badge ${map[status] || 'badge-pending'}`}>{status}</span>
}

export default StatusBadge
