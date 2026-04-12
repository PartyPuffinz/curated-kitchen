import { Link } from 'react-router-dom'
import './Header.css'

function Header() {
  return (
    <header className="header">
      <Link to="/" className="header-logo">Curated Kitchen</Link>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/browse">Browse</Link>
        <Link to="/signin">Sign in</Link>
      </nav>
    </header>
  )
}

export default Header