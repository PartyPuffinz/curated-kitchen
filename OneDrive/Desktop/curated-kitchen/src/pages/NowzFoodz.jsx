import { useState } from 'react'
import './NowzFoodz.css'

const categories = [
  'All', 'Energy Drinks', 'Protein Bars', 'Snacks',
  'Frozen Meals', 'Ready to Eat', 'Drinks', 'Desserts'
]

const dietFilters = [
  'Keto', 'Low-carb', 'Gluten-free', 'Dairy-free',
  'Vegan', 'Vegetarian', 'Nut-free'
]

const foods = [
  {
    id: 1,
    name: 'Gatorade Zero',
    brand: 'Gatorade',
    category: 'Drinks',
    tags: ['Keto', 'Low-carb', 'Gluten-free', 'Dairy-free', 'Vegan'],
    calories: 5,
    protein: 0,
    carbs: 1,
    fat: 0,
    description: 'Electrolyte drink with zero sugar. Great for hydration on low-carb diets.',
    rating: 4.2,
    ratingCount: 18,
    spoons: 0
  },
  {
    id: 2,
    name: 'Alani Nu Energy',
    brand: 'Alani Nu',
    category: 'Energy Drinks',
    tags: ['Keto', 'Low-carb', 'Gluten-free', 'Dairy-free', 'Vegan'],
    calories: 10,
    protein: 0,
    carbs: 3,
    fat: 0,
    description: 'Zero sugar energy drink with 200mg caffeine. Available in many flavors.',
    rating: 4.5,
    ratingCount: 24,
    spoons: 0
  },
  {
    id: 3,
    name: 'GHOST Energy',
    brand: 'GHOST',
    category: 'Energy Drinks',
    tags: ['Keto', 'Low-carb', 'Gluten-free', 'Dairy-free', 'Vegan'],
    calories: 5,
    protein: 0,
    carbs: 1,
    fat: 0,
    description: 'Natural caffeine energy drink with transparent labeling.',
    rating: 4.3,
    ratingCount: 15,
    spoons: 0
  },
  {
    id: 4,
    name: 'Bang Energy',
    brand: 'Bang',
    category: 'Energy Drinks',
    tags: ['Keto', 'Low-carb', 'Gluten-free', 'Dairy-free', 'Vegan'],
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    description: 'Zero calorie energy drink with 300mg caffeine and BCAAs.',
    rating: 3.8,
    ratingCount: 31,
    spoons: 0
  },
  {
    id: 5,
    name: 'Reign Energy',
    brand: 'Reign',
    category: 'Energy Drinks',
    tags: ['Keto', 'Low-carb', 'Gluten-free', 'Dairy-free', 'Vegan'],
    calories: 10,
    protein: 0,
    carbs: 3,
    fat: 0,
    description: 'Performance energy drink with 300mg natural caffeine and BCAAs.',
    rating: 4.0,
    ratingCount: 12,
    spoons: 0
  }
]

function NowzFoodz() {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedDiets, setSelectedDiets] = useState([])
  const [maxCalories, setMaxCalories] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  function toggleDiet(diet) {
    setSelectedDiets(prev =>
      prev.includes(diet) ? prev.filter(d => d !== diet) : [...prev, diet]
    )
  }

  const filtered = foods.filter(food => {
    if (selectedCategory !== 'All' && food.category !== selectedCategory)
      return false
    if (selectedDiets.length > 0 &&
      !selectedDiets.every(d => food.tags.includes(d)))
      return false
    if (maxCalories && food.calories > parseInt(maxCalories))
      return false
    if (searchTerm && !food.name.toLowerCase().includes(
      searchTerm.toLowerCase()) &&
      !food.brand.toLowerCase().includes(searchTerm.toLowerCase()))
      return false
    return true
  })

  return (
    <main className="main">
      <div className="nowz-layout">
        <div className="nowz-header">
          <h2>Nowz Foodz 🛒</h2>
          <p>Zero energy to cook? We get it. Browse packaged foods,
          ready-to-eat meals, drinks, and snacks that fit your diet —
          no spoons required.</p>
        </div>

        <div className="nowz-disclaimer">
          ⚠️ Nutrition information is approximate and based on
          standard serving sizes. Always check the label before
          purchasing, especially if you have allergies.
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

            <div className="nowz-filter-group">
              <h4>Max Calories</h4>
              <input
                type="text"
                className="nowz-search"
                placeholder="e.g. 200"
                value={maxCalories}
                onChange={e => setMaxCalories(
                  e.target.value.replace(/[^0-9]/g, '')
                )}
              />
            </div>
          </aside>

          <section className="nowz-results">
            <p className="nowz-count">
              Showing {filtered.length} item{filtered.length !== 1 ? 's' : ''}
            </p>
            {filtered.length === 0 ? (
              <div className="nowz-empty">
                <p>No items match your filters.
                Try adjusting your search!</p>
              </div>
            ) : (
              <div className="nowz-grid">
                {filtered.map(food => (
                  <div key={food.id} className="nowz-card">
                    <div className="nowz-card-header">
                      <div>
                        <h3 className="nowz-name">{food.name}</h3>
                        <p className="nowz-brand">{food.brand}</p>
                      </div>
                      <span className="nowz-category-tag">
                        {food.category}
                      </span>
                    </div>
                    <p className="nowz-description">{food.description}</p>
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
                    </div>
                    <div className="nowz-tags">
                      {food.tags.map(tag => (
                        <span key={tag} className="nowz-tag">{tag}</span>
                      ))}
                    </div>
                    <div className="nowz-rating">
                      {[1,2,3,4,5].map(star => (
                        <span key={star}>
                          {food.rating >= star ? '★' : '☆'}
                        </span>
                      ))}
                      <span className="nowz-rating-count">
                        ({food.ratingCount} ratings)
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