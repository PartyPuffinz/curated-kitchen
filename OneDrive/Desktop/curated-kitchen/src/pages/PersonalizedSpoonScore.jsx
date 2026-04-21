import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import './PersonalizedSpoonScore.css'

const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9yZnNnZmR2b2ppaGRkZXdvcnV6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYwMTMxODYsImV4cCI6MjA5MTU4OTE4Nn0.lQuHjktlnZmv6BGZrZxQ4gQl_WBQysF2vEjZv38Z-0A'
const DB = 'https://orfsgfdvojihddeworuz.supabase.co'
const HEADERS = { 'apikey': ANON_KEY, 'Authorization': `Bearer ${ANON_KEY}` }

const questions = [
  {
    id: 'chopping',
    label: 'Chopping & Cutting',
    question: 'How difficult is cutting and chopping raw potatoes and carrots for you?',
    equipmentQuestion: 'Does this score include any equipment you may have? (e.g. food processor, mandoline, slap chop)',
  },
  {
    id: 'stirring',
    label: 'Stirring',
    question: 'How difficult is stirring tomato sauce continuously for 5 minutes for you?',
    equipmentQuestion: 'Does this score include any equipment you may have?',
  },
  {
    id: 'kneading',
    label: 'Mixing & Kneading',
    question: 'How difficult is mixing thick batters or kneading dough such as cake batter or cookie dough?',
    equipmentQuestion: 'Does this score include any equipment you may have? (e.g. stand mixer, hand mixer)',
  },
  {
    id: 'lifting',
    label: 'Lifting',
    question: 'How difficult is it to lift heavy pots and pans, including cast iron?',
    equipmentQuestion: 'Does this score include any equipment you may have?',
  },
  {
    id: 'stovetop',
    label: 'Stovetop Standing',
    question: 'How difficult is standing at the stove for 10 straight minutes for you?',
    equipmentQuestion: 'Does this score include any equipment you may have? (e.g. tall stool, perching aid)',
  },
  {
    id: 'multitasking',
    label: 'Multitasking',
    question: 'How difficult is it to stir a pot periodically while also slicing vegetables?',
    equipmentQuestion: 'Does this score include any equipment you may have?',
  },
  {
    id: 'fineMotor',
    label: 'Fine Motor Tasks',
    question: 'How difficult are precise hand tasks such as filleting fish or peeling large quantities of vegetables?',
    equipmentQuestion: 'Does this score include any equipment you may have? (e.g. peeler, deveining tool)',
  },
  {
    id: 'passive',
    label: 'Passive Monitoring',
    question: 'How difficult is managing a recipe that requires checking back every 30 minutes?',
    equipmentQuestion: 'Does this score include any equipment you may have? (e.g. smart oven, slow cooker with timer)',
  },
  {
    id: 'timing',
    label: 'Timing Precision',
    question: 'How difficult is managing precise timing, such as with caramel or cooking meat to exact temperatures?',
    equipmentQuestion: 'Does this score include any equipment you may have? (e.g. instant read thermometer, sous vide)',
  },
  {
    id: 'cleanup',
    label: 'Cleanup',
    question: 'How difficult is cleanup after cooking for you? Consider washing heavy pans, scrubbing baked-on food, or lifting a full pot to drain pasta.',
    equipmentQuestion: 'Does this include having a dishwasher available to you?',
  },
]

