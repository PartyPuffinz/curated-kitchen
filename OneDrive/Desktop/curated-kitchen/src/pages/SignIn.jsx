import { useState } from 'react'
import { Link } from 'react-router-dom'
import './SignIn.css'

function SignIn() {
  const [activeTab, setActiveTab] = useState('signin')
  const [step, setStep] = useState(1)

  return (
    <main className="auth-layout">
      <div className="auth-card">

        <div className="launch-banner">
          Launch pricing — lock in $9.99/month for life
        </div>

        <h2>Welcome to Curated Kitchen</h2>
        <p className="auth-subtitle">Sign in or create your account</p>

        <div className="auth-tabs">
          <button
            className={`auth-tab ${activeTab === 'signin' ? 'active' : ''}`}
            onClick={() => { setActiveTab('signin'); setStep(1) }}
          >Sign in</button>
          <button
            className={`auth-tab ${activeTab === 'register' ? 'active' : ''}`}
            onClick={() => { setActiveTab('register'); setStep(1) }}
          >Create account</button>
        </div>

        {activeTab === 'signin' && (
          <div className="auth-form">
            <div className="form-group">
              <label>Email address</label>
              <input type="email" placeholder="you@example.com" />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input type="password" placeholder="Your password" />
            </div>
            <a href="#" className="forgot-link">Forgot your password?</a>
            <button className="submit-btn">Sign in</button>
          </div>
        )}

        {activeTab === 'register' && step === 1 && (
          <div className="auth-form">
            <div className="form-group">
              <label>Email address</label>
              <input type="email" placeholder="you@example.com" />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input type="password" placeholder="Create a password" />
            </div>
            <div className="form-group">
              <label>Confirm password</label>
              <input type="password" placeholder="Confirm your password" />
            </div>
            <p className="auth-note">A verification email will be sent
            to activate your account. You can browse and save recipes
            once verified.</p>
            <button className="submit-btn"
            onClick={() => setStep(2)}>Create account</button>
          </div>
        )}

        {activeTab === 'register' && step === 2 && (
          <div className="auth-form">
            <div className="unlock-box">
              <p className="unlock-title">Unlock full access</p>
              <p className="unlock-desc">Add your phone number to unlock:</p>
              <ul className="unlock-list">
                <li>Rate and comment on recipes</li>
                <li>Upload your own recipes</li>
                <li>Exclude up to 5 ingredients</li>
                <li>Access after 7 day probation period</li>
              </ul>
            </div>
            <div className="form-group">
              <label>Phone number (optional)</label>
              <input type="tel" placeholder="+1 (555) 000-0000" />
            </div>
            <button className="submit-btn"
            onClick={() => setStep(3)}>Send verification code</button>
            <button className="skip-btn">
            Skip for now — basic access only</button>
          </div>
        )}

        {activeTab === 'register' && step === 3 && (
          <div className="auth-form">
            <p className="auth-note">We sent a 6-digit code to your
            phone. Enter it below to verify.</p>
            <div className="form-group">
              <label>Verification code</label>
              <input type="text" placeholder="000000"
              maxLength="6" className="code-input" />
            </div>
            <button className="submit-btn">Verify and finish</button>
            <button className="skip-btn">
            Skip — basic access only</button>
          </div>
        )}

        <p className="auth-divider">or continue with</p>
        <button className="social-btn">Sign in with Google</button>

        <div className="auth-extra-links">
          <Link to="/membership" className="auth-extra-btn">
          View membership levels</Link>
          <Link to="/subscribe" className="auth-extra-btn filled-extra">
          Continue with subscription</Link>
        </div>

        <p className="auth-terms">By continuing you agree to our
          <Link to="#">Terms of Service</Link> and
          <Link to="#">Privacy Policy</Link>
        </p>

      </div>
    </main>
  )
}

export default SignIn