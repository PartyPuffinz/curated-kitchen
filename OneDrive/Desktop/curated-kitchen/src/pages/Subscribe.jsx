import { useState } from 'react'
import { Link } from 'react-router-dom'
import './Subscribe.css'

function Subscribe() {
  const [plan, setPlan] = useState('monthly')

  return (
    <main className="auth-layout">
      <div className="auth-card">

        <div className="launch-banner">
          Launch pricing — lock in $9.99/month for life
        </div>

        <h2>Subscribe to Curated Kitchen</h2>
        <p className="auth-subtitle">Unlock the full personalized experience</p>

        <div className="plan-toggle">
          <button
            className={`plan-btn ${plan === 'monthly' ? 'active' : ''}`}
            onClick={() => setPlan('monthly')}
          >Monthly</button>
          <button
            className={`plan-btn ${plan === 'annual' ? 'active' : ''}`}
            onClick={() => setPlan('annual')}
          >Annual — save 33%</button>
        </div>

        {plan === 'monthly' && (
          <div className="plan-summary">
            <p className="plan-price">$9.99 <span>/ month</span></p>
            <p className="plan-note">Cancel anytime.</p>
          </div>
        )}

        {plan === 'annual' && (
          <div className="plan-summary">
            <p className="plan-price">$80 <span>/ year</span></p>
            <p className="plan-note">Best value — save 33%, roughly
            4 months free.</p>
          </div>
        )}

        <div className="plan-features-mini">
          <p className="plan-features-title">Everything included:</p>
          <ul>
            <li>Ad-free browsing</li>
            <li>Unlimited saved recipes</li>
            <li>View 7 last visited recipes</li>
            <li>Exclude up to 15 ingredients</li>
            <li>Personalized Spoon-Based Scoring</li>
            <li>My Equipment profile</li>
            <li>Filter by equipment profile</li>
            <li>Search by ingredient or equipment</li>
            <li>Saved filters per session</li>
            <li>Filter recipes by holiday or season</li>
            <li>Grocery shopping list</li>
            <li>Recipe Card mode — step by step with timers</li>
            <li>Upload up to 4 recipes per day</li>
            <li>Rate up to 20 recipes per day</li>
            <li>Comment up to 20 times per day</li>
            <li>Nutritional auto-calculation per portion</li>
            <li>Phone number optional</li>
          </ul>
          <Link to="/membership" className="forgot-link">
          View full membership comparison</Link>
        </div>

        <div className="pricing-notice">
          Pricing is planned to increase approximately one year
          from launch. Subscribers who sign up during launch
          pricing will be grandfathered at $9.99/month or
          $80/year for the lifetime of their account.
        </div>

        <div className="stripe-placeholder">
          <p className="stripe-note">Payment processed securely
          by Stripe. We do not store your card details.</p>
          <div className="form-group">
            <label>Cardholder name</label>
            <input type="text" placeholder="Name on card" />
          </div>
          <div className="stripe-field">
            <p className="stripe-coming-soon">Secure card entry
            will appear here once payment processing
            is connected.</p>
          </div>
          <button className="submit-btn">Subscribe now</button>
        </div>

        <div className="legal-notice">
          <p>By subscribing you agree to our
          <Link to="#"> Terms of Service</Link> and
          <Link to="#"> Privacy Policy</Link>.</p>
          <p>Cancelling your subscription returns you to your
          qualified Basic tier. You will be notified of how many
          saved recipes you will lose access to before any
          changes take effect.</p>
          <p>No refunds are issued. Subscription cancellations
must be submitted 3 days before your monthly or annual
renewal date. Cancelled subscriptions remain active
until the next billing cycle.</p>
          <p>Curated Kitchen reserves the right to update pricing
for new subscribers. Existing subscribers that are
eligible to receive the special launch pricing are
grandfathered to receive the launch pricing for the
lifetime of their account, regardless of any future
pricing increases.</p>
        </div>

      </div>
    </main>
  )
}

export default Subscribe