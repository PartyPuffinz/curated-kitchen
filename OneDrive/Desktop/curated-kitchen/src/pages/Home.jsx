import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import RecipeCard from '../components/RecipeCard'

const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9yZnNnZmR2b2ppaGRkZXdvcnV6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYwMTMxODYsImV4cCI6MjA5MTU4OTE4Nn0.lQuHjktlnZmv6BGZrZxQ4gQl_WBQysF2vEjZv38Z-0A'
const DB = 'https://orfsgfdvojihddeworuz.supabase.co'
const HEADERS = { 'apikey': ANON_KEY, 'Authorization': `Bearer ${ANON_KEY}` }

function NowzCard({ food }) {
  return (
    <Link to="/nowz-foodz" className="nowz-home-card">
      {food.image_url && (
        <img src={food.image_url} alt={food.name} className="nowz-home-img" />
      )}
      <div className="nowz-home-info">
        <p className="nowz-home-name">{food.name}</p>
        <p className="nowz-home-brand">{food.brand}</p>
        <p className="nowz-home-cal">{food.calories} cal</p>
        <div className="nowz-home-stars">
          {[1,2,3,4,5].map(star => (
            <span key={star} style={{
              color: food.rating >= star ? '#7b1f4a' : '#ddd'
            }}>★</span>
          ))}
        </div>
      </div>
    </Link>
  )
}

function Home() {
  const [recipes, setRecipes] = useState([])
  const [nowzTopRated, setNowzTopRated] = useState([])
  const [nowzNewest, setNowzNewest] = useState([])
  const [recentlyViewedRecipes, setRecentlyViewedRecipes] = useState([])
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

  useEffect(() => {
    fetch(
      `${DB}/rest/v1/nowz_foodz?is_approved=eq.true&order=rating.desc&limit=4&select=*`,
      { headers: HEADERS }
    )
      .then(res => res.json())
      .then(data => setNowzTopRated(Array.isArray(data) ? data : []))
      .catch(() => {})
  }, [])

  useEffect(() => {
    fetch(
      `${DB}/rest/v1/nowz_foodz?is_approved=eq.true&order=created_at.desc&limit=4&select=*`,
      { headers: HEADERS }
    )
      .then(res => res.json())
      .then(data => setNowzNewest(Array.isArray(data) ? data : []))
      .catch(() => {})
  }, [])

  useEffect(() => {
    try {
      const stored = localStorage.getItem('recently-viewed-recipes')
      if (stored) {
        const parsed = JSON.parse(stored)
        if (Array.isArray(parsed) && parsed.length > 0) {
          setRecentlyViewedRecipes(parsed.slice(0, 4))
        }
      }
    } catch(e) {}
  }, [])

  if (loading) return <main className="main"><p>Loading...</p></main>

  return (
    <main className="main">

      <section className="hero">
        <h2>Recipes for every body, every culture, every ability.</h2>
        <p>Filter by diet, exclude ingredients, and find recipes
        that work for your energy level today.</p>
        <div className="hero-btns">
          <Link to="/browse" className="view-btn">Browse Recipes</Link>
          <Link to="/nowz-foodz" className="view-btn">Nowz Foodz</Link>
        </div>
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
        <h2>Recently Added Recipes</h2>
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
        <h2>Most Popular Recipes</h2>
        <div className="recipe-row">
          {[...recipes]
            .sort((a, b) => b.rating - a.rating)
            .slice(0, 4)
            .map(recipe => (
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



      {(nowzTopRated.length > 0 || nowzNewest.length > 0) && (
        <section className="recipe-section">
          <div className="section-header-row">
            <h2>Nowz Foodz 🛒</h2>
            <Link to="/nowz-foodz" className="section-see-all">
              See all →</Link>
          </div>

          {nowzTopRated.length > 0 && (
            <>
              <h3 className="nowz-sub-heading">Top Rated</h3>
              <div className="nowz-home-row">
                {nowzTopRated.map(food => (
                  <NowzCard key={food.id} food={food} />
                ))}
              </div>
            </>
          )}

          {nowzNewest.length > 0 && (
            <>
              <h3 className="nowz-sub-heading">Recently Added</h3>
              <div className="nowz-home-row">
                {nowzNewest.map(food => (
                  <NowzCard key={food.id} food={food} />
                ))}
              </div>
            </>
          )}
        </section>
      )}

      {recentlyViewedRecipes.length > 0 && (
        <section className="recipe-section">
          <h2>Recently Viewed</h2>
          <div className="recipe-row">
            {recentlyViewedRecipes.map(recipe => (
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
      )}

    </main>
  )
}

export default Home