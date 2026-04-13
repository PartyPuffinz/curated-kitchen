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

const allergenRules = {
  'Dairy-free': {
    contains: ['milk', 'butter', 'cream', 'cheese', 'yogurt', 'whey',
      'casein', 'lactose', 'ghee', 'kefir', 'mozzarella', 'cheddar',
      'parmesan', 'brie', 'gouda', 'ricotta', 'sour cream',
      'heavy cream', 'half and half', 'ice cream']
  },
  'Gluten-free': {
    contains: ['flour', 'wheat', 'barley', 'rye', 'bread', 'pasta',
      'noodle', 'soy sauce', 'breadcrumb', 'malt', 'semolina',
      'spelt', 'farro', 'couscous', 'cracker', 'cereal']
  },
  'Nut-free': {
    contains: ['almond', 'walnut', 'pecan', 'cashew', 'pistachio',
      'hazelnut', 'macadamia', 'brazil nut', 'pine nut', 'chestnut',
      'almond flour', 'almond milk', 'peanut', 'peanut butter']
  },
  'Egg-free': {
    contains: ['egg', 'eggs', 'mayonnaise', 'meringue', 'albumin']
  },
  'Soy-free': {
    contains: ['soy', 'soya', 'tofu', 'edamame', 'miso', 'tempeh',
      'soy sauce', 'tamari', 'soybean']
  },
  'Shellfish-free': {
    contains: ['shrimp', 'crab', 'lobster', 'crayfish', 'prawn',
      'scallop', 'clam', 'oyster', 'mussel', 'squid', 'octopus']
  },
  'Fish-free': {
    contains: ['salmon', 'tuna', 'cod', 'tilapia', 'halibut', 'anchovy',
      'sardine', 'mahi', 'bass', 'trout', 'catfish', 'fish sauce',
      'worcestershire']
  },
  'Sesame-free': {
    contains: ['sesame', 'tahini', 'sesame oil', 'sesame seed']
  },
  'Peanut-free': {
    contains: ['peanut', 'peanut butter', 'groundnut']
  },
  'Chocolate-free': {
    contains: ['chocolate', 'cocoa', 'cacao', 'nutella']
  },
  'Vegan': {
    contains: ['milk', 'butter', 'cream', 'cheese', 'yogurt', 'egg',
      'eggs', 'chicken', 'beef', 'pork', 'fish', 'shrimp',
      'bacon', 'gelatin', 'honey', 'whey', 'casein']
  },
  'Vegetarian': {
    contains: ['chicken', 'beef', 'pork', 'lamb', 'turkey', 'bacon',
      'ham', 'sausage', 'anchovies', 'gelatin', 'lard',
      'fish sauce', 'shrimp', 'salmon', 'tuna', 'cod']
  },
  'Keto': {
    contains: ['sugar', 'flour', 'bread', 'pasta', 'rice', 'potato',
      'corn', 'oat', 'honey', 'maple syrup', 'banana', 'apple',
      'orange juice', 'cornstarch']
  },
  'Low-carb': {
    contains: ['sugar', 'flour', 'bread', 'pasta', 'rice', 'potato',
      'corn', 'oat', 'honey', 'maple syrup']
  }
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
        const hasModifier = ketoFriendlyModifiers.some(mod =>
          lower.includes(mod)
        )
        if (hasModifier && (tag === 'Keto' || tag === 'Low-carb')) {
          return false
        }
        return true
      })
    })
    if (found) warningTags.push(tag)
    else suggestedTags.push(tag)
  }
  return { warningTags, suggestedTags }
}

