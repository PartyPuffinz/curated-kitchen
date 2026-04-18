import { useState, useEffect } from 'react'
import './NowzFoodz.css'

const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9yZnNnZmR2b2ppaGRkZXdvcnV6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYwMTMxODYsImV4cCI6MjA5MTU4OTE4Nn0.lQuHjktlnZmv6BGZrZxQ4gQl_WBQysF2vEjZv38Z-0A'
const DB = 'https://orfsgfdvojihddeworuz.supabase.co'
const HEADERS = { 'apikey': ANON_KEY, 'Authorization': `Bearer ${ANON_KEY}` }

const categories = [
  'All', 'Energy Drinks', 'Protein Bars', 'Snacks',
  'Frozen Meals', 'Ready to Eat', 'Drinks', 'Desserts',
  'Canned Goods', 'Other'
]

const dietFilters = [
  'Keto', 'Low-carb', 'Gluten-free', 'Dairy-free', 'Vegan',
  'Vegetarian', 'Nut-free', 'Paleo', 'Diabetic-friendly',
  'Halal', 'Kosher', 'Whole30', 'AIP', 'Mediterranean',
  'DASH', 'Low-sodium', 'Egg-free', 'Soy-free',
  'Shellfish-free', 'Fish-free', 'Peanut-free', 'Sesame-free'
]

function NowzFoodz() {
  const [foods, setFoods] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedDiets, setSelectedDiets] = useState([])
  const [maxCalories, setMaxCalories] = useState('')
