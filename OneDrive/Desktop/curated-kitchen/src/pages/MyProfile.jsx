import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import './MyProfile.css'

const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9yZnNnZmR2b2ppaGRkZXdvcnV6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYwMTMxODYsImV4cCI6MjA5MTU4OTE4Nn0.lQuHjktlnZmv6BGZrZxQ4gQl_WBQysF2vEjZv38Z-0A'
const DB = 'https://orfsgfdvojihddeworuz.supabase.co'
const HEADERS = { 'apikey': ANON_KEY, 'Authorization': `Bearer ${ANON_KEY}` }

function MyProfile() {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [bio, setBio] = useState('')
  const [editingBio, setEditingBio] = useState(false)
  const [bioSaving, setBioSaving] = useState(false)
  const [bioError, setBioError] = useState('')
  const [bioSuccess, setBioSuccess] = useState(false)

  useEffect(() => {
    const keys = Object.keys(localStorage)
    for (const key of keys) {
      if (key.startsWith('sb-') && key.includes('auth')) {
        try {
          const parsed = JSON.parse(localStorage.getItem(key))
          const u = parsed?.user
          if (u) {
            fetch(`${DB}/rest/v1/profiles?id=eq.${u.id}&select=*`, { headers: HEADERS })
              .then(res => res.json())
              .then(data => {
                const p = data?.[0]
                setProfile(p)
                setBio(p?.bio || '')
                setLoading(false)
              })
            break
          }
        } catch(e) {}
      }
    }
  }, [])

  async function handleSaveBio() {
    setBioError('')
    if (bio.length > 300) {
      setBioError('Bio must be 300 characters or less.')
      return
    }
    setBioSaving(true)
    const res = await fetch(
      `${DB}/rest/v1/profiles?id=eq.${profile.id}`,
      {
        method: 'PATCH',
        headers: { ...HEADERS, 'Content-Type': 'application/json' },
        body: JSON.stringify({ bio })
      }
    )
    if (res.ok) {
      setProfile(prev => ({ ...prev, bio }))
      setEditingBio(false)
      setBioSuccess(true)
      setTimeout(() => setBioSuccess(false), 3000)
    } else {
      setBioError('Failed to save bio. Please try again.')
    }
    setBioSaving(false)
  }

  if (loading) return <main className="main"><p>Loading...</p></main>

  if (!profile) {
    return (
      <main className="main">
        <div className="not-found">
          <h2>Not signed in</h2>
          <p>Please sign in to view your profile.</p>
          <Link to="/signin" className="view-btn">Sign In</Link>
        </div>
      </main>
    )
  }

  return (
    <main className="main">
      <div className="my-profile-layout">

        <div className="my-profile-header">
          <div className="my-profile-avatar">
            {profile.avatar_url
              ? <img src={profile.avatar_url} alt={profile.username} />
              : <div className="my-avatar-placeholder">👤</div>
            }
          </div>
          <div className="my-profile-info">
            <div className="my-profile-name-row">
              <h2>{profile.username}</h2>
              {profile.is_trusted_chef && (
                <span className="trusted-chef-tag">👨‍🍳 Trusted Chef</span>
              )}
            </div>
            <p className="my-profile-account-type">
              Account type: <strong>{profile.account_type}</strong>
            </p>
            <p className="my-profile-joined">
              Member since {new Date(profile.created_at).toLocaleDateString(
                'en-US', { year: 'numeric', month: 'long' }
              )}
            </p>
          </div>
        </div>

        {(profile.is_trusted_chef) && (
          <div className="my-profile-section">
            <div className="my-profile-section-header">
              <h3>Bio</h3>
              {!editingBio && (
                <button
                  className="edit-btn"
                  onClick={() => setEditingBio(true)}
                >Edit</button>
              )}
            </div>
            {editingBio ? (
              <div className="bio-edit">
                <textarea
                  className="bio-textarea"
                  value={bio}
                  onChange={e => setBio(e.target.value)}
                  maxLength={300}
                  rows={4}
                  placeholder="Tell the community about yourself and your cooking style..."
                />
                <p className="bio-char-count">{bio.length}/300</p>
                {bioError && <p className="auth-error">{bioError}</p>}
                <div className="bio-actions">
                  <button
                    className="submit-btn"
                    style={{width: 'auto', padding: '8px 20px'}}
                    onClick={handleSaveBio}
                    disabled={bioSaving}
                  >{bioSaving ? 'Saving...' : 'Save bio'}</button>
                  <button
                    className="skip-btn"
                    onClick={() => {
                      setEditingBio(false)
                      setBio(profile.bio || '')
                    }}
                  >Cancel</button>
                </div>
              </div>
            ) : (
              <p className="bio-display">
                {profile.bio || 'No bio yet — click Edit to add one!'}
              </p>
            )}
            {bioSuccess && (
              <p className="bio-success">Bio saved!</p>
            )}
          </div>
        )}

        <div className="my-profile-links">
          <Link to="/my-recipes" className="my-profile-link-card">
            <span>📋</span>
            <div>
              <strong>My Uploaded Recipes</strong>
              <p>View and manage all your uploaded recipes</p>
            </div>
          </Link>
          <Link to="/saved-recipes" className="my-profile-link-card">
            <span>🔖</span>
            <div>
              <strong>My Saved Recipes</strong>
              <p>Recipes you've bookmarked for later</p>
            </div>
          </Link>
          {(profile.is_trusted_chef ||
            profile.account_type === 'subscriber') && (
            <Link to="/equipment" className="my-profile-link-card">
              <span>🔧</span>
              <div>
                <strong>My Equipment Profile</strong>
                <p>Manage your kitchen equipment for personalized scores</p>
              </div>
            </Link>
          )}
          {profile.is_trusted_chef && (
            <Link
              to={`/chef/${profile.username}`}
              className="my-profile-link-card"
            >
              <span>👨‍🍳</span>
              <div>
                <strong>My Trusted Chef Page</strong>
                <p>View your public Trusted Chef profile</p>
              </div>
            </Link>
          )}
        </div>

      </div>
    </main>
  )
}

export default MyProfile