function autoDetectSpoonComponents(ingredientList, stepList) {
  const allText = [...ingredientList, ...stepList].join(' ').toLowerCase()
  const stepText = stepList.join(' ').toLowerCase()

  // Component 10: Ingredient count
  const ingredientCount = ingredientList.length
  let ingredientScore = 0
  if (ingredientCount >= 17) ingredientScore = 5
  else if (ingredientCount >= 14) ingredientScore = 4
  else if (ingredientCount >= 11) ingredientScore = 3
  else if (ingredientCount >= 8) ingredientScore = 2
  else if (ingredientCount >= 5) ingredientScore = 1

  // Component 11: Task switching
  const taskKeywords = [
    'chop', 'dice', 'mince', 'slice', 'sauté', 'saute', 'brown',
    'simmer', 'whisk', 'drain', 'bake', 'broil', 'blend', 'marinate',
    'steam', 'fry', 'beat', 'fold', 'knead', 'boil', 'roast',
    'grill', 'poach', 'strain', 'shred', 'grate', 'peel', 'season',
    'deglaze', 'reduce', 'caramelize', 'sear', 'braise'
  ]
  const foundTasks = taskKeywords.filter(k => stepText.includes(k))
  const taskCount = foundTasks.length
  let taskScore = 0
  if (taskCount >= 7) taskScore = 5
  else if (taskCount >= 5) taskScore = 3
  else if (taskCount >= 3) taskScore = 1

  // Component 9: Passive waiting time
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

  // Timing precision auto-detect
  const hasMeat = /chicken|beef|pork|lamb|turkey|fish|shrimp|salmon|tuna/.test(allText)
  const hasHighPrecision = /caramelize|candy|caramel|tempering|chocolate/.test(allText)
  let timingBonus = hasMeat ? 2 : 0
  let baseTimingScore = hasHighPrecision ? 5 : 2
  const timingScore = Math.min(5, baseTimingScore + timingBonus)

  // Cleanup auto-detect
  const hasCastIron = /cast iron/.test(allText)
  const hasParchmentOrFoil = /parchment|aluminum foil|tin foil/.test(allText)
  const hasBaking = /bake|oven/.test(allText)
  const messyIngredients = /\b(flour|powdered sugar|brown sugar|granulated sugar)\b/.test(allText)
  const hasCheesecloth = /cheesecloth|cheese cloth/.test(allText)

  let cleanupLevel = 'Low'
  if (hasCastIron) cleanupLevel = 'High'
  else if (hasBaking && !hasParchmentOrFoil) cleanupLevel = 'High'
  else if (messyIngredients) cleanupLevel = 'Medium'

  return {
    ingredientScore,
    taskScore,
    passiveScore,
    timingScore,
    cleanupLevel,
    hasCheesecloth
  }
}

function calculateSpoonScore(manual, auto) {
  const chopping = manual.chopping
  const stirring = manual.stirring
  const kneading = manual.kneading
  const lifting = manual.lifting
  const stovetop = manual.stovetop
  const multitasking = manual.multitasking
  const fineMotor = manual.fineMotor

  const raw = chopping + stirring + kneading + lifting + stovetop +
    multitasking + auto.timingScore + fineMotor +
    auto.passiveScore + auto.ingredientScore + auto.taskScore

  const displayed = Math.round((raw / 115) * 100)
  const spoon = Math.round((displayed / 10) * 2) / 2
  return { raw, displayed, spoon: Math.min(10, Math.max(0.5, spoon)) }
}

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
    /(\d)(oz|lb|lbs|tsp|tbsp|cup|cups|g|kg|ml|qt|pt|gal|fl|c)\b/gi,
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

function formatStep(step) {
  const trimmed = step.trim()
  if (!trimmed) return trimmed
  const withFractions = formatFractions(trimmed)
  const withTemps = formatTemperature(withFractions)
  return withTemps.charAt(0).toUpperCase() + withTemps.slice(1)
}

