export const ALLERGIES = [
  { id: 'peanuts', label: 'Peanuts', emoji: '🥜' },
  { id: 'tree_nuts', label: 'Tree Nuts', emoji: '🌰' },
  { id: 'milk', label: 'Milk / Dairy', emoji: '🥛' },
  { id: 'eggs', label: 'Eggs', emoji: '🥚' },
  { id: 'wheat', label: 'Wheat / Gluten', emoji: '🌾' },
  { id: 'soy', label: 'Soy', emoji: '🫘' },
  { id: 'fish', label: 'Fish', emoji: '🐟' },
  { id: 'shellfish', label: 'Shellfish', emoji: '🦐' },
  { id: 'sesame', label: 'Sesame', emoji: '🌱' },
  { id: 'sulfites', label: 'Sulfites', emoji: '🍷' },
];

export const DIETARY_RESTRICTIONS = [
  { id: 'lactose_intolerant', label: 'Lactose Intolerant', emoji: '🚫🥛' },
  { id: 'celiac', label: 'Celiac Disease', emoji: '🚫🌾' },
  { id: 'diabetic', label: 'Diabetic', emoji: '💉' },
  { id: 'low_sodium', label: 'Low Sodium', emoji: '🧂' },
  { id: 'low_sugar', label: 'Low Sugar', emoji: '🍬' },
  { id: 'kidney_disease', label: 'Kidney Disease', emoji: '🫀' },
  { id: 'ibs', label: 'IBS / Low FODMAP', emoji: '🌿' },
  { id: 'halal', label: 'Halal', emoji: '☪️' },
  { id: 'kosher', label: 'Kosher', emoji: '✡️' },
];

export const DIETARY_PREFERENCES = [
  { id: 'vegan', label: 'Vegan', emoji: '🌱', description: 'No animal products' },
  { id: 'vegetarian', label: 'Vegetarian', emoji: '🥗', description: 'No meat or fish' },
  { id: 'pescatarian', label: 'Pescatarian', emoji: '🐟', description: 'No meat, fish is okay' },
  { id: 'keto', label: 'Keto', emoji: '🥑', description: 'Low carb, high fat' },
  { id: 'paleo', label: 'Paleo', emoji: '🥩', description: 'Whole foods, no processed' },
  { id: 'mediterranean', label: 'Mediterranean', emoji: '🫒', description: 'Olive oil, fish, whole grains' },
  { id: 'low_carb', label: 'Low Carb', emoji: '🍞', description: 'Reduced carbohydrates' },
  { id: 'low_fat', label: 'Low Fat', emoji: '🥙', description: 'Reduced fat intake' },
  { id: 'high_protein', label: 'High Protein', emoji: '💪', description: 'Muscle building, fitness' },
  { id: 'dairy_free', label: 'Dairy-Free', emoji: '🚫🧀', description: 'No dairy, by choice' },
  { id: 'gluten_free', label: 'Gluten-Free', emoji: '🌾', description: 'No gluten, by choice' },
  { id: 'low_fiber', label: 'Low Fiber', emoji: '🫁', description: 'Easy on digestion' },
  { id: 'none', label: 'No Preference', emoji: '🍽️', description: 'I eat everything' },
];

export type DietaryProfile = {
  allergies: string[];
  restrictions: string[];
  preferences: string[];
  name: string;
};
