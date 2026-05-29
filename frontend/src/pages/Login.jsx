import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Login() {
  const navigate = useNavigate()
  const { login, adminLogin } = useAuth()
  const [activeTab, setActiveTab] = useState('citizen')
  const [citizenForm, setCitizenForm] = useState({ mobile: '', password: '' })
  const [adminForm, setAdminForm] = useState({ username: '', password: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [apiError, setApiError] = useState('')

  const validateCitizen = () => {
    const errs = {}
    if (!/^[6-9]\d{9}$/.test(citizenForm.mobile)) errs.mobile = 'Enter a valid 10-digit mobile number'
    if (!citizenForm.password || citizenForm.password.length < 6) errs.password = 'Password must be at least 6 characters'
    return errs
  }

  const validateAdmin = () => {
    const errs = {}
    if (!adminForm.username.trim()) errs.username = 'Username is required'
    if (!adminForm.password) errs.password = 'Password is required'
    return errs
  }

  const handleCitizenLogin = async (e) => {
    e.preventDefault()
    const errs = validateCitizen()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    setLoading(true); setApiError('')
    try {
      await login(citizenForm.mobile, citizenForm.password)
      navigate('/citizen-dashboard')
    } catch (err) {
      setApiError(err.response?.data?.message || 'Login failed. Please try again.')
    } finally { setLoading(false) }
  }

  const handleAdminLogin = async (e) => {
    e.preventDefault()
    const errs = validateAdmin()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    setLoading(true); setApiError('')
    try {
      await adminLogin(adminForm.username, adminForm.password)
      navigate('/admin-dashboard')
    } catch (err) {
      setApiError(err.response?.data?.message || 'Invalid admin credentials.')
    } finally { setLoading(false) }
  }

  const switchTab = (tab) => { setActiveTab(tab); setErrors({}); setApiError('') }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <span className="auth-icon">⚖️</span>
          <h1>Welcome Back</h1>
          <p>Sign in to access your portal</p>
        </div>

        <div className="tab-group">
          <button className={`tab-btn ${activeTab === 'citizen' ? 'active' : ''}`} onClick={() => switchTab('citizen')}>👤 Citizen</button>
          <button className={`tab-btn ${activeTab === 'admin' ? 'active' : ''}`} onClick={() => switchTab('admin')}>🛡️ Admin</button>
        </div>

        {apiError && <div className="error-banner">{apiError}</div>}

        {activeTab === 'citizen' ? (
          <form onSubmit={handleCitizenLogin} className="auth-form">
            <div className="form-group">
              <label>Mobile Number *</label>
              <input type="tel" placeholder="10-digit mobile number" value={citizenForm.mobile} maxLength={10}
                onChange={(e) => { setCitizenForm({ ...citizenForm, mobile: e.target.value }); setErrors({}) }}
                className={errors.mobile ? 'input-error' : ''} />
              {errors.mobile && <span className="error-msg">{errors.mobile}</span>}
            </div>
            <div className="form-group">
              <label>Password *</label>
              <input type="password" placeholder="Your password" value={citizenForm.password}
                onChange={(e) => { setCitizenForm({ ...citizenForm, password: e.target.value }); setErrors({}) }}
                className={errors.password ? 'input-error' : ''} />
              {errors.password && <span className="error-msg">{errors.password}</span>}
            </div>
            <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
            <p className="auth-hint">New user? <Link to="/register" className="auth-link">Create an account →</Link></p>
          </form>
        ) : (
          <form onSubmit={handleAdminLogin} className="auth-form">
            <div className="auth-notice">
              <strong>🔑 Admin Access</strong>
              <p>Username: <code>admin</code> &nbsp; Password: <code>admin123</code></p>
            </div>
            <div className="form-group">
              <label>Username *</label>
              <input type="text" placeholder="Admin username" value={adminForm.username}
                onChange={(e) => { setAdminForm({ ...adminForm, username: e.target.value }); setErrors({}) }}
                className={errors.username ? 'input-error' : ''} />
              {errors.username && <span className="error-msg">{errors.username}</span>}
            </div>
            <div className="form-group">
              <label>Password *</label>
              <input type="password" placeholder="Admin password" value={adminForm.password}
                onChange={(e) => { setAdminForm({ ...adminForm, password: e.target.value }); setErrors({}) }}
                className={errors.password ? 'input-error' : ''} />
              {errors.password && <span className="error-msg">{errors.password}</span>}
            </div>
            <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In as Admin'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

export default Login
