import { useState, useRef, useEffect } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import './UploadRecipe.css'
import './RemixRecipe.css'
import CustomSelect from '../components/CustomSelect'

const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9yZnNnZmR2b2ppaGRkZXdvcnV6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYwMTMxODYsImV4cCI6MjA5MTU4OTE4Nn0.lQuHjktlnZmv6BGZrZxQ4gQl_WBQysF2vEjZv38Z-0A'
const DB = 'https://orfsgfdvojihddeworuz.supabase.co'
const HEADERS = { 'apikey': ANON_KEY, 'Authorization': `Bearer ${ANON_KEY}` }

const dietOptions = [
  "Keto", "Paleo", "Mediterranean", "Vegan", "Vegetarian",
  "Halal", "Kosher", "Low-carb", "Low-sodium", "DASH",
  "Whole30", "AIP", "Gluten-free", "Dairy-free", "Egg-free",
  "Nut-free", "Peanut-free", "Soy-free", "Shellfish-free",
  "Fish-free", "Sesame-free", "Chocolate-free"
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

const allergenRules = {
  'Dairy-free': { contains: ['milk', 'butter', 'cream', 'cheese', 'yogurt', 'whey', 'casein', 'lactose', 'ghee', 'kefir', 'mozzarella', 'cheddar', 'parmesan', 'brie', 'gouda', 'ricotta', 'sour cream', 'heavy cream', 'half and half', 'ice cream'] },
  'Gluten-free': { contains: ['flour', 'wheat', 'barley', 'rye', 'bread', 'pasta', 'noodle', 'soy sauce', 'breadcrumb', 'malt', 'semolina', 'spelt', 'farro', 'couscous', 'cracker', 'cereal'] },
  'Nut-free': { contains: ['almond', 'walnut', 'pecan', 'cashew', 'pistachio', 'hazelnut', 'macadamia', 'brazil nut', 'pine nut', 'chestnut', 'almond flour', 'almond milk', 'peanut', 'peanut butter'] },
  'Egg-free': { contains: ['egg', 'eggs', 'mayonnaise', 'meringue', 'albumin'] },
  'Soy-free': { contains: ['soy', 'soya', 'tofu', 'edamame', 'miso', 'tempeh', 'soy sauce', 'tamari', 'soybean'] },
  'Shellfish-free': { contains: ['shrimp', 'crab', 'lobster', 'crayfish', 'prawn', 'scallop', 'clam', 'oyster', 'mussel', 'squid', 'octopus'] },
  'Fish-free': { contains: ['salmon', 'tuna', 'cod', 'tilapia', 'halibut', 'anchovy', 'sardine', 'mahi', 'bass', 'trout', 'catfish', 'fish sauce', 'worcestershire'] },
  'Sesame-free': { contains: ['sesame', 'tahini', 'sesame oil', 'sesame seed'] },
  'Peanut-free': { contains: ['peanut', 'peanut butter', 'groundnut'] },
  'Chocolate-free': { contains: ['chocolate', 'cocoa', 'cacao', 'nutella'] },
  'Vegan': { contains: ['milk', 'butter', 'cream', 'cheese', 'yogurt', 'egg', 'eggs', 'chicken', 'beef', 'pork', 'fish', 'shrimp', 'bacon', 'gelatin', 'honey', 'whey', 'casein'] },
  'Vegetarian': { contains: ['chicken', 'beef', 'pork', 'lamb', 'turkey', 'bacon', 'ham', 'sausage', 'anchovies', 'gelatin', 'lard', 'fish sauce', 'shrimp', 'salmon', 'tuna', 'cod'] },
  'Keto': { contains: ['sugar', 'flour', 'bread', 'pasta', 'rice', 'potato', 'corn', 'oat', 'honey', 'maple syrup', 'banana', 'apple', 'orange juice', 'cornstarch'] },
  'Low-carb': { contains: ['sugar', 'flour', 'bread', 'pasta', 'rice', 'potato', 'corn', 'oat', 'honey', 'maple syrup'] }
}

const ketoFriendlyModifiers = [
  'sugar-free', 'sugar free', 'keto', 'low-carb', 'low carb',
  'no sugar', 'zero sugar', 'unsweetened', 'diabetic'
]

function detectAllergenTags(ingredientList) {
  const warningTags = []
  const suggestedTags = []
  for (const [tag, rule] of Object.entries(allergenRules)) {
    const found = rule.contains.some(item => {
      return ingredientList.some(ingredient => {
        const lower = ingredient.toLowerCase()
        if (!lower.includes(item.toLowerCase())) return false
        const hasModifier = ketoFriendlyModifiers.some(mod => lower.includes(mod))
        if (hasModifier && (tag === 'Keto' || tag === 'Low-carb')) return false
        return true
      })
    })
    if (found) warningTags.push(tag)
    else suggestedTags.push(tag)
  }
  return { warningTags, suggestedTags }
}

function formatFractions(text) {
  return text
    .replace(/\b1\/2\b/g, '½').replace(/\b1\/4\b/g, '¼')
    .replace(/\b3\/4\b/g, '¾').replace(/\b1\/3\b/g, '⅓')
    .replace(/\b2\/3\b/g, '⅔').replace(/\b1\/8\b/g, '⅛')
    .replace(/\b3\/8\b/g, '⅜').replace(/\b5\/8\b/g, '⅝')
    .replace(/\b7\/8\b/g, '⅞')
}

function formatTemperature(text) {
  let result = text
  result = result
    .replace(/(\d+)\s*°\s*F\b/g, '$1°F')
    .replace(/(\d+)\s*°\s*C\b/g, '$1°C')
    .replace(/(\d+)\s*degrees?\s*F\b/gi, '$1°F')
    .replace(/(\d+)\s*degrees?\s*C\b/gi, '$1°C')
  const tempContextWords = ['preheat', 'bake', 'roast', 'broil', 'fry', 'heat', 'warm', 'temperature', 'temp', 'degrees', 'oven', 'grill']
  const lowerText = result.toLowerCase()
  const hasTempContext = tempContextWords.some(w => lowerText.includes(w))
  if (hasTempContext) {
    result = result.replace(/(\d+)\s*F\b(?!°)/g, '$1°F')
    result = result.replace(/(\d+)\s*C\b(?!°)(?!\s*up)(?!\s*[a-z])/g, '$1°C')
  }
  return result
}

function formatIngredient(ingredient) {
  const withFractions = formatFractions(ingredient)
  const spacedUnits = withFractions.replace(
    /(\d)(oz|lb|lbs|tsp|tbsp|cup|cups|g|kg|ml|qt|pt|gal|fl|c)\b/gi,
    (match, num, unit) => num + ' ' + unit.toLowerCase()
  )
  const prepWords = ['shredded', 'diced', 'minced', 'chopped', 'sliced', 'grated', 'crushed', 'mashed', 'peeled', 'deveined', 'deseeded', 'halved', 'softened', 'melted']
  return spacedUnits.replace(
    /^([\d¼½¾⅓⅔⅛⅜⅝⅞\s\/\.]+\s*)?(.+)$/,
    (match, measurement, name) => {
      const cleanMeasurement = measurement ? measurement.toLowerCase() : ''
      const extractedPrep = []
      let nameWithoutLeadingPrep = name.trim()
      const words = nameWithoutLeadingPrep.split(/\s+/)
      const leadingPreps = []
      let i = 0
      while (i < words.length && prepWords.includes(words[i].toLowerCase())) {
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
        if (word.startsWith('(')) { insideParen = true; existingParens.push(word) }
        else if (insideParen) { existingParens[existingParens.length - 1] += ' ' + word; if (word.includes(')')) insideParen = false }
        else { cleanWords.push(word) }
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
      if (extractedPrep.length > 0) result += ' (' + extractedPrep.join(', ') + ')'
      if (existingParens.length > 0) result += ' ' + existingParens.map(p => p.toLowerCase()).join(' ')
      return formatTemperature(result.trim())
    }
  )
}

function formatStep(step) {
  const trimmed = step.trim()
  if (!trimmed) return trimmed
  const withFractions = formatFractions(trimmed)
  const withTemps = formatTemperature(withFractions)
  return withTemps.charAt(0).toUpperCase() + withTemps.slice(1)
}

function autoDetectSpoonComponents(ingredientList, stepList) {
  const allText = [...ingredientList, ...stepList].join(' ').toLowerCase()
  const stepText = stepList.join(' ').toLowerCase()
  const ingredientCount = ingredientList.length
  let ingredientScore = 0
  if (ingredientCount >= 17) ingredientScore = 5
  else if (ingredientCount >= 14) ingredientScore = 4
  else if (ingredientCount >= 11) ingredientScore = 3
  else if (ingredientCount >= 8) ingredientScore = 2
  else if (ingredientCount >= 5) ingredientScore = 1
  const taskKeywords = ['chop', 'dice', 'mince', 'slice', 'sauté', 'saute', 'brown', 'simmer', 'whisk', 'drain', 'bake', 'broil', 'blend', 'marinate', 'steam', 'fry', 'beat', 'fold', 'knead', 'boil', 'roast', 'grill', 'poach', 'strain', 'shred', 'grate', 'peel', 'season', 'deglaze', 'reduce', 'caramelize', 'sear', 'braise']
  const taskCount = taskKeywords.filter(k => stepText.includes(k)).length
  let taskScore = 0
  if (taskCount >= 7) taskScore = 5
  else if (taskCount >= 5) taskScore = 3
  else if (taskCount >= 3) taskScore = 1
  let passiveScore = 0
  if (/freeze|freezer/.test(allText)) passiveScore = 10
  else if (/overnight|refrigerate|fridge|refrigerator|chill/.test(allText)) passiveScore = 8
  else if (/slow cooker|crockpot|all day/.test(allText)) passiveScore = 9
  else {
    const hourMatch = allText.match(/(\d+)\s*hour/)
    const minMatch = allText.match(/(\d+)\s*min/)
    const hours = hourMatch ? parseInt(hourMatch[1]) : 0
    const mins = minMatch ? parseInt(minMatch[1]) : 0
    const totalMins = hours * 60 + mins
    if (totalMins >= 120) passiveScore = 8
    else if (totalMins >= 60) passiveScore = 6
    else if (totalMins >= 30) passiveScore = 4
    else if (totalMins >= 15) passiveScore = 3
    else if (allText.includes('microwave')) passiveScore = 2
  }
  const hasMeat = /chicken|beef|pork|lamb|turkey|fish|shrimp|salmon|tuna/.test(allText)
  const hasHighPrecision = /caramelize|candy|caramel|tempering|chocolate/.test(allText)
  const timingScore = Math.min(5, (hasHighPrecision ? 5 : 2) + (hasMeat ? 2 : 0))
  const hasCastIron = /cast iron/.test(allText)
  const hasParchmentOrFoil = /parchment|aluminum foil|tin foil/.test(allText)
  const hasBaking = /bake|oven/.test(allText)
  const messyIngredients = /\b(flour|powdered sugar|brown sugar|granulated sugar)\b/.test(allText)
  let cleanupLevel = 'Low'
  if (hasCastIron) cleanupLevel = 'High'
  else if (hasBaking && !hasParchmentOrFoil) cleanupLevel = 'High'
  else if (messyIngredients) cleanupLevel = 'Medium'
  return { ingredientScore, taskScore, passiveScore, timingScore, cleanupLevel }
}

function calculateSpoonScore(manual, auto) {
  const raw = manual.chopping + manual.stirring + manual.kneading +
    manual.lifting + manual.stovetop + manual.multitasking +
    auto.timingScore + manual.fineMotor + auto.passiveScore +
    auto.ingredientScore + auto.taskScore
  const displayed = Math.round((raw / 115) * 100)
  const spoon = Math.round((displayed / 10) * 2) / 2
  return { spoon: Math.min(10, Math.max(0.5, spoon)) }
}

function RemixRecipe() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const originalSlug = searchParams.get('from')

  const [originalRecipe, setOriginalRecipe] = useState(null)
  const [loadingOriginal, setLoadingOriginal] = useState(true)
  const [page, setPage] = useState(1)

  const [titleSuffix, setTitleSuffix] = useState('')
  const [remixDescription, setRemixDescription] = useState('')
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

  const [warningTags, setWarningTags] = useState([])
  const [suggestedTags, setSuggestedTags] = useState([])
  const [chopping, setChopping] = useState('')
  const [stirring, setStirring] = useState('')
  const [kneading, setKneading] = useState('')
  const [lifting, setLifting] = useState('')
  const [stovetop, setStovetop] = useState('')
  const [multitasking, setMultitasking] = useState('')
  const [fineMotor, setFineMotor] = useState('')

  const tagPickerRef = useRef(null)
  const tagBtnRef = useRef(null)

  useEffect(() => {
    if (!originalSlug) { setLoadingOriginal(false); return }
    fetch(`${DB}/rest/v1/recipes?slug=eq.${originalSlug}&select=*`, { headers: HEADERS })
      .then(res => res.json())
      .then(data => {
        const r = data?.[0]
        if (r) {
          setOriginalRecipe(r)
          setIngredients(r.ingredients?.length > 0 ? r.ingredients : [''])
          setSteps(r.steps?.length > 0 ? r.steps : [''])
          setSelectedTags(r.tags || [])
          setPortions(r.portions?.toString() || '')
          setImagePreview(r.image_url || null)
          if (r.tags?.includes('American') || cuisineOptions.includes(r.tags?.[0])) {
            setCuisine(r.tags?.find(t => cuisineOptions.includes(t)) || '')
          }
        }
        setLoadingOriginal(false)
      })
      .catch(() => setLoadingOriginal(false))
  }, [originalSlug])

  useEffect(() => {
    function handleClickOutside(e) {
      if (tagPickerRef.current && !tagPickerRef.current.contains(e.target) &&
        tagBtnRef.current && !tagBtnRef.current.contains(e.target)) {
        setShowTagPicker(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  function handleTagToggle(tag) {
    setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag])
  }

  function handleIngredientChange(index, value) {
    const updated = [...ingredients]
    updated[index] = value
    setIngredients(updated)
  }

  function handleIngredientBlur(index) {
    setTimeout(() => {
      setIngredients(prev => {
        if (prev.length <= 1) return prev
        const current = prev[index]
        if (current !== undefined && current.trim() === '') {
          return prev.filter((_, i) => i !== index)
        }
        return prev
      })
    }, 300)
  }

  function handleIngredientKeyDown(index, e) {
    if (e.key === 'Enter') {
      e.preventDefault()
      if (!ingredients[index].trim()) return
      setIngredients([...ingredients, ''])
      setTimeout(() => {
        const inputs = document.querySelectorAll('.ingredient-input')
        if (inputs[index + 1]) inputs[index + 1].focus()
      }, 50)
    }
  }

  function addIngredientAfter(index) {
    const updated = [...ingredients]
    updated.splice(index + 1, 0, '')
    setIngredients(updated)
    setTimeout(() => {
      const inputs = document.querySelectorAll('.ingredient-input')
      if (inputs[index + 1]) inputs[index + 1].focus()
    }, 50)
  }

  function removeIngredient(index) {
    if (ingredients.length <= 1) return
    setIngredients(ingredients.filter((_, i) => i !== index))
  }

  function handleStepChange(index, value) {
    const updated = [...steps]
    updated[index] = value
    setSteps(updated)
  }

  function handleStepBlur(i) {
    setTimeout(() => {
      setSteps(prev => {
        if (prev.length <= 1) return prev
        const current = prev[i]
        if (current !== undefined && current.trim() === '') {
          return prev.filter((_, idx) => idx !== i)
        }
        return prev
      })
    }, 300)
  }

  function handleStepKeyDown(index, e) {
    if (e.key === 'Enter' && !e.shiftKey && !e.ctrlKey) {
      e.preventDefault()
      if (!steps[index].trim()) return
      setSteps([...steps, ''])
      setTimeout(() => {
        const textareas = document.querySelectorAll('.step-input')
        if (textareas[index + 1]) textareas[index + 1].focus()
      }, 50)
    }
  }

  function addStepAfter(index) {
    const updated = [...steps]
    updated.splice(index + 1, 0, '')
    setSteps(updated)
    setTimeout(() => {
      const textareas = document.querySelectorAll('.step-input')
      if (textareas[index + 1]) textareas[index + 1].focus()
    }, 50)
  }

  function removeStep(index) {
    if (steps.length <= 1) return
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
    return title.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, '-').trim()
  }

  function handleNextPage() {
    setError('')
    if (!titleSuffix.trim()) { setError('Please add a remix title (e.g. "Nut-free version").'); return }
    if (titleSuffix.trim().length > 15) { setError('Remix title must be 15 characters or less.'); return }
    if (!remixDescription.trim()) { setError('Please describe what you changed from the original recipe.'); return }
    if (!portions) { setError('Please add the number of portions.'); return }
    if (ingredients.filter(i => i.trim()).length === 0) { setError('Please add at least one ingredient.'); return }
    if (steps.filter(s => s.trim()).length === 0) { setError('Please add at least one step.'); return }
    const filled = ingredients.filter(i => i.trim())
    const { warningTags: warnings, suggestedTags: suggested } = detectAllergenTags(filled)
    setWarningTags(warnings)
    setSuggestedTags(suggested.filter(t => !selectedTags.includes(t)))
    window.scrollTo(0, 0)
    setPage(2)
  }

  async function handlePublish() {
    setError('')
    if (!chopping || !stirring || !kneading || !lifting ||
      !stovetop || !multitasking || !fineMotor) {
      setError('Please answer all spoon score questions.')
      return
    }
    const formattedIngredients = ingredients.filter(i => i.trim()).map(formatIngredient)
    const formattedSteps = steps.filter(s => s.trim()).map(formatStep)
    const autoComponents = autoDetectSpoonComponents(formattedIngredients, formattedSteps)
    const manualComponents = {
      chopping: parseInt(chopping), stirring: parseInt(stirring),
      kneading: parseInt(kneading), lifting: parseInt(lifting),
      stovetop: parseInt(stovetop), multitasking: parseInt(multitasking),
      fineMotor: parseInt(fineMotor)
    }
    const { spoon } = calculateSpoonScore(manualComponents, autoComponents)
    const cleanupLevel = autoComponents.cleanupLevel
    setLoading(true)
    let user = null
    const keys = Object.keys(localStorage)
    for (const key of keys) {
      if (key.includes('auth')) {
        try {
          const parsed = JSON.parse(localStorage.getItem(key))
          if (parsed?.user) { user = parsed.user; break }
        } catch(e) {}
      }
    }
    if (!user) {
      setError('You must be signed in to submit a remix.')
      setLoading(false)
      return
    }
    let imageUrl = originalRecipe?.image_url || ''
    if (imageFile) {
      const fileExt = imageFile.name.split('.').pop()
      const fileName = `${user.id}-remix-${Date.now()}.${fileExt}`
      const formData = new FormData()
      formData.append('', imageFile)
      const uploadRes = await fetch(
        `${DB}/storage/v1/object/recipe-images/${fileName}`,
        { method: 'POST', headers: { 'Authorization': `Bearer ${ANON_KEY}`, 'x-upsert': 'true' }, body: formData }
      )
      if (uploadRes.ok) {
        imageUrl = `${DB}/storage/v1/object/public/recipe-images/${fileName}`
      }
    }
    const fullTitle = `${originalRecipe.title} — ${titleSuffix.trim()}`
    const slug = generateSlug(fullTitle) + '-' + Date.now()
    const finalTags = cuisine ? [...new Set([...selectedTags, cuisine])] : [...new Set(selectedTags)]
    const insertRes = await fetch(`${DB}/rest/v1/recipes`, {
      method: 'POST',
      headers: { ...HEADERS, 'Content-Type': 'application/json', 'Prefer': 'return=minimal' },
      body: JSON.stringify({
        title: fullTitle,
        description: originalRecipe.description,
        tags: finalTags,
        portions: parseInt(portions),
        ingredients: formattedIngredients,
        steps: formattedSteps,
        image_url: imageUrl,
        slug,
        uploaded_by: user.id,
        spoon_score: spoon,
        cleanup: cleanupLevel,
        rating: 0,
        rating_count: 0,
        is_well_seasoned: false,
        is_trusted_chef: false,
        is_remix: true,
        remixed_from: originalRecipe.id,
        remix_title_suffix: titleSuffix.trim(),
        remix_description: remixDescription.trim()
      })
    })
    if (!insertRes.ok) {
      const errText = await insertRes.text()
      setError('Error saving remix: ' + errText)
      setLoading(false)
      return
    }
    navigate(`/upload-success?slug=${slug}`)
  }

  if (loadingOriginal) return <main className="main"><p>Loading...</p></main>

  if (!originalRecipe) {
    return (
      <main className="main">
        <div className="not-found">
          <h2>Recipe not found</h2>
          <p>We couldn't find the recipe you're trying to remix.</p>
          <Link to="/browse" className="view-btn">Browse Recipes</Link>
        </div>
      </main>
    )
  }

  if (originalRecipe.is_remix) {
    return (
      <main className="main">
        <div className="not-found">
          <h2>Remixes can't be remixed</h2>
          <p>To keep things organized, only original recipes can
          be remixed. If you'd like to put your own spin on this,
          try remixing the original recipe instead.</p>
          {originalRecipe.remixed_from && (
            <Link
              to={`/remix?from=${originalRecipe.remixed_from}`}
              className="view-btn"
            >Go to original recipe</Link>
          )}
        </div>
      </main>
    )
  }

  if (page === 2) {
    return (
      <main className="upload-layout">
        <div className="remix-banner">
          🎛️ Remix Upload — Step 2 of 2
        </div>
        <div className="almost-there-banner">
          🎉 Almost done! Answer the effort questions for
          your remixed version.
        </div>

        {error && <p className="auth-error">{error}</p>}

        <div className="upload-card">
          {warningTags.length > 0 && (
            <div className="allergen-warning">
              <h3>⚠️ Allergen notice</h3>
              <p>Based on your ingredients, this remix
              <strong> contains</strong> the following:</p>
              <div className="tag-grid" style={{marginTop: '10px'}}>
                {warningTags.map(tag => (
                  <span key={tag} className="allergen-tag">{tag}</span>
                ))}
              </div>
            </div>
          )}

          {suggestedTags.length > 0 && (
            <div className="allergen-suggested">
              <h3>✓ Suggested dietary tags</h3>
              <p>Based on your ingredients, your remix may
              qualify for these tags. Click to add any that apply:</p>
              <div className="tag-grid" style={{marginTop: '10px'}}>
                {suggestedTags.map(tag => (
                  <button
                    key={tag}
                    type="button"
                    className={`tag-toggle ${selectedTags.includes(tag) ? 'active' : ''}`}
                    onClick={() => {
                      handleTagToggle(tag)
                      setSuggestedTags(prev => prev.filter(t => t !== tag))
                    }}
                  >{tag} +</button>
                ))}
              </div>
              <p style={{fontSize: '12px', color: '#888', marginTop: '12px', fontStyle: 'italic'}}>
                If any tags are missing or incorrect, go back and
                adjust them using the Dietary Tags selector.
              </p>
            </div>
          )}

          <p className="allergen-note">
            ⚠️ Allergen detection is not perfect. Please double-check
            your ingredients list before publishing.
          </p>

          <div className="spoon-divider">
            <h3>Effort Score Questions</h3>
            <p className="field-hint">Rate the effort for
            your remix specifically — it may differ from
            the original!</p>
          </div>

          <div className="form-group">
            <label>Chopping & Cutting</label>
            <select className="cuisine-select" value={chopping} onChange={e => setChopping(e.target.value)}>
              <option value="">Select the most intensive cutting task...</option>
              <option value="0">Nothing to chop or cut</option>
              <option value="1">Open a can only</option>
              <option value="3">Halving or quartering only</option>
              <option value="4">Rough chunks</option>
              <option value="7">Medium dice (e.g. diced onion)</option>
              <option value="10">Fine dice</option>
              <option value="12">Minced by hand OR large volume rough chop (2lbs+)</option>
              <option value="15">Large volume fine dice (2lbs+)</option>
              <option value="13">Complex prep per item (e.g. bell pepper — deseed, devein, top, slice)</option>
            </select>
          </div>

          <div className="form-group">
            <label>Stirring Frequency</label>
            <select className="cuisine-select" value={stirring} onChange={e => setStirring(e.target.value)}>
              <option value="">Select stirring frequency...</option>
              <option value="0">No stirring required</option>
              <option value="2">Once or twice total</option>
              <option value="3">Occasional (every 10-15 min)</option>
              <option value="7">Frequent (every 5-10 min)</option>
              <option value="11">Very frequent (every 2-5 min)</option>
              <option value="15">Constant stirring</option>
            </select>
          </div>

          <div className="form-group">
            <label>Kneading & Mixing</label>
            <select className="cuisine-select" value={kneading} onChange={e => setKneading(e.target.value)}>
              <option value="">Select mixing intensity...</option>
              <option value="0">No kneading or mixing</option>
              <option value="3">Light folding or combining</option>
              <option value="5">Beating ingredients together</option>
              <option value="7">Cookie dough consistency</option>
              <option value="8">Thick batter</option>
              <option value="10">Bread dough by hand</option>
            </select>
          </div>

          <div className="form-group">
            <label>Heaviest Thing You Lift</label>
            <select className="cuisine-select" value={lifting} onChange={e => setLifting(e.target.value)}>
              <option value="">Select heaviest lift...</option>
              <option value="0">No lifting required</option>
              <option value="1">Light pan (regular frying pan)</option>
              <option value="2">Light pan with lid OR medium pot</option>
              <option value="3">Medium pot with lid OR heavy stock pot</option>
              <option value="4">Heavy pot with lid OR cast iron pan</option>
              <option value="5">Cast iron with lid</option>
            </select>
          </div>

          <div className="form-group">
            <label>Stovetop Monitoring</label>
            <select className="cuisine-select" value={stovetop} onChange={e => setStovetop(e.target.value)}>
              <option value="">Select monitoring level...</option>
              <option value="0">No stovetop used</option>
              <option value="1">Oven with timer only</option>
              <option value="4">Occasional check (every 15-20 min)</option>
              <option value="8">Regular check (every 5-10 min)</option>
              <option value="12">Frequent — can step away briefly (every 2-3 min)</option>
              <option value="15">Cannot walk away at all (active boil, candy, caramel)</option>
            </select>
          </div>

          <div className="form-group">
            <label>Multi-tasking Level</label>
            <select className="cuisine-select" value={multitasking} onChange={e => setMultitasking(e.target.value)}>
              <option value="">Select multi-tasking level...</option>
              <option value="0">Fully linear — one thing at a time</option>
              <option value="3">Two things occasionally overlapping</option>
              <option value="6">Two things actively simultaneous</option>
              <option value="10">Three or more things simultaneous</option>
            </select>
          </div>

          <div className="form-group">
            <label>Fine Motor Tasks</label>
            <select className="cuisine-select" value={fineMotor} onChange={e => setFineMotor(e.target.value)}>
              <option value="">Select most intensive fine motor task...</option>
              <option value="0">None</option>
              <option value="2">Simple peeling (small quantity) or light zesting</option>
              <option value="5">Full lemon/lime zesting</option>
              <option value="6">Deveining shrimp</option>
              <option value="7">Peeling large quantity (4+ items)</option>
              <option value="8">Butterflying chicken</option>
              <option value="10">Filleting fish OR straining through cheesecloth</option>
              <option value="11">Removing all fat/sinew from meat</option>
              <option value="13">Deboning</option>
              <option value="15">Decorative cuts (curly fries, ribbon cuts, sushi-style cucumber)</option>
            </select>
          </div>

          <div className="publish-actions">
            <button className="submit-btn" onClick={handlePublish} disabled={loading}>
              {loading ? 'Publishing...' : '🎛️ Publish Remix'}
            </button>
            <button className="skip-btn" onClick={() => { setPage(1); window.scrollTo(0, 0) }}>
              ← Go back and edit
            </button>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="upload-layout">
      <div className="remix-banner">
        🎛️ Remix Upload Form
      </div>

      <div className="remix-original-ref">
        <p>You're remixing:</p>
        <div className="remix-original-card">
          {originalRecipe.image_url && (
            <img src={originalRecipe.image_url} alt={originalRecipe.title} className="remix-original-img" />
          )}
          <div className="remix-original-info">
            <strong>{originalRecipe.title}</strong>
            <span>🥄 {originalRecipe.spoon_score}/10 spoons</span>
            <span>
              {[1,2,3,4,5].map(star => (
                <span key={star} style={{color: originalRecipe.rating >= star ? '#7b1f4a' : '#ddd'}}>★</span>
              ))}
            </span>
          </div>
          <Link to={`/recipes/${originalRecipe.slug}`} className="remix-original-link">
            View original →
          </Link>
        </div>
      </div>

      {error && <p className="auth-error">{error}</p>}

      <div className="upload-card">

        <div className="form-group">
          <label>Remix Title</label>
          <p className="field-hint">
            Your remix will be titled: <strong>{originalRecipe.title}</strong> —
            add up to 15 characters to complete it (e.g. "Nut-free version",
            "Dairy-free", "Air fryer").
          </p>
          <div className="remix-title-row">
            <span className="remix-title-prefix">{originalRecipe.title} —</span>
            <input
              type="text"
              className="remix-title-input"
              placeholder="e.g. Nut-free version"
              value={titleSuffix}
              maxLength={15}
              onChange={e => setTitleSuffix(e.target.value)}
            />
          </div>
          <p className="bio-char-count">{titleSuffix.length}/15</p>
        </div>

        <div className="form-group">
          <label>What did you change?</label>
          <p className="field-hint">
            Describe the differences between your remix and the
            original recipe. This is required so the community
            knows what makes your version unique.
          </p>
          <textarea
            placeholder="e.g. Replaced all nuts with sunflower seeds to make this nut-free. Also swapped butter for coconut oil."
            value={remixDescription}
            onChange={e => setRemixDescription(e.target.value)}
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
          <p className="field-hint">Select all that apply.</p>
          <div className="tag-grid">
            {selectedTags.length > 0 && selectedTags.map(tag => (
              <span key={tag} className="tag-selected">
                {tag}
                <button type="button" className="tag-remove" onClick={() => handleTagToggle(tag)}>×</button>
              </span>
            ))}
            <button ref={tagBtnRef} type="button" className="tag-toggle add-tag"
              onClick={() => setShowTagPicker(!showTagPicker)}>+ Add tag</button>
          </div>
          {showTagPicker && (
            <div className="tag-picker" ref={tagPickerRef}>
              {dietOptions.map(tag => (
                <button key={tag} type="button"
                  className={`tag-toggle ${selectedTags.includes(tag) ? 'active' : ''}`}
                  onClick={() => handleTagToggle(tag)}>{tag}</button>
              ))}
            </div>
          )}
        </div>

        <div className="form-group">
          <label>Number of portions</label>
          <div className="portions-wrapper">
            <input
              type="text"
              placeholder="e.g. 4"
              value={portions}
              onChange={e => {
                const val = e.target.value.replace(/[^0-9]/g, '')
                if (val === '' || (parseInt(val) >= 1 && parseInt(val) <= 99)) setPortions(val)
              }}
              className="portions-input"
            />
            <div className="portions-btns">
              <button type="button" className="portions-btn"
                onClick={() => setPortions(p => Math.min(99, (parseInt(p) || 0) + 1))}>▲</button>
              <button type="button" className="portions-btn"
                onClick={() => setPortions(p => Math.max(1, (parseInt(p) || 2) - 1))}>▼</button>
            </div>
          </div>
        </div>

        <div className="form-group">
          <label>Recipe photo</label>
          <p className="field-hint">Leave as-is to use the original photo,
          or upload a new one for your remix.</p>
          {imagePreview && (
            <img src={imagePreview} alt="Preview" className="image-preview" />
          )}
          <input type="file" accept="image/*" onChange={handleImageChange} />
        </div>

        <div className="form-group">
          <label>Ingredients</label>
          <p className="field-hint">
            The original ingredients are pre-loaded. Edit, remove,
            or use the <strong>+</strong> button to insert a new
            ingredient after any line.
          </p>
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
              <button type="button" className="insert-btn"
                onClick={() => addIngredientAfter(i)}>+</button>
              {ingredients.length > 1 && (
                <button type="button" className="remove-btn"
                  onClick={() => removeIngredient(i)}>×</button>
              )}
            </div>
          ))}
        </div>

        <div className="form-group">
          <label>Steps</label>
          <p className="field-hint">
            The original steps are pre-loaded. Edit, remove,
            or use the <strong>+</strong> button to insert a
            new step after any line.
          </p>
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
              <button type="button" className="insert-btn"
                onClick={() => addStepAfter(i)}>+</button>
              {steps.length > 1 && (
                <button type="button" className="remove-btn"
                  onClick={() => removeStep(i)}>×</button>
              )}
            </div>
          ))}
        </div>

        {error && <p className="auth-error">{error}</p>}
        <button className="submit-btn" onClick={handleNextPage}>
          Next — Review & Score →
        </button>

      </div>
    </main>
  )
}

export default RemixRecipe