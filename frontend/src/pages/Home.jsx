import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Home() {
  const navigate = useNavigate()
  const { user, isAdmin, isCitizen } = useAuth()

  const features = [
    { icon: '📝', title: 'Easy Filing', desc: 'Submit complaints with all necessary details including photo evidence in minutes.' },
    { icon: '📊', title: 'Track Status', desc: 'Monitor your complaint status in real time from Pending to Resolved.' },
    { icon: '🏛️', title: 'Right Authority', desc: 'Route issues directly to Collector, MLA, or Counsellor for faster resolution.' },
    { icon: '🔒', title: 'Secure & Private', desc: 'JWT-authenticated access ensures your data is safe and private.' },
  ]

  const steps = [
    { num: '01', title: 'Register', desc: 'Create your account using your mobile number and password.' },
    { num: '02', title: 'File Complaint', desc: 'Fill out the complaint form with details and photo.' },
    { num: '03', title: 'Track Progress', desc: 'Monitor your complaint from your dashboard.' },
    { num: '04', title: 'Resolution', desc: 'Receive updates when your complaint is resolved.' },
  ]

  return (
    <div className="home-page">
      <section className="hero">
        <div className="hero-content">
          <span className="hero-tag">Government Grievance Portal</span>
          <h1 className="hero-title">Your Voice, <br /><span className="hero-accent">Our Priority</span></h1>
          <p className="hero-subtitle">File and track civic complaints directly with local authorities. Transparent, efficient, and accountable governance starts here.</p>
          <div className="hero-btns">
            {!user && (
              <>
                <button className="btn btn-primary" onClick={() => navigate('/register')}>Get Started Free</button>
                <button className="btn btn-outline" onClick={() => navigate('/login')}>Sign In</button>
              </>
            )}
            {isCitizen && (
              <>
                <button className="btn btn-primary" onClick={() => navigate('/register-complaint')}>File a Complaint</button>
                <button className="btn btn-outline" onClick={() => navigate('/citizen-dashboard')}>My Complaints</button>
              </>
            )}
            {isAdmin && (
              <button className="btn btn-primary" onClick={() => navigate('/admin-dashboard')}>Go to Admin Panel</button>
            )}
          </div>
          <div className="hero-stats">
            <div className="stat"><strong>2,400+</strong><span>Complaints Filed</span></div>
            <div className="stat"><strong>1,800+</strong><span>Resolved</span></div>
            <div className="stat"><strong>3</strong><span>Authorities</span></div>
          </div>
        </div>
        <div className="hero-visual">
          <div className="hero-card-stack">
            <div className="floating-card fc1"><span className="fc-icon">✅</span><div><strong>Road Repair</strong><p>Resolved in 3 days</p></div></div>
            <div className="floating-card fc2"><span className="fc-icon">⏳</span><div><strong>Water Supply</strong><p>In Progress</p></div></div>
            <div className="floating-card fc3"><span className="fc-icon">📋</span><div><strong>Street Light</strong><p>Pending Review</p></div></div>
          </div>
        </div>
      </section>

      <section className="features-section">
        <div className="section-header">
          <h2>Why Choose PeopleVoice?</h2>
          <p>A transparent platform built for citizens, managed by authorities.</p>
        </div>
        <div className="features-grid">
          {features.map((f, i) => (
            <div className="feature-card" key={i}>
              <span className="feature-icon">{f.icon}</span>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="steps-section">
        <div className="section-header">
          <h2>How It Works</h2>
          <p>Four simple steps to get your issue resolved.</p>
        </div>
        <div className="steps-grid">
          {steps.map((s, i) => (
            <div className="step-card" key={i}>
              <span className="step-num">{s.num}</span>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="cta-section">
        <h2>Ready to make your voice heard?</h2>
        <p>Join thousands of citizens who have successfully resolved their civic issues.</p>
        {!user && (
          <button className="btn btn-primary btn-lg" onClick={() => navigate('/register')}>
            Create Free Account →
          </button>
        )}
        {isCitizen && (
          <button className="btn btn-primary btn-lg" onClick={() => navigate('/register-complaint')}>
            Submit Your Complaint Now →
          </button>
        )}
      </section>
    </div>
  )
}

export default Home
