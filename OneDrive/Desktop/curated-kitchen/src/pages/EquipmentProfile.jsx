import { useState, useEffect } from 'react'
import './EquipmentProfile.css'

const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9yZnNnZmR2b2ppaGRkZXdvcnV6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYwMTMxODYsImV4cCI6MjA5MTU4OTE4Nn0.lQuHjktlnZmv6BGZrZxQ4gQl_WBQysF2vEjZv38Z-0A'
const DB = 'https://orfsgfdvojihddeworuz.supabase.co'
const HEADERS = { 'apikey': ANON_KEY, 'Authorization': `Bearer ${ANON_KEY}` }

const equipmentList = [
  { id: 'food_processor', label: 'Food Processor', icon: '⚙️',
    description: 'Reduces chopping effort by 70%' },
  { id: 'stand_mixer', label: 'Stand Mixer', icon: '🥣',
    description: 'Reduces mixing/kneading effort by 80%' },
  { id: 'hand_mixer', label: 'Hand Mixer', icon: '🔌',
    description: 'Reduces mixing effort by 60%' },
  { id: 'air_fryer', label: 'Air Fryer', icon: '🌬️',
    description: 'Reduces oven waiting time by 30%' },
  { id: 'instant_pot', label: 'Instant Pot / Pressure Cooker', icon: '🫕',
    description: 'Reduces passive time by 50%' },
  { id: 'slow_cooker', label: 'Slow Cooker / Crockpot', icon: '🍲',
    description: 'Eliminates stovetop monitoring during cooking' },
  { id: 'blender', label: 'Blender', icon: '🥤',
    description: 'Available for blending tasks' },
  { id: 'immersion_blender', label: 'Immersion Blender', icon: '🫙',
    description: 'Available for blending tasks in the pot' },
  { id: 'rice_cooker', label: 'Rice Cooker', icon: '🍚',
    description: 'Reduces rice/grain passive time to minimum' },
  { id: 'mandoline', label: 'Mandoline Slicer', icon: '🔪',
    description: 'Reduces slicing effort by 60%' },
  { id: 'sous_vide', label: 'Sous Vide', icon: '🌡️',
    description: 'Eliminates timing precision concerns' },
  { id: 'deep_fryer', label: 'Deep Fryer', icon: '🍟',
    description: 'Regulates oil temperature automatically' },
  { id: 'toaster_oven', label: 'Toaster Oven', icon: '🍞',
    description: 'Reduces waiting time for small batches' },
  { id: 'slap_chop', label: 'Slap Chop', icon: '✂️',
    description: 'Reduces chopping effort by 30%' },
]

function EquipmentProfile() {
  const [userId, setUserId] = useState(null)
  const [profile, setProfile] = useState(null)
  const [selected, setSelected] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const keys = Object.keys(localStorage)
    for (const key of keys) {
      if (key.startsWith('sb-') && key.includes('auth')) {
        try {
          const parsed = JSON.parse(localStorage.getItem(key))
          const u = parsed?.user
          if (u) {
            setUserId(u.id)
            fetch(`${DB}/rest/v1/profiles?id=eq.${u.id}&select=*`,
              { headers: HEADERS })
              .then(res => res.json())
              .then(data => {
                const p = data?.[0]
                setProfile(p)
                setSelected(p?.equipment || [])
                setLoading(false)
              })
            break
          }
        } catch(e) {}
      }
    }
  }, [])

  function toggleEquipment(id) {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id]
    )
  }

  async function handleSave() {
    setSaving(true)
    const res = await fetch(`${DB}/rest/v1/profiles?id=eq.${userId}`, {
      method: 'PATCH',
      headers: { ...HEADERS, 'Content-Type': 'application/json' },
      body: JSON.stringify({ equipment: selected })
    })
    if (res.ok) {
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    }
    setSaving(false)
  }

  if (loading) return <main className="main"><p>Loading...</p></main>

  if (!profile || (profile.account_type !== 'subscriber' &&
    !profile.is_trusted_chef)) {
    return (
      <main className="main">
        <div className="not-found">
          <h2>Subscribers & Trusted Chefs Only</h2>
          <p>The equipment profile is available to subscribers
          and Trusted Chefs. Upgrade to unlock personalized
          Spoon Scores based on your kitchen setup.</p>
        </div>
      </main>
    )
  }

  return (
    <main className="main">
      <div className="equipment-layout">
        <div className="equipment-header">
          <h2>My Equipment Profile</h2>
          <p>Select the equipment you have available in your kitchen.
          Your Spoon Scores will be adjusted to reflect the tools
          you actually use — making scores more accurate for you
          personally.</p>
        </div>

        <div className="equipment-grid">
          {equipmentList.map(item => (
            <button
              key={item.id}
              className={`equipment-item ${selected.includes(item.id) ? 'active' : ''}`}
              onClick={() => toggleEquipment(item.id)}
            >
              <span className="equipment-icon">{item.icon}</span>
              <strong className="equipment-label">{item.label}</strong>
              <p className="equipment-desc">{item.description}</p>
              <span className="equipment-check">
                {selected.includes(item.id) ? '✓ Selected' : '+ Add'}
              </span>
            </button>
          ))}
        </div>

        <div className="equipment-save">
          {saved && (
            <p className="equipment-saved">
              Equipment profile saved!
            </p>
          )}
          <button
            className="submit-btn"
            style={{width: 'auto', padding: '12px 32px'}}
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save Equipment Profile'}
          </button>
        </div>
      </div>
    </main>
  )
}

export default EquipmentProfile