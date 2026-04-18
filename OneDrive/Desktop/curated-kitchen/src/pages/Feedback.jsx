import { useState } from 'react'
import './Feedback.css'

function Feedback() {
  const [type, setType] = useState('')
  const [message, setMessage] = useState('')
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  function handleSubmit() {
    setError('')
    if (!type) { setError('Please select a feedback type.'); return }
    if (!message.trim()) { setError('Please enter your feedback.'); return }
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <main className="main">
        <div className="feedback-layout">
          <div className="feedback-success">
            <span>🎉</span>
            <h2>Thank you for your feedback!</h2>
            <p>We read every submission and use it to make
            Curated Kitchen better for everyone.</p>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="main">
      <div className="feedback-layout">
        <div className="feedback-header">
          <h2>Share Your Feedback</h2>
          <p>Have an idea, found a bug, or just want to say hi?
          We'd love to hear from you. Every piece of feedback
          helps us improve.</p>
        </div>

        <div className="feedback-card">
          <div className="feedback-group">
            <label>What kind of feedback is this?</label>
            <div className="feedback-types">
              {['Bug report', 'Feature request', 'Recipe issue',
                'Accessibility concern', 'General feedback',
                'Other'].map(t => (
                <button
                  key={t}
                  className={`feedback-type-btn ${type === t ? 'active' : ''}`}
                  onClick={() => setType(t)}
                >{t}</button>
              ))}
            </div>
          </div>

          <div className="feedback-group">
            <label>Your feedback</label>
            <textarea
              className="feedback-textarea"
              placeholder="Tell us what's on your mind..."
              value={message}
              onChange={e => setMessage(e.target.value)}
              rows={6}
            />
          </div>

          <div className="feedback-group">
            <label>Email address (optional)</label>
            <input
              type="email"
              className="feedback-input"
              placeholder="If you'd like a response..."
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
            <p className="feedback-hint">We'll only use this to
            follow up on your feedback if needed.</p>
          </div>

          {error && <p className="auth-error">{error}</p>}

          <button className="submit-btn" onClick={handleSubmit}>
            Send Feedback
          </button>
        </div>
      </div>
    </main>
  )
}

export default Feedback