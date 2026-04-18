import { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import './Header.css'

const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9yZnNnZmR2b2ppaGRkZXdvcnV6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYwMTMxODYsImV4cCI6MjA5MTU4OTE4Nn0.lQuHjktlnZmv6BGZrZxQ4gQl_WBQysF2vEjZv38Z-0A'
const DB = 'https://orfsgfdvojihddeworuz.supabase.co'
const HEADERS = { 'apikey': ANON_KEY, 'Authorization': `Bearer ${ANON_KEY}` }

function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [showTrustedChefBanner, setShowTrustedChefBanner] = useState(false)
  const [tcWarningDays, setTcWarningDays] = useState(0)
const [showTcLostBanner, setShowTcLostBanner] = useState(false)
  const menuRef = useRef(null)
  const location = useLocation()

  async function fetchProfile(userId) {
  try {
    const res = await fetch(
      `${DB}/rest/v1/profiles?id=eq.${userId}&select=username,account_type,is_trusted_chef,trusted_chef_granted_at,trusted_chef_grace_until`,
      { headers: HEADERS }
    )
    const data = await res.json()
    const p = data?.[0]
    setProfile(p)

    if (p?.is_trusted_chef && p?.trusted_chef_granted_at) {
      const dismissed = localStorage.getItem(`tc-banner-dismissed-${userId}`)
      if (!dismissed) setShowTrustedChefBanner(true)
    }

    if (p?.trusted_chef_grace_until) {
      const graceEnd = new Date(p.trusted_chef_grace_until)
      const now = new Date()
      const daysLeft = Math.ceil((graceEnd - now) / (1000 * 60 * 60 * 24))
      if (daysLeft > 0 && daysLeft <= 7) {
        setTcWarningDays(daysLeft)
      }
    }

    if (!p?.is_trusted_chef) {
      const wasTc = localStorage.getItem(`was-trusted-chef-${userId}`)
      if (wasTc) {
        setShowTcLostBanner(true)
      }
    } else {
      localStorage.setItem(`was-trusted-chef-${userId}`, 'true')
    }

  } catch(e) {
    console.error('Profile fetch error:', e)
  }
}

  useEffect(() => {
    const keys = Object.keys(localStorage)
for (const key of keys) {
  if (key.startsWith('sb-') && key.includes('auth')) {
    try {
      const parsed = JSON.parse(localStorage.getItem(key))
      const u = parsed?.user
      if (u) {
        setUser(u)
        fetchProfile(u.id)
        break
      }
    } catch(e) {}
  }
}
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

  function handleSignOut() {
    localStorage.removeItem('curated-kitchen-auth')
    localStorage.removeItem('sb-orfsgfdvojihddeworuz-auth-token')
    window.location.href = '/'
  }

  function handleDismissBanner() {
    if (user?.id) {
      localStorage.setItem(`tc-banner-dismissed-${user.id}`, 'true')
    }
    setShowTrustedChefBanner(false)
  }

  return (
    <>
      {showTrustedChefBanner && (
  <div className="trusted-chef-banner">
    🎉 Congratulations! You've earned the 👨‍🍳 Trusted Chef title!
    <a href="/trusted-chef" className="trusted-chef-banner-link">
    Click here to see your new profile and benefits →</a>
    <button
      className="trusted-chef-banner-close"
      onClick={handleDismissBanner}
    >×</button>
  </div>
)}

{tcWarningDays > 0 && (
  <div className="trusted-chef-banner tc-warning-banner">
    ⚠️ You have {tcWarningDays} day{tcWarningDays !== 1 ? 's' : ''} left
    as a <span className="hero-tc-badge">👨‍🍳 Trusted Chef</span>
    — keep your ratings up to maintain your status!
    <a href="/trusted-chef-info" className="trusted-chef-banner-link">
    Click here to see how to maintain your status →</a>
    <button
      className="trusted-chef-banner-close"
      onClick={() => setTcWarningDays(0)}
    >×</button>
  </div>
)}

{showTcLostBanner && (
  <div className="trusted-chef-banner tc-lost-banner">
    Your <span className="hero-tc-badge">👨‍🍳 Trusted Chef</span> status
    is no longer active.
    <a href="/faq#trusted-chef" className="trusted-chef-banner-link">
    Click here to find out how to earn it back →</a>
    <button
      className="trusted-chef-banner-close"
      onClick={() => {
        setShowTcLostBanner(false)
        if (user?.id) localStorage.removeItem(`was-trusted-chef-${user.id}`)
      }}
    >×</button>
  </div>
)}
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
                  <Link to="/profile" className="dropdown-item">My Profile</Link>
                  <Link to="/saved-recipes" className="dropdown-item">My Saved Recipes</Link>
                  <Link to="/upload" className="dropdown-item">Upload a Recipe</Link>
                  <Link to="/my-recipes" className="dropdown-item">My Uploaded Recipes</Link>
                  {(profile?.account_type === 'subscriber' ||
                    profile?.is_trusted_chef) && (
                    <Link to="/equipment" className="dropdown-item">My Equipment</Link>
                  )}
                  {profile?.account_type === 'subscriber' && (
                    <Link to="#" className="dropdown-item">
                    Personalized Spoon-Based Scoring</Link>
                  )}
                  {profile?.is_trusted_chef && (
  <Link to={`/chef/${profile.username}`} className="dropdown-item">
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
    </>
  )
}

export default Header