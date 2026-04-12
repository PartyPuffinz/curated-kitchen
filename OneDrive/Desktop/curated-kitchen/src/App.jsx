import './App.css'
import Header from './components/Header'
import RecipeCard from './components/RecipeCard'

const recipes = [
  {
    id: 1,
    title: "Chicken & Mushroom Gravy",
    description: "A delicious mouth-watering mushroom gravy with tender chicken breast.",
    tags: ["Keto", "Paleo", "Gluten-free"],
    spoonScore: 4,
    rating: 5,
    ratingCount: 24,
    image: "https://placehold.co/400x200",
    isWellSeasoned: true,
    isTrustedChef: true,
    link: "#"
  },
  {
    id: 2,
    title: "Beef Taco Bowl",
    description: "A hearty taco bowl with seasoned ground beef, rice, and fresh toppings.",
    tags: ["Gluten-free", "Latin"],
    spoonScore: 3,
    rating: 4,
    ratingCount: 11,
    image: "https://placehold.co/400x200",
    isWellSeasoned: false,
    isTrustedChef: false,
    link: "#"
  },
  {
    id: 3,
    title: "Keto Chocolate Brownies",
    description: "Rich fudgy brownies made with almond flour and sugar free chocolate.",
    tags: ["Keto", "Gluten-free"],
    spoonScore: 5,
    rating: 5,
    ratingCount: 38,
    image: "https://placehold.co/400x200",
    isWellSeasoned: true,
    isTrustedChef: false,
    link: "#"
  },
  {
    id: 4,
    title: "Halal Lamb Curry",
    description: "A fragrant slow cooked lamb curry with warming spices and fresh herbs.",
    tags: ["Halal", "South Asian"],
    spoonScore: 6,
    rating: 5,
    ratingCount: 52,
    image: "https://placehold.co/400x200",
    isWellSeasoned: true,
    isTrustedChef: false,
    link: "#"
  },
  {
    id: 5,
    title: "Paleo Banana Pancakes",
    description: "Fluffy two ingredient pancakes made with banana and eggs.",
    tags: ["Paleo", "Gluten-free"],
    spoonScore: 2,
    rating: 4,
    ratingCount: 19,
    image: "https://placehold.co/400x200",
    isWellSeasoned: false,
    isTrustedChef: false,
    link: "#"
  }
]

function App() {
  return (
    <div className="app">
      <Header />
      <main className="main">

        <section className="hero">
          <h2>Recipes for every body, every culture, every ability.</h2>
          <p>Filter by diet, exclude ingredients, and find recipes
          that work for your energy level today.</p>
          <a href="#" className="view-btn">Browse Recipes</a>
        </section>

        <section className="recipe-section">
          <h2>Recently Added</h2>
          <div className="recipe-row">
            {recipes.slice(0, 4).map(recipe => (
              <RecipeCard key={recipe.id} {...recipe} />
            ))}
          </div>
        </section>

        <section className="recipe-section">
          <h2>Most Popular</h2>
          <div className="recipe-row">
            {recipes.slice(0, 4).map(recipe => (
              <RecipeCard key={recipe.id} {...recipe} />
            ))}
          </div>
        </section>

        <section className="category-section">
          <h2>Browse by Category</h2>
          <div className="category-grid">
            <a href="#" className="category-tile">Keto</a>
            <a href="#" className="category-tile">Paleo</a>
            <a href="#" className="category-tile">Halal</a>
            <a href="#" className="category-tile">Latin</a>
            <a href="#" className="category-tile">Gluten-free</a>
            <a href="#" className="category-tile">Low-carb</a>
          </div>
        </section>

        <section className="last-viewed">
          <h2>Recently Viewed</h2>
          <div className="recipe-row">
            {recipes.slice(0, 1).map(recipe => (
              <RecipeCard key={recipe.id} {...recipe} />
            ))}
          </div>
        </section>

      </main>
    </div>
  )
}

export default App