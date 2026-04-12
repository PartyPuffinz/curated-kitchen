import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'
import { useSearchParams } from 'react-router-dom'
import RecipeCard from '../components/RecipeCard'
import CustomSelect from '../components/CustomSelect'
import './Browse.css'



const dietOptions = [
  "Keto", "Paleo", "Halal", "Kosher", "Gluten-free", "Vegan",
  "Vegetarian", "Low-carb", "Dairy-free", "Nut-free",
  "Diabetic-friendly", "AIP", "Whole30", "Mediterranean",
  "DASH", "Low-sodium"
]

const cuisineOptions = [
  "American", "Latin / Mexican", "Caribbean", "Italian",
  "Mediterranean", "Middle Eastern", "Persian", "Turkish",
  "Greek", "West African", "East African", "Ethiopian",
  "South Asian / Indian", "East Asian", "Chinese", "Japanese",
  "Korean", "Southeast Asian", "Filipino", "Eastern European",
  "Southern American", "Indigenous / Native", "Pacific Islander"
]

const ingredients = [
  "salmon", "tuna", "shrimp", "chicken", "chicken breast",
  "beef", "ground beef", "pork", "bacon", "turkey", "lamb",
  "egg", "eggs", "milk", "butter", "cream cheese", "parmesan",
  "flour", "almond flour", "sugar", "honey", "olive oil",
  "garlic", "onion", "tomato", "mushroom", "bell pepper",
  "potato", "carrot", "broccoli", "spinach", "avocado",
  "lemon", "lime", "rice", "pasta", "quinoa", "oats",
  "black beans", "chickpeas", "chocolate", "vanilla",
  "cinnamon", "cumin", "paprika", "oregano", "thyme",
  "chicken broth", "beef broth", "coconut milk", "soy sauce",
  "xanthan gum", "heavy whipping cream", "parsley"
]

function Browse() {
  const [searchParams] = useSearchParams()
  const [allRecipes, setAllRecipes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchRecipes() {
      const { data, error } = await supabase
        .from('recipes')
        .select('*')
      if (error) {
        console.error('Error fetching recipes:', error)
      } else {
        setAllRecipes(data)
      }
      setLoading(false)
    }
    fetchRecipes()
  }, [])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDiets, setSelectedDiets] = useState([])
  const [selectedCuisines, setSelectedCuisines] = useState([])
  const [maxSpoon, setMaxSpoon] = useState(10)
  const [minRating, setMinRating] = useState(0)
  const [excludedIngredients, setExcludedIngredients] = useState([])
  const [excludeInput, setExcludeInput] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [source, setSource] = useState('all')

  const [sortBy, setSortBy] = useState('newest')
