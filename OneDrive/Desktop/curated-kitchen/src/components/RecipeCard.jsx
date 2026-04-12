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
            <span className="rating">
  {[1,2,3,4,5].map(star => {
    if (rating >= star) return <span key={star}>★</span>
    if (rating >= star - 0.5) return <span key={star}>½</span>
    return <span key={star}>☆</span>
  })}
  <span className="rating-count"> ({ratingCount} ratings)</span>
</span>
          </div>
        </div>
      </div>
    </a>
  )
}

export default RecipeCard