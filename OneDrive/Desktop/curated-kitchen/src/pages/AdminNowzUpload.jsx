import { useState } from 'react'
import './AdminNowzUpload.css'

const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9yZnNnZmR2b2ppaGRkZXdvcnV6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYwMTMxODYsImV4cCI6MjA5MTU4OTE4Nn0.lQuHjktlnZmv6BGZrZxQ4gQl_WBQysF2vEjZv38Z-0A'
const DB = 'https://orfsgfdvojihddeworuz.supabase.co'
const HEADERS = { 'apikey': ANON_KEY, 'Authorization': `Bearer ${ANON_KEY}` }

const categories = [
  'Energy Drinks', 'Protein Bars', 'Snacks', 'Frozen Meals',
  'Ready to Eat', 'Drinks', 'Desserts', 'Canned Goods', 'Other'
]

const dietOptions = [
  "Keto", "Paleo", "Mediterranean", "Vegan", "Vegetarian",
  "Halal", "Kosher", "Low-carb", "Low-sodium", "DASH",
  "Whole30", "AIP", "Gluten-free", "Dairy-free", "Egg-free",
  "Nut-free", "Peanut-free", "Soy-free", "Shellfish-free",
  "Fish-free", "Sesame-free", "Chocolate-free"
]

function blankItem() {
  return {
    barcode: '', looking: false, minimized: false,
    name: '', brand: '', category: '', description: '',
    imageUrl: '', imageFile: null, imagePreview: null,
    calories: '', protein: '', carbs: '', fat: '',
    fiber: '', sugar: '', sodium: '', ingredients: '',
    selectedTags: [], possibleTags: [],
    error: '', saved: false, saving: false
  }
}

