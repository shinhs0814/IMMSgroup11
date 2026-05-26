/**
 * Multilingual vegan classifier dispatcher.
 *
 * Single entry point for the rest of the app. CameraScreen and any other
 * caller no longer needs to know which language-specific classifier to
 * invoke — `classifyVegan(text)` auto-detects and routes.
 *
 * Currently supported languages:
 *   - 'ko' → koreanVeganClassifier
 *   - 'en' → englishVeganClassifier
 *
 * Any other detected language returns `caution` with an explanatory
 * reason — better than crashing or guessing.
 */

import {
  classifyKoreanVegan,
  type ClassifierResult as KoClassifierResult,
} from './koreanVeganClassifier';
import {
  classifyEnglishVegan,
  type ClassifierResult as EnClassifierResult,
} from './englishVeganClassifier';

export type SupportedLanguage = 'ko' | 'en';
export type DetectedLanguage = SupportedLanguage | 'unknown';

export type VeganVerdict = 'safe' | 'caution' | 'unsafe';

export type MultilingualResult = {
  verdict: VeganVerdict;
  /** Which language the input was classified as. */
  language: DetectedLanguage;
  /** Korean canonical terms OR English canonical terms, depending on
   *  which classifier ran. The matchedText field tells you the raw
   *  string that triggered the match in the input. */
  detectedAnimal: Array<{ matchedText: string; canonical: string }>;
  detectedAmbiguous: Array<{ matchedText: string; canonical: string }>;
  /** Localized to match the input language when possible, English when
   *  the language is unsupported. */
  reason: string;
};

/**
 * Detect the language of an ingredient label by character composition.
 *
 * Heuristic — not ML. Works well for the wedge cases (Korean, English):
 *   - Hangul characters present → 'ko'
 *   - Mostly Latin alphabet → 'en'
 *   - Otherwise (e.g. Japanese, Chinese, Arabic) → 'unknown'
 *
 * Empty / whitespace-only input → 'unknown'.
 */
export function detectLanguage(text: string): DetectedLanguage {
  if (!text || text.trim().length === 0) return 'unknown';

  const HANGUL = /[가-힯]/;
  if (HANGUL.test(text)) return 'ko';

  // Count Latin letters vs total non-whitespace, non-punctuation chars.
  const letters = text.match(/[a-zA-Z]/g) ?? [];
  const nonWhitespace = text.replace(/\s/g, '');
  if (nonWhitespace.length === 0) return 'unknown';

  // Filter out punctuation/digits for the ratio denominator so common label
  // characters like commas don't push English below the threshold.
  const wordlike = nonWhitespace.replace(/[\d.,;:()\-_/\[\]{}!@#$%^&*+=<>?'"`~|\\]/g, '');
  if (wordlike.length === 0) return 'unknown';

  const latinRatio = letters.length / wordlike.length;
  if (latinRatio >= 0.7) return 'en';

  return 'unknown';
}

/**
 * Classify ingredient text by auto-detecting language, then dispatching
 * to the appropriate language-specific classifier.
 */
export function classifyVegan(ingredientText: string): MultilingualResult {
  const language = detectLanguage(ingredientText);

  if (language === 'ko') {
    const r: KoClassifierResult = classifyKoreanVegan(ingredientText);
    return {
      verdict: r.verdict,
      language,
      detectedAnimal: r.detectedAnimal.map((d) => ({
        matchedText: d.matchedText,
        canonical: d.canonical,
      })),
      detectedAmbiguous: r.detectedAmbiguous.map((d) => ({
        matchedText: d.matchedText,
        canonical: d.canonical,
      })),
      reason: r.reason,
    };
  }

  if (language === 'en') {
    const r: EnClassifierResult = classifyEnglishVegan(ingredientText);
    return {
      verdict: r.verdict,
      language,
      detectedAnimal: r.detectedAnimal.map((d) => ({
        matchedText: d.matchedText,
        canonical: d.canonical,
      })),
      detectedAmbiguous: r.detectedAmbiguous.map((d) => ({
        matchedText: d.matchedText,
        canonical: d.canonical,
      })),
      reason: r.reason,
    };
  }

  // Unsupported language — be conservative.
  return {
    verdict: 'caution',
    language: 'unknown',
    detectedAnimal: [],
    detectedAmbiguous: [],
    reason:
      'Unsupported label language — vegan verdict cannot be verified deterministically. Defer to the LLM analysis.',
  };
}
