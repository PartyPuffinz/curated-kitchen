import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import './RecipePage.css'
import { calculateRecipeNutrition } from '../utils/nutrition'

function RecipePage() {
  const { slug } = useParams()
  const [recipe, setRecipe] = useState(null)
  const [loading, setLoading] = useState(true)
  const [nutrition, setNutrition] = useState(null)
const [nutritionLoading, setNutritionLoading] = useState(false)

  useEffect(() => {
  fetch(`https://orfsgfdvojihddeworuz.supabase.co/rest/v1/recipes?slug=eq.${slug}&select=*`, {
    headers: {
      'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9yZnNnZmR2b2ppaGRkZXdvcnV6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYwMTMxODYsImV4cCI6MjA5MTU4OTE4Nn0.lQuHjktlnZmv6BGZrZxQ4gQl_WBQysF2vEjZv38Z-0A',
      'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9yZnNnZmR2b2ppaGRkZXdvcnV6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYwMTMxODYsImV4cCI6MjA5MTU4OTE4Nn0.lQuHjktlnZmv6BGZrZxQ4gQl_WBQysF2vEjZv38Z-0A'
    }
  })
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
          <h2>{recipe.title}</h2>
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
            <div className="nutrition-facts">
  <h4>Nutrition per serving</h4>
  <p className="nutrition-serves">Recipe serves {recipe.portions}</p>
  {nutritionLoading && <p className="nutrition-loading">
    Calculating nutrition facts...</p>}
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

        </div>
      </div>
    </main>
  )
}

export default RecipePage