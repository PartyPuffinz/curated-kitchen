import { Link } from 'react-router-dom'
import './TrustedChefInfo.css'

function TrustedChefInfo() {
  return (
    <main className="main">
      <div className="tc-info-layout">

        <div className="tc-info-header">
          <span className="tc-info-badge">👨‍🍳 Trusted Chef</span>
          <h2>What is a Trusted Chef?</h2>
          <p>The Trusted Chef title is our community's highest honor
          for recipe uploaders. It's earned — not purchased — and
          reflects a consistent track record of recipes that the
          community loves.</p>
        </div>

        <div className="tc-info-section">
          <h3>How to Earn Trusted Chef Status</h3>
          <p>To earn the Trusted Chef title, your account must meet
          all three of the following criteria:</p>
          <ul className="tc-criteria">
            <li>
              <span className="tc-criteria-icon">📅</span>
              <div>
                <strong>Account age of 30+ days</strong>
                <p>Your account must be at least 30 days old.
                This helps ensure quality over quantity.</p>
              </div>
            </li>
            <li>
              <span className="tc-criteria-icon">📋</span>
              <div>
                <strong>15 or more recipes uploaded</strong>
                <p>You must have contributed at least 15 recipes
                to the Curated Kitchen community.</p>
              </div>
            </li>
            <li>
              <span className="tc-criteria-icon">🏅</span>
              <div>
                <strong>66% or more of your recipes have the
                Well Seasoned badge</strong>
                <p>At least two thirds of your uploaded recipes
                must have earned the Well Seasoned badge; meaning
                these recipes have 40+ ratings with an average of 4.5 stars or higher.</p>
              </div>
            </li>
          </ul>
        </div>

        <div className="tc-info-section">
          <h3>How to Maintain Your Status</h3>
          <p>Trusted Chef status is checked regularly. If your
          recipes fall below the required thresholds, you'll receive
          a warning and a grace period before your status changes.
          Here are some ways to keep your ratings strong:</p>

          <div className="tc-tips">
            <div className="tc-tip">
              <span>🍽️</span>
              <div>
                <strong>Cook your recipes for family and friends</strong>
                <p>Bring dishes to gatherings, holidays, or potlucks.
                People who have tasted your food firsthand are the most
                likely to leave genuine, enthusiastic ratings.</p>
              </div>
            </div>
            <div className="tc-tip">
              <span>🔗</span>
              <div>
                <strong>Share your recipe links</strong>
                <p>You can link directly to any of your recipes on
                Curated Kitchen. Share them with friends, family, or
                anyone who asks for the recipe — they can rate and
                comment directly on the page.</p>
              </div>
            </div>
            <div className="tc-tip">
              <span>📱</span>
              <div>
                <strong>Share on social media</strong>
                <p>Post photos of your dishes with a link to the recipe.
                Anyone who has tried it can come back and leave a rating.
                The more people who rate your recipes, the more stable
                your average becomes.</p>
              </div>
            </div>
            <div className="tc-tip">
              <span>✍️</span>
              <div>
                <strong>Keep uploading quality recipes</strong>
                <p>The more Well Seasoned recipes you have, the more
                cushion you have against any single lower-rated recipe.
                Consistency is key.</p>
              </div>
            </div>
            <div className="tc-tip">
              <span>📝</span>
              <div>
                <strong>Write clear, detailed recipes</strong>
                <p>Recipes with clear steps, accurate ingredient lists,
                and honest effort scores tend to get rated more highly
                because cooks know exactly what to expect.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="tc-info-section">
          <h3>Trusted Chef Benefits</h3>
          <div className="tc-benefits">
            <div className="tc-benefit">
              <strong>📌 Profile page</strong>
              <p>A dedicated public profile page with your bio,
              top recipes, newest uploads, and any remixes you've
              submitted.</p>
            </div>
            <div className="tc-benefit">
              <strong>⬆️ Recipe visibility</strong>
              <p>Your recipes appear ahead of others in Browse
              results by default, giving them more exposure to
              the community.</p>
            </div>
            <div className="tc-benefit">
              <strong>📤 Higher upload limits</strong>
              <p>Upload up to 4 recipes per day, compared to
              lower limits for other account types.</p>
            </div>
            <div className="tc-benefit">
              <strong>🔧 Equipment profile</strong>
              <p>Set up your personal equipment profile so your
              Spoon Scores reflect the tools you actually have.</p>
            </div>
            <div className="tc-benefit">
              <strong>💾 Saved recipes</strong>
              <p>Save more recipes than basic account holders.</p>
            </div>
          </div>
        </div>

        <div className="tc-info-section">
          <h3>The Grace Period</h3>
          <p>We know that ratings can fluctuate. If your account
          falls below the Trusted Chef threshold, you won't lose
          your status immediately. You'll receive a warning banner
          and a grace period of up to 30 days. During this time:</p>
          <ul className="tc-grace-list">
            <li>You keep all Trusted Chef benefits</li>
            <li>You'll see daily countdown banners reminding you
            if you no longer meet the Trusted Chef criteria</li>
            <li>You can subscribe to retain your saved recipes
            and equipment profile even if you lose the title</li>
            <li>If you lose the title in the last week of your
            grace period, you receive one additional week</li>
          </ul>
          <p style={{marginTop: '16px'}}>If you do lose your
          Trusted Chef status, your profile and bio are preserved
          — they'll be restored automatically if you earn the
          title again.</p>
        </div>

        <div className="tc-info-footer">
          <Link to="/browse" className="view-btn">Browse Recipes</Link>
          <Link to="/membership" className="view-btn"
          style={{backgroundColor: 'white', color: '#7b1f4a',
          border: '2px solid #7b1f4a'}}>View Membership Options</Link>
        </div>

      </div>
    </main>
  )
}

export default TrustedChefInfo