import Anthropic from '@anthropic-ai/sdk';
import { DietaryProfile } from '../constants/dietary';

const client = new Anthropic({
  apiKey: process.env.EXPO_PUBLIC_ANTHROPIC_API_KEY || '',
  dangerouslyAllowBrowser: true,
});

const MODEL = 'claude-sonnet-4-6';

export type AnalysisResult = {
  foodName: string;
  englishName?: string;         // always in English — used internally for image search
  originalName?: string;
  originalIngredients?: string[]; // ingredients in original label language (e.g. Korean) — used by vegan classifier
  labelLanguage?: string;
  type: 'food_image' | 'label';
  overallStatus: 'safe' | 'caution' | 'unsafe';
  summary: string;
  ingredients?: string[];
  flags: FoodFlag[];
  calories?: string;
  nutritionHighlights?: string[];
  veganWarning?: {              // set when Korean vegan classifier disagrees with Claude
    detectedAnimal: { matchedText: string; canonical: string; english: string }[];
    detectedAmbiguous: { matchedText: string; canonical: string; english: string }[];
    reason: string;
  };
};

export type FoodFlag = {
  ingredient: string;
  reason: string;
  severity: 'safe' | 'caution' | 'unsafe';
};

export async function analyzeFoodImage(
  base64Image: string,
  mimeType: 'image/jpeg' | 'image/png',
  dietaryProfile: DietaryProfile,
  uiLanguage: string = 'English'
): Promise<AnalysisResult> {
  const profileDescription = buildProfileDescription(dietaryProfile);

  const prompt = `You are a multilingual global food safety assistant. Analyze this image — it may be a food dish or a product package label in ANY language (Korean, Japanese, Arabic, French, Spanish, Chinese, Thai, etc.).

User's dietary profile:
${profileDescription}

IMPORTANT INSTRUCTIONS:
1. If the label is in a non-English language, read it fully — you must still identify the food and all ingredients.
2. Always identify the food/product name, even from non-English packaging.
3. ALL text in your response — foodName, ingredients, flag ingredient names, flag reasons, summary, and nutritionHighlights — must be written in ${uiLanguage}.
4. The only exception: "originalName" should be the name exactly as printed on the package (keep original script).
5. Your entire response must be valid JSON only — no markdown, no code blocks, no extra text before or after.

Respond with ONLY this JSON (no other text):
{
  "foodName": "name of the food or product written in ${uiLanguage}",
  "englishName": "name ALWAYS in English regardless of UI language, e.g. 'Honey Butter Chip', 'Kimchi', 'Croissant'",
  "originalName": "name exactly as printed on the package in its original language/script",
  "labelLanguage": "language of the label (e.g. Korean, Japanese, English)",
  "type": "label",
  "overallStatus": "safe",
  "summary": "1-2 sentence summary for this specific user based on their dietary profile, written in ${uiLanguage}",
  "ingredients": ["every", "ingredient", "written", "in", "${uiLanguage}"],
  "originalIngredients": ["every ingredient exactly as printed on the label in its original script — do NOT translate"],
  "flags": [
    {
      "ingredient": "ingredient name written in ${uiLanguage}",
      "reason": "why this is a concern for this user, written in ${uiLanguage}",
      "severity": "unsafe"
    }
  ],
  "calories": "calorie info if visible, else null",
  "nutritionHighlights": ["notable nutrition facts written in ${uiLanguage}"]
}

Use "food_image" for type if it is a photo of a dish (not a label).

Safety rules:
- "safe" = no issues for this user
- "caution" = possible concern or ingredient unclear
- "unsafe" = confirmed allergen or violates dietary restriction
- Vegan: flag honey, gelatin, carmine, casein, whey, animal fat, animal-derived oils, meat broths
- Vegetarian: flag meat, fish, gelatin, rennet, animal fat, meat-based broths
- Lactose intolerant: flag all dairy (milk, cream, butter, cheese, whey, casein, lactose)
- Always check for all allergens in the user's profile
- For food images (not labels): identify the dish by appearance and flag likely ingredients`;

  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 2048,
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'image',
            source: {
              type: 'base64',
              media_type: mimeType,
              data: base64Image,
            },
          },
          {
            type: 'text',
            text: prompt,
          },
        ],
      },
    ],
  });

  const text = response.content[0].type === 'text' ? response.content[0].text : '';

  try {
    // Strip any accidental markdown code fences
    const cleaned = text.replace(/```json|```/g, '').trim();
    const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]) as AnalysisResult;
      // Ensure flags always exists
      if (!parsed.flags) parsed.flags = [];
      return parsed;
    }
    throw new Error('No JSON found');
  } catch {
    // Return the raw text as summary so the user still gets info
    return {
      foodName: 'Could not parse result',
      type: 'label',
      overallStatus: 'caution',
      summary: text.slice(0, 300) || 'Could not fully analyze this image. Please try a clearer photo.',
      flags: [],
    };
  }
}

