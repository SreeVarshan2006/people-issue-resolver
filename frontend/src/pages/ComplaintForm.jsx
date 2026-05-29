import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import BASE_URL from '../api'

const INITIAL_FORM = {
  citizenName: '',
  aadhaarNumber: '',
  age: '',
  address: '',
  mobileNumber: '',
  issueStatement: '',
  dateOfIssue: '',
  authority: '',
  citizenEmail: '',
}

function ComplaintForm() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [form, setForm] = useState(INITIAL_FORM)
  const [photo, setPhoto] = useState(null)
  const [photoPreview, setPhotoPreview] = useState(null)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')
  const [apiError, setApiError] = useState('')

  useEffect(() => {
    if (user) {
      setForm((f) => ({
        ...f,
        mobileNumber: user.mobile || '',
        citizenName: user.name || '',
        citizenEmail: user.email || '',
      }))
    }
  }, [user])

  const validate = () => {
    const errs = {}
    if (!form.citizenName.trim() || form.citizenName.trim().length < 2) errs.citizenName = 'Name must be at least 2 characters'
    if (!/^\d{12}$/.test(form.aadhaarNumber)) errs.aadhaarNumber = 'Aadhaar must be exactly 12 digits'
    if (!form.age || isNaN(form.age) || Number(form.age) < 1 || Number(form.age) > 120) errs.age = 'Enter a valid age (1–120)'
    if (!form.address.trim() || form.address.trim().length < 10) errs.address = 'Address must be at least 10 characters'
    if (!/^[6-9]\d{9}$/.test(form.mobileNumber)) errs.mobileNumber = 'Enter a valid 10-digit Indian mobile number'
    if (!form.issueStatement.trim() || form.issueStatement.trim().length < 20) errs.issueStatement = 'Issue statement must be at least 20 characters'
    if (!form.dateOfIssue) errs.dateOfIssue = 'Date of issue is required'
    if (!form.authority) errs.authority = 'Please select an authority'
    if (form.citizenEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.citizenEmail)) errs.citizenEmail = 'Enter a valid email'
    if (!photo) errs.photo = 'Issue photo is required'
    return errs
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setErrors({ ...errors, [e.target.name]: '' })
  }

  const handlePhoto = (e) => {
    const file = e.target.files[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) { setErrors({ ...errors, photo: 'File must be under 5MB' }); return }
    setPhoto(file)
    setPhotoPreview(URL.createObjectURL(file))
    setErrors({ ...errors, photo: '' })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    setLoading(true); setApiError('')
    try {
      const fd = new FormData()
      Object.entries(form).forEach(([k, v]) => fd.append(k, v))
      if (photo) fd.append('issuePhoto', photo)
      await axios.post(`${BASE_URL}/api/complaints`, fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      setSuccessMsg('🎉 Your complaint has been submitted successfully!')
      setForm(INITIAL_FORM)
      setPhoto(null)
      setPhotoPreview(null)
      setTimeout(() => navigate('/citizen-dashboard'), 2000)
    } catch (err) {
      setApiError(err.response?.data?.message || 'Failed to submit complaint. Please try again.')
    } finally { setLoading(false) }
  }

  if (successMsg) {
    return (
      <div className="success-page">
        <div className="success-box">
          <div className="success-icon">✅</div>
          <h2>Complaint Submitted!</h2>
          <p>{successMsg}</p>
          <p className="redirect-msg">Redirecting to your dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="form-page">
      <div className="form-container">
        <div className="form-header">
          <h1>Register a Complaint</h1>
          <p>Fill in all details accurately. Fields marked * are required.</p>
        </div>

        {apiError && <div className="error-banner">{apiError}</div>}

        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="form-section">
            <h3 className="section-title">👤 Personal Information</h3>
            <div className="form-grid">
              <div className="form-group">
                <label>Citizen Name *</label>
                <input name="citizenName" value={form.citizenName} onChange={handleChange} placeholder="Full name" className={errors.citizenName ? 'input-error' : ''} />
                {errors.citizenName && <span className="error-msg">{errors.citizenName}</span>}
              </div>
              <div className="form-group">
                <label>Aadhaar Number *</label>
                <input name="aadhaarNumber" value={form.aadhaarNumber} onChange={handleChange} placeholder="12-digit Aadhaar" maxLength={12} className={errors.aadhaarNumber ? 'input-error' : ''} />
                {errors.aadhaarNumber && <span className="error-msg">{errors.aadhaarNumber}</span>}
              </div>
              <div className="form-group">
                <label>Age *</label>
                <input type="number" name="age" value={form.age} onChange={handleChange} placeholder="Your age" min={1} max={120} className={errors.age ? 'input-error' : ''} />
                {errors.age && <span className="error-msg">{errors.age}</span>}
              </div>
              <div className="form-group">
                <label>Mobile Number *</label>
                <input type="tel" name="mobileNumber" value={form.mobileNumber} onChange={handleChange} placeholder="10-digit mobile" maxLength={10} className={errors.mobileNumber ? 'input-error' : ''} />
                {errors.mobileNumber && <span className="error-msg">{errors.mobileNumber}</span>}
              </div>
              <div className="form-group">
                <label>Email (optional)</label>
                <input type="email" name="citizenEmail" value={form.citizenEmail} onChange={handleChange} placeholder="your@email.com" className={errors.citizenEmail ? 'input-error' : ''} />
                {errors.citizenEmail && <span className="error-msg">{errors.citizenEmail}</span>}
              </div>
            </div>
            <div className="form-group">
              <label>Address *</label>
              <textarea name="address" value={form.address} onChange={handleChange} placeholder="Full address including city, district, pincode" rows={3} className={errors.address ? 'input-error' : ''} />
              {errors.address && <span className="error-msg">{errors.address}</span>}
            </div>
          </div>

          <div className="form-section">
            <h3 className="section-title">📋 Complaint Details</h3>
            <div className="form-grid">
              <div className="form-group">
                <label>Date of Issue *</label>
                <input type="date" name="dateOfIssue" value={form.dateOfIssue} onChange={handleChange} max={new Date().toISOString().split('T')[0]} className={errors.dateOfIssue ? 'input-error' : ''} />
                {errors.dateOfIssue && <span className="error-msg">{errors.dateOfIssue}</span>}
              </div>
              <div className="form-group">
                <label>Select Authority *</label>
                <select name="authority" value={form.authority} onChange={handleChange} className={errors.authority ? 'input-error' : ''}>
                  <option value="">-- Choose Authority --</option>
                  <option value="Collector">Collector</option>
                  <option value="MLA">MLA</option>
                  <option value="Counsellor">Counsellor</option>
                </select>
                {errors.authority && <span className="error-msg">{errors.authority}</span>}
              </div>
            </div>
            <div className="form-group">
              <label>Issue Statement *</label>
              <textarea name="issueStatement" value={form.issueStatement} onChange={handleChange} placeholder="Describe your issue in detail (at least 20 characters)..." rows={5} className={errors.issueStatement ? 'input-error' : ''} />
              <span className="char-count">{form.issueStatement.length} characters</span>
              {errors.issueStatement && <span className="error-msg">{errors.issueStatement}</span>}
            </div>
            <div className="form-group">
              <label>Issue Photo * (max 5MB)</label>
              <div className="photo-upload-area">
                <input type="file" id="issuePhoto" accept="image/*" onChange={handlePhoto} style={{ display: 'none' }} />
                <label htmlFor="issuePhoto" className={`photo-label ${errors.photo ? 'photo-label-error' : ''}`}>
                  {photoPreview ? (
                    <img src={photoPreview} alt="Preview" className="photo-preview" />
                  ) : (
                    <div className="photo-placeholder">
                      <span>📷</span>
                      <p>Click to upload photo evidence</p>
                      <small>JPEG, PNG, GIF, WEBP — max 5MB</small>
                    </div>
                  )}
                </label>
              </div>
              {errors.photo && <span className="error-msg">{errors.photo}</span>}
              {photo && <p className="file-name">📎 {photo.name}</p>}
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-outline" onClick={() => navigate(-1)}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit Complaint →'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ComplaintForm