function UploadRecipe() {
  const navigate = useNavigate()

  // Page state
  const [page, setPage] = useState(1)

  // Page 1 state
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

  // Page 2 state — allergen
  const [warningTags, setWarningTags] = useState([])
  const [suggestedTags, setSuggestedTags] = useState([])

  // Page 2 state — spoon score questions
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

  function handleNextPage() {
    setError('')
    if (!title) { setError('Please add a recipe title.'); return }
    if (!description) { setError('Please add a description.'); return }
    if (!portions) { setError('Please add the number of portions.'); return }
    if (!imageFile) { setError('A photo is required.'); return }
    if (ingredients.filter(i => i.trim()).length === 0) {
      setError('Please add at least one ingredient.'); return
    }
    if (steps.filter(s => s.trim()).length === 0) {
      setError('Please add at least one step.'); return
    }

    const filled = ingredients.filter(i => i.trim())
    const { warningTags: warnings, suggestedTags: suggested } =
      detectAllergenTags(filled)
    setWarningTags(warnings)
    setSuggestedTags(suggested.filter(t => !selectedTags.includes(t)))
    window.scrollTo(0, 0)
    setPage(2)
  }

  async function handlePublish() {
    setError('')

    if (!chopping) { setError('Please answer all spoon score questions.'); return }
    if (!stirring) { setError('Please answer all spoon score questions.'); return }
    if (!kneading) { setError('Please answer all spoon score questions.'); return }
    if (!lifting) { setError('Please answer all spoon score questions.'); return }
    if (!stovetop) { setError('Please answer all spoon score questions.'); return }
    if (!multitasking) { setError('Please answer all spoon score questions.'); return }
    if (!fineMotor) { setError('Please answer all spoon score questions.'); return }

    const formattedIngredients = ingredients
      .filter(i => i.trim())
      .map(formatIngredient)
    const formattedSteps = steps
      .filter(s => s.trim())
      .map(formatStep)

    const autoComponents = autoDetectSpoonComponents(
      formattedIngredients, formattedSteps
    )
    const manualComponents = {
      chopping: parseInt(chopping),
      stirring: parseInt(stirring),
      kneading: parseInt(kneading),
      lifting: parseInt(lifting),
      stovetop: parseInt(stovetop),
      multitasking: parseInt(multitasking),
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
      if (parsed?.access_token) {
        user = { id: parsed.user?.id || parsed.sub }; break
      }
    } catch(e) {}
  }
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
    const finalTags = cuisine
      ? [...new Set([...selectedTags, cuisine])]
      : [...new Set(selectedTags)]

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

  if (page === 2) {
    return (
      <main className="upload-layout">
        <div className="almost-there-banner">
          🎉 You're almost done! Just a few quick questions to help
          other cooks find and enjoy your recipe.
        </div>

        {error && <p className="auth-error">{error}</p>}

        <div className="upload-card">

          {warningTags.length > 0 && (
            <div className="allergen-warning">
              <h3>⚠️ Allergen notice</h3>
              <p>Based on your ingredients, this recipe
              <strong> contains</strong> the following — these tags
              will NOT be added automatically but please verify
              your ingredient list is accurate:</p>
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
              <p>Based on your ingredients, your recipe may
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
            </div>
          )}

          <p className="allergen-note">
            ⚠️ Allergen detection is not perfect. Please double-check
            your ingredients list to ensure accuracy before publishing.
            Users with allergies depend on this information.
          </p>

          <div className="spoon-divider">
            <h3>Effort Score Questions</h3>
            <p className="field-hint">These 5 questions help us
            calculate your recipe's Spoon Score. Be as accurate
            as you can!</p>
          </div>

          <div className="form-group">
            <label>Chopping & Cutting</label>
            <select
              className="cuisine-select"
              value={chopping}
              onChange={e => setChopping(e.target.value)}
            >
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
            <select
              className="cuisine-select"
              value={stirring}
              onChange={e => setStirring(e.target.value)}
            >
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
            <select
              className="cuisine-select"
              value={kneading}
              onChange={e => setKneading(e.target.value)}
            >
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
            <select
              className="cuisine-select"
              value={lifting}
              onChange={e => setLifting(e.target.value)}
            >
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
            <select
              className="cuisine-select"
              value={stovetop}
              onChange={e => setStovetop(e.target.value)}
            >
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
            <select
              className="cuisine-select"
              value={multitasking}
              onChange={e => setMultitasking(e.target.value)}
            >
              <option value="">Select multi-tasking level...</option>
              <option value="0">Fully linear — one thing at a time</option>
              <option value="3">Two things occasionally overlapping</option>
              <option value="6">Two things actively simultaneous</option>
              <option value="10">Three or more things simultaneous</option>
            </select>
          </div>

          <div className="form-group">
            <label>Fine Motor Tasks</label>
            <select
              className="cuisine-select"
              value={fineMotor}
              onChange={e => setFineMotor(e.target.value)}
            >
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
            <button
              className="submit-btn"
              onClick={handlePublish}
              disabled={loading}
            >
              {loading ? 'Publishing...' : '🚀 Publish Recipe'}
            </button>
            <button
              className="skip-btn"
              onClick={() => { setPage(1); window.scrollTo(0, 0) }}
            >← Go back and edit</button>
          </div>

        </div>
      </main>
    )
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
                onClick={() => setPortions(p =>
                  Math.min(99, (parseInt(p) || 0) + 1))}
              >▲</button>
              <button
                type="button"
                className="portions-btn"
                onClick={() => setPortions(p =>
                  Math.max(1, (parseInt(p) || 2) - 1))}
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
          onClick={handleNextPage}
        >
          Next — Review & Score →
        </button>

      </div>
    </main>
  )
}

export default UploadRecipe