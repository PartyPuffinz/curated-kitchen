import { Link } from 'react-router-dom'
import './About.css'

function About() {
  return (
    <main className="main">
      <div className="about-layout">

        <div className="about-header">
          <h2>About Curated Kitchen</h2>
          <p>A recipe platform built for every body, every ability,
          and every energy level.</p>
        </div>

        <div className="about-section">
          <h3>Why We Built This</h3>
          <p>Curated Kitchen was born out of a simple frustration:
          most recipe sites assume you have unlimited time, unlimited
          energy, and a fully equipped kitchen. They don't account
          for the days when getting off the couch feels like an
          achievement — let alone cooking a full meal.</p>
          <p>We built Curated Kitchen for people who live with chronic
          illness, disability, neurodivergence, or just the ordinary
          exhaustion of modern life. We believe that good food should
          be accessible to everyone, regardless of how many spoons
          you have today.</p>
        </div>

        <div className="about-section">
          <h3>What Makes Us Different</h3>
          <div className="about-features">
            <div className="about-feature">
              <span>🥄</span>
              <div>
                <strong>Spoon Score System</strong>
                <p>Every recipe is scored by effort level using our
                detailed Effort Scoring system — not just cook time,
                but actual physical and cognitive demand. Subscribers
                can personalize scores based on their equipment
                and ability.</p>
              </div>
            </div>
            <div className="about-feature">
              <span>🌍</span>
              <div>
                <strong>Cultural Inclusivity</strong>
                <p>We celebrate food from every culture and tradition.
                Our cuisine filters span the globe, and we actively
                welcome recipes from all backgrounds.</p>
              </div>
            </div>
            <div className="about-feature">
              <span>🛒</span>
              <div>
                <strong>Nowz Foodz</strong>
                <p>For the days when cooking isn't an option, our
                Nowz Foodz section lists packaged foods, ready-to-eat
                meals, and drinks that fit your dietary needs —
                no spoons required.</p>
              </div>
            </div>
            <div className="about-feature">
              <span>🏅</span>
              <div>
                <strong>Community Quality Control</strong>
                <p>Our Well Seasoned and Trusted Chef badges ensure
                the most loved, most reliable recipes rise to the top.
                Every rating is from a real community member who
                cooked the dish.</p>
              </div>
            </div>
            <div className="about-feature">
              <span>🔒</span>
              <div>
                <strong>Safety First</strong>
                <p>We take community safety seriously. Our reporting
                system, moderation tools, and anti-abuse policies are
                designed to keep Curated Kitchen a welcoming space
                for everyone.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="about-section">
          <h3>Our Community</h3>
          <p>Curated Kitchen is built on the idea that food brings
          people together. Whether you're a seasoned home cook sharing
          generations-old family recipes, or someone figuring out how
          to feed yourself on a difficult day — you belong here.</p>
          <p>We especially welcome people who cook for others with
          dietary restrictions, caregivers, people new to cooking,
          and anyone who has ever Googled "easy recipes when you
          have no energy."</p>
        </div>

        <div className="about-section">
          <h3>Support Us</h3>
          <p>Curated Kitchen is an independent project built with
          love. If you find it helpful, consider supporting us:</p>
          <div className="about-support">
            
              <a href="https://www.buymeacoffee.com"
              target="_blank"
              rel="noopener noreferrer"
              className="view-btn"
            >☕ Buy Me a Coffee</a>
            <Link to="/subscribe" className="view-btn">
            Become a Subscriber</Link>
          </div>
        </div>

        <div className="about-footer-links">
          <Link to="/faq">FAQ</Link>
          <Link to="/trusted-chef-info">Trusted Chef Info</Link>
          <Link to="/membership">Membership</Link>
          <Link to="#">Contact Us</Link>
        </div>

      </div>
    </main>
  )
}

export default About