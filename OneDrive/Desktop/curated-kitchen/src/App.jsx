import { Routes, Route } from 'react-router-dom'
import './App.css'
import Header from './components/Header'
import Home from './pages/Home'
import Browse from './pages/Browse'
import RecipePage from './pages/RecipePage'
import SignIn from './pages/SignIn'
import Membership from './pages/Membership'
import Subscribe from './pages/Subscribe'
import FAQ from './pages/FAQ'
import TrustedChefInfo from './pages/TrustedChefInfo'
import UploadRecipe from './pages/UploadRecipe'

function App() {
  return (
    <div className="app">
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/browse" element={<Browse />} />
        <Route path="/recipes/:slug" element={<RecipePage />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/membership" element={<Membership />} />
        <Route path="/subscribe" element={<Subscribe />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/trusted-chef-info" element={<TrustedChefInfo />} />
        <Route path="/upload" element={<UploadRecipe />} />
      </Routes>
    </div>
  )
}

export default App