export async function analyzeFoodText(
  foodQuery: string,
  dietaryProfile: DietaryProfile,
  uiLanguage: string = 'English'
): Promise<AnalysisResult> {
  const profileDescription = buildProfileDescription(dietaryProfile);

  const prompt = `You are a global food safety assistant. The user wants to know about this food: "${foodQuery}"

User's dietary profile:
${profileDescription}

Identify this food correctly even if the name is in a non-English language (e.g. 김치, 라멘, Poulet rôti, Pad Thai).
ALL text in your response — foodName, ingredients, flag ingredient names, flag reasons, summary, and nutritionHighlights — must be written in ${uiLanguage}.
Your entire response must be valid JSON only — no markdown, no code blocks, no extra text.

{
  "foodName": "name of this food written in ${uiLanguage}",
  "englishName": "name ALWAYS in English regardless of UI language, e.g. 'Honey Butter Chip', 'Kimchi', 'Croissant'",
  "originalName": "name in its original language/script if different from ${uiLanguage}, else null",
  "labelLanguage": null,
  "type": "food_image",
  "overallStatus": "safe",
  "summary": "1-2 sentence plain-language analysis for this specific user, written in ${uiLanguage}",
  "ingredients": ["every", "typical", "ingredient", "written", "in", "${uiLanguage}"],
  "flags": [
    {
      "ingredient": "ingredient name written in ${uiLanguage}",
      "reason": "why this is a concern for this user, written in ${uiLanguage}",
      "severity": "unsafe"
    }
  ],
  "calories": "approximate calories per serving, or null",
  "nutritionHighlights": ["notable nutrition facts written in ${uiLanguage}"]
}

Safety rules:
- "safe" = no issues for this user
- "caution" = possible concern or ingredient unclear
- "unsafe" = confirmed allergen or violates dietary restriction
- Base your analysis on common/typical recipes for this food
- Vegan: flag honey, gelatin, carmine, casein, whey, animal fat, animal-derived oils, meat broths
- Vegetarian: flag meat, fish, gelatin, rennet, animal fat, meat-based broths
- Lactose intolerant: flag all dairy (milk, cream, butter, cheese, whey, casein, lactose)
- Always check every allergen listed in the user's profile`;

  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 2048,
    messages: [{ role: 'user', content: prompt }],
  });

  const text = response.content[0].type === 'text' ? response.content[0].text : '';

  try {
    const cleaned = text.replace(/```json|```/g, '').trim();
    const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]) as AnalysisResult;
      if (!parsed.flags) parsed.flags = [];
      return parsed;
    }
    throw new Error('No JSON found');
  } catch {
    return {
      foodName: foodQuery,
      type: 'food_image',
      overallStatus: 'caution',
      summary: text.slice(0, 300) || 'Could not analyze this food. Please try again.',
      flags: [],
    };
  }
}

/** Exported for unit testing */
export function buildProfileDescription(profile: DietaryProfile): string {
  const lines: string[] = [];

  if (profile.preferences.length > 0) {
    lines.push(`- Dietary preferences: ${profile.preferences.join(', ')}`);
  }
  if (profile.allergies.length > 0) {
    lines.push(`- Allergies: ${profile.allergies.join(', ')}`);
  }
  if (profile.restrictions.length > 0) {
    lines.push(`- Dietary restrictions: ${profile.restrictions.join(', ')}`);
  }
  if (lines.length === 0) {
    lines.push('- No specific dietary restrictions');
  }

  return lines.join('\n');
}
