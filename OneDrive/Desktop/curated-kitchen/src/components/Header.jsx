import { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import './Header.css'

function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [user, setUser] = useState(null)
  const menuRef = useRef(null)
  const location = useLocation()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

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

  async function handleSignOut() {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  return (
    <header className="header">
      <Link to="/" className="header-logo">Curated Kitchen</Link>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/browse">Browse</Link>
        {!user ? (
          <Link to="/signin">Sign in</Link>
        ) : (
          <div
            className="account-menu"
            ref={menuRef}
            onMouseEnter={() => {
              clearTimeout(window.menuTimeout)
              setMenuOpen(true)
            }}
            onMouseLeave={() => {
              window.menuTimeout = setTimeout(() => setMenuOpen(false), 2000)
            }}
          >
            <button className="account-btn">
              My Account ▾
            </button>
            {menuOpen && (
              <div className="account-dropdown">
                <Link to="#" className="dropdown-item">My Profile</Link>
                <Link to="#" className="dropdown-item">My Saved Recipes</Link>
                <div className="dropdown-divider" />
                <button
                  className="dropdown-item signout"
                  onClick={handleSignOut}
                >Sign Out</button>
              </div>
            )}
          </div>
        )}
      </nav>
    </header>
  )
}

export default Header