import { useState, useEffect, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import './RecipePage.css'
import { calculateRecipeNutrition } from '../utils/nutrition'
import RecipeCard from '../components/RecipeCard'

const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9yZnNnZmR2b2ppaGRkZXdvcnV6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYwMTMxODYsImV4cCI6MjA5MTU4OTE4Nn0.lQuHjktlnZmv6BGZrZxQ4gQl_WBQysF2vEjZv38Z-0A'
const DB = 'https://orfsgfdvojihddeworuz.supabase.co'
const HEADERS = { 'apikey': ANON_KEY, 'Authorization': `Bearer ${ANON_KEY}` }

function TimerCountdown({ endTime }) {
  const [remaining, setRemaining] = useState(Math.max(0, endTime - Date.now()))

  useEffect(() => {
    const interval = setInterval(() => {
      const left = Math.max(0, endTime - Date.now())
      setRemaining(left)
      if (left === 0) clearInterval(interval)
    }, 1000)
    return () => clearInterval(interval)
  }, [endTime])

  const totalSecs = Math.ceil(remaining / 1000)
  const mins = Math.floor(totalSecs / 60)
  const secs = totalSecs % 60
  return (
    <span className="timer-countdown">
      {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')} remaining
    </span>
  )
}

function RecipePage() {
  const { slug } = useParams()
  const [recipe, setRecipe] = useState(null)
  const [loading, setLoading] = useState(true)
  const [nutrition, setNutrition] = useState(null)
  const [nutritionLoading, setNutritionLoading] = useState(false)
  const [comments, setComments] = useState([])
  const [commentText, setCommentText] = useState('')
  const [commentLoading, setCommentLoading] = useState(false)
  const [commentError, setCommentError] = useState('')
  const [reportingId, setReportingId] = useState(null)
  const [reportReason, setReportReason] = useState('')
  const [showReportRecipe, setShowReportRecipe] = useState(false)
  const [reportRecipeReason, setReportRecipeReason] = useState('')
  const [commentPage, setCommentPage] = useState(1)
  const [userRating, setUserRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [hasRated, setHasRated] = useState(false)
  const [ratingSubmitting, setRatingSubmitting] = useState(false)
  const [remixes, setRemixes] = useState([])
  const [isSaved, setIsSaved] = useState(false)
  const [saveLoading, setSaveLoading] = useState(false)
  const [uploader, setUploader] = useState(null)
  const [originalRecipe, setOriginalRecipe] = useState(null)
  const [recentlyViewed, setRecentlyViewed] = useState([])
  const [activeTimers, setActiveTimers] = useState([])
const [isSubscriber, setIsSubscriber] = useState(false)
const [userEquipment, setUserEquipment] = useState(null)
const [isTrustedChef, setIsTrustedChef] = useState(false)
const [personalizedSpoon, setPersonalizedSpoon] = useState(null)
  const reportMenuRef = useRef(null)

  useEffect(() => {
    fetch(`${DB}/rest/v1/recipes?slug=eq.${slug}&select=*`, { headers: HEADERS })
      .then(res => res.json())
      .then(data => {
        const r = Array.isArray(data) && data.length > 0 ? data[0] : null
        setRecipe(r)
        if (r) {
          const key = 'recently-viewed-recipes'
          const existing = JSON.parse(localStorage.getItem(key) || '[]')
          const filtered = existing.filter(item => item.id !== r.id)
          const updated = [{
            id: r.id, title: r.title, slug: r.slug,
            image_url: r.image_url, spoon_score: r.spoon_score,
            rating: r.rating, rating_count: r.rating_count,
            tags: r.tags, is_well_seasoned: r.is_well_seasoned,
            is_trusted_chef: r.is_trusted_chef, description: r.description
          }, ...filtered].slice(0, 8)
          localStorage.setItem(key, JSON.stringify(updated))
        }
        setLoading(false)
      })
      .catch(err => { console.error('Fetch error:', err); setLoading(false) })
  }, [slug])

  useEffect(() => {
    if (!recipe) return
    setNutritionLoading(true)
    calculateRecipeNutrition(recipe.ingredients, recipe.portions)
      .then(data => { setNutrition(data); setNutritionLoading(false) })
      .catch(() => setNutritionLoading(false))
  }, [recipe])

  useEffect(() => {
    if (!recipe) return
    fetch(`${DB}/rest/v1/comments?recipe_id=eq.${recipe.id}&order=created_at.asc&select=*`, { headers: HEADERS })
      .then(res => res.json())
      .then(data => setComments(Array.isArray(data) ? data : []))
      .catch(err => console.error('Comments fetch error:', err))
  }, [recipe])

  useEffect(() => {
    if (!recipe) return
    let user = null
    const keys = Object.keys(localStorage)
    for (const key of keys) {
      if (key.includes('auth')) {
        try {
          const parsed = JSON.parse(localStorage.getItem(key))
          if (parsed?.user) { user = parsed.user; break }
        } catch(e) {}
      }
    }
    if (!user) return
    fetch(`${DB}/rest/v1/ratings?recipe_id=eq.${recipe.id}&user_id=eq.${user.id}&select=rating`, { headers: HEADERS })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setUserRating(data[0].rating); setHasRated(true)
        }
      }).catch(() => {})
  }, [recipe])

  useEffect(() => {
    if (!recipe) return
    let user = null
    const keys = Object.keys(localStorage)
    for (const key of keys) {
      if (key.includes('auth')) {
        try {
          const parsed = JSON.parse(localStorage.getItem(key))
          if (parsed?.user) { user = parsed.user; break }
        } catch(e) {}
      }
    }
    if (!user) return
    fetch(`${DB}/rest/v1/saved_recipes?user_id=eq.${user.id}&recipe_id=eq.${recipe.id}&select=id`, { headers: HEADERS })
      .then(res => res.json())
      .then(data => { if (Array.isArray(data) && data.length > 0) setIsSaved(true) })
      .catch(() => {})
  }, [recipe])

useEffect(() => {
    const keys = Object.keys(localStorage)
    for (const key of keys) {
      if (key.startsWith('sb-') && key.includes('auth')) {
        try {
          const parsed = JSON.parse(localStorage.getItem(key))
          const u = parsed?.user
          if (u) {
            fetch(`${DB}/rest/v1/profiles?id=eq.${u.id}&select=account_type,is_trusted_chef,equipment`, { headers: HEADERS })
              .then(res => res.json())
              .then(data => {
                const p = data?.[0]
                if (p?.account_type === 'subscriber') setIsSubscriber(true)
                if (p?.is_trusted_chef) setIsTrustedChef(true)
                if (p?.account_type === 'subscriber' || p?.is_trusted_chef) {
                  setUserEquipment(p?.equipment || [])
                }
                if (p?.account_type === 'subscriber' && p?.spoon_profile) {
                  import('../utils/personalizedSpoon.js').then(({ calculatePersonalizedSpoonScore }) => {
                    const score = calculatePersonalizedSpoonScore({}, p.spoon_profile)
                    setPersonalizedSpoon(score)
                  })
                }
              })
            break
          }
        } catch(e) {}
      }
    }
  }, [recipe])

  useEffect(() => {
    if (!recipe?.uploaded_by) return
    fetch(`${DB}/rest/v1/profiles?id=eq.${recipe.uploaded_by}&select=username,avatar_url,is_trusted_chef`, { headers: HEADERS })
      .then(res => res.json())
      .then(data => { if (data?.[0]) setUploader(data[0]) })
      .catch(() => {})
  }, [recipe])

  useEffect(() => {
    if (!recipe?.is_remix || !recipe?.remixed_from) return
    fetch(`${DB}/rest/v1/recipes?id=eq.${recipe.remixed_from}&select=*`, { headers: HEADERS })
      .then(res => res.json())
      .then(data => { if (data?.[0]) setOriginalRecipe(data[0]) })
      .catch(() => {})
  }, [recipe])

  useEffect(() => {
    if (!recipe) return
    fetch(`${DB}/rest/v1/recipes?remixed_from=eq.${recipe.id}&order=rating.desc&select=*`, { headers: HEADERS })
      .then(res => res.json())
      .then(data => setRemixes(Array.isArray(data) ? data : []))
      .catch(() => {})
  }, [recipe])

  useEffect(() => {
    try {
      const stored = localStorage.getItem('recently-viewed-recipes')
      if (stored) {
        const parsed = JSON.parse(stored)
        if (Array.isArray(parsed)) {
          setRecentlyViewed(parsed.filter(r => r.slug !== slug).slice(0, 4))
        }
      }
    } catch(e) {}
  }, [slug])

  useEffect(() => {
    function handleClickOutside(e) {
      if (reportMenuRef.current && !reportMenuRef.current.contains(e.target)) {
        setShowReportRecipe(false)
      }
      const menus = document.querySelectorAll('.three-dot-menu')
      let clickedInsideMenu = false
      menus.forEach(menu => { if (menu.contains(e.target)) clickedInsideMenu = true })
      if (!clickedInsideMenu) setReportingId(null)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    if (showReportRecipe) {
      const t = setTimeout(() => setShowReportRecipe(false), 4000)
      return () => clearTimeout(t)
    }
  }, [showReportRecipe])

  useEffect(() => {
    if (reportingId !== null) {
      const t = setTimeout(() => setReportingId(null), 4000)
      return () => clearTimeout(t)
    }
  }, [reportingId])

function playChime() {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)()
      const notes = [523.25, 659.25, 783.99, 1046.50]
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.frequency.value = freq
        osc.type = 'sine'
        gain.gain.setValueAtTime(0.3, ctx.currentTime + i * 0.3)
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.3 + 0.6)
        osc.start(ctx.currentTime + i * 0.3)
        osc.stop(ctx.currentTime + i * 0.3 + 0.6)
      })
    } catch(e) {}
  }

  function extractMinutes(stepText) {
    const patterns = [
      /(\d+)\s*(?:to\s*\d+\s*)?minutes?/i,
      /(\d+)\s*(?:to\s*\d+\s*)?hours?/i,
      /(\d+)\s*(?:to\s*\d+\s*)?seconds?/i,
    ]
    for (const pattern of patterns) {
      const match = stepText.match(pattern)
      if (match) {
        const val = parseInt(match[1])
        if (/hours?/i.test(match[0])) return val * 60
        if (/seconds?/i.test(match[0])) return Math.ceil(val / 60)
        return val
      }
    }
    return null
  }

  function startTimer(stepIndex, minutes, stepText) {
    if (Notification.permission === 'default') {
      Notification.requestPermission()
    }
    const endTime = Date.now() + minutes * 60 * 1000
    const timerId = setTimeout(() => {
      playChime()
      document.title = '⏰ Timer Done! — Curated Kitchen'
      setTimeout(() => { document.title = 'Curated Kitchen' }, 10000)
      if (Notification.permission === 'granted') {
        new Notification('⏰ Timer Done!', {
          body: `Your timer for Step ${stepIndex + 1} is complete!`,
          icon: '/favicon.ico'
        })
      }
      setActiveTimers(prev => prev.filter(t => t.stepIndex !== stepIndex))
    }, minutes * 60 * 1000)

    setActiveTimers(prev => {
      const filtered = prev.filter(t => t.stepIndex !== stepIndex)
      return [...filtered, { stepIndex, endTime, timerId, minutes, label: `Step ${stepIndex + 1}` }]
    })
  }

  function cancelTimer(stepIndex) {
    setActiveTimers(prev => {
      const timer = prev.find(t => t.stepIndex === stepIndex)
      if (timer) clearTimeout(timer.timerId)
      return prev.filter(t => t.stepIndex !== stepIndex)
    })
  }

  async function handleSaveRecipe() {
    let user = null
    const keys = Object.keys(localStorage)
    for (const key of keys) {
      if (key.includes('auth')) {
        try {
          const parsed = JSON.parse(localStorage.getItem(key))
          if (parsed?.user) { user = parsed.user; break }
        } catch(e) {}
      }
    }
    if (!user) { alert('You must be signed in to save recipes.'); return }
    setSaveLoading(true)
    if (isSaved) {
      await fetch(`${DB}/rest/v1/saved_recipes?user_id=eq.${user.id}&recipe_id=eq.${recipe.id}`,
        { method: 'DELETE', headers: HEADERS })
      setIsSaved(false)
    } else {
      await fetch(`${DB}/rest/v1/saved_recipes`, {
        method: 'POST',
        headers: { ...HEADERS, 'Content-Type': 'application/json', 'Prefer': 'return=minimal' },
        body: JSON.stringify({ user_id: user.id, recipe_id: recipe.id })
      })
      setIsSaved(true)
    }
    setSaveLoading(false)
  }

  async function handleRating(stars) {
    if (hasRated) return
    let user = null
    const keys = Object.keys(localStorage)
    for (const key of keys) {
      if (key.includes('auth')) {
        try {
          const parsed = JSON.parse(localStorage.getItem(key))
          if (parsed?.user) { user = parsed.user; break }
        } catch(e) {}
      }
    }
    if (!user) { alert('You must be signed in to rate recipes.'); return }
    setRatingSubmitting(true)
    const res = await fetch(`${DB}/rest/v1/ratings`, {
      method: 'POST',
      headers: { ...HEADERS, 'Content-Type': 'application/json', 'Prefer': 'return=minimal' },
      body: JSON.stringify({ recipe_id: recipe.id, user_id: user.id, rating: stars })
    })
    if (res.ok) {
      setUserRating(stars); setHasRated(true)
      const newCount = recipe.rating_count + 1
      const newRating = ((recipe.rating * recipe.rating_count) + stars) / newCount
      const roundedRating = Math.round(newRating * 10) / 10
      await fetch(`${DB}/rest/v1/recipes?id=eq.${recipe.id}`, {
        method: 'PATCH',
        headers: { ...HEADERS, 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating: roundedRating, rating_count: newCount })
      })
      setRecipe(prev => ({ ...prev, rating: roundedRating, rating_count: newCount }))
    }
    setRatingSubmitting(false)
  }

  async function handleSubmitComment() {
    setCommentError('')
    if (!commentText.trim()) { setCommentError('Please write a comment before submitting.'); return }
    let user = null
    const keys = Object.keys(localStorage)
    for (const key of keys) {
      if (key.includes('auth')) {
        try {
          const parsed = JSON.parse(localStorage.getItem(key))
          if (parsed?.user) { user = parsed.user; break }
        } catch(e) {}
      }
    }
    if (!user) { setCommentError('You must be signed in to comment.'); return }
    const profileRes = await fetch(`${DB}/rest/v1/profiles?id=eq.${user.id}&select=username`, { headers: HEADERS })
    const profileData = await profileRes.json()
    const username = profileData?.[0]?.username || 'Anonymous'
    setCommentLoading(true)
    const res = await fetch(`${DB}/rest/v1/comments`, {
      method: 'POST',
      headers: { ...HEADERS, 'Content-Type': 'application/json', 'Prefer': 'return=minimal' },
      body: JSON.stringify({ recipe_id: recipe.id, user_id: user.id, username, content: commentText.trim() })
    })
    if (res.ok) {
      setComments(prev => [...prev, { id: Date.now(), username, content: commentText.trim(), created_at: new Date().toISOString() }])
      setCommentText('')
    } else { setCommentError('Failed to post comment. Please try again.') }
    setCommentLoading(false)
  }

  async function handleReportComment(commentId) {
    await fetch(`${DB}/rest/v1/comments?id=eq.${commentId}`, {
      method: 'PATCH',
      headers: { ...HEADERS, 'Content-Type': 'application/json' },
      body: JSON.stringify({ reported: true })
    })
    setReportingId(null); setReportReason('')
    alert('Comment reported. Our moderation team will review it.')
  }

  if (loading) return <main className="main"><p>Loading...</p></main>

  if (!recipe) {
    return (
      <main className="main">
        <div className="not-found">
          <h2>404 — Recipe Not Found</h2>
          <p>This recipe doesn't exist or may have been removed.</p>
          <div className="not-found-btns">
            <Link to="/browse" className="view-btn">Return to Browse</Link>
            <Link to="/" className="view-btn">Return to Home</Link>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="main">
      <Link to="/browse" className="back-btn">← Back to Browse</Link>

      <div className="recipe-page">
        <img src={recipe.image_url} alt={recipe.title} />

        <div className="recipe-page-body">

          {recipe.is_remix && recipe.remix_description && (
            <div className="remix-changes-box">
              <p className="remix-changes-label">🎛️ What changed in this remix:</p>
              <p className="remix-changes-text">{recipe.remix_description}</p>
            </div>
          )}

          <div className="recipe-title-row">
            <h2>{recipe.title}</h2>
            <div style={{display:'flex', gap:'8px', alignItems:'center', flexShrink:0}}>
              <button
                className={`save-recipe-btn ${isSaved ? 'saved' : ''}`}
                onClick={handleSaveRecipe}
                disabled={saveLoading}
              >
                {saveLoading ? '...' : isSaved ? '🔖 Saved' : '🔖 Save'}
              </button>
              {!recipe.is_remix && (
                <Link to={`/remix?from=${recipe.slug}`} className="remix-btn">🎛️ Remix This Recipe</Link>
              )}

{isSubscriber && (
                <Link to={`/recipes/${recipe.slug}/cards`} className="remix-btn">📋 Recipe Cards</Link>
              )}

              <div className="three-dot-menu" ref={reportMenuRef}>
                <button className="three-dot-btn" onClick={() => setShowReportRecipe(!showReportRecipe)}>⋮</button>
                {showReportRecipe && (
                  <div className="three-dot-dropdown">
                    <button className="three-dot-item" onClick={() => { setShowReportRecipe(false); setReportRecipeReason('recipe') }}>🚩 Report this recipe</button>
                    <button className="three-dot-item" onClick={() => { setShowReportRecipe(false); setReportRecipeReason('user') }}>🚩 Report this user</button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {uploader && (
            <div className="recipe-uploader">
              <div className="uploader-avatar">
                {uploader.avatar_url
                  ? <img src={uploader.avatar_url} alt={uploader.username} />
                  : <div className="uploader-avatar-placeholder">👤</div>
                }
              </div>
              <div className="uploader-info">
                <Link
                  to={uploader.is_trusted_chef ? `/chef/${uploader.username}` : '#'}
                  className="uploader-username"
                >
                  {uploader.username}
                </Link>
                {uploader.is_trusted_chef && (
                  <span className="trusted-chef-tag" style={{fontSize:'10px', padding:'2px 8px'}}>👨‍🍳 Trusted Chef</span>
                )}
              </div>
            </div>
          )}

          {reportRecipeReason && (
            <div className="report-box">
              <p className="report-title">
                {reportRecipeReason === 'recipe' && "What's the issue with this recipe?"}
                {reportRecipeReason === 'user' && "What's the issue with this user?"}
                {reportRecipeReason.startsWith('comment-') && "What's the issue with this comment?"}
                {reportRecipeReason.startsWith('commenter-') && "What's the issue with this commenter?"}
              </p>
              <div className="report-options">
                {(reportRecipeReason === 'recipe'
                  ? ['Inaccurate ingredients or steps','Inappropriate content','Spam or self-promotion','Copyright violation','Harmful or dangerous instructions','Other']
                  : reportRecipeReason === 'user' || reportRecipeReason.startsWith('commenter-')
                  ? ['Spam or bot account','Harassment','Hate speech','Phishing or scam','Impersonation','Other']
                  : ['Spam','Harassment','Hate speech','Off-topic or irrelevant','Phishing or scam','Other']
                ).map(reason => (
                  <label key={reason} className="report-option">
                    <input type="radio" name="report-reason" value={reason} onChange={e => setReportReason(e.target.value)} />
                    {reason}
                  </label>
                ))}
              </div>
              <div className="report-actions">
                <button className="submit-btn" style={{width:'auto', padding:'10px 20px'}}
                  onClick={() => {
                    if (!reportReason) return
                    if (reportRecipeReason.startsWith('comment-') || reportRecipeReason.startsWith('commenter-')) {
                      handleReportComment(reportRecipeReason.split('-')[1])
                    }
                    setReportRecipeReason(''); setReportReason('')
                    alert('Report submitted. Our moderation team will review it.')
                  }}>Submit report</button>
                <button className="skip-btn" onClick={() => { setReportRecipeReason(''); setReportReason('') }}>Cancel</button>
              </div>
            </div>
          )}

          <div className="recipe-badges">
            {recipe.is_trusted_chef && <span className="trusted-chef-tag">👨‍🍳 Trusted Chef</span>}
            {recipe.is_well_seasoned && <span className="well-seasoned-tag">🏅 Well Seasoned</span>}
            {recipe.is_remix && <span className="remix-badge">🎛️ Remixed Recipe</span>}
          </div>

          <div className="tags">
            {recipe.tags.map((tag, i) => <span key={i} className="tag">{tag}</span>)}
          </div>

          <p className="description">{recipe.description}</p>

          <div className="recipe-page-meta">

            {recipe.is_remix && originalRecipe && (
              <div className="original-recipe-ref">
                <p className="original-recipe-label">Original Recipe</p>
                <Link to={`/recipes/${originalRecipe.slug}`} className="original-recipe-card">
                  {originalRecipe.image_url && (
                    <img src={originalRecipe.image_url} alt={originalRecipe.title} className="original-recipe-img" />
                  )}
                  <div className="original-recipe-info">
                    <strong>{originalRecipe.title}</strong>
                    <span>🥄 {originalRecipe.spoon_score}/10</span>
                    <div>
                      {[1,2,3,4,5].map(star => (
                        <span key={star} style={{color: originalRecipe.rating >= star ? '#7b1f4a' : '#ddd', fontSize:'12px'}}>★</span>
                      ))}
                    </div>
                  </div>
                </Link>
              </div>
            )}

{(isSubscriber || isTrustedChef) && userEquipment !== null && (
              <div className="equipment-notice">
                {userEquipment.length > 0 ? (
                  <>
                    <p className="equipment-notice-title">
                      ⚠️ Personalized Equipment
                    </p>
                    <p className="equipment-notice-body">
                      Your equipment profile shows you have:
                      <strong> {userEquipment.join(', ')}</strong>.
                      These items may reduce your spoon score.
                    </p>
                    <p className="equipment-notice-footnote">
                      {isSubscriber
                        ? '* Your personalized spoon score takes your equipment into account.'
                        : '* Trusted Chef scores do not reflect a personalized spoon score. Subscribe to get a personalized score.'}
                    </p>
                  </>
                ) : (
                  <>
                    <p className="equipment-notice-title">
                      ⚠️ Equipment Profile
                    </p>
                    <p className="equipment-notice-body">
                      We can't give any equipment tips right now.<br />
                      Please click <a href="/equipment" className="equipment-notice-link">here</a> to add your equipment profile.
                    </p>
                  </>
                )}
              </div>
            )}


            {personalizedSpoon !== null && (
              <div className="personalized-spoon-notice">
                <p className="personalized-spoon-title">
                  🥄 Your Personalized Spoon Score
                </p>
                <p className="personalized-spoon-score">
                  {personalizedSpoon}/10 spoons
                </p>
                <p className="personalized-spoon-note">
                  Based on your personal energy profile. The standard score is {recipe.spoon_score}/10.
                </p>
              </div>
            )}
            
            <div className="meta-row">
              <span>🥄 {recipe.spoon_score}/10 spoons</span>
              <span>
                {recipe.cleanup === 'High' ? '🧹 ⚠️ High cleanup ⚠️' :
                 recipe.cleanup === 'Medium' ? '🧹 Medium cleanup' : '🧹 Low cleanup'}
              </span>
            </div>
            <div className="meta-row">
              <span>
                {[1,2,3,4,5].map(star => {
                  if (recipe.rating >= star) return <span key={star}>★</span>
                  if (recipe.rating >= star - 0.5) return <span key={star}>½</span>
                  return <span key={star}>☆</span>
                })}
              </span>
              <span>{recipe.rating_count} ratings</span>
            </div>

            <div className="rating-widget">
              {hasRated ? (
                <p className="rating-thanks">You rated this recipe {userRating} star{userRating !== 1 ? 's' : ''}!</p>
              ) : (
                <>
                  <p className="rating-prompt">Rate this recipe:</p>
                  <div className="rating-stars">
                    {[1,2,3,4,5].map(star => (
                      <button key={star}
                        className={`rating-star ${(hoverRating || userRating) >= star ? 'active' : ''}`}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        onClick={() => handleRating(star)}
                        disabled={ratingSubmitting}>★</button>
                    ))}
                  </div>
                </>
              )}
            </div>

            <div className="nutrition-facts">
              <h4>Nutrition per serving</h4>
              <p className="nutrition-serves">Recipe serves {recipe.portions}</p>
              {nutritionLoading && <p className="nutrition-loading">Calculating nutrition facts...</p>}
              {nutrition && !nutritionLoading && (
                <div className="nutrition-grid">
                  {[
                    ['calories','Calories',''],
                    ['protein','Protein','g'],
                    ['fat','Fat','g'],
                    ['carbs','Carbs','g'],
                    ['fiber','Fiber','g'],
                    ['sugar','Sugar','g'],
                    ['sodium','Sodium','mg']
                  ].map(([key, label, unit]) => (
                    <div key={key} className="nutrition-item">
                      <span className="nutrition-value">{nutrition[key]}{unit}</span>
                      <span className="nutrition-label">{label}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <h3>Ingredients</h3>
          <ul className="ingredient-grid">
            {recipe.ingredients.map((ingredient, i) => <li key={i}>{ingredient}</li>)}
          </ul>

          <h3>Steps</h3>
          <ol className="steps-list">
            {recipe.steps.map((step, i) => {
              const mins = extractMinutes(step)
              console.log('step', i, 'mins:', mins, 'isSubscriber:', isSubscriber)
              const activeTimer = activeTimers.find(t => t.stepIndex === i)
              return (
                <li key={i}>
                  {step}
                  {isSubscriber && mins && (
                    <div className="step-timer">
                      {activeTimer ? (
                        <div className="step-timer-active">
                          <TimerCountdown endTime={activeTimer.endTime} />
                          <button
                            className="timer-cancel-btn"
                            onClick={() => cancelTimer(i)}
                          >Cancel</button>
                        </div>
                      ) : (
                        <button
                          className="timer-start-btn"
                          onClick={() => startTimer(i, mins, step)}
                        >⏱ Start Timer — {mins} min</button>
                      )}
                    </div>
                  )}
                </li>
              )
            })}
          </ol>

          {remixes.length > 0 && (
            <div className="remixes-section">
              <h3>Remixes of this Recipe</h3>
              <div className="remixes-grid">
                {remixes.slice(0, 4).map(remix => (
                  <Link key={remix.id} to={`/recipes/${remix.slug}`} className="remix-card">
                    {remix.image_url && (
                      <img src={remix.image_url} alt={remix.title} className="remix-card-img" />
                    )}
                    <div className="remix-card-info">
                      <p className="remix-card-title">{remix.title}</p>
                      {remix.remix_description && (
                        <p className="remix-card-desc">{remix.remix_description}</p>
                      )}
                      <div className="remix-card-meta">
                        <span>🥄 {remix.spoon_score}/10</span>
                        <span>
                          {[1,2,3,4,5].map(star => (
                            <span key={star} style={{color: remix.rating >= star ? '#7b1f4a' : '#ddd', fontSize:'12px'}}>★</span>
                          ))}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div className="comment-section">
            <div className="comment-section-header">
              <h3>Comments</h3>
            </div>
            <div className="comment-form">
              <h4>Leave a comment</h4>
              {commentError && <p className="auth-error">{commentError}</p>}
              <textarea
                className="comment-input"
                placeholder="Share your thoughts, tips, or modifications..."
                value={commentText}
                onChange={e => setCommentText(e.target.value)}
                rows={4}
              />
              <button
                className="submit-btn"
                onClick={handleSubmitComment}
                disabled={commentLoading}
                style={{width:'auto', padding:'10px 24px'}}
              >
                {commentLoading ? 'Posting...' : 'Post comment'}
              </button>
            </div>
            <div className="comments-list">
              {comments.length === 0 && (
                <p className="no-comments">No comments yet — be the first to share your thoughts!</p>
              )}
              {comments.slice().reverse().slice((commentPage - 1) * 10, commentPage * 10).map(comment => (
                <div key={comment.id} className="comment-item">
                  <div className="comment-header">
                    <span className="comment-username">{comment.username}</span>
                    <span className="comment-date">
                      {new Date(comment.created_at).toLocaleDateString('en-US', {year:'numeric', month:'short', day:'numeric'})}
                    </span>
                    <div className="three-dot-menu">
                      <button className="three-dot-btn" onClick={() => setReportingId(reportingId === comment.id ? null : comment.id)}>⋮</button>
                      {reportingId === comment.id && (
                        <div className="three-dot-dropdown">
                          <button className="three-dot-item" onClick={() => { setReportingId(null); setReportReason(''); setReportRecipeReason(`comment-${comment.id}`) }}>🚩 Report comment</button>
                          <button className="three-dot-item" onClick={() => { setReportingId(null); setReportReason(''); setReportRecipeReason(`commenter-${comment.id}`) }}>🚩 Report this user</button>
                        </div>
                      )}
                    </div>
                  </div>
                  <p className="comment-content">{comment.content}</p>
                </div>
              ))}
            </div>
            {comments.length > 10 && (
              <div className="comment-pagination">
                {Array.from({length: Math.ceil(comments.length / 10)}, (_, i) => (
                  <button key={i+1} className={`page-btn ${commentPage === i+1 ? 'active' : ''}`} onClick={() => setCommentPage(i+1)}>{i+1}</button>
                ))}
              </div>
            )}
          </div>

          {recentlyViewed.length > 0 && (
            <div className="recently-viewed-section">
              <h3>Recently Viewed</h3>
              <div className="recipe-row">
                {recentlyViewed.map(r => (
                  <RecipeCard
                    key={r.id}
                    title={r.title}
                    description={r.description}
                    tags={r.tags}
                    spoonScore={r.spoon_score}
                    rating={r.rating}
                    ratingCount={r.rating_count}
                    image={r.image_url}
                    isWellSeasoned={r.is_well_seasoned}
                    isTrustedChef={r.is_trusted_chef}
                    link={`/recipes/${r.slug}`}
                  />
                ))}
              </div>
            </div>
          )}

        </div>
      </div>

      {activeTimers.length > 0 && (
        <div className="timer-float-bar">
          {activeTimers.map(timer => (
            <div key={timer.stepIndex} className="timer-float-item">
              <span className="timer-float-label">{timer.label}</span>
              <TimerCountdown endTime={timer.endTime} />
              <button
                className="timer-cancel-btn"
                onClick={() => cancelTimer(timer.stepIndex)}
              >✕</button>
            </div>
          ))}
        </div>
      )}

    </main>
  )
}

export default RecipePage