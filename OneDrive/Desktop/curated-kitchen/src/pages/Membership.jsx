import { Link } from 'react-router-dom'
import './Membership.css'

function Membership() {
  return (
    <main className="membership-layout">

      <h2 className="membership-title">Membership Levels</h2>
      <p className="membership-subtitle">Most features are completely free.
      Subscribe for the full personalized experience.</p>

      <div className="membership-grid">

        <div className="membership-card">
          <div className="membership-badge guest">Guest</div>
          <p className="membership-price">Free</p>
          <p className="membership-desc">No account needed</p>
          <ul className="membership-features">
            <li>Browse all recipes</li>
            <li>View 1 last visited recipe</li>
            <li>Exclude 1 ingredient</li>
            <li>View standard spoon-based effort scores</li>
            <li>View CURRENT holiday and seasonal recommendations</li>
            <li>Measurement conversions</li>
            <li>Nutritional info per portion</li>
            <li className="feature-no">Cannot save recipes</li>
            <li className="feature-no">Cannot rate or comment</li>
            <li className="feature-no">Cannot upload recipes</li>
            <li className="feature-no">Cannot personalize spoon-based scoring</li>
            <li className="feature-no">Cannot filter or search recipes
by specific holiday or season</li>
            <li className="feature-no">Cannot filter by equipment profile</li>
            <li className="feature-no">No grocery shopping list</li>
            <li className="feature-no">Ads displayed</li>
          </ul>
          <Link to="/browse" className="membership-btn outline-btn">
          Browse as guest</Link>
        </div>

        <div className="membership-card">
          <div className="membership-badge basic">Basic — email only</div>
          <p className="membership-price">Free</p>
          <p className="membership-desc">Verified email required</p>
          <ul className="membership-features">
            <li>Browse all recipes</li>
            <li>Save up to 10 recipes</li>
            <li>View 2 last visited recipes</li>
            <li>Exclude 1 ingredient</li>
            <li>View standard spoon-based effort scores</li>
            <li>View CURRENT holiday and seasonal recommendations</li>
            <li>Measurement conversions</li>
            <li>Nutritional info per portion</li>
            <li className="feature-no">Cannot rate or comment</li>
            <li className="feature-no">Cannot upload recipes</li>
            <li className="feature-no">Cannot personalize spoon-based scoring</li>
            <li className="feature-no">Cannot filter or search recipes
by specific holiday or season</li>
            <li className="feature-no">Cannot filter by equipment profile</li>
            <li className="feature-no">No grocery shopping list</li>
            <li className="feature-no">Ads displayed</li>
          </ul>
          <Link to="/signin" className="membership-btn outline-btn">
          Create free account</Link>
        </div>

        <div className="membership-card">
          <div className="membership-badge verified">Basic — verified</div>
          <p className="membership-price">Free</p>
          <p className="membership-desc">Email + phone verified</p>
          <div className="probation-note">
            Available immediately after verification:
          </div>
          <ul className="membership-features">
            <li>Browse all recipes</li>
            <li>Save up to 10 recipes</li>
            <li>View 3 last visited recipes</li>
            <li>Exclude up to 5 ingredients</li>
            <li>View standard spoon-based effort scores</li>
            <li>View CURRENT holiday and seasonal recommendations</li>
            <li>Measurement conversions</li>
            <li>Nutritional info per portion</li>
            <li className="feature-no">Cannot personalize spoon-based scoring</li>
            <li className="feature-no">Cannot filter or search recipes
by specific holiday or season</li>
            <li className="feature-no">Cannot filter by equipment profile</li>
            <li className="feature-no">No grocery shopping list</li>
            <li className="feature-no">Ads displayed</li>
          </ul>
          <div className="probation-note after-note">
            After 7 day probation period:
          </div>
          <ul className="membership-features">
            <li>Rate up to 10 recipes per day</li>
            <li>Comment up to 10 times per day</li>
            <li>Upload up to 2 recipes per day</li>
          </ul>
          <Link to="/signin" className="membership-btn outline-btn">
          Verify your account</Link>
        </div>

        <div className="membership-card featured-card">
          <div className="membership-badge-featured">Most popular</div>
          <div className="membership-badge subscriber">Subscriber</div>
          <p className="membership-price">$9.99 <span>/ month</span></p>
          <p className="membership-desc">or $80/year — save 33%</p>
          <p className="launch-price-note">Lock in this rate for life
          when you subscribe during launch pricing.</p>
          <ul className="membership-features">
            <li>Everything in verified</li>
            <li>Ad-free experience</li>
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
            <li>Recipe Card mode — step by step</li>
            <li>Built in timers</li>
            <li>Upload up to 4 recipes per day</li>
            <li>Rate up to 20 recipes per day</li>
            <li>Comment up to 20 times per day</li>
            <li>Nutritional auto-calculation per portion</li>
            <li>Phone number optional</li>
          </ul>
          <div className="cancel-note">
            Cancelling returns you to your qualified Basic tier.
            You will be notified how many saved recipes you will
            lose access to before any changes are made.
            No refunds issued.
          </div>
          <Link to="/subscribe" className="membership-btn filled-btn">
          Subscribe now</Link>
        </div>

        <div className="membership-card">
          <div className="membership-badge trusted">Trusted Chef</div>
          <p className="membership-price">Earned</p>
          <p className="membership-desc">By community recognition</p>
          <ul className="membership-features">
            <li>Everything in Basic verified</li>
            <li>View 5 last visited recipes</li>
            <li>Upload up to 4 recipes per day</li>
            <li>Rate up to 20 recipes per day</li>
            <li>Comment up to 20 times per day</li>
            <li>My Equipment profile</li>
            <li>Filter by equipment profile</li>
            <li>Browsable chef profile page</li>
            <li>Chef's Special section on your profile</li>
            <li>Filter recipes by holiday or season</li>
          </ul>
          <div className="probation-note after-note">
            How to become a Trusted Chef:
          </div>
          <ul className="membership-features">
            <li>Account must be 30+ days old</li>
            <li>Must have uploaded at least 15 recipes</li>
            <li>66% or more of uploaded recipes must have
            earned the Well Seasoned badge</li>
            <li>Well Seasoned badge earned when a recipe
            reaches 4.5+ stars with 40+ community ratings</li>
            <li>Status maintained as long as 66% threshold holds</li>
          </ul>
          <Link to="/signin" className="membership-btn outline-btn">
          Start uploading recipes</Link>
        </div>

      </div>

      <div className="downgrade-notice">
        <h3>Downgrading or cancelling your account</h3>
        <p>If you cancel your subscription or remove your phone
        verification, you will be notified how many saved recipes
        you will lose access to before any changes are made.
        You will always keep your most recently saved recipes
        up to your new tier limit. Ratings and comments always
        remain visible publicly. Phone numbers can only be
        changed once every 30 days.</p>
        <p>All recipes ever uploaded to Curated Kitchen remain
        on the site regardless of account status. Deleting your
        account does not remove your uploaded recipes, comments,
        reviews, or recipe photos from the platform.</p>
        <Link to="/signin" className="forgot-link">
        Manage your account</Link>
      </div>

    </main>
  )
}

export default Membership