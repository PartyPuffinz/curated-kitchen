import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import './UploadRecipe.css'

const dietOptions = [
  "Keto", "Paleo", "Halal", "Kosher", "Gluten-free", "Vegan",
  "Vegetarian", "Low-carb", "Dairy-free", "Nut-free",
  "Diabetic-friendly", "AIP", "Whole30", "Mediterranean",
  "DASH", "Low-sodium"
]

const cuisineOptions = [
  "American", "Latin / Mexican", "Caribbean", "Italian",
  "Mediterranean", "Middle Eastern", "Persian", "Turkish",
  "Greek", "West African", "East African", "Ethiopian",
  "South Asian / Indian", "East Asian", "Chinese", "Japanese",
  "Korean", "Southeast Asian", "Filipino", "Eastern European",
  "Southern American", "Indigenous / Native", "Pacific Islander"
]

function UploadRecipe() {
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [selectedTags, setSelectedTags] = useState([])
  const [cuisine, setCuisine] = useState('')
const [showTagPicker, setShowTagPicker] = useState(false)
  const [portions, setPortions] = useState('')
  const [ingredients, setIngredients] = useState([''])
  const [steps, setSteps] = useState([''])
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function handleTagToggle(tag) {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    )
  }

  function handleIngredientChange(index, value) {
    const updated = [...ingredients]
    updated[index] = value
    setIngredients(updated)
  }

  function addIngredient() {
    setIngredients([...ingredients, ''])
  }

  function removeIngredient(index) {
    setIngredients(ingredients.filter((_, i) => i !== index))
  }

  function handleStepChange(index, value) {
    const updated = [...steps]
    updated[index] = value
    setSteps(updated)
  }

  function addStep() {
    setSteps([...steps, ''])
  }

  function removeStep(index) {
    setSteps(steps.filter((_, i) => i !== index))
  }

  function handleImageChange(e) {
    const file = e.target.files[0]
    if (file) {
      setImageFile(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  function generateSlug(title) {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '-')
      .trim()
  }

function formatIngredient(ingredient) {
    return ingredient.replace(/^([\d¼½¾⅓⅔\s\/\.]+)?(.+)$/, (match, measurement, name) => {
      const cleanMeasurement = measurement ? measurement.toLowerCase() : ''
      const cleanName = name.trim().replace(/\w\S*/g, word =>
        word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      )
      return (cleanMeasurement + cleanName).trim()
    })
  }

  function formatStep(step) {
    const trimmed = step.trim()
    if (!trimmed) return trimmed
    const capitalized = trimmed.charAt(0).toUpperCase() + trimmed.slice(1)
    return capitalized.endsWith('.') ||
           capitalized.endsWith('!') ||
           capitalized.endsWith('?')
      ? capitalized
      : capitalized + '.'
  }

  async function handleSubmit() {
    setError('')

    if (!title) { setError('Please add a recipe title.'); return }
    if (!description) { setError('Please add a description.'); return }
    if (selectedTags.length === 0) { setError('Please select at least one dietary tag.'); return }
    if (!portions) { setError('Please add the number of portions.'); return }
    if (!imageFile) { setError('A photo is required to upload a recipe.'); return }
    if (ingredients.filter(i => i.trim()).length === 0) { setError('Please add at least one ingredient.'); return }
    if (steps.filter(s => s.trim()).length === 0) { setError('Please add at least one step.'); return }

    setLoading(true)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setError('You must be signed in to upload a recipe.'); setLoading(false); return }

    const fileExt = imageFile.name.split('.').pop()
    const fileName = `${user.id}-${Date.now()}.${fileExt}`
    const { error: uploadError } = await supabase.storage
      .from('recipe-images')
      .upload(fileName, imageFile)

    if (uploadError) {
      setError('Image upload failed: ' + uploadError.message)
      setLoading(false)
      return
    }

    const { data: urlData } = supabase.storage
      .from('recipe-images')
      .getPublicUrl(fileName)

    const slug = generateSlug(title)

    const { error: insertError } = await supabase
      .from('recipes')
      .insert({
        title,
        description,
        tags: cuisine ? [...selectedTags, cuisine] : selectedTags,
        portions: parseInt(portions),
        ingredients: ingredients.filter(i => i.trim()).map(formatIngredient),
steps: steps.filter(s => s.trim()).map(formatStep),
image_url: urlData.publicUrl,
        slug,
        uploaded_by: user.id,
        spoon_score: 0,
        rating: 0,
        rating_count: 0,
        is_well_seasoned: false,
        is_trusted_chef: false,
      })

    if (insertError) {
      setError('Error saving recipe: ' + insertError.message)
      setLoading(false)
      return
    }

    navigate(`/recipes/${slug}`)
  }

  return (
    <main className="upload-layout">
      <h2 className="upload-title">Upload a Recipe</h2>
      <p className="upload-subtitle">Share your recipe with the
      Curated Kitchen community. A photo is required.</p>

      {error && <p className="auth-error">{error}</p>}

      <div className="upload-card">

        <div className="form-group">
          <label htmlFor="recipe-title">Recipe title</label>
          <input
            id="recipe-title"
            type="text"
            placeholder="e.g. Chicken & Mushroom Gravy"
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="recipe-desc">Description</label>
          <textarea
            id="recipe-desc"
            placeholder="A short description of your recipe..."
            value={description}
            onChange={e => setDescription(e.target.value)}
            rows={3}
          />
        </div>

        <div className="form-group">
  <label>Cuisine</label>
  <select
    className="cuisine-select"
    value={cuisine}
    onChange={e => setCuisine(e.target.value)}
  >
    <option value="">Select a cuisine...</option>
    {cuisineOptions.map(c => (
      <option key={c} value={c}>{c}</option>
    ))}
  </select>
</div>

<div className="form-group">
  <label>Dietary tags</label>
  <p className="field-hint">We'll suggest tags based on your
  ingredients. You can add or remove them.</p>
  <div className="tag-grid">
    {selectedTags.map(tag => (
      <button
        key={tag}
        type="button"
        className="tag-toggle active"
        onClick={() => handleTagToggle(tag)}
      >{tag} ×</button>
    ))}
    <button
      type="button"
      className="tag-toggle add-tag"
      onClick={() => setShowTagPicker(!showTagPicker)}
    >+ Add tag</button>
  </div>
  {showTagPicker && (
    <div className="tag-picker">
      {dietOptions.filter(t => !selectedTags.includes(t)).map(tag => (
        <button
          key={tag}
          type="button"
          className="tag-toggle"
          onClick={() => {
            handleTagToggle(tag)
            setShowTagPicker(false)
          }}
        >{tag}</button>
      ))}
    </div>
  )}
</div>

        <div className="form-group">
          <label htmlFor="portions">Number of portions</label>
          <input
            id="portions"
            type="number"
            placeholder="e.g. 4"
            value={portions}
            onChange={e => setPortions(e.target.value)}
            min="1"
            style={{maxWidth: '120px'}}
          />
        </div>

        <div className="form-group">
          <label>Recipe photo (required)</label>
          {imagePreview && (
            <img
              src={imagePreview}
              alt="Preview"
              className="image-preview"
            />
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />
        </div>

        <div className="form-group">
          <label>Ingredients</label>
          {ingredients.map((ingredient, i) => (
            <div key={i} className="list-input-row">
              <input
                type="text"
                placeholder={`e.g. 1¼ lb chicken breast`}
                value={ingredient}
                onChange={e => handleIngredientChange(i, e.target.value)}
              />
              {ingredients.length > 1 && (
                <button
                  type="button"
                  className="remove-btn"
                  onClick={() => removeIngredient(i)}
                >×</button>
              )}
            </div>
          ))}
          <button
            type="button"
            className="add-btn"
            onClick={addIngredient}
          >+ Add ingredient</button>
        </div>

        <div className="form-group">
          <label>Steps</label>
          {steps.map((step, i) => (
            <div key={i} className="list-input-row">
              <div className="step-number">Step {i + 1}</div>
              <textarea
                placeholder="Describe this step..."
                value={step}
                onChange={e => handleStepChange(i, e.target.value)}
                rows={3}
              />
              {steps.length > 1 && (
                <button
                  type="button"
                  className="remove-btn"
                  onClick={() => removeStep(i)}
                >×</button>
              )}
            </div>
          ))}
          <button
            type="button"
            className="add-btn"
            onClick={addStep}
          >+ Add step</button>
        </div>

        <button
          className="submit-btn"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? 'Uploading...' : 'Submit Recipe'}
        </button>

      </div>
    </main>
  )
}

export default UploadRecipe