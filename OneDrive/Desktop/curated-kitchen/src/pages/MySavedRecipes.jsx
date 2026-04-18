import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import RecipeCard from '../components/RecipeCard'
import './MySavedRecipes.css'

const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9yZnNnZmR2b2ppaGRkZXdvcnV6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYwMTMxODYsImV4cCI6MjA5MTU4OTE4Nn0.lQuHjktlnZmv6BGZrZxQ4gQl_WBQysF2vEjZv38Z-0A'
const DB = 'https://orfsgfdvojihddeworuz.supabase.co'
const HEADERS = { 'apikey': ANON_KEY, 'Authorization': `Bearer ${ANON_KEY}` }

function MySavedRecipes() {
  const [recipes, setRecipes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const keys = Object.keys(localStorage)
    for (const key of keys) {
      if (key.startsWith('sb-') && key.includes('auth')) {
        try {
          const parsed = JSON.parse(localStorage.getItem(key))
          const u = parsed?.user
          if (u) {
            fetch(
              `${DB}/rest/v1/saved_recipes?user_id=eq.${u.id}&select=recipe_id,recipes(*)`,
              { headers: HEADERS }
            )
              .then(res => res.json())
              .then(data => {
                const saved = Array.isArray(data)
                  ? data.map(d => d.recipes).filter(Boolean)
                  : []
                setRecipes(saved)
                setLoading(false)
              })
            break
          }
        } catch(e) {}
      }
    }
  }, [])

  if (loading) return <main className="main"><p>Loading...</p></main>

  return (
    <main className="main">
      <div className="saved-recipes-layout">
        <div className="saved-recipes-header">
          <h2>My Saved Recipes</h2>
          <Link to="/browse" className="view-btn">Browse More Recipes</Link>
        </div>

        {recipes.length === 0 ? (
          <div className="saved-recipes-empty">
            <p>You haven't saved any recipes yet.</p>
            <Link to="/browse" className="view-btn">
            Browse recipes to save</Link>
          </div>
        ) : (
          <>
            <p className="saved-recipes-count">
              {recipes.length} saved recipe{recipes.length !== 1 ? 's' : ''}
            </p>
            <div className="recipe-row">
              {recipes.map(recipe => (
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
          </>
        )}
      </div>
    </main>
  )
}

export default MySavedRecipes