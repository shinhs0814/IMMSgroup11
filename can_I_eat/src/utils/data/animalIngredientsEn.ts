/**
 * English animal-derived ingredient dictionary.
 *
 * Mirror of `animalIngredientsKo.ts` for English-language labels. Used by
 * `englishVeganClassifier.ts`. Same RED / AMBER schema so the multilingual
 * dispatcher can swap languages without changing the public API.
 *
 * Scope: V2 wedge expansion (US/EU packaged food labels). Keep entries to
 * canonical English ingredient names that appear on FDA-style ingredient
 * lists. Brand-specific terms (e.g. "McDonald's beef tallow") belong in
 * V3+ when we have a brand layer.
 */

export type IngredientEntry = {
  /** Canonical English term as it appears in ingredient lists (lowercase). */
  term: string;
  /** Optional alternate spellings / plurals / synonyms (all lowercase). */
  aliases?: string[];
};

/**
 * Confirmed animal-derived. If any match, NOT vegan.
 */
export const RED_LIST: IngredientEntry[] = [
  // Meat
  { term: 'beef', aliases: ['beef stock', 'beef broth', 'beef tallow', 'beef extract'] },
  { term: 'pork', aliases: ['pork stock', 'pork broth', 'pork fat'] },
  { term: 'chicken', aliases: ['chicken stock', 'chicken broth', 'chicken fat'] },
  { term: 'turkey' },
  { term: 'lamb', aliases: ['mutton'] },
  { term: 'duck' },
  { term: 'ham' },
  { term: 'bacon' },
  { term: 'sausage' },
  { term: 'lard' },
  { term: 'tallow' },
  { term: 'gelatin' },
  { term: 'meat', aliases: ['meat extract'] },

  // Seafood
  { term: 'fish', aliases: ['fish sauce', 'fish oil', 'fish extract'] },
  { term: 'anchovy', aliases: ['anchovies'] },
  { term: 'shrimp', aliases: ['prawn', 'prawns'] },
  { term: 'crab' },
  { term: 'lobster' },
  { term: 'squid', aliases: ['calamari'] },
  { term: 'octopus' },
  { term: 'tuna' },
  { term: 'salmon' },
  { term: 'cod' },
  { term: 'oyster', aliases: ['oyster sauce'] },
  { term: 'clam' },
  { term: 'bonito' },

  // Dairy
  { term: 'milk', aliases: ['whole milk', 'skim milk', 'condensed milk', 'milk powder'] },
  { term: 'cream' },
  { term: 'butter' },
  { term: 'cheese', aliases: ['parmesan', 'cheddar'] },
  { term: 'yogurt', aliases: ['yoghurt'] },
  { term: 'whey', aliases: ['whey protein'] },
  { term: 'casein', aliases: ['caseinate', 'sodium caseinate'] },
  { term: 'lactose' },
  { term: 'ghee' },

  // Eggs
  { term: 'egg', aliases: ['eggs', 'egg white', 'egg yolk', 'whole egg', 'egg powder'] },
  { term: 'albumen' },

  // Other animal-derived
  { term: 'honey' },
  { term: 'royal jelly' },
  { term: 'carmine', aliases: ['cochineal', 'natural red 4'] },
  { term: 'shellac' },
  { term: 'isinglass' },
];

/**
 * Ambiguous (animal OR plant source). Triggers `caution`.
 */
export const AMBER_LIST: IngredientEntry[] = [
  { term: 'natural flavoring', aliases: ['natural flavor', 'natural flavors', 'flavoring', 'flavor'] },
  { term: 'emulsifier' },
  { term: 'l-cysteine', aliases: ['cysteine'] },
  { term: 'vitamin d3' },
  { term: 'glycerin', aliases: ['glycerol', 'glycerine'] },
  { term: 'mono- and diglycerides', aliases: ['monoglycerides', 'diglycerides'] },
  { term: 'stearic acid' },
  { term: 'lecithin' }, // usually soy but not guaranteed
  { term: 'omega-3' }, // could be fish oil
  { term: 'collagen' },
];
