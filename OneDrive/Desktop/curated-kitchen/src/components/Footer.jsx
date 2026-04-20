import { Link } from 'react-router-dom'
import './Footer.css'

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-links">
        <Link to="/faq">FAQ</Link>
        <Link to="/diets">Diets & Allergens</Link>
        <Link to="/membership">Membership</Link>
        <Link to="/trusted-chef-info">Trusted Chef</Link>
        <Link to="/faq#spoon-theory">Spoon Theory</Link>
        <Link to="/about">About Us</Link>
        <Link to="/feedback">Feedback</Link>
        
          <a href="https://www.buymeacoffee.com"
          target="_blank"
          rel="noopener noreferrer"
        >☕ Buy Me a Coffee</a>
      </div>
      <div className="footer-legal">
        <Link to="/terms">Terms of Service</Link>
        <Link to="/privacy">Privacy Policy</Link>
        <Link to="/abuse-policy">Abuse Policy</Link>
      </div>
      <p className="footer-note">
        © {new Date().getFullYear()} Curated Kitchen. All rights reserved.
        Allergen and dietary information is provided as a guide only —
        always verify ingredients before cooking if you have allergies.
      </p>
    </footer>
  )
}

export default Footer