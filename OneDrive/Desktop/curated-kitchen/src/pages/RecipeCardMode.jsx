import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import './RecipeCardMode.css'

const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9yZnNnZmR2b2ppaGRkZXdvcnV6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYwMTMxODYsImV4cCI6MjA5MTU4OTE4Nn0.lQuHjktlnZmv6BGZrZxQ4gQl_WBQysF2vEjZv38Z-0A'
const DB = 'https://orfsgfdvojihddeworuz.supabase.co'
const HEADERS = { 'apikey': ANON_KEY, 'Authorization': `Bearer ${ANON_KEY}` }

function extractMinutes(text) {
  const patterns = [
    /(\d+)\s*(?:to\s*\d+\s*)?hours?/i,
    /(\d+)\s*(?:to\s*\d+\s*)?minutes?/i,
    /(\d+)\s*(?:to\s*\d+\s*)?seconds?/i,
  ]
  for (const pattern of patterns) {
    const match = text.match(pattern)
    if (match) {
      const val = parseInt(match[1])
      if (/hours?/i.test(match[0])) return val * 60
      if (/seconds?/i.test(match[0])) return Math.ceil(val / 60)
      return val
    }
  }
  return null
}

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

function TimerCountdown({ endTime, onDone }) {
  const [remaining, setRemaining] = useState(Math.max(0, endTime - Date.now()))

  useEffect(() => {
    const interval = setInterval(() => {
      const left = Math.max(0, endTime - Date.now())
      setRemaining(left)
      if (left === 0) {
        clearInterval(interval)
        onDone()
      }
    }, 1000)
    return () => clearInterval(interval)
  }, [endTime])

  const totalSecs = Math.ceil(remaining / 1000)
  const mins = Math.floor(totalSecs / 60)
  const secs = totalSecs % 60
  return (
    <span className="rcm-timer-countdown">
      {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
    </span>
  )
}

function RecipeCardMode() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [recipe, setRecipe] = useState(null)
  const [loading, setLoading] = useState(true)
  const [cardIndex, setCardIndex] = useState(0)
  const [activeTimer, setActiveTimer] = useState(null)
  const [timerDone, setTimerDone] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const touchStartX = useRef(null)

  useEffect(() => {
    fetch(`${DB}/rest/v1/recipes?slug=eq.${slug}&select=*`, { headers: HEADERS })
      .then(res => res.json())
      .then(data => {
        setRecipe(Array.isArray(data) && data.length > 0 ? data[0] : null)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [slug])

  function buildCards(recipe) {
    const cards = []
    cards.push({ type: 'ingredients', ingredients: recipe.ingredients })
    recipe.steps.forEach((step, i) => {
      cards.push({ type: 'step', index: i, text: step, mins: extractMinutes(step) })
    })
    cards.push({ type: 'done' })
    return cards
  }

  function handleNext() {
    if (!recipe) return
    const cards = buildCards(recipe)
    if (cardIndex < cards.length - 1) {
      setCardIndex(cardIndex + 1)
      setTimerDone(false)
    }
  }

  function handlePrev() {
    if (cardIndex > 0) {
      setCardIndex(cardIndex - 1)
      setTimerDone(false)
    }
  }

  function handleTouchStart(e) {
    touchStartX.current = e.touches[0].clientX
  }

  function handleTouchEnd(e) {
    if (touchStartX.current === null) return
    const diff = touchStartX.current - e.changedTouches[0].clientX
    if (Math.abs(diff) > 50) {
      if (diff > 0) handleNext()
      else handlePrev()
    }
    touchStartX.current = null
  }

  function startTimer(mins) {
    if (Notification.permission === 'default') Notification.requestPermission()
    const endTime = Date.now() + mins * 60 * 1000
    setActiveTimer({ endTime, mins })
    setTimerDone(false)
  }

  function handleTimerDone() {
    playChime()
    setTimerDone(true)
    setActiveTimer(null)
    document.title = '⏰ Timer Done! — Curated Kitchen'
    setTimeout(() => { document.title = 'Curated Kitchen' }, 10000)
    if (Notification.permission === 'granted') {
      new Notification('⏰ Timer Done!', {
        body: `Your timer for ${recipe?.title} is complete!`,
        icon: '/favicon.ico'
      })
    }
  }

  if (loading) return <div className="rcm-overlay"><p className="rcm-loading">Loading...</p></div>
  if (!recipe) return <div className="rcm-overlay"><p className="rcm-loading">Recipe not found.</p></div>

  const cards = buildCards(recipe)
  const card = cards[cardIndex]
  const isFirst = cardIndex === 0
  const isLast = cardIndex === cards.length - 1

  return (
    <div
      className="rcm-overlay"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="rcm-card">

        <div className="rcm-header">
          <div className="rcm-title-area">
            <span className="rcm-recipe-title">{recipe.title}</span>
            <span className="rcm-meta">
              🥄 {recipe.spoon_score}/10
              &nbsp;·&nbsp;
              {[1,2,3,4,5].map(star => (
                <span key={star} style={{color: recipe.rating >= star ? '#7b1f4a' : '#ddd', fontSize:'13px'}}>★</span>
              ))}
            </span>
          </div>
          <button className="rcm-close" onClick={() => navigate(`/recipes/${slug}`)}>✕</button>
        </div>

        <div className="rcm-progress">
          <div
            className="rcm-progress-bar"
            style={{width: `${((cardIndex + 1) / cards.length) * 100}%`}}
          />
        </div>

        <div className="rcm-body">

          {card.type === 'ingredients' && (
            <div className="rcm-ingredients">
              <h2 className="rcm-card-heading">Ingredients</h2>
              <p className="rcm-serves">Serves {recipe.portions}</p>
              <ul className="rcm-ingredient-list">
                {recipe.ingredients.map((ing, i) => (
                  <li key={i}>{ing}</li>
                ))}
              </ul>
            </div>
          )}

          {card.type === 'step' && (
            <div className="rcm-step">
              <h2 className="rcm-card-heading">Step {card.index + 1}</h2>
              <p className="rcm-step-text">{card.text}</p>

              {card.mins && (
                <div className="rcm-timer-area">
                  {timerDone ? (
                    <div className="rcm-timer-done">✅ Timer done! Continue when ready.</div>
                  ) : activeTimer ? (
                    <div className="rcm-timer-running">
                      <span className="rcm-timer-label">⏱ Time remaining:</span>
                      <TimerCountdown endTime={activeTimer.endTime} onDone={handleTimerDone} />
                      <button className="rcm-cancel-btn" onClick={() => setActiveTimer(null)}>Cancel</button>
                    </div>
                  ) : (
                    <button
                      className="rcm-start-timer-btn"
                      onClick={() => startTimer(card.mins)}
                    >⏱ Start Timer — {card.mins} min</button>
                  )}
                </div>
              )}
            </div>
          )}

          {card.type === 'done' && (
            <div className="rcm-done">
              <div className="rcm-confetti" aria-hidden="true">
                🎉🎊🎉🎊🎉
              </div>
              <h2 className="rcm-done-heading">Congrats! You're done!</h2>
              <p className="rcm-done-text">Enjoy your meal! 🍽️</p>
              <button
                className="rcm-finish-btn"
                onClick={() => navigate(`/recipes/${slug}`)}
              >Back to Recipe</button>
            </div>
          )}

        </div>

        <div className="rcm-footer">
          <button
            className="rcm-nav-btn"
            onClick={handlePrev}
            disabled={isFirst}
          >← Back</button>
          <span className="rcm-page-indicator">
            {cardIndex + 1} / {cards.length}
          </span>
          {!isLast && (
            <button className="rcm-nav-btn" onClick={handleNext}>Next →</button>
          )}
          {isLast && (
            <button className="rcm-nav-btn" onClick={() => navigate(`/recipes/${slug}`)}>Finish</button>
          )}
        </div>

        {activeTimer && (
          <div className="rcm-timer-float">
            <span>⏱ Timer: </span>
            <TimerCountdown endTime={activeTimer.endTime} onDone={handleTimerDone} />
          </div>
        )}

      </div>
    </div>
  )
}

export default RecipeCardMode