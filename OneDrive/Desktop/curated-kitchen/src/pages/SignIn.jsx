import { useState } from 'react'
import { supabase } from '../supabaseClient'
import { Link } from 'react-router-dom'
import './SignIn.css'

function SignIn() {
  const [activeTab, setActiveTab] = useState('signin')
  const [step, setStep] = useState(1)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [username, setUsername] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [showPassword, setShowPassword] = useState(false)
const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  function getPasswordStrength(pwd) {
    let score = 0
    if (pwd.length >= 8) score++
    if (/[A-Z]/.test(pwd)) score++
    if (/[a-z]/.test(pwd)) score++
    if (/[!?@#$%^&*]/.test(pwd)) score++
    if ((/\d.*\d/).test(pwd)) score++
    return score
  }

  function getStrengthLabel(score) {
    if (score <= 1) return { label: 'Very weak', color: '#e74c3c' }
    if (score === 2) return { label: 'Weak', color: '#e67e22' }
    if (score === 3) return { label: 'Fair', color: '#f1c40f' }
    if (score === 4) return { label: 'Strong', color: '#2ecc71' }
    return { label: 'Very strong', color: '#0f6e3a' }
  }

  function validatePassword(pwd) {
    const errors = []
    if (pwd.length < 8) errors.push('At least 8 characters')
    if (!/[A-Z]/.test(pwd)) errors.push('At least one uppercase letter')
    if (!/[a-z]/.test(pwd)) errors.push('At least one lowercase letter')
    if (!/[!?@#$%^&*]/.test(pwd)) errors.push('At least one special character (!?@#$%^&*)')
    if (!(/\d.*\d/).test(pwd)) errors.push('At least two numbers')
    return errors
  }

  async function handleSignIn() {
    setError('')
    setMessage('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      if (error.message.includes('Invalid login')) {
        setError('No account found with that email and password combination.')
      } else {
        setError(error.message)
      }
    } else {
      window.location.href = '/'
    }
  }

  async function handleRegister() {
    setError('')
    setMessage('')
    if (!username) {
      setError('Please choose a username.')
      return
    }
    if (username.length < 3) {
      setError('Username must be at least 3 characters.')
      return
    }
    const pwdErrors = validatePassword(password)
    if (pwdErrors.length > 0) {
      setError('Password must include: ' + pwdErrors.join(', ') + '.')
      return
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password
    })

    if (signUpError) {
      if (signUpError.message.includes('already registered')) {
        setError('An account with that email already exists. Try signing in instead.')
      } else {
        setError(signUpError.message)
      }
      return
    }

    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: data.user.id,
        username: username,
        account_type: 'basic_email'
      })

    if (profileError) {
      if (profileError.message.includes('unique')) {
        setError('That username is already taken — please try another.')
      } else {
        setError(profileError.message)
      }
      return
    }

    setMessage('Account created! Check your email to verify your account.')
    setStep(2)
  }

  async function handleForgotPassword(e) {
    e.preventDefault()
    setError('')
    setMessage('')
    if (!email) {
      setError('Enter your email address above first.')
      return
    }
    const { error } = await supabase.auth.resetPasswordForEmail(email)
    if (error) {
      setError(error.message)
    } else {
      setMessage('Password reset email sent — check your inbox!')
    }
  }

  const strengthScore = getPasswordStrength(password)
  const strengthInfo = getStrengthLabel(strengthScore)

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
            onClick={() => { setActiveTab('signin'); setStep(1); setError(''); setMessage(''); setPassword(''); setConfirmPassword(''); setEmail(''); setUsername('') }}
          >Sign in</button>
          <button
            className={`auth-tab ${activeTab === 'register' ? 'active' : ''}`}
            onClick={() => { setActiveTab('register'); setStep(1); setError(''); setMessage('') }}
          >Create account</button>
        </div>

        {activeTab === 'signin' && (
          <div className="auth-form">
            <div className="form-group">
  <label htmlFor="signin-email">Email address</label>
  <input
    id="signin-email"
    name="email"
    type="email"
    placeholder="you@example.com"
    value={email}
    onChange={e => setEmail(e.target.value)}
  />
</div>
<div className="form-group">
  <label htmlFor="signin-password">Password</label>
  <div className="password-wrapper">
    <input
  id="signin-password"
  name="password"
  type={showPassword ? 'text' : 'password'}
  placeholder="Your password"
  value={password}
  onChange={e => setPassword(e.target.value)}
/>
    <button
      type="button"
      className="eye-btn"
      onClick={() => setShowPassword(!showPassword)}
    >
      {showPassword ? '🙈' : '👁️'}
    </button>
  </div>
</div>
            {error && <p className="auth-error">{error}</p>}
            {message && <p className="auth-success">{message}</p>}
            <a href="#" className="forgot-link"
            onClick={handleForgotPassword}>Forgot your password?</a>
            <button className="submit-btn" onClick={handleSignIn}>
            Sign in</button>
          </div>
        )}

        {activeTab === 'register' && step === 1 && (
          <div className="auth-form">
            <div className="form-group">
              <label>Email address</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Username</label>
              <input
                type="text"
                placeholder="Choose a username"
                value={username}
                onChange={e => setUsername(
                  e.target.value.toLowerCase().replace(/\s/g, '')
                )}
              />
              <p className="field-hint">Lowercase only, no spaces.
              This is what others will see.</p>
            </div>
            <div className="form-group">
  <label>Password</label>
  <div className="password-wrapper">
    <input
      type={showPassword ? 'text' : 'password'}
      placeholder="Create a password"
      value={password}
      onChange={e => setPassword(e.target.value)}
    />
    <button
      type="button"
      className="eye-btn"
      onClick={() => setShowPassword(!showPassword)}
    >
      {showPassword ? '🙈' : '👁️'}
    </button>
  </div>
              {password.length > 0 && (
                <div className="strength-bar-wrapper">
                  <div className="strength-bar">
                    <div
                      className="strength-fill"
                      style={{
                        width: `${(strengthScore / 5) * 100}%`,
                        backgroundColor: strengthInfo.color
                      }}
                    />
                  </div>
                  <span className="strength-label"
                  style={{ color: strengthInfo.color }}>
                    {strengthInfo.label}
                  </span>
                </div>
              )}
              <ul className="password-reqs">
                <li className={password.length >= 8 ? 'met' : ''}>
                At least 8 characters</li>
                <li className={/[A-Z]/.test(password) ? 'met' : ''}>
                At least one uppercase letter</li>
                <li className={/[a-z]/.test(password) ? 'met' : ''}>
                At least one lowercase letter</li>
                <li className={/[!?@#$%^&*]/.test(password) ? 'met' : ''}>
                At least one special character (!?@#$%^&*)</li>
                <li className={(/\d.*\d/).test(password) ? 'met' : ''}>
                At least two numbers</li>
              </ul>
            </div>
            <div className="form-group">
  <label>Confirm password</label>
  <div className="password-wrapper">
    <input
      type={showConfirmPassword ? 'text' : 'password'}
      placeholder="Confirm your password"
      value={confirmPassword}
      onChange={e => setConfirmPassword(e.target.value)}
    />
    <button
      type="button"
      className="eye-btn"
      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
    >
      {showConfirmPassword ? '🙈' : '👁️'}
    </button>
  </div>
              {confirmPassword.length > 0 && password !== confirmPassword && (
                <p className="field-hint error">Passwords do not match.</p>
              )}
              {confirmPassword.length > 0 && password === confirmPassword && (
                <p className="field-hint success">Passwords match!</p>
              )}
            </div>
            {error && <p className="auth-error">{error}</p>}
            {message && <p className="auth-success">{message}</p>}
            <p className="auth-note">A verification email will be sent
            to activate your account. You can browse and save recipes
            once verified.</p>
            <button className="submit-btn"
            onClick={handleRegister}>Create account</button>
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
            <button className="skip-btn" onClick={() => window.location.href = '/'}>
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