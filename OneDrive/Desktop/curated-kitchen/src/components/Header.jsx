import { useState, useRef, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import './Header.css'

function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef(null)
  const location = useLocation()
  const userType = 'guest'

  useEffect(() => {
    setMenuOpen(false)
  }, [location])

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <header className="header">
      <Link to="/" className="header-logo">Curated Kitchen</Link>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/browse">Browse</Link>
        {userType === 'guest' ? (
          <Link to="/signin">Sign in</Link>
        ) : (
          <div
            className="account-menu"
            ref={menuRef}
            onMouseEnter={() => setMenuOpen(true)}
            onMouseLeave={() => setMenuOpen(false)}
          >
            <button className="account-btn">
              My Account ▾
            </button>
            {menuOpen && (
              <div className="account-dropdown">
                <Link to="#" className="dropdown-item">My Profile</Link>
                <Link to="#" className="dropdown-item">Saved Recipes</Link>
                {(userType === 'subscriber' || userType === 'trustedChef') && (
                  <Link to="#" className="dropdown-item">My Equipment</Link>
                )}
                {userType === 'subscriber' && (
                  <Link to="#" className="dropdown-item">
                  Personalized Spoon-Based Scoring</Link>
                )}
                {userType === 'trustedChef' && (
                  <Link to="#" className="dropdown-item">
                  Trusted Chef Page</Link>
                )}
                <div className="dropdown-divider" />
                <Link to="#" className="dropdown-item signout">
                Sign Out</Link>
              </div>
            )}
          </div>
        )}
      </nav>
    </header>
  )
}

export default Header