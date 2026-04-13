import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import './UploadRecipe.css'
import CustomSelect from '../components/CustomSelect'

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

const units = ['oz', 'lb', 'lbs', 'tsp', 'tbsp', 'cup', 'cups',
  'g', 'kg', 'ml', 'l', 'qt', 'pt', 'gal', 'fl', 'c']
const smallWords = ['a', 'an', 'the', 'and', 'or', 'but',
  'for', 'of', 'in', 'on', 'at', 'to', 'with', 'from',
  'small', 'medium', 'large']
const alwaysLower = ['diced', 'minced', 'chopped', 'sliced',
  'grated', 'shredded', 'crushed', 'mashed', 'peeled',
  'deveined', 'deseeded', 'divided', 'softened', 'melted',
  'cooked', 'raw', 'frozen', 'thawed', 'drained', 'rinsed',
  'reserve', 'reserved', 'juice', 'when', 'draining', 'topping',
  'remainder', 'will', 'be', 'tops', 'off', 'halved']

const tempContextWords = ['preheat', 'bake', 'roast', 'broil',
  'fry', 'heat', 'warm', 'temperature', 'temp', 'degrees',
  'airfryer', 'air', 'fryer', 'oven', 'grill']

function formatTemperature(text) {
  let result = text
  result = result
    .replace(/(\d+)\s*°\s*F\b/g, '$1°F')
    .replace(/(\d+)\s*°\s*C\b/g, '$1°C')
    .replace(/(\d+)\s*degrees?\s*F\b/gi, '$1°F')
    .replace(/(\d+)\s*degrees?\s*C\b/gi, '$1°C')
  const lowerText = result.toLowerCase()
  const hasTempContext = tempContextWords.some(w => lowerText.includes(w))
  if (hasTempContext) {
    result = result.replace(/(\d+)\s*F\b(?!°)/g, '$1°F')
    result = result.replace(/(\d+)\s*C\b(?!°)(?!\s*up)(?!\s*[a-z])/g, '$1°C')
  }
  return result
}

function formatFractions(text) {
  return text
    .replace(/\b1\/2\b/g, '½')
    .replace(/\b1\/4\b/g, '¼')
    .replace(/\b3\/4\b/g, '¾')
    .replace(/\b1\/3\b/g, '⅓')
    .replace(/\b2\/3\b/g, '⅔')
    .replace(/\b1\/8\b/g, '⅛')
    .replace(/\b3\/8\b/g, '⅜')
    .replace(/\b5\/8\b/g, '⅝')
    .replace(/\b7\/8\b/g, '⅞')
}

function formatIngredient(ingredient) {
  const withFractions = formatFractions(ingredient)
  const spacedUnits = withFractions.replace(
    /(\d)(oz|lb|lbs|tsp|tbsp|cup|cups|g|kg|ml|qt|pt|gal|fl)\b/gi,
    (match, num, unit) => num + ' ' + unit.toLowerCase()
  )

  const prepWords = ['shredded', 'diced', 'minced', 'chopped',
    'sliced', 'grated', 'crushed', 'mashed', 'peeled',
    'deveined', 'deseeded', 'halved', 'softened', 'melted']

  return spacedUnits.replace(
    /^([\d¼½¾⅓⅔⅛⅜⅝⅞\s\/\.]+\s*)?(.+)$/,
    (match, measurement, name) => {
      const cleanMeasurement = measurement ? measurement.toLowerCase() : ''
      const extractedPrep = []
      let nameWithoutLeadingPrep = name.trim()
      const words = nameWithoutLeadingPrep.split(/\s+/)
      const leadingPreps = []
      let i = 0
      while (i < words.length &&
        prepWords.includes(words[i].toLowerCase())) {
        leadingPreps.push(words[i].toLowerCase())
        i++
      }
      if (leadingPreps.length > 0) {
        nameWithoutLeadingPrep = words.slice(i).join(' ')
        extractedPrep.push(...leadingPreps)
      }

      let insideParen = false
      const existingParens = []
      const nameWords = nameWithoutLeadingPrep.split(/\s+/)
      const cleanWords = []

      nameWords.forEach(word => {
        if (word.startsWith('(')) {
          insideParen = true
          existingParens.push(word)
        } else if (insideParen) {
          existingParens[existingParens.length - 1] += ' ' + word
          if (word.includes(')')) insideParen = false
        } else {
          cleanWords.push(word)
        }
      })

      const cleanName = cleanWords.map((word, idx) => {
        const lower = word.toLowerCase()
        const stripped = lower.replace(/[(),]/g, '')
        if (units.includes(stripped)) return lower
        if (idx !== 0 && smallWords.includes(lower)) return lower
        if (alwaysLower.includes(stripped)) return lower
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      }).join(' ')

      let result = cleanMeasurement + cleanName
      if (extractedPrep.length > 0) {
        result += ' (' + extractedPrep.join(', ') + ')'
      }
      if (existingParens.length > 0) {
        result += ' ' + existingParens.map(p => p.toLowerCase()).join(' ')
      }
      return formatTemperature(result.trim())
    }
  )
}

