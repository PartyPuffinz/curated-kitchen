import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import RecipeCard from '../components/RecipeCard'
import './TrustedChefProfile.css'

const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9yZnNnZmR2b2ppaGRkZXdvcnV6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYwMTMxODYsImV4cCI6MjA5MTU4OTE4Nn0.lQuHjktlnZmv6BGZrZxQ4gQl_WBQysF2vEjZv38Z-0A'
const DB = 'https://orfsgfdvojihddeworuz.supabase.co'
const HEADERS = { 'apikey': ANON_KEY, 'Authorization': `Bearer ${ANON_KEY}` }

function TrustedChefProfile() {
  const { username } = useParams()
  const [profile, setProfile] = useState(null)
  const [recipes, setRecipes] = useState([])
  const [remixes, setRemixes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${DB}/rest/v1/profiles?username=eq.${username}&select=*`, { headers: HEADERS })
      .then(res => res.json())
      .then(data => {
        const p = data?.[0]
        if (!p || !p.is_trusted_chef) { setLoading(false); return }
        setProfile(p)
        return fetch(`${DB}/rest/v1/recipes?uploaded_by=eq.${p.id}&order=rating.desc&select=*`, { headers: HEADERS })
      })
      .then(res => res?.json())
      .then(data => {
        if (!data) return
        const all = Array.isArray(data) ? data : []
        setRecipes(all.filter(r => !r.is_remix).slice(0, 10))
        setRemixes(all.filter(r => r.is_remix).slice(0, 6))
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [username])

  if (loading) return <main className="main"><p>Loading...</p></main>

  if (!profile) {
    return (
      <main className="main">
        <div className="not-found">
          <h2>Chef Not Found</h2>
          <p>This profile doesn't exist or is no longer a Trusted Chef.</p>
          <Link to="/browse" className="view-btn">Browse Recipes</Link>
        </div>
      </main>
    )
  }

  const topRecipes = [...recipes].sort((a, b) => b.rating - a.rating).slice(0, 4)
  const newRecipes = [...recipes].sort((a, b) =>
    new Date(b.created_at) - new Date(a.created_at)).slice(0, 4)

  return (
    <main className="main">
      <div className="tc-profile-header">
        <div className="tc-profile-avatar">
          {profile.avatar_url
            ? <img src={profile.avatar_url} alt={profile.username} />
            : <div className="tc-avatar-placeholder">👨‍🍳</div>
          }
        </div>
        <div className="tc-profile-info">
          <div className="tc-profile-name-row">
            <h2>{profile.username}</h2>
            <span className="trusted-chef-tag">👨‍🍳 Trusted Chef</span>
          </div>
          {profile.bio && <p className="tc-profile-bio">{profile.bio}</p>}
          <p className="tc-profile-stats">
            {recipes.length} recipe{recipes.length !== 1 ? 's' : ''} uploaded
          </p>
        </div>
      </div>

      {topRecipes.length > 0 && (
        <section className="recipe-section">
          <h2>Top Recipes</h2>
          <div className="recipe-row">
            {topRecipes.map(recipe => (
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

      {newRecipes.length > 0 && (
        <section className="recipe-section">
          <h2>Newest Recipes</h2>
          <div className="recipe-row">
            {newRecipes.map(recipe => (
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

      {remixes.length > 0 && (
        <section className="recipe-section">
          <h2>Remixes</h2>
          <div className="recipe-row">
            {remixes.map(recipe => (
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

export default TrustedChefProfile