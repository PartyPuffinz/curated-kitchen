const COMPONENT_MAXES = {
  chopping: 15,
  stirring: 15,
  kneading: 10,
  lifting: 5,
  stovetop: 15,
  multitasking: 10,
  fineMotor: 15,
  passive: 10,
  timing: 5,
  ingredientCount: 5,
  taskSwitching: 5,
  cleanup: 10
}

const TOTAL_MAX = Object.values(COMPONENT_MAXES).reduce((a, b) => a + b, 0)

export function calculatePersonalizedSpoonScore(recipeComponents, spoonProfile) {
  if (!spoonProfile?.scores) return null

  const { scores, equipmentAnswers } = spoonProfile

  const adjustedMaxes = { ...COMPONENT_MAXES }
  const userScores = scores

  const manualComponents = ['chopping', 'stirring', 'kneading', 'lifting',
    'stovetop', 'multitasking', 'fineMotor', 'cleanup']

  let totalRedistribute = 0
  const redistributeTo = []

  for (const comp of manualComponents) {
    const userRating = userScores[comp] ?? 5
    if (userRating === 0) {
      totalRedistribute += COMPONENT_MAXES[comp]
      adjustedMaxes[comp] = 0
    }
  }

  if (totalRedistribute > 0) {
    for (const comp of manualComponents) {
      const userRating = userScores[comp] ?? 5
      if (userRating > 0) redistributeTo.push(comp)
    }
    if (redistributeTo.length > 0) {
      const perComp = totalRedistribute / redistributeTo.length
      for (const comp of redistributeTo) {
        adjustedMaxes[comp] += perComp
      }
    }
  }

  function getMultiplier(comp) {
    const rating = userScores[comp] ?? 5
    const equipment = equipmentAnswers[comp] || ''

    if (rating === 0) return 0

    const normalizedRating = rating / 10

    if (rating >= 5) {
      if (equipment === 'yes') {
        return 0.7 + (normalizedRating * 0.5)
      } else if (equipment === 'no') {
        return 0.85 + (normalizedRating * 0.6)
      } else if (equipment === 'neither') {
        return 1.0 + (normalizedRating * 0.4)
      }
    }

    return 0.3 + (normalizedRating * 0.7)
  }

  const componentMap = {
    chopping: recipeComponents.chopping || 0,
    stirring: recipeComponents.stirring || 0,
    kneading: recipeComponents.kneading || 0,
    lifting: recipeComponents.lifting || 0,
    stovetop: recipeComponents.stovetop || 0,
    multitasking: recipeComponents.multitasking || 0,
    fineMotor: recipeComponents.fineMotor || 0,
    passive: recipeComponents.passiveScore || 0,
    timing: recipeComponents.timingScore || 0,
    ingredientCount: recipeComponents.ingredientScore || 0,
    taskSwitching: recipeComponents.taskScore || 0,
    cleanup: recipeComponents.cleanupScore || 0
  }

  let weightedTotal = 0
  let adjustedTotalMax = 0

  for (const comp of manualComponents) {
    const recipePoints = componentMap[comp]
    const multiplier = getMultiplier(comp)
    const adjustedMax = adjustedMaxes[comp]
    const ratio = adjustedMax / (COMPONENT_MAXES[comp] || 1)
    weightedTotal += recipePoints * multiplier * ratio
    adjustedTotalMax += adjustedMax
  }

  const autoComponents = ['passive', 'timing', 'ingredientCount', 'taskSwitching']
  for (const comp of autoComponents) {
    weightedTotal += componentMap[comp]
    adjustedTotalMax += COMPONENT_MAXES[comp]
  }

  const cleanupPoints = getCleanupPoints(recipeComponents.cleanupLevel, userScores.cleanup, equipmentAnswers.cleanup)
  weightedTotal += cleanupPoints
  adjustedTotalMax += COMPONENT_MAXES.cleanup

  const percentage = adjustedTotalMax > 0 ? (weightedTotal / adjustedTotalMax) * 100 : 0
  const spoon = Math.round((percentage / 10) * 2) / 2
  return Math.min(10, Math.max(0.5, spoon))
}

function getCleanupPoints(cleanupLevel, userCleanupScore, equipmentAnswer) {
  if (!cleanupLevel || !userCleanupScore) return 0

  const basePoints = cleanupLevel === 'High' ? 10
    : cleanupLevel === 'Medium' ? 5 : 1

  const userRating = userCleanupScore / 10
  const hasDishwasher = equipmentAnswer === 'yes'

  if (hasDishwasher) return basePoints * userRating * 0.6
  return basePoints * userRating
}