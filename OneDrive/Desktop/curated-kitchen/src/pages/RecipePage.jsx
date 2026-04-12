import { useParams, Link } from 'react-router-dom'
import './RecipePage.css'

const recipes = {
  'chicken-mushroom-gravy': {
    title: "Chicken & Mushroom Gravy",
    description: "A delicious mouth-watering mushroom gravy with tender chicken breast.",
    tags: ["Keto", "Paleo", "Gluten-free", "Low-carb", "American"],
    spoonScore: 4,
    rating: 5,
    ratingCount: 24,
    portions: 4,
    image: "https://placehold.co/800x400",
    isWellSeasoned: true,
    isTrustedChef: true,
    cleanup: "High",
    ingredients: [
      "1¼ lb chicken breast",
      "2 Tbsp butter (divided)",
      "1c chicken broth",
      "⅔c heavy whipping cream",
      "¼c parmesan cheese, grated",
      "½ tsp xanthan gum",
      "½c diced onion",
      "2 garlic cloves, minced",
      "8oz mushrooms, chopped",
      "½ tsp oregano",
      "¼ tsp thyme",
      "¼ tsp parsley",
    ],
    steps: [
      "Using a large cast iron pot, sauté ½c diced onion, 2 minced garlic cloves, and 8oz chopped mushrooms in 1 Tbsp butter for approximately 6 minutes or until cooked through.",
      "Remove the onion, garlic and mushroom mixture from the cast iron pot and set aside.",
      "Add remaining 1 Tbsp butter to the cast iron pot, add the 1¼lb chicken breast, and brown on both sides.",
      "Add the onion, garlic and mushroom mixture back into the pot with the chicken.",
      "⚠️ Do NOT add xanthan gum in this step — Add ⅔c heavy whipping cream, 1c chicken broth, ¼c grated parmesan cheese, ½ tsp oregano, ¼ tsp thyme, and ¼ tsp parsley, then simmer on medium-low heat with lid on for 20 minutes.",
      "Remove lid, sprinkle in ½ tsp xanthan gum, and continue simmering on medium-low until sauce thickens. Note: almond flour may be substituted for xanthan gum as a thickener.",
    ]
  }
}

function RecipePage() {
  const { slug } = useParams()
  const recipe = recipes[slug]

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
        <img src={recipe.image} alt={recipe.title} />

        <div className="recipe-page-body">
          <h2>
            {recipe.title}
            {recipe.isTrustedChef && (
              <span className="trusted-chef-tag">👨‍🍳 Trusted Chef</span>
            )}
            {recipe.isWellSeasoned && (
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
    <span>🥄 {recipe.spoonScore}/10 spoons</span>
    <span>🧹 {recipe.cleanup} cleanup</span>
  </div>
  <div className="meta-row">
    <span>{'★'.repeat(recipe.rating)}{'☆'.repeat(5 - recipe.rating)}</span>
    <span>{recipe.ratingCount} ratings</span>
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