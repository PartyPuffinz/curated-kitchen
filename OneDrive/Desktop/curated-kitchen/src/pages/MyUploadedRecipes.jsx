import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import RecipeCard from '../components/RecipeCard'
import './MyUploadedRecipes.css'

const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9yZnNnZmR2b2ppaGRkZXdvcnV6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYwMTMxODYsImV4cCI6MjA5MTU4OTE4Nn0.lQuHjktlnZmv6BGZrZxQ4gQl_WBQysF2vEjZv38Z-0A'
const DB = 'https://orfsgfdvojihddeworuz.supabase.co'
const HEADERS = { 'apikey': ANON_KEY, 'Authorization': `Bearer ${ANON_KEY}` }

function MyUploadedRecipes() {
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
              `${DB}/rest/v1/recipes?uploaded_by=eq.${u.id}&order=created_at.desc&select=*`,
              { headers: HEADERS }
            )
              .then(res => res.json())
              .then(data => {
                setRecipes(Array.isArray(data) ? data : [])
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
      <div className="my-recipes-layout">
        <div className="my-recipes-header">
          <h2>My Uploaded Recipes</h2>
          <Link to="/upload" className="view-btn">+ Upload New Recipe</Link>
        </div>

        {recipes.length === 0 ? (
          <div className="my-recipes-empty">
            <p>You haven't uploaded any recipes yet.</p>
            <Link to="/upload" className="view-btn">
            Upload your first recipe</Link>
          </div>
        ) : (
          <>
            <p className="my-recipes-count">
              {recipes.length} recipe{recipes.length !== 1 ? 's' : ''} uploaded
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

export default MyUploadedRecipes