import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Register() {
  const navigate = useNavigate()
  const { register } = useAuth()
  const [form, setForm] = useState({ name: '', mobile: '', email: '', password: '', confirmPassword: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [apiError, setApiError] = useState('')

  const validate = () => {
    const errs = {}
    if (!form.name.trim() || form.name.trim().length < 2) errs.name = 'Name must be at least 2 characters'
    if (!/^[6-9]\d{9}$/.test(form.mobile)) errs.mobile = 'Enter a valid 10-digit Indian mobile number'
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Enter a valid email'
    if (!form.password || form.password.length < 6) errs.password = 'Password must be at least 6 characters'
    if (form.password !== form.confirmPassword) errs.confirmPassword = 'Passwords do not match'
    return errs
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setErrors({ ...errors, [e.target.name]: '' })
    setApiError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    setLoading(true); setApiError('')
    try {
      await register(form.name, form.mobile, form.password, form.email)
      navigate('/citizen-dashboard')
    } catch (err) {
      setApiError(err.response?.data?.message || 'Registration failed. Please try again.')
    } finally { setLoading(false) }
  }

  return (
    <div className="auth-page">
      <div className="auth-container auth-container-wide">
        <div className="auth-header">
          <span className="auth-icon">📝</span>
          <h1>Create Account</h1>
          <p>Register to file and track your complaints</p>
        </div>

        {apiError && <div className="error-banner">{apiError}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Full Name *</label>
            <input name="name" type="text" placeholder="Your full name" value={form.name} onChange={handleChange}
              className={errors.name ? 'input-error' : ''} />
            {errors.name && <span className="error-msg">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label>Mobile Number *</label>
            <input name="mobile" type="tel" placeholder="10-digit mobile number" value={form.mobile}
              maxLength={10} onChange={handleChange} className={errors.mobile ? 'input-error' : ''} />
            {errors.mobile && <span className="error-msg">{errors.mobile}</span>}
          </div>

          <div className="form-group">
            <label>Email (optional)</label>
            <input name="email" type="email" placeholder="your@email.com" value={form.email} onChange={handleChange}
              className={errors.email ? 'input-error' : ''} />
            {errors.email && <span className="error-msg">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label>Password *</label>
            <input name="password" type="password" placeholder="Min. 6 characters" value={form.password}
              onChange={handleChange} className={errors.password ? 'input-error' : ''} />
            {errors.password && <span className="error-msg">{errors.password}</span>}
          </div>

          <div className="form-group">
            <label>Confirm Password *</label>
            <input name="confirmPassword" type="password" placeholder="Re-enter password" value={form.confirmPassword}
              onChange={handleChange} className={errors.confirmPassword ? 'input-error' : ''} />
            {errors.confirmPassword && <span className="error-msg">{errors.confirmPassword}</span>}
          </div>

          <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
            {loading ? 'Creating Account...' : 'Create Account →'}
          </button>

          <p className="auth-hint">Already have an account? <Link to="/login" className="auth-link">Sign in →</Link></p>
        </form>
      </div>
    </div>
  )
}

export default Register