const [minProtein, setMinProtein] = useState('')
const [minFat, setMinFat] = useState('')
const [maxFat, setMaxFat] = useState('')
const [maxSugar, setMaxSugar] = useState('')
const [maxCarbs, setMaxCarbs] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [userRatings, setUserRatings] = useState({})
  const [hoverRating, setHoverRating] = useState({})
  const [ratedFoods, setRatedFoods] = useState({})
  const [userId, setUserId] = useState(null)

  useEffect(() => {
    const keys = Object.keys(localStorage)
    for (const key of keys) {
      if (key.startsWith('sb-') && key.includes('auth')) {
        try {
          const parsed = JSON.parse(localStorage.getItem(key))
          if (parsed?.user?.id) { setUserId(parsed.user.id); break }
        } catch(e) {}
      }
    }
  }, [])

  useEffect(() => {
    fetch(`${DB}/rest/v1/nowz_foodz?is_approved=eq.true&order=created_at.desc&select=*`,
      { headers: HEADERS })
      .then(res => res.json())
      .then(data => {
        setFoods(Array.isArray(data) ? data : [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (!userId || foods.length === 0) return
    foods.forEach(food => {
      fetch(`${DB}/rest/v1/nowz_ratings?food_id=eq.${food.id}&user_id=eq.${userId}&select=rating`,
        { headers: HEADERS })
        .then(res => res.json())
        .then(data => {
          if (data?.[0]) {
            setRatedFoods(prev => ({ ...prev, [food.id]: data[0].rating }))
          }
        })
    })
  }, [userId, foods])

  async function handleRate(foodId, stars) {
    if (!userId) { alert('You must be signed in to rate items.'); return }
    if (ratedFoods[foodId]) return

    const res = await fetch(`${DB}/rest/v1/nowz_ratings`, {
      method: 'POST',
      headers: { ...HEADERS, 'Content-Type': 'application/json', 'Prefer': 'return=minimal' },
      body: JSON.stringify({ food_id: foodId, user_id: userId, rating: stars })
    })

    if (res.ok) {
      const food = foods.find(f => f.id === foodId)
      const newCount = (food.rating_count || 0) + 1
      const newRating = (((food.rating || 0) * (food.rating_count || 0)) + stars) / newCount
      const rounded = Math.round(newRating * 10) / 10

      await fetch(`${DB}/rest/v1/nowz_foodz?id=eq.${foodId}`, {
        method: 'PATCH',
        headers: { ...HEADERS, 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating: rounded, rating_count: newCount })
      })

      setFoods(prev => prev.map(f =>
        f.id === foodId ? { ...f, rating: rounded, rating_count: newCount } : f
      ))
      setRatedFoods(prev => ({ ...prev, [foodId]: stars }))
    }
  }

  function toggleDiet(diet) {
    setSelectedDiets(prev =>
      prev.includes(diet) ? prev.filter(d => d !== diet) : [...prev, diet]
    )
  }

  const filtered = foods.filter(food => {
  if (selectedCategory !== 'All' && food.category !== selectedCategory)
    return false
  if (selectedDiets.length > 0 &&
    !selectedDiets.every(d => food.tags?.includes(d)))
    return false
  if (maxCalories && food.calories > parseInt(maxCalories))
    return false
  if (minProtein && food.protein < parseFloat(minProtein))
    return false
  if (minFat && food.fat < parseFloat(minFat))
    return false
if (maxFat && food.fat > parseFloat(maxFat))
    return false
  if (maxSugar && food.sugar > parseFloat(maxSugar))
    return false
  if (maxCarbs && food.carbs > parseFloat(maxCarbs))
    return false
  if (searchTerm &&
    !food.name?.toLowerCase().includes(searchTerm.toLowerCase()) &&
    !food.brand?.toLowerCase().includes(searchTerm.toLowerCase()))
    return false
  return true
})

  if (loading) return <main className="main"><p>Loading...</p></main>

  return (
    <main className="main">
      <div className="nowz-layout">
        <div className="nowz-header">
          <h2>Nowz Foodz</h2>
          <p>Zero energy to cook? We get it. Browse packaged foods,
          ready-to-eat meals, drinks, and snacks that fit your
          diet — no spoons required.</p>
        </div>

        <div className="nowz-disclaimer">
          ⚠️ Nutritional information is sourced from Open Food Facts
          and is provided as a guide only. Always check the actual
          product label before purchasing or consuming, especially
          if you have food allergies or dietary restrictions.
          Curated Kitchen is not affiliated with any brands listed
          here and does not sell products.
        </div>

        <div className="nowz-content">
          <aside className="nowz-filters">
            <h3>Filters</h3>

            <div className="nowz-filter-group">
              <h4>Search</h4>
              <input
                type="text"
                className="nowz-search"
                placeholder="Search by name or brand..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="nowz-filter-group">
              <h4>Category</h4>
              {categories.map(cat => (
                <label key={cat} className="nowz-radio">
                  <input
                    type="radio"
                    name="category"
                    checked={selectedCategory === cat}
                    onChange={() => setSelectedCategory(cat)}
                  />
                  {cat}
                </label>
              ))}
            </div>

            <div className="nowz-filter-group">
  <h4>Dietary Tags</h4>
  <div className="nowz-diet-scroll">
    {dietFilters.map(diet => (
      <label key={diet} className="nowz-checkbox">
        <input
          type="checkbox"
          checked={selectedDiets.includes(diet)}
          onChange={() => toggleDiet(diet)}
        />
        {diet}
      </label>
    ))}
  </div>
</div>

            <div className="nowz-filter-group">
  <h4>Max Calories</h4>
  <input
    type="text"
    className="nowz-search"
    placeholder="e.g. 200"
    value={maxCalories}
    onChange={e => setMaxCalories(e.target.value.replace(/[^0-9]/g, ''))}
  />
</div>

<div className="nowz-filter-group">
  <h4>Min Fat (g)</h4>
  <input
    type="text"
    className="nowz-search"
    placeholder="e.g. 5"
    value={minFat}
    onChange={e => setMinFat(e.target.value.replace(/[^0-9.]/g, ''))}
  />
</div>

<div className="nowz-filter-group">
  <h4>Max Fat (g)</h4>
  <input
    type="text"
    className="nowz-search"
    placeholder="e.g. 20"
    value={maxFat}
    onChange={e => setMaxFat(e.target.value.replace(/[^0-9.]/g, ''))}
  />
</div>

<div className="nowz-filter-group">
  <h4>Max Carbs (g)</h4>
  <input
    type="text"
    className="nowz-search"
    placeholder="e.g. 5"
    value={maxCarbs}
    onChange={e => setMaxCarbs(e.target.value.replace(/[^0-9.]/g, ''))}
  />
</div>

<div className="nowz-filter-group">
  <h4>Max Sugar (g)</h4>
  <input
    type="text"
    className="nowz-search"
    placeholder="e.g. 2"
    value={maxSugar}
    onChange={e => setMaxSugar(e.target.value.replace(/[^0-9.]/g, ''))}
  />
</div>

<div className="nowz-filter-group">
  <h4>Min Protein (g)</h4>
  <input
    type="text"
    className="nowz-search"
    placeholder="e.g. 10"
    value={minProtein}
    onChange={e => setMinProtein(e.target.value.replace(/[^0-9.]/g, ''))}
  />
</div>

<button
  className="nowz-reset-btn"
  onClick={() => {
    setSelectedCategory('All')
    setSelectedDiets([])
    setMaxCalories('')
    setMinProtein('')
    setMinFat('')
    setMaxFat('')
    setMaxSugar('')
    setMaxCarbs('')
    setSearchTerm('')
  }}
>Reset Filters</button>

          </aside>

          <section className="nowz-results">
            <p className="nowz-count">
              Showing {filtered.length} item{filtered.length !== 1 ? 's' : ''}
            </p>

            {filtered.length === 0 ? (
              <div className="nowz-empty">
                {foods.length === 0
                  ? <p>No items yet — check back soon!</p>
                  : <p>No items match your filters.
                    Try adjusting your search!</p>
                }
              </div>
            ) : (
              <div className="nowz-grid">
                {filtered.map(food => (
                  <div key={food.id} className="nowz-card">
                    {food.image_url && (
                      <img
                        src={food.image_url}
                        alt={food.name}
                        className="nowz-card-image"
                      />
                    )}
                    <div className="nowz-card-header">
                      <div>
                        <h3 className="nowz-name">{food.name}</h3>
                        <p className="nowz-brand">{food.brand}</p>
                      </div>
                      <span className="nowz-category-tag">
                        {food.category}
                      </span>
                    </div>
                    {food.description && (
                      <p className="nowz-description">{food.description}</p>
                    )}
                    <div className="nowz-nutrition">
                      <div className="nowz-nut-item">
                        <span className="nowz-nut-value">{food.calories}</span>
                        <span className="nowz-nut-label">Cal</span>
                      </div>
                      <div className="nowz-nut-item">
                        <span className="nowz-nut-value">{food.protein}g</span>
                        <span className="nowz-nut-label">Protein</span>
                      </div>
                      <div className="nowz-nut-item">
                        <span className="nowz-nut-value">{food.carbs}g</span>
                        <span className="nowz-nut-label">Carbs</span>
                      </div>
                      <div className="nowz-nut-item">
                        <span className="nowz-nut-value">{food.fat}g</span>
                        <span className="nowz-nut-label">Fat</span>
                      </div>
                      {food.fiber > 0 && (
                        <div className="nowz-nut-item">
                          <span className="nowz-nut-value">{food.fiber}g</span>
                          <span className="nowz-nut-label">Fiber</span>
                        </div>
                      )}
                      {food.sugar > 0 && (
                        <div className="nowz-nut-item">
                          <span className="nowz-nut-value">{food.sugar}g</span>
                          <span className="nowz-nut-label">Sugar</span>
                        </div>
                      )}
                      {food.sodium > 0 && (
                        <div className="nowz-nut-item">
                          <span className="nowz-nut-value">{food.sodium}mg</span>
                          <span className="nowz-nut-label">Sodium</span>
                        </div>
                      )}
                    </div>
                    {food.tags?.length > 0 && (
                      <div className="nowz-tags">
                        {food.tags.map(tag => (
                          <span key={tag} className="nowz-tag">{tag}</span>
                        ))}
                      </div>
                    )}
                    <div className="nowz-rating-section">
                      {ratedFoods[food.id] ? (
                        <p className="nowz-rated-thanks">
                          You rated this {ratedFoods[food.id]} star{ratedFoods[food.id] !== 1 ? 's' : ''}!
                        </p>
                      ) : (
                        <div className="nowz-rate-row">
                          <span className="nowz-rate-label">Rate:</span>
                          {[1,2,3,4,5].map(star => (
                            <button
                              key={star}
                              className={`nowz-star ${(hoverRating[food.id] || 0) >= star ? 'active' : ''}`}
                              onMouseEnter={() => setHoverRating(prev => ({ ...prev, [food.id]: star }))}
                              onMouseLeave={() => setHoverRating(prev => ({ ...prev, [food.id]: 0 }))}
                              onClick={() => handleRate(food.id, star)}
                            >★</button>
                          ))}
                        </div>
                      )}
                      <span className="nowz-rating-count">
                        {[1,2,3,4,5].map(star => (
                          <span key={star} style={{color: food.rating >= star ? '#7b1f4a' : '#ddd'}}>★</span>
                        ))}
                        {' '}({food.rating_count || 0} ratings)
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  )
}

export default NowzFoodz