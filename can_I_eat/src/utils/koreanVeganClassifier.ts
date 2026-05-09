/**
 * Korean Vegan Classifier
 *
 * A deterministic, rule-based classifier that scans Korean ingredient
 * label text for animal-derived ingredients. Designed to run AS A
 * GUARDRAIL alongside the LLM (Claude Vision) analysis in anthropic.ts —
 * if the LLM marks something "safe" but this classifier finds RED-list
 * ingredients, the app should surface the conflict.
 *
 * Why this exists:
 * - LLMs can hallucinate, miss ingredients, or mistranslate.
 * - Deterministic rules are unit-testable; LLM output is not.
 * - This narrow scope (Korean text + vegan) maps directly to the wedge
 *   defined in docs/WEDGE.md.
 *
 * Scope (V1):
 * - Korean text only.
 * - Vegan classification only.
 * - Substring matching against a curated dictionary.
 *
 * Out of scope (deferred to V2+):
 * - Other diets (allergies, halal, kosher, diabetic).
 * - Other languages (English, Japanese, Chinese labels).
 * - OCR — assumes text is already extracted.
 * - Context-aware parsing (e.g. "쇠고기 향" vs actual "쇠고기").
 */

import { RED_LIST, AMBER_LIST, IngredientEntry } from './data/animalIngredientsKo';

export type VeganVerdict = 'safe' | 'caution' | 'unsafe';

export type DetectedIngredient = {
  /** The Korean term that was matched in the input. */
  matchedText: string;
  /** Canonical dictionary entry it matched. */
  canonical: string;
  /** English translation for UI display. */
  english: string;
};

export type ClassifierResult = {
  verdict: VeganVerdict;
  /** Animal-derived ingredients found (drives "unsafe" verdict). */
  detectedAnimal: DetectedIngredient[];
  /** Ambiguous-source ingredients found (drives "caution" verdict). */
  detectedAmbiguous: DetectedIngredient[];
  /** Human-readable summary in Korean. */
  reason: string;
};

/**
 * Token-boundary match. Korean labels lack word spaces inside compounds
 * (e.g. "꿀맛", "닭갈비향"), so a naive substring search produces lots
 * of false positives. We split on label-level delimiters — commas,
 * semicolons, slashes, brackets, parentheses — to get rough ingredient
 * tokens, then check each token.
 *
 * A token "matches" a candidate term when:
 *   1. The token equals the candidate exactly, OR
 *   2. The candidate appears in the token AND is not followed by a
 *      flavor/style suffix that would change its meaning ("향", "맛",
 *      "풍미", "스타일") — those go through the AMBER list as 향료
 *      instead.
 */
const FLAVOR_SUFFIXES = ['향', '맛', '풍미', '스타일', '풍'];

function tokenize(text: string): string[] {
  return text
    .split(/[,;/\[\]（）()「」、]/)
    .map((t) => t.trim())
    .filter((t) => t.length > 0);
}

function tokenMatches(token: string, candidate: string): boolean {
  if (token === candidate) return true;
  const idx = token.indexOf(candidate);
  if (idx === -1) return false;
  // Reject if any flavor suffix appears anywhere after the candidate
  // within the token. Labels like "닭갈비향", "쇠고기향분말", "우유맛"
  // describe flavorings, not actual ingredients.
  const trailing = token.slice(idx + candidate.length);
  for (const suffix of FLAVOR_SUFFIXES) {
    if (trailing.includes(suffix)) return false;
  }
  return true;
}

function findMatches(
  normalizedText: string,
  list: IngredientEntry[]
): DetectedIngredient[] {
  const matches: DetectedIngredient[] = [];
  const seen = new Set<string>();
  const tokens = tokenize(normalizedText);

  for (const entry of list) {
    const candidates = [entry.term, ...(entry.aliases ?? [])];
    let matched: string | undefined;
    for (const token of tokens) {
      for (const candidate of candidates) {
        if (tokenMatches(token, candidate)) {
          matched = candidate;
          break;
        }
      }
      if (matched) break;
    }
    if (matched && !seen.has(entry.term)) {
      matches.push({
        matchedText: matched,
        canonical: entry.term,
        english: entry.english,
      });
      seen.add(entry.term);
    }
  }

  return matches;
}

/**
 * Normalize input: strip all whitespace inside the label.
 * Korean ingredient labels rarely use whitespace meaningfully — most
 * compound ingredient names are written without spaces. Removing all
 * whitespace lets the tokenizer use only commas/brackets as boundaries
 * and lets multi-word aliases like "동물성 유지" still match the
 * canonical "동물성유지" form.
 */
function normalize(text: string): string {
  return text.replace(/\s+/g, '');
}

/**
 * Classify Korean ingredient label text for vegan compatibility.
 *
 * @param ingredientText Raw Korean text from a food label (typically
 *   the "성분" or "원재료명" section). Whitespace and punctuation are
 *   normalized internally.
 * @returns Verdict + matched ingredients + Korean reason string.
 */
export function classifyKoreanVegan(ingredientText: string): ClassifierResult {
  if (!ingredientText || ingredientText.trim().length === 0) {
    return {
      verdict: 'caution',
      detectedAnimal: [],
      detectedAmbiguous: [],
      reason: '성분 텍스트가 비어 있습니다.',
    };
  }

  const normalized = normalize(ingredientText);
  const detectedAnimal = findMatches(normalized, RED_LIST);
  const detectedAmbiguous = findMatches(normalized, AMBER_LIST);

  if (detectedAnimal.length > 0) {
    const list = detectedAnimal.map((d) => d.canonical).join(', ');
    return {
      verdict: 'unsafe',
      detectedAnimal,
      detectedAmbiguous,
      reason: `동물성 성분 검출: ${list}`,
    };
  }

  if (detectedAmbiguous.length > 0) {
    const list = detectedAmbiguous.map((d) => d.canonical).join(', ');
    return {
      verdict: 'caution',
      detectedAnimal,
      detectedAmbiguous,
      reason: `출처가 모호한 성분 검출 (제조사 확인 권장): ${list}`,
    };
  }

  return {
    verdict: 'safe',
    detectedAnimal: [],
    detectedAmbiguous: [],
    reason: '동물성 성분이 감지되지 않았습니다.',
  };
}

/**
 * Cross-check helper for use AFTER the LLM has already classified.
 * Returns true when the deterministic classifier disagrees with the
 * LLM's verdict in a way that should be surfaced to the user.
 *
 * Specifically, this catches the dangerous case: LLM said "safe" but
 * we found RED-list ingredients. The reverse (LLM "unsafe", us "safe")
 * is not flagged here — we trust the LLM's broader knowledge to catch
 * ingredients our dictionary missed.
 */
export function disagreesWithLLM(
  llmVerdict: VeganVerdict,
  classifierResult: ClassifierResult
): boolean {
  if (llmVerdict === 'safe' && classifierResult.verdict === 'unsafe') {
    return true;
  }
  if (llmVerdict === 'safe' && classifierResult.verdict === 'caution') {
    return true;
  }
  return false;
}
