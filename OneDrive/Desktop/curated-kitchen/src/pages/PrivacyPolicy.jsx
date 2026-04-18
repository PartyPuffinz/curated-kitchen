import { Link } from 'react-router-dom'
import './Legal.css'

function PrivacyPolicy() {
  return (
    <main className="main">
      <div className="legal-layout">
        <div className="legal-header">
          <h2>Privacy Policy</h2>
          <p className="legal-effective">Effective date: April 2026</p>
        </div>

        <div className="legal-section">
          <h3>1. Information We Collect</h3>
          <p>When you create an account, we collect your email address,
          username, and optionally your phone number. If you subscribe,
          payment is processed by Stripe — we do not store your card
          details.</p>
          <p>We also collect information you provide voluntarily, such
          as recipes you upload, ratings and comments you submit,
          your equipment profile, and your bio if you are a
          Trusted Chef.</p>
        </div>

        <div className="legal-section">
          <h3>2. How We Use Your Information</h3>
          <p>We use your information to operate the platform, provide
          personalized features such as Spoon Score adjustments based
          on your equipment profile, and communicate with you about
          your account status.</p>
          <p>We do not sell your personal information to third parties.
          We do not display advertising. Curated Kitchen is ad-free.</p>
        </div>

        <div className="legal-section">
          <h3>3. Cookies & Local Storage</h3>
          <p>We use browser local storage to maintain your session
          and remember your preferences. We do not use third-party
          tracking cookies.</p>
        </div>

        <div className="legal-section">
          <h3>4. Data Retention</h3>
          <p>If you delete your account, your personal information is
          removed from our systems within 30 days. However, recipes
          you uploaded remain on the platform with your username
          replaced by "Deleted User." Ratings and comments you
          submitted are anonymized.</p>
        </div>

        <div className="legal-section">
          <h3>5. Security</h3>
          <p>We use industry-standard security practices to protect
          your data. Passwords are hashed and never stored in plain
          text. However, no system is completely secure and we cannot
          guarantee absolute security.</p>
        </div>

        <div className="legal-section">
          <h3>6. Third-Party Services</h3>
          <p>We use Supabase for database and authentication services,
          Stripe for payment processing, and the USDA FoodData Central
          API for nutritional information. Each of these services has
          their own privacy policy.</p>
        </div>

        <div className="legal-section">
          <h3>7. Children's Privacy</h3>
          <p>Curated Kitchen is not intended for users under the age
          of 13. We do not knowingly collect personal information from
          children. If you believe a child has created an account,
          please contact us.</p>
        </div>

        <div className="legal-section">
          <h3>8. Your Rights</h3>
          <p>You have the right to access, correct, or delete your
          personal information. You can update your account details
          at any time from your profile page. To request deletion of
          your data, please contact us via the feedback page.</p>
        </div>

        <div className="legal-section">
          <h3>9. Changes to This Policy</h3>
          <p>We may update this policy from time to time. We will
          notify users of significant changes via email or in-app
          banner. Continued use of the platform constitutes
          acceptance of the updated policy.</p>
        </div>

        <div className="legal-footer-links">
          <Link to="/terms">Terms of Service</Link>
          <Link to="/abuse-policy">Abuse Policy</Link>
          <Link to="/faq">FAQ</Link>
        </div>
      </div>
    </main>
  )
}

export default PrivacyPolicy