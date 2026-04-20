const USDA_API_KEY = import.meta.env.VITE_USDA_API_KEY

export async function searchFood(query) {
  const cleanQuery = query
    .replace(/\([^)]*\)/g, '')
    .replace(/[^a-zA-Z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .split(' ')
    .slice(0, 4)
    .join(' ')

  if (cleanQuery.length < 2) return []

  const res = await fetch(
    `https://api.nal.usda.gov/fdc/v1/foods/search?query=${encodeURIComponent(cleanQuery)}&api_key=${USDA_API_KEY}&pageSize=5&dataType=Foundation,SR%20Legacy`
  )
  if (!res.ok) return []
  const data = await res.json()
  return data.foods || []
}

function parseIngredient(ingredientStr) {
  const fractionMap = {
    '½': '0.5', '¼': '0.25', '¾': '0.75',
    '⅓': '0.333', '⅔': '0.667', '⅛': '0.125',
    '⅜': '0.375', '⅝': '0.625', '⅞': '0.875'
  }

  let str = ingredientStr.trim()
  for (const [fraction, value] of Object.entries(fractionMap)) {
    str = str.replace(fraction, value)
  }

  str = str.replace(/\([^)]*\)/g, '').trim()

  const amountMatch = str.match(/^([\d\.]+)\s*(\d+\/\d+)?/)
  let amount = 0
  if (amountMatch) {
    amount = parseFloat(amountMatch[1]) || 0
    if (amountMatch[2]) {
      const parts = amountMatch[2].split('/')
      amount += parseInt(parts[0]) / parseInt(parts[1])
    }
  }

  const unitMatch = str.match(
    /\b(oz|lb|lbs|tsp|tbsp|cup|cups|g|kg|ml|l|qt|pt|c)\b/i
  )
  const unit = unitMatch ? unitMatch[1].toLowerCase() : ''

  const nameStr = str
    .replace(/^[\d\.\s]+/, '')
    .replace(/\b(oz|lb|lbs|tsp|tbsp|cup|cups|g|kg|ml|l|qt|pt|c)\b/i, '')
    .replace(/[^a-zA-Z\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .split(' ')
    .slice(0, 3)
    .join(' ')

  return { amount, unit, name: nameStr }
}

function convertToGrams(amount, unit) {
  if (!amount || amount === 0) return 100

  const conversions = {
    g: 1,
    kg: 1000,
    oz: 28.3495,
    lb: 453.592,
    lbs: 453.592,
    tsp: 4.2,
    tbsp: 14.175,
    cup: 236.588,
    cups: 236.588,
    c: 236.588,
    ml: 1,
    l: 1000,
    qt: 946.353,
    pt: 473.176
  }

  if (!unit || !conversions[unit]) return Math.min(amount * 100, 500)
  return amount * conversions[unit]
}

function isReasonableNutrition(calories, grams) {
  if (grams <= 0) return false
  const calPer100g = (calories / grams) * 100
  return calPer100g >= 0 && calPer100g <= 900
}

export async function calculateRecipeNutrition(ingredients, portions) {
  const results = {
    calories: 0, protein: 0, fat: 0,
    carbs: 0, fiber: 0, sugar: 0, sodium: 0
  }

  for (const ingredient of ingredients) {
    try {
      const parsed = parseIngredient(ingredient)
      if (!parsed.name || parsed.name.length < 2) continue

      const foods = await searchFood(parsed.name)
      if (!foods || foods.length === 0) continue

      const food = foods[0]
      const grams = convertToGrams(parsed.amount, parsed.unit)
      const ratio = grams / 100

      const nutrients = food.foodNutrients || []

      const getVal = (id) => {
        const n = nutrients.find(n =>
          n.nutrientId === id ||
          n.nutrientNumber === String(id)
        )
        const raw = n ? (n.value ?? n.amount ?? 0) : 0
        return raw * ratio
      }

      const itemCalories = getVal(1008)
      const itemSodium = getVal(1093)

      if (!isReasonableNutrition(itemCalories, grams)) continue
      if (itemSodium > 5000) continue

      results.calories += itemCalories
      results.protein += getVal(1003)
      results.fat += getVal(1004)
      results.carbs += getVal(1005)
      results.fiber += getVal(1079)
      results.sugar += getVal(2000)
      results.sodium += itemSodium

    } catch (err) {
      console.warn('Could not get nutrition for:', ingredient, err)
    }
  }

  const perPortion = portions > 0 ? portions : 1

  return {
    calories: Math.round(results.calories / perPortion),
    protein: Math.round(results.protein / perPortion * 10) / 10,
    fat: Math.round(results.fat / perPortion * 10) / 10,
    carbs: Math.round(results.carbs / perPortion * 10) / 10,
    fiber: Math.round(results.fiber / perPortion * 10) / 10,
    sugar: Math.round(results.sugar / perPortion * 10) / 10,
    sodium: Math.round(results.sodium / perPortion)
  }
}