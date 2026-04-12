import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import './RecipePage.css'

function RecipePage() {
  const { slug } = useParams()
  const [recipe, setRecipe] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchRecipe() {
      const { data, error } = await supabase
        .from('recipes')
        .select('*')
        .eq('slug', slug)
        .single()

      if (error) {
        console.error('Error fetching recipe:', error)
      } else {
        setRecipe(data)
      }
      setLoading(false)
    }
    fetchRecipe()
  }, [slug])

  if (loading) return <main className="main"><p>Loading...</p></main>

  if (!recipe) {
    return (
      <main className="main">
        <h2>Recipe not found</h2>
        <Link to="/browse" className="back-btn">← Back to Browse</Link>
      </main>
    )
  }

  return (
    <main className="main">
      <Link to="/browse" className="back-btn">← Back to Browse</Link>

      <div className="recipe-page">
        <img src={recipe.image_url} alt={recipe.title} />

        <div className="recipe-page-body">
          <h2>
            {recipe.title}
            {recipe.is_trusted_chef && (
              <span className="trusted-chef-tag">👨‍🍳 Trusted Chef</span>
            )}
            {recipe.is_well_seasoned && (
              <span className="well-seasoned-tag">🏅 Well Seasoned</span>
            )}
          </h2>

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
            <div className="meta-row nutrition-placeholder">
              <span>Serves {recipe.portions} — Nutrition facts coming soon</span>
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