function SliderQuestion({ q, value, onChange, equipmentAnswer, onEquipmentChange }) {
  return (
    <div className="pss-question-block">
      <div className="pss-question-header">
        <span className="pss-question-label">{q.label}</span>
        <span className="pss-question-score">{value}/10</span>
      </div>
      <p className="pss-question-text">{q.question}</p>

      <div className="pss-slider-wrapper">
        <input
        type="range"
        min="0"
        max="10"
        step="1"
        value={value}
        onChange={e => onChange(parseInt(e.target.value))}
        className="pss-slider"
      />
        <div className="pss-slider-labels">
          <span className="pss-label-left">0 — I can do it for<br />20+ min with no issue</span>
          <span className="pss-label-mid">5 — I struggle but<br />can manage 5–10 min</span>
          <span className="pss-label-right">10 — I'll need at least<br />15+ min to recover</span>
        </div>
      </div>

      {value >= 5 && (
        <div className="pss-equipment-followup">
          <p className="pss-equipment-question">{q.equipmentQuestion}</p>
          <div className="pss-equipment-options">
            {['yes', 'no', 'neither'].map(opt => (
              <label key={opt} className="pss-equipment-option">
                <input
                  type="radio"
                  name={`equip-${q.id}`}
                  value={opt}
                  checked={equipmentAnswer === opt}
                  onChange={() => onEquipmentChange(opt)}
                />
                {opt === 'yes' && 'Yes, this score includes my equipment'}
                {opt === 'no' && "No, I have equipment but didn't factor it in"}
                {opt === 'neither' && "I don't have any relevant equipment"}
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function PersonalizedSpoonScore() {
  const [userId, setUserId] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [savedBanner, setSavedBanner] = useState(false)
  const [error, setError] = useState('')
  const [scores, setScores] = useState({
    chopping: 5, stirring: 5, kneading: 5, lifting: 5,
    stovetop: 5, multitasking: 5, fineMotor: 5,
    passive: 5, timing: 5, cleanup: 5
  })

  const [equipmentAnswers, setEquipmentAnswers] = useState({
    chopping: '', stirring: '', kneading: '', lifting: '',
    stovetop: '', multitasking: '', fineMotor: '', passive: '',
    timing: '', cleanup: ''
  })

  useEffect(() => {
    const keys = Object.keys(localStorage)
    for (const key of keys) {
      if (key.startsWith('sb-') && key.includes('auth')) {
        try {
          const parsed = JSON.parse(localStorage.getItem(key))
          const u = parsed?.user
          if (u) {
            setUserId(u.id)
            fetch(`${DB}/rest/v1/profiles?id=eq.${u.id}&select=*`, { headers: HEADERS })
              .then(res => res.json())
              .then(data => {
                const p = data?.[0]
                setProfile(p)
                if (p?.spoon_profile) {
                  const sp = p.spoon_profile
                  if (sp.scores) setScores(prev => ({ ...prev, ...sp.scores }))
                  if (sp.equipmentAnswers) setEquipmentAnswers(prev => ({ ...prev, ...sp.equipmentAnswers }))
                }
                setLoading(false)
              })
            break
          }
        } catch(e) { setLoading(false) }
      }
    }
  }, [])

 async function handleSave() {
    setError('')
    const unanswered = questions.filter(q =>
      scores[q.id] >= 5 && !equipmentAnswers[q.id]
    )
    if (unanswered.length > 0) {
      setError(`Please answer the equipment follow-up for: ${unanswered.map(q => q.label).join(', ')}`)
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }
    setSaving(true)
    const res = await fetch(`${DB}/rest/v1/profiles?id=eq.${userId}`, {
      method: 'PATCH',
      headers: { ...HEADERS, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        spoon_profile: { scores, equipmentAnswers, updatedAt: new Date().toISOString() }
      })
    })
    if (res.ok) {
      setSaved(true)
      setSavedBanner(true)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      setError('Failed to save. Please try again.')
    }
    setSaving(false)
  }

  if (loading) return <main className="main"><p>Loading...</p></main>

  if (!profile || profile.account_type !== 'subscriber') {
    return (
      <main className="main">
        <div className="not-found">
          <h2>Subscribers Only</h2>
          <p>Personalized Spoon Scoring is available to subscribers.</p>
          <Link to="/membership" className="view-btn">View Membership Options</Link>
        </div>
      </main>
    )
  }

  return (
    <main className="main">
      <div className="pss-layout">

        {savedBanner && (
          <div className="pss-saved-banner">
            ✓ Your personalized spoon score has been saved! You may update at any time if you feel your energy levels have changed.
            <button className="pss-banner-close" onClick={() => setSavedBanner(false)}>×</button>
          </div>
        )}

        <div className="pss-header">
          <h2>Personalized Spoon Score</h2>
          <p className="pss-intro">
            <strong>Please give your personal rating of the difficulties of the tasks listed below.</strong>
          </p>
          <p className="pss-subintro">
            Your answers are used to calculate a personalized spoon score on every recipe,
            reflecting your unique energy levels and abilities. We never ask about specific
            conditions — only how tasks feel to you personally.
          </p>
          <p className="pss-subintro">
            Rate each task from <strong>0</strong> (very easy) to <strong>10</strong> (extremely difficult).
            If you rate a task 5 or higher, we'll ask a quick follow-up about equipment.
          </p>
        </div>

        {questions.map(q => (
          <SliderQuestion
            key={q.id}
            q={q}
            value={scores[q.id]}
            onChange={val => setScores(prev => ({ ...prev, [q.id]: val }))}
            equipmentAnswer={equipmentAnswers[q.id]}
            onEquipmentChange={val => setEquipmentAnswers(prev => ({ ...prev, [q.id]: val }))}
          />
        ))}

        {error && <p className="auth-error">{error}</p>}

        

        <button
          className="submit-btn"
          onClick={handleSave}
          disabled={saving}
          style={{marginTop: '8px'}}
        >
          {saving ? 'Saving...' : 'Save My Spoon Profile'}
        </button>

        <p className="pss-footnote">
          Your answers are saved to your account and will persist even if you
          cancel and resubscribe. You can update them at any time.
        </p>

      </div>
    </main>
  )
}

export default PersonalizedSpoonScore