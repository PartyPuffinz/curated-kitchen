import { useState, useEffect, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import './RecipePage.css'
import { calculateRecipeNutrition } from '../utils/nutrition'

const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9yZnNnZmR2b2ppaGRkZXdvcnV6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYwMTMxODYsImV4cCI6MjA5MTU4OTE4Nn0.lQuHjktlnZmv6BGZrZxQ4gQl_WBQysF2vEjZv38Z-0A'
const DB = 'https://orfsgfdvojihddeworuz.supabase.co'
const HEADERS = { 'apikey': ANON_KEY, 'Authorization': `Bearer ${ANON_KEY}` }

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
  const reportMenuRef = useRef(null)

  useEffect(() => {
    fetch(`${DB}/rest/v1/recipes?slug=eq.${slug}&select=*`, { headers: HEADERS })
      .then(res => res.json())
      .then(data => {
        setRecipe(Array.isArray(data) && data.length > 0 ? data[0] : null)
        setLoading(false)
      })
      .catch(err => {
        console.error('Fetch error:', err)
        setLoading(false)
      })
  }, [slug])

  useEffect(() => {
    if (!recipe) return
    setNutritionLoading(true)
    calculateRecipeNutrition(recipe.ingredients, recipe.portions)
      .then(data => {
        setNutrition(data)
        setNutritionLoading(false)
      })
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
        setUserRating(data[0].rating)
        setHasRated(true)
      }
    })
    .catch(() => {})
}, [recipe])

  useEffect(() => {
  function handleClickOutside(e) {
    if (reportMenuRef.current && !reportMenuRef.current.contains(e.target)) {
      setShowReportRecipe(false)
    }
    const menus = document.querySelectorAll('.three-dot-menu')
    let clickedInsideMenu = false
    menus.forEach(menu => {
      if (menu.contains(e.target)) clickedInsideMenu = true
    })
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
  if (!user) {
    alert('You must be signed in to rate recipes.')
    return
  }
  setRatingSubmitting(true)
  const res = await fetch(`${DB}/rest/v1/ratings`, {
    method: 'POST',
    headers: { ...HEADERS, 'Content-Type': 'application/json', 'Prefer': 'return=minimal' },
    body: JSON.stringify({
      recipe_id: recipe.id,
      user_id: user.id,
      rating: stars
    })
  })
  
  if (res.ok) {
    setUserRating(stars)
    setHasRated(true)
    const newCount = recipe.rating_count + 1
    const newRating = ((recipe.rating * recipe.rating_count) + stars) / newCount
    const roundedRating = Math.round(newRating * 10) / 10
    await fetch(`${DB}/rest/v1/recipes?id=eq.${recipe.id}`, {
      method: 'PATCH',
      headers: { ...HEADERS, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        rating: roundedRating,
        rating_count: newCount
      })
    })
    setRecipe(prev => ({
      ...prev,
      rating: roundedRating,
      rating_count: newCount
    }))
  }
  setRatingSubmitting(false)
}

  async function handleSubmitComment() {
    setCommentError('')
    if (!commentText.trim()) {
      setCommentError('Please write a comment before submitting.')
      return
    }
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
    if (!user) {
      setCommentError('You must be signed in to comment.')
      return
    }
    const profileRes = await fetch(
      `${DB}/rest/v1/profiles?id=eq.${user.id}&select=username`,
      { headers: HEADERS }
    )
    const profileData = await profileRes.json()
    const username = profileData?.[0]?.username || 'Anonymous'
    setCommentLoading(true)
    const res = await fetch(`${DB}/rest/v1/comments`, {
      method: 'POST',
      headers: { ...HEADERS, 'Content-Type': 'application/json', 'Prefer': 'return=minimal' },
      body: JSON.stringify({
        recipe_id: recipe.id,
        user_id: user.id,
        username,
        content: commentText.trim()
      })
    })
    if (res.ok) {
      setComments(prev => [...prev, {
        id: Date.now(),
        username,
        content: commentText.trim(),
        created_at: new Date().toISOString()
      }])
      setCommentText('')
    } else {
      setCommentError('Failed to post comment. Please try again.')
    }
    setCommentLoading(false)
  }

  async function handleReportComment(commentId) {
    await fetch(`${DB}/rest/v1/comments?id=eq.${commentId}`, {
      method: 'PATCH',
      headers: { ...HEADERS, 'Content-Type': 'application/json' },
      body: JSON.stringify({ reported: true })
    })
    setReportingId(null)
    setReportReason('')
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

          <div className="recipe-title-row">
            <h2>{recipe.title}</h2>
            <div
  className="three-dot-menu"
  ref={reportMenuRef}
  
>
  <button
    className="three-dot-btn"
    onClick={() => setShowReportRecipe(!showReportRecipe)}
  >⋮</button>
              {showReportRecipe && (
                <div className="three-dot-dropdown">
                  <button
                    className="three-dot-item"
                    onClick={() => {
                      setShowReportRecipe(false)
                      setReportRecipeReason('recipe')
                    }}
                  >🚩 Report this recipe</button>
                  <button
                    className="three-dot-item"
                    onClick={() => {
                      setShowReportRecipe(false)
                      setReportRecipeReason('user')
                    }}
                  >🚩 Report this user</button>
                </div>
              )}
            </div>
          </div>

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
                  ? ['Inaccurate ingredients or steps',
                      'Inappropriate content',
                      'Spam or self-promotion',
                      'Copyright violation',
                      'Harmful or dangerous instructions',
                      'Other']
                  : reportRecipeReason === 'user' || reportRecipeReason.startsWith('commenter-')
                  ? ['Spam or bot account',
                      'Harassment',
                      'Hate speech',
                      'Phishing or scam',
                      'Impersonation',
                      'Other']
                  : ['Spam',
                      'Harassment',
                      'Hate speech',
                      'Off-topic or irrelevant',
                      'Phishing or scam',
                      'Other']
                ).map(reason => (
                  <label key={reason} className="report-option">
                    <input
                      type="radio"
                      name="report-reason"
                      value={reason}
                      onChange={e => setReportReason(e.target.value)}
                    />
                    {reason}
                  </label>
                ))}
              </div>
              <div className="report-actions">
                <button
                  className="submit-btn"
                  style={{width: 'auto', padding: '10px 20px'}}
                  onClick={() => {
                    if (!reportReason) return
                    if (reportRecipeReason.startsWith('comment-') ||
                        reportRecipeReason.startsWith('commenter-')) {
                      const commentId = reportRecipeReason.split('-')[1]
                      handleReportComment(commentId)
                    }
                    setReportRecipeReason('')
                    setReportReason('')
                    alert('Report submitted. Our moderation team will review it.')
                  }}
                >Submit report</button>
                <button
                  className="skip-btn"
                  onClick={() => {
                    setReportRecipeReason('')
                    setReportReason('')
                  }}
                >Cancel</button>
              </div>
            </div>
          )}

          <div className="recipe-badges">
            {recipe.is_trusted_chef && (
              <span className="trusted-chef-tag">👨‍🍳 Trusted Chef</span>
            )}
            {recipe.is_well_seasoned && (
              <span className="well-seasoned-tag">🏅 Well Seasoned</span>
            )}
          </div>

          <div className="tags">
            {recipe.tags.map((tag, i) => (
              <span key={i} className="tag">{tag}</span>
            ))}
          </div>

          <p className="description">{recipe.description}</p>

          <div className="recipe-page-meta">
            <div className="meta-row">
              <span>🥄 {recipe.spoon_score}/10 spoons</span>
              <span>
                {recipe.cleanup === 'High' ? '🧹 ⚠️ High cleanup ⚠️' :
                 recipe.cleanup === 'Medium' ? '🧹 Medium cleanup' :
                 '🧹 Low cleanup'}
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
    <p className="rating-thanks">
      You rated this recipe {userRating} star{userRating !== 1 ? 's' : ''}!
    </p>
  ) : (
    <>
      <p className="rating-prompt">Rate this recipe:</p>
      <div className="rating-stars">
        {[1,2,3,4,5].map(star => (
          <button
            key={star}
            className={`rating-star ${(hoverRating || userRating) >= star ? 'active' : ''}`}
            onMouseEnter={() => setHoverRating(star)}
            onMouseLeave={() => setHoverRating(0)}
            onClick={() => handleRating(star)}
            disabled={ratingSubmitting}
          >★</button>
        ))}
      </div>
    </>
  )}