function autoDetectTags(ingredientText) {
  const text = ingredientText.toLowerCase()
  const confirmed = []
  const possible = []

  // CONFIRMED auto-detectable by absence:
  if (!/sugar|honey|maple|corn syrup|maltose|dextrose|fructose/.test(text) &&
    !/flour|bread|pasta|rice|oat|potato|corn/.test(text))
    confirmed.push('Keto', 'Low-carb')

  if (!/wheat|gluten|barley|rye|malt|spelt|farro|breadcrumb|soy sauce|couscous/.test(text))
    confirmed.push('Gluten-free')

  if (!/milk|butter|cream|cheese|yogurt|whey|casein|lactose|ghee|kefir/.test(text))
    confirmed.push('Dairy-free')

  if (!/egg|eggs|mayonnaise|meringue|albumin/.test(text))
    confirmed.push('Egg-free')

  if (!/soy|soya|tofu|edamame|miso|tempeh|tamari/.test(text))
    confirmed.push('Soy-free')

  if (!/almond|walnut|pecan|cashew|pistachio|hazelnut|macadamia|pine nut|brazil nut|chestnut/.test(text))
    confirmed.push('Nut-free')

  if (!/peanut|groundnut/.test(text))
    confirmed.push('Peanut-free')

  if (!/sesame|tahini/.test(text))
    confirmed.push('Sesame-free')

  if (!/shrimp|crab|lobster|prawn|crayfish|scallop|clam|oyster|mussel|squid|octopus/.test(text))
    confirmed.push('Shellfish-free')

  if (!/salmon|tuna|cod|tilapia|halibut|anchovy|sardine|mahi|bass|trout|catfish|fish sauce|worcestershire/.test(text))
    confirmed.push('Fish-free')

  if (!/chocolate|cocoa|cacao|nutella/.test(text))
    confirmed.push('Chocolate-free')

  if (!/chicken|beef|pork|lamb|turkey|fish|shrimp|bacon|gelatin|honey|whey|casein|egg|eggs/.test(text))
    confirmed.push('Vegan')

  if (!/chicken|beef|pork|lamb|turkey|bacon|ham|sausage|anchovies|gelatin|lard|fish sauce|shrimp|salmon|tuna|cod/.test(text))
    confirmed.push('Vegetarian')

  // POSSIBLE matches — educated guesses, require verification:

  // Paleo: no grains, no legumes, no refined sugar, no soy
  // (dairy in moderation is acceptable)
  if (!/wheat|flour|bread|pasta|rice|oat|corn|barley|rye|spelt|farro|couscous/.test(text) &&
    !/beans|lentils|chickpea|peanut|soy|tofu|edamame|legume/.test(text) &&
    !/refined sugar|white sugar|granulated sugar|corn syrup/.test(text))
    possible.push('Paleo')

  // Whole30: no grains, no legumes, no dairy, no sugar, no soy, no alcohol
  if (!/wheat|flour|bread|pasta|rice|oat|corn|barley|rye/.test(text) &&
    !/beans|lentils|chickpea|peanut|soy|tofu|edamame/.test(text) &&
    !/milk|cheese|yogurt|cream|butter|whey|casein/.test(text) &&
    !/sugar|honey|maple|agave|stevia|splenda/.test(text) &&
    !/wine|beer|alcohol|bourbon|rum|vodka/.test(text))
    possible.push('Whole30')

  // AIP: Paleo rules + no eggs, no nightshades, no nuts, no seeds
  if (!/wheat|flour|bread|pasta|rice|oat|corn|barley|rye/.test(text) &&
    !/beans|lentils|chickpea|peanut|soy|tofu|edamame/.test(text) &&
    !/egg|eggs|mayonnaise/.test(text) &&
    !/tomato|pepper|eggplant|potato|paprika|cayenne|chili/.test(text) &&
    !/almond|walnut|pecan|cashew|pistachio|hazelnut|macadamia|pine nut/.test(text) &&
    !/sesame|sunflower|pumpkin seed|chia|flax/.test(text))
    possible.push('AIP')

  // Mediterranean: olive oil present, or fish/seafood present, or heavy vegetables
  if (/olive oil/.test(text) ||
    (/salmon|tuna|cod|tilapia|halibut|sardine|anchovy|shrimp|clam|mussel/.test(text) &&
    !/deep fry|fried/.test(text)))
    possible.push('Mediterranean')

  // DASH: no high-sodium ingredients, no processed meats
  if (!/salt|sodium|soy sauce|fish sauce|worcestershire|anchovies/.test(text) &&
    !/bacon|ham|sausage|hot dog|deli meat|pepperoni|salami/.test(text))
    possible.push('DASH')

  return { confirmed, possible }
}

