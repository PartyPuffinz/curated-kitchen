import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import RecipeCard from '../components/RecipeCard'

function Home() {
  const [recipes, setRecipes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchRecipes() {
      const { data, error } = await supabase
        .from('recipes')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching recipes:', error)
      } else {
        setRecipes(data)
      }
      setLoading(false)
    }
    fetchRecipes()
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