</div>

            <div className="nutrition-facts">
              <h4>Nutrition per serving</h4>
              <p className="nutrition-serves">Recipe serves {recipe.portions}</p>
              {nutritionLoading && (
                <p className="nutrition-loading">Calculating nutrition facts...</p>
              )}
              {nutrition && !nutritionLoading && (
                <div className="nutrition-grid">
                  <div className="nutrition-item">
                    <span className="nutrition-value">{nutrition.calories}</span>
                    <span className="nutrition-label">Calories</span>
                  </div>
                  <div className="nutrition-item">
                    <span className="nutrition-value">{nutrition.protein}g</span>
                    <span className="nutrition-label">Protein</span>
                  </div>
                  <div className="nutrition-item">
                    <span className="nutrition-value">{nutrition.fat}g</span>
                    <span className="nutrition-label">Fat</span>
                  </div>
                  <div className="nutrition-item">
                    <span className="nutrition-value">{nutrition.carbs}g</span>
                    <span className="nutrition-label">Carbs</span>
                  </div>
                  <div className="nutrition-item">
                    <span className="nutrition-value">{nutrition.fiber}g</span>
                    <span className="nutrition-label">Fiber</span>
                  </div>
                  <div className="nutrition-item">
                    <span className="nutrition-value">{nutrition.sugar}g</span>
                    <span className="nutrition-label">Sugar</span>
                  </div>
                  <div className="nutrition-item">
                    <span className="nutrition-value">{nutrition.sodium}mg</span>
                    <span className="nutrition-label">Sodium</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <h3>Ingredients</h3>
          <ul className="ingredient-grid">
            {recipe.ingredients.map((ingredient, i) => (
              <li key={i}>{ingredient}</li>
            ))}
          </ul>

          <h3>Steps</h3>
          <ol className="steps-list">
            {recipe.steps.map((step, i) => (
              <li key={i}>{step}</li>
            ))}
          </ol>

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
                style={{width: 'auto', padding: '10px 24px'}}
              >
                {commentLoading ? 'Posting...' : 'Post comment'}
              </button>
            </div>

            <div className="comments-list">
              {comments.length === 0 && (
                <p className="no-comments">No comments yet —
                be the first to share your thoughts!</p>
              )}
              {comments
                .slice()
                .reverse()
                .slice((commentPage - 1) * 10, commentPage * 10)
                .map(comment => (
                  <div key={comment.id} className="comment-item">
                    <div className="comment-header">
                      <span className="comment-username">
                        {comment.username}</span>
                      <span className="comment-date">
                        {new Date(comment.created_at).toLocaleDateString(
                          'en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          }
                        )}
                      </span>
                      <div
  className="three-dot-menu"
  
>
  <button
    className="three-dot-btn"
    onClick={() => setReportingId(
      reportingId === comment.id ? null : comment.id
    )}
  >⋮</button>
                        {reportingId === comment.id && (
                          <div className="three-dot-dropdown">
                            <button
                              className="three-dot-item"
                              onClick={() => {
                                setReportingId(null)
                                setReportReason('')
                                setReportRecipeReason(`comment-${comment.id}`)
                              }}
                            >🚩 Report comment</button>
                            <button
                              className="three-dot-item"
                              onClick={() => {
                                setReportingId(null)
                                setReportReason('')
                                setReportRecipeReason(`commenter-${comment.id}`)
                              }}
                            >🚩 Report this user</button>
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
                {Array.from(
                  { length: Math.ceil(comments.length / 10) },
                  (_, i) => (
                    <button
                      key={i + 1}
                      className={`page-btn ${commentPage === i + 1 ? 'active' : ''}`}
                      onClick={() => setCommentPage(i + 1)}
                    >{i + 1}</button>
                  )
                )}
              </div>
            )}
          </div>

        </div>
      </div>
    </main>
  )
}

export default RecipePage