const [perPage, setPerPage] = useState(25)

  useEffect(() => {
    const diet = searchParams.get('diet')
    if (diet) {
      const matched = dietOptions.find(
        d => d.toLowerCase() === diet.toLowerCase()
      )
      if (matched) setSelectedDiets([matched])
    }
  }, [searchParams])

  const handleDietChange = (diet) => {
    setSelectedDiets(prev =>
      prev.includes(diet) ? prev.filter(d => d !== diet) : [...prev, diet]
    )
  }

  const handleCuisineChange = (cuisine) => {
    setSelectedCuisines(prev =>
      prev.includes(cuisine) ? prev.filter(c => c !== cuisine) : [...prev, cuisine]
    )
  }

  const handleExcludeInput = (val) => {
    setExcludeInput(val)
    if (val.length < 2) { setSuggestions([]); return }
    const matches = ingredients.filter(i =>
      i.toLowerCase().includes(val.toLowerCase())
    ).slice(0, 5)
    setSuggestions(matches)
  }

  const addExclusion = (ingredient) => {
    if (excludedIngredients.length >= 1) {
      alert('Sign in to exclude more ingredients.')
      return
    }
    if (!excludedIngredients.includes(ingredient)) {
      setExcludedIngredients(prev => [...prev, ingredient])
    }
    setExcludeInput('')
    setSuggestions([])
  }

  const removeExclusion = (ingredient) => {
    setExcludedIngredients(prev => prev.filter(i => i !== ingredient))
  }

  const filteredRecipes = allRecipes
  .filter(recipe => {
    if (searchTerm && !recipe.title.toLowerCase().includes(
      searchTerm.toLowerCase())) return false
    if (selectedDiets.length > 0 && !selectedDiets.some(
      d => recipe.tags.includes(d))) return false
    if (selectedCuisines.length > 0 && !selectedCuisines.some(
      c => recipe.tags.includes(c))) return false
    if (recipe.spoonScore > maxSpoon) return false
    if (recipe.rating < minRating) return false
    if (excludedIngredients.some(
      i => recipe.title.toLowerCase().includes(i))) return false
    if (source === 'wellSeasoned' && !recipe.isWellSeasoned) return false
    if (source === 'trustedChef' && !recipe.isTrustedChef) return false
    return true
  })
  .sort((a, b) => {
    if (sortBy === 'highest') return b.rating - a.rating
    if (sortBy === 'spoon-asc') return a.spoonScore - b.spoonScore
    if (sortBy === 'spoon-desc') return b.spoonScore - a.spoonScore
    if (sortBy === 'oldest') return a.id - b.id
    return b.id - a.id
  })
  .slice(0, perPage)


  if (loading) return <div className="browse-layout"><p>Loading...</p></div>

  return (
    <div className="browse-layout">

      <aside className="filters">
        <h2>Filters</h2>

        <div className="filter-group">
          <h3>Diet</h3>
          <div className="filter-scroll">
            {dietOptions.map(diet => (
              <label key={diet}>
                <input
                  type="checkbox"
                  checked={selectedDiets.includes(diet)}
                  onChange={() => handleDietChange(diet)}
                />
                {diet}
              </label>
            ))}
          </div>
        </div>

        <div className="filter-group">
          <h3>Cuisine</h3>
          <div className="filter-scroll">
            {cuisineOptions.map(cuisine => (
              <label key={cuisine}>
                <input
                  type="checkbox"
                  checked={selectedCuisines.includes(cuisine)}
                  onChange={() => handleCuisineChange(cuisine)}
                />
                {cuisine}
              </label>
            ))}
          </div>
        </div>

        <div className="filter-group">
          <h3>Recipe Source</h3>
          <label>
            <input type="radio" name="source" checked={source === 'all'}
            onChange={() => setSource('all')} /> All recipes
          </label>
          <label>
            <input type="radio" name="source" checked={source === 'trustedChef'}
            onChange={() => setSource('trustedChef')} /> Trusted Chefs only
          </label>
          <label>
            <input type="radio" name="source" checked={source === 'wellSeasoned'}
            onChange={() => setSource('wellSeasoned')} /> Well Seasoned badge only
          </label>
          <label>
            <input type="radio" name="source" checked={source === 'userSubmitted'}
            onChange={() => setSource('userSubmitted')} /> All user submitted
          </label>
        </div>

        <div className="filter-group">
          <h3>Max Spoon Score</h3>
          <input
            type="range" min="1" max="10"
            value={maxSpoon}
            onChange={e => setMaxSpoon(Number(e.target.value))}
            className="effort-slider"
          />
          <p className="slider-label">Up to {maxSpoon}/10 spoons</p>
        </div>

        <div className="filter-group">
          <h3>Minimum Rating</h3>
          <label><input type="radio" name="rating"
          onChange={() => setMinRating(5)} /> ★★★★★ 5 only</label>
          <label><input type="radio" name="rating"
          onChange={() => setMinRating(4)} /> ★★★★☆ 4+</label>
          <label><input type="radio" name="rating"
          onChange={() => setMinRating(3)} /> ★★★☆☆ 3+</label>
          <label><input type="radio" name="rating"
          onChange={() => setMinRating(0)} defaultChecked /> Any</label>
        </div>

        <div className="filter-group">
          <h3>Exclude Ingredients</h3>
          <div className="exclude-wrapper">
            <input
              type="text"
              className="exclude-input"
              placeholder="Type an ingredient..."
              value={excludeInput}
              onChange={e => handleExcludeInput(e.target.value)}
            />
            {suggestions.length > 0 && (
              <div className="suggestions-box">
                {suggestions.map(s => (
                  <div key={s} className="suggestion-item"
                  onClick={() => addExclusion(s)}>{s}</div>
                ))}
              </div>
            )}
          </div>
          <div className="exclude-tags">
            {excludedIngredients.map(i => (
              <div key={i} className="exclude-tag">
                {i}
                <span className="remove-tag"
                onClick={() => removeExclusion(i)}>×</span>
              </div>
            ))}
          </div>
        </div>

      </aside>

      <section className="results">
       <div className="results-header">
  <h2>All Recipes</h2>
  <p className="results-count">
    Showing {filteredRecipes.length} recipe{filteredRecipes.length !== 1 ? 's' : ''}
  </p>
</div>

<div className="sort-bar">
  <label className="sort-label">Sort by</label>
  <CustomSelect
    value={sortBy}
    onChange={setSortBy}
    options={[
      { value: 'newest', label: 'Most recently uploaded' },
      { value: 'oldest', label: 'Oldest first' },
      { value: 'highest', label: 'Highest rated' },
      { value: 'spoon-asc', label: 'Spoon score — low to high' },
      { value: 'spoon-desc', label: 'Spoon score — high to low' },
    ]}
  />
  <label className="sort-label">Show</label>
  <CustomSelect
    value={perPage}
    onChange={val => setPerPage(Number(val))}
    options={[
      { value: 25, label: '25 per page' },
      { value: 10, label: '10 per page' },
      { value: 50, label: '50 per page' },
      { value: 100, label: '100 per page' },
    ]}
  />
</div>

        <div className="search-bar-wrapper">
          <input
            type="text"
            className="recipe-search-bar"
            placeholder="Search recipes by name..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="recipe-row">
         {filteredRecipes.map(recipe => (
  <RecipeCard
    key={recipe.id}
    title={recipe.title}
    description={recipe.description}
    tags={recipe.tags}
    spoonScore={recipe.spoon_score}
    rating={recipe.rating}
    ratingCount={recipe.rating_count}
    image={recipe.image_url}
    isWellSeasoned={recipe.is_well_seasoned}
    isTrustedChef={recipe.is_trusted_chef}
    link={`/recipes/${recipe.slug}`}
  />
))}
        </div>

      </section>

    </div>
  )
}

export default Browse