function injectPrepNotes(step, ingredientList) {
  let result = step
  ingredientList.forEach(ingredient => {
    const measureMatch = ingredient.match(
      /^([\d¼½¾⅓⅔⅛⅜⅝⅞\s\/\.]+(?:oz|lb|lbs|tsp|tbsp|cup|cups|g|kg|ml|qt|pt|gal|fl|c)?\s*)/i
    )
    const measurement = measureMatch ? measureMatch[1].trim() : ''
    const nameWithParens = ingredient
      .replace(/^[\d¼½¾⅓⅔⅛⅜⅝⅞\s\/\.]+(?:oz|lb|lbs|tsp|tbsp|cup|cups|g|kg|ml|qt|pt|gal|fl|c)?\s*/i, '')
      .trim()
    const parens = nameWithParens.match(/\([^)]+\)/g) || []
    const baseName = nameWithParens.replace(/\([^)]+\)/g, '').trim()
    if (!baseName || baseName.length < 3) return
    const baseWords = baseName.toLowerCase().split(/\s+/)
      .filter(w => !units.includes(w) && !smallWords.includes(w))
    if (baseWords.length === 0) return
    const longestWord = baseWords.reduce((a, b) =>
      a.length >= b.length ? a : b
    )
    if (longestWord.length < 3) return
    const escapedWord = longestWord.replace(
      /[.*+?^${}()|[\]\\]/g, '\\$&'
    )
    const regex = new RegExp(
      `\\b(the\\s+)?((?:[\\w]+\\s+){0,2}${escapedWord}(?:\\s+[\\w]+){0,2})\\b(?!\\s*\\()`,
      'gi'
    )
    result = result.replace(regex, (match, article, food) => {
      const fullRef = measurement
        ? `${measurement} ${baseName}${parens.length > 0 ? ' ' + parens.join(' ') : ''}`
        : `${baseName}${parens.length > 0 ? ' ' + parens.join(' ') : ''}`
      return fullRef
    })
  })
  return result
}

