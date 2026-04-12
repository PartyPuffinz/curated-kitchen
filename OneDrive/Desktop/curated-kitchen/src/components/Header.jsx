import { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import './Header.css'

function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const menuRef = useRef(null)
  const location = useLocation()

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
  setUser(session?.user ?? null)
  if (session?.user) {
    const { data } = await supabase
      .from('profiles')
      .select('username, account_type, is_trusted_chef')
      .eq('id', session.user.id)
      .single()
    setProfile(data)
  }
})

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
  async (_event, session) => {
    setUser(session?.user ?? null)
    if (session?.user) {
      const { data } = await supabase
        .from('profiles')
        .select('username, account_type, is_trusted_chef')
        .eq('id', session.user.id)
        .single()
      setProfile(data)
    } else {
      setProfile(null)
    }
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
  {profile?.username || 'My Account'} ▾
</button>
            {menuOpen && (
              <div className="account-dropdown">
  <Link to="#" className="dropdown-item">My Profile</Link>
  <Link to="#" className="dropdown-item">My Saved Recipes</Link>
  {(profile?.account_type === 'subscriber' ||
    profile?.is_trusted_chef) && (
    <Link to="#" className="dropdown-item">My Equipment</Link>
  )}
  {profile?.account_type === 'subscriber' && (
    <Link to="#" className="dropdown-item">
    Personalized Spoon-Based Scoring</Link>
  )}
  {profile?.is_trusted_chef && (
    <Link to="#" className="dropdown-item">
    My Trusted Chef Page</Link>
  )}
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