import './RecipeCard.css'

function RecipeCard({ title, description, tags, spoonScore, rating, ratingCount, image, isWellSeasoned, isTrustedChef, link }) {
  return (
    <a href={link} className="card-link">
      <div className="recipe-card">
        <div className="card-image-wrapper">
          <img src={image} alt={title} />
          {isWellSeasoned && (
            <div className="well-seasoned-badge">🏅 Well Seasoned</div>
          )}
        </div>
        <div className="card-body">
         <h3>{title}</h3>
{isTrustedChef && (
  <span className="trusted-chef-tag">👨‍🍳 Trusted Chef</span>
)}
          <div className="tags">
            {tags.map((tag, index) => (
              <span key={index} className="tag">{tag}</span>
            ))}
          </div>
          <p className="card-description">{description}</p>
          <div className="recipe-meta">
            <span className="spoon-score">🥄 {spoonScore}/10 spoons</span>
            <span className="rating">★ {rating} ({ratingCount} ratings)</span>
          </div>
        </div>
      </div>
    </a>
  )
}

export default RecipeCard