function ItemForm({ item, index, onChange, onRemove, onLookup, onSave }) {

  function update(field, value) {
    onChange(index, field, value)
  }

  function toggleTag(tag) {
    const tags = item.selectedTags.includes(tag)
      ? item.selectedTags.filter(t => t !== tag)
      : [...item.selectedTags, tag]
    update('selectedTags', tags)
  }

  function handleImageFile(e) {
    const file = e.target.files[0]
    if (file) {
      update('imageFile', file)
      update('imagePreview', URL.createObjectURL(file))
    }
  }

  return (
    <div className="item-form-wrapper">
      <div
        className="item-form-bar"
        onClick={() => update('minimized', !item.minimized)}
      >
        <span className="item-form-bar-title">
          {item.name || `Item ${index + 1}`}
          {item.saved && <span className="item-saved-badge">✓ Saved</span>}
        </span>
        <div className="item-form-bar-actions">
          {index > 0 && (
            <button
              className="item-remove-btn"
              onClick={e => { e.stopPropagation(); onRemove(index) }}
            >Remove</button>
          )}
          <span className="item-minimize-arrow">
            {item.minimized ? '▼' : '▲'}
          </span>
        </div>
      </div>

      {!item.minimized && (
        <div className="item-form-body">

          <div className="admin-group">
            <label>Barcode / UPC (optional)</label>
            <div className="barcode-row">
              <input
                type="text"
                className="admin-input"
                placeholder="e.g. 049000050103"
                value={item.barcode}
                onChange={e => update('barcode', e.target.value)}
              />
              <button
                className="barcode-btn"
                onClick={() => onLookup(index)}
                disabled={item.looking}
              >{item.looking ? 'Looking up...' : 'Look up'}</button>
            </div>
          </div>

          <div className="admin-group">
            <label>Product Image</label>
            {item.imagePreview && (
              <>
                <img
                  src={item.imagePreview}
                  alt="Product"
                  className="admin-image-preview"
                />
                <button
                  className="item-remove-btn"
                  style={{marginBottom: '10px'}}
                  onClick={() => {
                    update('imagePreview', null)
                    update('imageUrl', '')
                    update('imageFile', null)
                  }}
                >Remove image</button>
              </>
            )}
            <p className="admin-hint">Upload a file:</p>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageFile}
            />
            <p className="admin-hint" style={{marginTop: '10px'}}>
            Or paste an image URL to fetch and save to our servers:</p>
            <div className="barcode-row">
              <input
                type="text"
                className="admin-input"
                placeholder="https://..."
                value={item.imageUrl}
                onChange={e => update('imageUrl', e.target.value)}
              />
              <button
                className="barcode-btn"
                onClick={() => {
                  if (item.imageUrl) update('imagePreview', item.imageUrl)
                }}
              >Preview</button>
            </div>
          </div>

          <div className="admin-group">
            <label>Product Name *</label>
            <input
              type="text"
              className="admin-input"
              value={item.name}
              onChange={e => update('name', e.target.value)}
              placeholder="e.g. Gatorade Zero"
            />
          </div>

          <div className="admin-group">
            <label>Brand</label>
            <input
              type="text"
              className="admin-input"
              value={item.brand}
              onChange={e => update('brand', e.target.value)}
              placeholder="e.g. Gatorade"
            />
          </div>

          <div className="admin-group">
            <label>Category *</label>
            <select
              className="admin-select"
              value={item.category}
              onChange={e => update('category', e.target.value)}
            >
              <option value="">Select a category...</option>
              {categories.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="admin-group">
            <label>Description</label>
            <textarea
              className="admin-textarea"
              value={item.description}
              onChange={e => update('description', e.target.value)}
              rows={3}
              placeholder="Brief description of the product..."
            />
          </div>

          <div className="admin-group">
            <label>Nutrition Facts (per serving)</label>
            <div className="nutrition-row">
              {[
                ['Calories', 'calories'],
                ['Fat (g)', 'fat'],
                ['Sodium (mg)', 'sodium'],
                ['Total Carbs (g)', 'carbs'],
                ['Dietary Fiber (g)', 'fiber'],
                ['Total Sugars (g)', 'sugar'],
                ['Protein (g)', 'protein'],
              ].map(([label, field]) => (
                <div key={field} className="nutrition-field">
                  <label>{label}</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={item[field]}
                    onChange={e => update(field,
                      e.target.value.replace(/[^0-9.]/g, ''))}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="admin-group">
            <label>Ingredients list</label>
            <textarea
              className="admin-textarea"
              value={item.ingredients}
              onChange={e => update('ingredients', e.target.value)}
              rows={3}
              placeholder="Full ingredients list from label..."
            />
          </div>

          <div className="admin-group">
  <label>Dietary Tags (auto-detected + manual)</label>
  <p className="admin-hint">
    Tags in green were auto-detected from the ingredients list.
    Toggle any tag to add or remove it manually.
  </p>

  <div className="admin-halal-note">
    ⚠️ If this recipe or product should be considered
    <strong> Halal</strong> or <strong>Kosher</strong>, please
    note any necessary ingredient substitutions or preparation
    requirements in the description field above.
  </div>

  <div className="admin-tags">
    {dietOptions.map(tag => (
      <button
        key={tag}
        type="button"
        className={`admin-tag-btn ${item.selectedTags.includes(tag) ? 'active' : ''}`}
        onClick={() => toggleTag(tag)}
      >{tag}</button>
    ))}
  </div>

  {item.possibleTags?.length > 0 && (
    <div className="admin-possible-tags">
      <p className="admin-possible-title">
        🔍 Possible matches — please verify before selecting:
      </p>
      <div className="admin-tags">
        {item.possibleTags.map(tag => (
          <button
            key={tag}
            type="button"
            className={`admin-tag-btn possible ${item.selectedTags.includes(tag) ? 'active' : ''}`}
            onClick={() => toggleTag(tag)}
          >{tag} ?</button>
        ))}
      </div>
    </div>
  )}
</div>

          {item.error && <p className="auth-error">{item.error}</p>}
          {item.saved && (
            <div className="item-success">✓ This item is ready!</div>
          )}

        </div>
      )}
    </div>
  )
}

function AdminNowzUpload() {
  const [items, setItems] = useState([blankItem()])
  const [publishingAll, setPublishingAll] = useState(false)
  const [publishSuccess, setPublishSuccess] = useState(false)
  const [publishCount, setPublishCount] = useState(0)

  function updateItem(index, field, value) {
    setItems(prev => prev.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    ))
  }

  function addItem() {
    setItems(prev => [...prev, blankItem()])
  }

  function removeItem(index) {
    setItems(prev => prev.filter((_, i) => i !== index))
  }

  async function handleLookup(index) {
    const item = items[index]
    if (!item.barcode.trim()) return
    updateItem(index, 'looking', true)
    updateItem(index, 'error', '')
    try {
      const res = await fetch(
        `https://world.openfoodfacts.org/api/v0/product/${item.barcode.trim()}.json`
      )
      const data = await res.json()
      if (data.status === 0) {
        updateItem(index, 'error',
          'Product not found. Please fill in manually.')
        updateItem(index, 'looking', false)
        return
      }
      const p = data.product
      const n = p.nutriments || {}
      const ingredientText = p.ingredients_text || ''
      const { confirmed, possible } = autoDetectTags(ingredientText)
setItems(prev => prev.map((it, i) => i === index ? {
  ...it,
  looking: false,
  name: p.product_name || '',
  brand: p.brands || '',
  imageUrl: p.image_url || '',
  imagePreview: p.image_url || null,
  ingredients: ingredientText,
  calories: Math.round(n['energy-kcal_100g'] || 0).toString(),
  protein: (n.proteins_100g || 0).toFixed(1),
  carbs: (n.carbohydrates_100g || 0).toFixed(1),
  fat: (n.fat_100g || 0).toFixed(1),
  fiber: (n.fiber_100g || 0).toFixed(1),
  sugar: (n.sugars_100g || 0).toFixed(1),
  sodium: Math.round((n.sodium_100g || 0) * 1000).toString(),
  selectedTags: [...new Set([...it.selectedTags, ...confirmed])],
  possibleTags: possible
} : it))

    } catch(e) {
      updateItem(index, 'error',
        'Failed to fetch product. Please fill in manually.')
      updateItem(index, 'looking', false)
    }
  }

async function handlePublishAll() {
    setPublishingAll(true)
    setPublishSuccess(false)
    let count = 0
    const unpublished = items
      .map((item, index) => ({ item, index }))
      .filter(({ item }) => !item.saved)

    for (const { index } of unpublished) {
      const item = items[index]
      if (!item.name || !item.category) {
        updateItem(index, 'error',
          'Product name and category are required.')
        updateItem(index, 'minimized', false)
        continue
      }
      await handleSave(index)
      count++
    }

    setPublishCount(count)
    if (count > 0) setPublishSuccess(true)
    setPublishingAll(false)
  }

  async function handleSave(index) {
    const item = items[index]
    if (!item.name) { updateItem(index, 'error', 'Product name is required.'); return }
    if (!item.category) { updateItem(index, 'error', 'Please select a category.'); return }

    updateItem(index, 'saving', true)
    updateItem(index, 'error', '')

    let finalImageUrl = item.imageUrl

    const keys = Object.keys(localStorage)
    let userId = 'admin'
    for (const key of keys) {
      if (key.startsWith('sb-') && key.includes('auth')) {
        try {
          const parsed = JSON.parse(localStorage.getItem(key))
          if (parsed?.user?.id) { userId = parsed.user.id; break }
        } catch(e) {}
      }
    }

    if (item.imageFile) {
      const fileName = `nowz-${userId}-${Date.now()}.${item.imageFile.name.split('.').pop()}`
      const formData = new FormData()
      formData.append('', item.imageFile)
      const uploadRes = await fetch(
        `${DB}/storage/v1/object/recipe-images/${fileName}`,
        {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${ANON_KEY}`, 'x-upsert': 'true' },
          body: formData
        }
      )
      if (uploadRes.ok) {
        finalImageUrl = `${DB}/storage/v1/object/public/recipe-images/${fileName}`
      }
    } else if (item.imageUrl && !item.imageFile) {
      try {
        const imgRes = await fetch(item.imageUrl)
        const blob = await imgRes.blob()
        const ext = blob.type.split('/')[1] || 'jpg'
        const fileName = `nowz-${userId}-${Date.now()}.${ext}`
        const formData = new FormData()
        formData.append('', blob, fileName)
        const uploadRes = await fetch(
          `${DB}/storage/v1/object/recipe-images/${fileName}`,
          {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${ANON_KEY}`, 'x-upsert': 'true' },
            body: formData
          }
        )
        if (uploadRes.ok) {
          finalImageUrl = `${DB}/storage/v1/object/public/recipe-images/${fileName}`
        }
      } catch(e) {
        console.warn('Could not fetch image from URL, using URL directly:', e)
      }
    }

    const res = await fetch(`${DB}/rest/v1/nowz_foodz`, {
      method: 'POST',
      headers: { ...HEADERS, 'Content-Type': 'application/json', 'Prefer': 'return=minimal' },
      body: JSON.stringify({
        name: item.name, brand: item.brand, category: item.category,
        description: item.description, image_url: finalImageUrl,
        barcode: item.barcode || null,
        calories: parseFloat(item.calories) || 0,
        protein: parseFloat(item.protein) || 0,
        carbs: parseFloat(item.carbs) || 0,
        fat: parseFloat(item.fat) || 0,
        fiber: parseFloat(item.fiber) || 0,
        sugar: parseFloat(item.sugar) || 0,
        sodium: parseFloat(item.sodium) || 0,
        ingredients: item.ingredients,
        tags: item.selectedTags,
        is_approved: true
      })
    })

    if (res.ok) {
      updateItem(index, 'saved', true)
      updateItem(index, 'minimized', true)
    } else {
      const err = await res.text()
      updateItem(index, 'error', 'Failed to save: ' + err)
    }
    updateItem(index, 'saving', false)
  }

  return (
    <main className="main">
      <div className="admin-layout">
        <h2 className="admin-title">Admin — Add Nowz Foodz Items</h2>

        {publishSuccess && (
          <div className="publish-success">
            🎉 Success! {publishCount} item{publishCount !== 1 ? 's have' : ' has'} been
            published to the site!
          </div>
        )}

        {!publishSuccess && items.map((item, index) => (
          <ItemForm
            key={index}
            item={item}
            index={index}
            onChange={updateItem}
            onRemove={removeItem}
            onLookup={handleLookup}
            onSave={handleSave}
          />
        ))}

        {publishSuccess ? (
          <button
            className="add-another-btn"
            onClick={() => {
              setItems([blankItem()])
              setPublishSuccess(false)
              setPublishCount(0)
            }}
          >+ Add More Items</button>
        ) : (
          <>
            <button className="add-another-btn" onClick={addItem}>
              + Add Another Item
            </button>
            <button
              className="submit-btn publish-btn"
              onClick={handlePublishAll}
              disabled={publishingAll}
              style={{marginTop: '20px'}}
            >
              {publishingAll
                ? 'Publishing...'
                : `Publish ${items.filter(i => !i.saved).length} Item${items.filter(i => !i.saved).length !== 1 ? 's' : ''} to Site`
              }
            </button>
          </>
        )}
      </div>
    </main>
  )
}

export default AdminNowzUpload