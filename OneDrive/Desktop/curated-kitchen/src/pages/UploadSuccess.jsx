import { useSearchParams, Link } from 'react-router-dom'
import './UploadSuccess.css'

function UploadSuccess() {
  const [searchParams] = useSearchParams()
  const slug = searchParams.get('slug')

  return (
    <main className="main">
      <div className="upload-success-layout">
        <div className="upload-success-card">
          <div className="upload-success-icon">🎉</div>
          <h2>Thank you for contributing to our community!</h2>
          <p className="upload-success-sub">Your recipe is being
          uploaded now. Please do not resubmit — it will appear
          on the site shortly.</p>

          <div className="upload-success-remix">
            <p>Do you or someone you know have a <Link
              to="/faq#remixes"
              className="remix-link"
            >Remix</Link> of this recipe? A Remix is your own
            spin on the original — a substitution, a tweak,
            a whole new take. We'd love to see it on the site!</p>
          </div>

          <div className="upload-success-actions">
            {slug && (
              <Link
                to={`/recipes/${slug}`}
                className="view-btn"
              >View My Recipe</Link>
            )}
            <Link to="/upload" className="view-btn"
              style={{backgroundColor: 'white', color: '#7b1f4a',
              border: '2px solid #7b1f4a'}}>
              Upload Another Recipe
            </Link>
            <Link to="/browse" className="view-btn"
              style={{backgroundColor: 'white', color: '#7b1f4a',
              border: '2px solid #7b1f4a'}}>
              Browse Recipes
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}

export default UploadSuccess