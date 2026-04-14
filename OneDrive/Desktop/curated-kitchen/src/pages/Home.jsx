import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import RecipeCard from '../components/RecipeCard'

const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9yZnNnZmR2b2ppaGRkZXdvcnV6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYwMTMxODYsImV4cCI6MjA5MTU4OTE4Nn0.lQuHjktlnZmv6BGZrZxQ4gQl_WBQysF2vEjZv38Z-0A'
const DB = 'https://orfsgfdvojihddeworuz.supabase.co'
const HEADERS = { 'apikey': ANON_KEY, 'Authorization': `Bearer ${ANON_KEY}` }

function Home() {
  const [recipes, setRecipes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${DB}/rest/v1/recipes?select=*&order=created_at.desc`, {
      headers: HEADERS
    })
    .then(res => res.json())
    .then(data => {
      setRecipes(Array.isArray(data) ? data : [])
      setLoading(false)
    })
    .catch(err => {
      console.error('Fetch error:', err)
      setLoading(false)
    })
  }, [])

  if (loading) return <main className="main"><p>Loading...</p></main>

  return (
    <main className="main">

      <section className="hero">
        <h2>Recipes for every body, every culture, every ability.</h2>
        <p>Filter by diet, exclude ingredients, and find recipes
        that work for your energy level today.</p>
        <Link to="/browse" className="view-btn">Browse Recipes</Link>
      </section>

      <section className="category-section">
        <h2>Browse by Category</h2>
        <div className="category-grid">
          <Link to="/browse?diet=Keto" className="category-tile">Keto</Link>
          <Link to="/browse?diet=Paleo" className="category-tile">Paleo</Link>
          <Link to="/browse?diet=Halal" className="category-tile">Halal</Link>
          <Link to="/browse?diet=Latin" className="category-tile">Latin</Link>
          <Link to="/browse?diet=Gluten-free"
          className="category-tile">Gluten-free</Link>
          <Link to="/browse?diet=Low-carb"
          className="category-tile">Low-carb</Link>
        </div>
      </section>

      <section className="recipe-section">
        <h2>Recently Added</h2>
        <div className="recipe-row">
          {recipes.slice(0, 4).map(recipe => (
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

      <section className="recipe-section">
        <h2>Most Popular</h2>
        <div className="recipe-row">
          {recipes.slice(0, 4).map(recipe => (
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

      <section className="last-viewed">
        <h2>Recently Viewed</h2>
        <div className="recipe-row">
          {recipes.slice(0, 1).map(recipe => (
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

    </main>
  )
}

export default Home