function formatStep(step, ingredientList) {
  const trimmed = step.trim()
  if (!trimmed) return trimmed
  const withFractions = formatFractions(trimmed)
  const withTemps = formatTemperature(withFractions)
  const withPrep = ingredientList
    ? injectPrepNotes(withTemps, ingredientList)
    : withTemps
  return withPrep.charAt(0).toUpperCase() + withPrep.slice(1)
}

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
  const tagPickerRef = useRef(null)
  const tagBtnRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(e) {
      if (
        tagPickerRef.current &&
        !tagPickerRef.current.contains(e.target) &&
        tagBtnRef.current &&
        !tagBtnRef.current.contains(e.target)
      ) {
        setShowTagPicker(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

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

  function handleIngredientBlur(index) {
    if (!ingredients[index].trim() && ingredients.length > 1) {
      setIngredients(ingredients.filter((_, i) => i !== index))
    }
  }

  function handleIngredientKeyDown(index, e) {
    if (e.key === 'Enter') {
      e.preventDefault()
      if (!ingredients[index].trim()) return
      const updated = [...ingredients, '']
      setIngredients(updated)
      setTimeout(() => {
        const inputs = document.querySelectorAll('.ingredient-input')
        if (inputs[index + 1]) inputs[index + 1].focus()
      }, 50)
    }
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

  function handleStepKeyDown(index, e) {
    if (e.key === 'Enter' && !e.shiftKey && !e.ctrlKey) {
      e.preventDefault()
      if (!steps[index].trim()) return
      const updated = [...steps, '']
      setSteps(updated)
      setTimeout(() => {
        const textareas = document.querySelectorAll('.step-input')
        if (textareas[index + 1]) textareas[index + 1].focus()
      }, 50)
    }
  }

  function handleStepBlur(i) {
    setTimeout(() => {
      setSteps(prev => {
        if (!prev[i]?.trim() && prev.length > 1) {
          return prev.filter((_, idx) => idx !== i)
        }
        return prev
      })
    }, 100)
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

  async function handleSubmit() {
    setError('')
    if (!title) { setError('Please add a recipe title.'); return }
    if (!description) { setError('Please add a description.'); return }
    if (selectedTags.length === 0) {
      setError('Please select at least one dietary tag.'); return
    }
    if (!portions) {
      setError('Please add the number of portions.'); return
    }
    if (!imageFile) {
      setError('A photo is required to upload a recipe.'); return
    }
    if (ingredients.filter(i => i.trim()).length === 0) {
      setError('Please add at least one ingredient.'); return
    }
    if (steps.filter(s => s.trim()).length === 0) {
      setError('Please add at least one step.'); return
    }

    setLoading(true)

    const userStr = localStorage.getItem('curated-kitchen-auth')
    let user = null
    if (userStr) {
      try {
        const parsed = JSON.parse(userStr)
        user = parsed?.user
      } catch(e) {}
    }
    if (!user) {
      setError('You must be signed in to upload a recipe.')
      setLoading(false)
      return
    }

    const fileExt = imageFile.name.split('.').pop()
    const fileName = `${user.id}-${Date.now()}.${fileExt}`
    const formData = new FormData()
    formData.append('', imageFile)

    const uploadRes = await fetch(
      `https://orfsgfdvojihddeworuz.supabase.co/storage/v1/object/recipe-images/${fileName}`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9yZnNnZmR2b2ppaGRkZXdvcnV6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYwMTMxODYsImV4cCI6MjA5MTU4OTE4Nn0.lQuHjktlnZmv6BGZrZxQ4gQl_WBQysF2vEjZv38Z-0A`,
          'x-upsert': 'true'
        },
        body: formData
      }
    )

    if (!uploadRes.ok) {
      const errText = await uploadRes.text()
      setError('Image upload failed: ' + errText)
      setLoading(false)
      return
    }

    const imageUrl = `https://orfsgfdvojihddeworuz.supabase.co/storage/v1/object/public/recipe-images/${fileName}`
    const slug = generateSlug(title)
    const formattedIngredients = ingredients
      .filter(i => i.trim())
      .map(formatIngredient)

    const insertRes = await fetch(
      'https://orfsgfdvojihddeworuz.supabase.co/rest/v1/recipes',
      {
        method: 'POST',
        headers: {
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9yZnNnZmR2b2ppaGRkZXdvcnV6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYwMTMxODYsImV4cCI6MjA5MTU4OTE4Nn0.lQuHjktlnZmv6BGZrZxQ4gQl_WBQysF2vEjZv38Z-0A',
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9yZnNnZmR2b2ppaGRkZXdvcnV6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYwMTMxODYsImV4cCI6MjA5MTU4OTE4Nn0.lQuHjktlnZmv6BGZrZxQ4gQl_WBQysF2vEjZv38Z-0A`,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify({
          title,
          description,
          tags: cuisine ? [...selectedTags, cuisine] : selectedTags,
          portions: parseInt(portions),
          ingredients: formattedIngredients,
          steps: steps
            .filter(s => s.trim())
            .map(s => formatStep(s, formattedIngredients)),
          image_url: imageUrl,
          slug,
          uploaded_by: user.id,
          spoon_score: 0,
          rating: 0,
          rating_count: 0,
          is_well_seasoned: false,
          is_trusted_chef: false,
        })
      }
    )

    if (!insertRes.ok) {
      const errText = await insertRes.text()
      setError('Error saving recipe: ' + errText)
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
          <CustomSelect
            value={cuisine}
            onChange={setCuisine}
            options={[
              { value: '', label: 'Select a cuisine...' },
              ...cuisineOptions.map(c => ({ value: c, label: c }))
            ]}
          />
        </div>

        <div className="form-group">
          <label>Dietary tags</label>
          <p className="field-hint">Select all that apply.
          Click elsewhere when done.</p>
          <div className="tag-grid">
            {selectedTags.length > 0 && selectedTags.map(tag => (
              <span key={tag} className="tag-selected">
                {tag}
                <button
                  type="button"
                  className="tag-remove"
                  onClick={() => handleTagToggle(tag)}
                >×</button>
              </span>
            ))}
            <button
              ref={tagBtnRef}
              type="button"
              className="tag-toggle add-tag"
              onClick={() => setShowTagPicker(!showTagPicker)}
            >+ Add tag</button>
          </div>
          {showTagPicker && (
            <div className="tag-picker" ref={tagPickerRef}>
              {dietOptions.map(tag => (
                <button
                  key={tag}
                  type="button"
                  className={`tag-toggle ${selectedTags.includes(tag) ? 'active' : ''}`}
                  onClick={() => handleTagToggle(tag)}
                >{tag}</button>
              ))}
            </div>
          )}
        </div>

        <div className="form-group">
  <label htmlFor="portions">Number of portions</label>
  <div className="portions-wrapper">
    <input
  id="portions"
  type="text"
  placeholder="e.g. 4"
  value={portions}
  onChange={e => {
    const val = e.target.value.replace(/[^0-9]/g, '')
    if (val === '' || (parseInt(val) >= 1 && parseInt(val) <= 99)) {
      setPortions(val)
    }
  }}
  className="portions-input"
/>
<div className="portions-btns">
  <button
    type="button"
    className="portions-btn"
    onClick={() => setPortions(p => Math.min(99, (parseInt(p) || 0) + 1))}
  >▲</button>
  <button
    type="button"
    className="portions-btn"
    onClick={() => setPortions(p => Math.max(1, (parseInt(p) || 2) - 1))}
  >▼</button>
</div>
  </div>
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
          <div className="ingredient-hint">
            <p>If an ingredient is used at different points in the
            recipe <span className="divided-tag">(divided)</span>,
            list it separately for each use.</p>
            <p><strong>Example 1:</strong> "6 Bell Peppers
            (halved and deseeded)" and a second ingredient listed
            as "2 Bell Peppers (diced)"</p>
            <p><strong>Example 2:</strong> "1 tbsp Unsalted Butter
            (for browning meat)" and a second ingredient listed as
            "1 tbsp Unsalted Butter (when cooking veggies)"</p>
          </div>
          {ingredients.map((ingredient, i) => (
            <div key={i} className="list-input-row">
              <input
                type="text"
                className="ingredient-input"
                placeholder="e.g. 1¼ lb Chicken Breast"
                value={ingredient}
                onChange={e => handleIngredientChange(i, e.target.value)}
                onKeyDown={e => handleIngredientKeyDown(i, e)}
                onBlur={() => handleIngredientBlur(i)}
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
                className="step-input"
                placeholder="Describe this step..."
                value={step}
                onChange={e => handleStepChange(i, e.target.value)}
                onKeyDown={e => handleStepKeyDown(i, e)}
                onBlur={() => handleStepBlur(i)}
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

        {error && <p className="auth-error">{error}</p>}
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