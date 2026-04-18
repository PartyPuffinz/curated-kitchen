import { Link } from 'react-router-dom'
import './Legal.css'

function AbusePolicy() {
  return (
    <main className="main">
      <div className="legal-layout">
        <div className="legal-header">
          <h2>Abuse Policy</h2>
          <p className="legal-effective">Effective date: April 2026</p>
        </div>

        <div className="legal-section">
          <h3>Our Commitment</h3>
          <p>Curated Kitchen is built to be a welcoming, inclusive
          community for people of all abilities, backgrounds, and
          dietary needs. We take abuse seriously and have designed
          our platform with multiple layers of protection to keep
          it safe for everyone.</p>
        </div>

        <div className="legal-section">
          <h3>Why Account Tiers Exist</h3>
          <p>Our tiered account system is not just about features —
          it is a core part of our anti-abuse strategy. New and
          unverified accounts have limited abilities deliberately.
          This prevents bots, spam accounts, and bad actors from
          immediately flooding the platform with fake ratings,
          harmful comments, or manipulated content.</p>
          <p>Specifically:</p>
          <p><strong>Guests</strong> can browse and use one ingredient
          exclusion. They cannot rate, comment, or upload. This
          prevents anonymous abuse entirely.</p>
          <p><strong>Basic unverified accounts</strong> can save
          recipes but cannot rate, comment, or upload until their
          email is verified. This ensures a real email address is
          attached to any community action.</p>
          <p><strong>Basic verified accounts</strong> must complete
          a 7-day probation period before rating, commenting, or
          uploading. This gives us time to detect automated account
          creation before abuse can occur.</p>
          <p><strong>Subscribers and Trusted Chefs</strong> have
          earned expanded permissions through either financial
          commitment or demonstrated community contribution.</p>
        </div>

        <div className="legal-section">
          <h3>Prohibited Behavior</h3>
          <p>The following behaviors are strictly prohibited and
          may result in immediate account suspension or permanent ban:</p>
          <p><strong>Spam and bots.</strong> Automated account
          creation, bot-driven ratings or comments, and coordinated
          inauthentic behavior are prohibited. We actively monitor
          for unusual activity patterns and will act swiftly.</p>
          <p><strong>Rating manipulation.</strong> Creating multiple
          accounts to inflate or deflate ratings, coordinating with
          others to mass-rate a recipe, or using any automated tool
          to manipulate community scores is prohibited.</p>
          <p><strong>Harassment and hate speech.</strong> Targeting
          other users with harassment, threats, slurs, or
          discriminatory language based on race, ethnicity, religion,
          gender, sexuality, disability, or any other characteristic
          is prohibited.</p>
          <p><strong>Impersonation.</strong> Pretending to be another
          user, a Trusted Chef, or a member of the Curated Kitchen
          team is prohibited.</p>
          <p><strong>Harmful content.</strong> Uploading recipes
          designed to harm, deliberately falsifying allergen
          information, or posting content intended to cause adverse
          reactions in vulnerable users is prohibited and may be
          reported to relevant authorities.</p>
          <p><strong>Phishing and scams.</strong> Using comments,
          profiles, or any platform feature to solicit personal
          information, financial details, or to redirect users to
          malicious sites is prohibited.</p>
          <p><strong>Inappropriate usernames or profile images.</strong>
          Usernames or profile pictures that are offensive, sexual,
          hateful, or designed to impersonate others will be removed.
          Repeat offenders will be banned.</p>
        </div>

        <div className="legal-section">
          <h3>Reporting Abuse</h3>
          <p>Every recipe page and comment has a report button
          accessible via the three-dot menu. Reports are reviewed
          by our moderation team. When you submit a report you will
          be asked to select a reason — this helps us prioritize
          and categorize incoming reports.</p>
          <p>Reports are anonymous. The person being reported will
          not be notified that a report was filed against them.</p>
          <p>We review the last 20 comments, recent ratings, and
          page activity of reported users to provide full context
          to our moderation team.</p>
        </div>

        <div className="legal-section">
          <h3>Our Right to Act</h3>
          <p>Curated Kitchen reserves the right to remove any
          content, suspend any account, or permanently ban any user
          at our discretion, with or without prior notice, if we
          determine that their behavior violates this policy or
          harms the community.</p>
          <p>Bans require human review — no account is permanently
          banned by an automated system alone. However, accounts
          may be temporarily suspended pending review.</p>
          <p>We reserve the right to report illegal activity to
          relevant law enforcement authorities.</p>
        </div>

        <div className="legal-section">
          <h3>Appeals</h3>
          <p>If you believe your account was suspended or content
          was removed in error, you may submit an appeal through
          our <Link to="/feedback">feedback page</Link>. Select
          "Other" as the feedback type and describe your situation.
          Appeals are reviewed within 7 business days.</p>
          <p>We do not guarantee reinstatement. Decisions on
          permanent bans are final.</p>
        </div>

        <div className="legal-section">
          <h3>Phone Number Policy</h3>
          <p>Phone numbers provided for verification may only be
          changed once every 30 days. This prevents abuse of the
          verification system. Phone numbers are never displayed
          publicly and are used only for account verification
          purposes.</p>
        </div>

        <div className="legal-footer-links">
          <Link to="/terms">Terms of Service</Link>
          <Link to="/privacy">Privacy Policy</Link>
          <Link to="/faq">FAQ</Link>
          <Link to="/feedback">Report an Issue</Link>
        </div>
      </div>
    </main>
  )
}

export default AbusePolicy