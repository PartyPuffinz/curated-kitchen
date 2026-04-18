import { Routes, Route } from 'react-router-dom'
import './App.css'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import Browse from './pages/Browse'
import RecipePage from './pages/RecipePage'
import SignIn from './pages/SignIn'
import Membership from './pages/Membership'
import Subscribe from './pages/Subscribe'
import FAQ from './pages/FAQ'
import TrustedChefInfo from './pages/TrustedChefInfo'
import TrustedChefProfile from './pages/TrustedChefProfile'
import MyProfile from './pages/MyProfile'
import MyUploadedRecipes from './pages/MyUploadedRecipes'
import MySavedRecipes from './pages/MySavedRecipes'
import EquipmentProfile from './pages/EquipmentProfile'
import NowzFoodz from './pages/NowzFoodz'
import About from './pages/About'
import Feedback from './pages/Feedback'
import TermsOfService from './pages/TermsOfService'
import PrivacyPolicy from './pages/PrivacyPolicy'
import AbusePolicy from './pages/AbusePolicy'
import AdminNowzUpload from './pages/AdminNowzUpload'
import UploadSuccess from './pages/UploadSuccess'
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
        <Route path="/chef/:username" element={<TrustedChefProfile />} />
        <Route path="/profile" element={<MyProfile />} />
        <Route path="/my-recipes" element={<MyUploadedRecipes />} />
        <Route path="/saved-recipes" element={<MySavedRecipes />} />
        <Route path="/equipment" element={<EquipmentProfile />} />
        <Route path="/nowz-foodz" element={<NowzFoodz />} />
        <Route path="/about" element={<About />} />
        <Route path="/feedback" element={<Feedback />} />
        <Route path="/terms" element={<TermsOfService />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/abuse-policy" element={<AbusePolicy />} />
        <Route path="/admin/nowz" element={<AdminNowzUpload />} />
        <Route path="/upload-success" element={<UploadSuccess />} />
        <Route path="/upload" element={<UploadRecipe />} />
      </Routes>
      <Footer />
    </div>
  )
}

export default App