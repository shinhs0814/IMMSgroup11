/**
 * English vegan classifier.
 *
 * Same shape as koreanVeganClassifier — different tokenization. English has
 * explicit word boundaries (spaces), so the tokenizer can use a real word-
 * boundary regex instead of the substring-after-flavor-suffix trick we
 * needed for Korean.
 *
 * Flavor-suffix exclusion still applies but uses English markers:
 * "-flavored", "-flavor", "-style". Examples that should NOT match meat:
 *   - "beef-flavored chips"  -> caution (flavoring), not unsafe
 *   - "chicken-style nugget" -> caution, not unsafe
 *
 * See SPEC + tests for the exact rules.
 */

import {
  RED_LIST,
  AMBER_LIST,
  type IngredientEntry,
} from './data/animalIngredientsEn';

export type VeganVerdict = 'safe' | 'caution' | 'unsafe';

export type DetectedIngredient = {
  matchedText: string;
  canonical: string;
};

export type ClassifierResult = {
  verdict: VeganVerdict;
  detectedAnimal: DetectedIngredient[];
  detectedAmbiguous: DetectedIngredient[];
  reason: string;
};

const FLAVOR_MARKERS = ['flavored', 'flavor', 'flavour', 'flavoured', 'style'];

/** Lowercase the text and collapse whitespace runs. */
function normalize(text: string): string {
  return text.replace(/\s+/g, ' ').trim().toLowerCase();
}

/** Split on commas, semicolons, parens, brackets, slashes. */
function tokenize(text: string): string[] {
  return text
    .split(/[,;/\[\]()「」、]/)
    .map((t) => t.trim())
    .filter((t) => t.length > 0);
}

/**
 * Result of checking a single (token, candidate) pair:
 *   - 'match':           candidate appears at word boundary, no flavor marker
 *   - 'flavor-rejected': candidate appears at word boundary BUT token has a
 *                        flavor marker — this is a flavoring of animal
 *                        origin, so caller should treat as AMBER
 *   - 'no-match':        candidate does not appear at a word boundary
 */
type MatchType = 'match' | 'flavor-rejected' | 'no-match';

/**
 * Check whether a token contains the candidate term at a word boundary.
 *
 * Word-boundary rule for English:
 *   - char before: absent OR non-word-char
 *   - char after: absent OR non-word-char OR plural 's' followed by boundary
 *     (so 'eggs', 'hams', 'shrimps' all match their singular dictionary
 *     entry without needing every plural enumerated as an alias)
 *
 * Flavor-marker rule (added in iteration 2):
 *   If the surrounding token contains `flavored`, `flavor`, `flavour`,
 *   `flavoured`, or `style` as its own word, the match is RED-rejected
 *   but reported as `flavor-rejected` so callers can promote it to AMBER.
 */
function checkTokenMatch(token: string, candidate: string): MatchType {
  if (token === candidate) return 'match';

  const idx = token.indexOf(candidate);
  if (idx === -1) return 'no-match';

  const before = idx === 0 ? '' : token[idx - 1];
  const afterStart = idx + candidate.length;
  const after = token[afterStart] ?? '';
  const afterAfter = token[afterStart + 1] ?? '';
  const isWordChar = (c: string) => /[a-z0-9]/.test(c);

  if (isWordChar(before)) return 'no-match';

  // Accept boundary OR plural-s + boundary as a match.
  const isPluralS = after === 's' && !isWordChar(afterAfter);
  if (isWordChar(after) && !isPluralS) return 'no-match';

  // Word boundary OK. Check flavor markers.
  for (const marker of FLAVOR_MARKERS) {
    const markerRe = new RegExp(`(^|[\\s-])${marker}([\\s-]|$)`);
    if (markerRe.test(token)) return 'flavor-rejected';
  }

  return 'match';
}

type FindMatchesResult = {
  detectedAnimal: DetectedIngredient[];
  /** RED-list candidates that matched a token whose surrounding text was a
   *  flavor marker. These are reported as AMBER. */
  flavorPromoted: DetectedIngredient[];
};

function findMatches(
  normalizedText: string,
  redList: IngredientEntry[]
): FindMatchesResult {
  const detectedAnimal: DetectedIngredient[] = [];
  const flavorPromoted: DetectedIngredient[] = [];
  const seenRed = new Set<string>();
  const seenAmber = new Set<string>();
  const tokens = tokenize(normalizedText);

  for (const entry of redList) {
    const candidates = [entry.term, ...(entry.aliases ?? [])];
    let redMatched: string | undefined;
    let flavorMatched: string | undefined;

    for (const token of tokens) {
      for (const candidate of candidates) {
        const r = checkTokenMatch(token, candidate);
        if (r === 'match') {
          redMatched = candidate;
          break;
        }
        if (r === 'flavor-rejected' && !flavorMatched) {
          flavorMatched = candidate;
        }
      }
      if (redMatched) break;
    }

    if (redMatched && !seenRed.has(entry.term)) {
      detectedAnimal.push({ matchedText: redMatched, canonical: entry.term });
      seenRed.add(entry.term);
    } else if (flavorMatched && !seenAmber.has(entry.term)) {
      flavorPromoted.push({ matchedText: flavorMatched, canonical: entry.term });
      seenAmber.add(entry.term);
    }
  }

  return { detectedAnimal, flavorPromoted };
}

function findAmberMatches(
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
        if (checkTokenMatch(token, candidate) === 'match') {
          matched = candidate;
          break;
        }
      }
      if (matched) break;
    }
    if (matched && !seen.has(entry.term)) {
      matches.push({ matchedText: matched, canonical: entry.term });
      seen.add(entry.term);
    }
  }

  return matches;
}

/**
 * Classify English ingredient label text for vegan compatibility.
 *
 * @param ingredientText Raw English ingredient list (typically the
 *   "Ingredients:" section on a US/EU packaged food label).
 */
export function classifyEnglishVegan(ingredientText: string): ClassifierResult {
  if (!ingredientText || ingredientText.trim().length === 0) {
    return {
      verdict: 'caution',
      detectedAnimal: [],
      detectedAmbiguous: [],
      reason: 'Ingredient text is empty.',
    };
  }

  const normalized = normalize(ingredientText);
  const { detectedAnimal, flavorPromoted } = findMatches(normalized, RED_LIST);
  const amberMatches = findAmberMatches(normalized, AMBER_LIST);
  const detectedAmbiguous = [...amberMatches, ...flavorPromoted];

  if (detectedAnimal.length > 0) {
    const list = detectedAnimal.map((d) => d.canonical).join(', ');
    return {
      verdict: 'unsafe',
      detectedAnimal,
      detectedAmbiguous,
      reason: `Animal-derived ingredients detected: ${list}`,
    };
  }

  if (detectedAmbiguous.length > 0) {
    const list = detectedAmbiguous.map((d) => d.canonical).join(', ');
    return {
      verdict: 'caution',
      detectedAnimal,
      detectedAmbiguous,
      reason: `Ambiguous-source ingredients detected (verify with manufacturer): ${list}`,
    };
  }

  return {
    verdict: 'safe',
    detectedAnimal: [],
    detectedAmbiguous: [],
    reason: 'No animal-derived ingredients detected.',
  };
}
