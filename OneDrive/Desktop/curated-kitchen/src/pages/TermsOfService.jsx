import { Link } from 'react-router-dom'
import './Legal.css'

function TermsOfService() {
  return (
    <main className="main">
      <div className="legal-layout">
        <div className="legal-header">
          <h2>Terms of Service</h2>
          <p className="legal-effective">Effective date: April 2026</p>
        </div>

        <div className="legal-section">
          <h3>1. Acceptance of Terms</h3>
          <p>By accessing or using Curated Kitchen, you agree to be
          bound by these Terms of Service. If you do not agree,
          please do not use the platform.</p>
        </div>

        <div className="legal-section">
          <h3>2. User Accounts</h3>
          <p>You are responsible for maintaining the security of your
          account. You must not share your login credentials or allow
          others to access your account. You must provide accurate
          information when creating an account.</p>
          <p>Accounts found to be using false information, impersonating
          others, or engaging in abusive behavior may be suspended or
          permanently banned without notice.</p>
        </div>

        <div className="legal-section">
          <h3>3. Content & Recipes</h3>
          <p>By uploading a recipe to Curated Kitchen, you grant us
          a non-exclusive, royalty-free license to display, distribute,
          and promote that content on the platform. You retain ownership
          of your content.</p>
          <p>Recipes are permanent on the platform. If you delete your
          account, your recipes will remain but your username will be
          displayed as "Deleted User." You may not delete recipe content
          directly — edit requests are reviewed by our moderation team.</p>
          <p>You may not upload content that is plagiarized, offensive,
          harmful, or designed to deceive users about dietary or
          allergen information.</p>
        </div>

        <div className="legal-section">
          <h3>4. Subscriptions & Payments</h3>
          <p>Subscriptions are billed monthly or annually. No refunds
          are issued under any circumstances. Cancellations must be
          submitted at least 3 days before your renewal date and take
          effect at the end of the current billing period.</p>
          <p>Launch pricing subscribers are grandfathered at their
          original rate for the lifetime of their account, regardless
          of future price increases.</p>
        </div>

        <div className="legal-section">
          <h3>5. Community Standards</h3>
          <p>You agree not to use Curated Kitchen to harass, threaten,
          or abuse other users. You agree not to post spam, engage in
          coordinated inauthentic behavior, or attempt to manipulate
          ratings or community features.</p>
          <p>Violations may result in content removal, account
          suspension, or permanent ban. Serious violations may be
          reported to relevant authorities.</p>
        </div>

        <div className="legal-section">
          <h3>6. Allergen & Dietary Disclaimer</h3>
          <p>Allergen and dietary information on Curated Kitchen is
          provided as a guide only. We do not guarantee the accuracy
          of tags, ingredient lists, or nutritional information.
          Always verify ingredients before cooking if you have
          food allergies or dietary restrictions.</p>
        </div>

        <div className="legal-section">
          <h3>7. Limitation of Liability</h3>
          <p>Curated Kitchen is provided "as is" without warranties
          of any kind. We are not liable for any damages arising from
          your use of the platform, including but not limited to
          adverse reactions to recipes, data loss, or service
          interruptions.</p>
        </div>

        <div className="legal-section">
          <h3>8. Changes to Terms</h3>
          <p>We reserve the right to update these terms at any time.
          Continued use of the platform after changes constitutes
          acceptance of the new terms. We will notify users of
          significant changes via email or in-app banner.</p>
        </div>

        <div className="legal-footer-links">
          <Link to="/privacy">Privacy Policy</Link>
          <Link to="/abuse-policy">Abuse Policy</Link>
          <Link to="/faq">FAQ</Link>
        </div>
      </div>
    </main>
  )
}

export default TermsOfService