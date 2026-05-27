/**
 * Tests for englishVeganClassifier — Story 1 acceptance criteria
 * (PRD: .omc/prd.json).
 */

import { describe, expect, test } from 'bun:test';
import { classifyEnglishVegan } from '../englishVeganClassifier';
import { RED_LIST } from '../data/animalIngredientsEn';

describe('classifyEnglishVegan — clear unsafe', () => {
  test("'milk, sugar, salt' -> unsafe + matches milk", () => {
    const r = classifyEnglishVegan('milk, sugar, salt');
    expect(r.verdict).toBe('unsafe');
    expect(r.detectedAnimal.map((d) => d.canonical)).toContain('milk');
  });

  test('whole milk powder + beef stock both detected', () => {
    const r = classifyEnglishVegan('flour, whole milk powder, beef stock, salt');
    expect(r.verdict).toBe('unsafe');
    const canonicals = r.detectedAnimal.map((d) => d.canonical);
    expect(canonicals).toContain('milk');
    expect(canonicals).toContain('beef');
  });

  test('common animal terms each match independently', () => {
    const cases: Array<[string, string]> = [
      ['gelatin', 'gelatin'],
      ['honey, oats', 'honey'],
      ['chicken broth, water', 'chicken'],
      ['eggs, flour', 'egg'],
      ['anchovies, oil', 'anchovy'],
      ['parmesan, basil', 'cheese'],
      ['butter, salt', 'butter'],
    ];
    for (const [input, expected] of cases) {
      const r = classifyEnglishVegan(input);
      expect(r.verdict).toBe('unsafe');
      expect(r.detectedAnimal.map((d) => d.canonical)).toContain(expected);
    }
  });
});

describe('classifyEnglishVegan — false positive defenses', () => {
  test('"milky way bar" must not match "milk" (word boundary)', () => {
    const r = classifyEnglishVegan('milky way bar, sugar');
    expect(r.detectedAnimal.map((d) => d.canonical)).not.toContain('milk');
  });

  test('"buttery" must not match "butter"', () => {
    const r = classifyEnglishVegan('buttery spread, oil');
    expect(r.detectedAnimal.map((d) => d.canonical)).not.toContain('butter');
  });

  test('"creamer" must not match "cream"', () => {
    const r = classifyEnglishVegan('non-dairy creamer, water');
    expect(r.detectedAnimal.map((d) => d.canonical)).not.toContain('cream');
  });
});

describe('classifyEnglishVegan — caution cases', () => {
  test('flour + natural flavoring -> caution', () => {
    const r = classifyEnglishVegan('flour, sugar, natural flavoring');
    expect(r.verdict).toBe('caution');
    expect(r.detectedAmbiguous.map((d) => d.canonical)).toContain('natural flavoring');
  });

  test('plain "flavor" alias also triggers caution', () => {
    const r = classifyEnglishVegan('flour, sugar, flavor');
    expect(r.verdict).toBe('caution');
  });
});

describe('classifyEnglishVegan — safe cases', () => {
  test('plant-based ingredient list -> safe', () => {
    const r = classifyEnglishVegan('flour, sugar, vegetable oil, salt');
    expect(r.verdict).toBe('safe');
  });

  test('only safe single ingredient', () => {
    const r = classifyEnglishVegan('rice');
    expect(r.verdict).toBe('safe');
  });
});

describe('classifyEnglishVegan — edge cases', () => {
  test('empty string -> caution with empty reason', () => {
    const r = classifyEnglishVegan('');
    expect(r.verdict).toBe('caution');
  });

  test('whitespace only -> caution', () => {
    const r = classifyEnglishVegan('   \n\t');
    expect(r.verdict).toBe('caution');
  });
});

describe('classifyEnglishVegan — lexical variation (Story 2)', () => {
  test("'Milk, sugar' (title case) → unsafe", () => {
    const r = classifyEnglishVegan('Milk, sugar');
    expect(r.verdict).toBe('unsafe');
    expect(r.detectedAnimal.map((d) => d.canonical)).toContain('milk');
  });

  test("'EGGS, flour' (uppercase plural) → unsafe + matches 'egg'", () => {
    const r = classifyEnglishVegan('EGGS, flour');
    expect(r.verdict).toBe('unsafe');
    expect(r.detectedAnimal.map((d) => d.canonical)).toContain('egg');
  });

  test("'eggs, sugar' (lowercase plural) → unsafe", () => {
    const r = classifyEnglishVegan('eggs, sugar');
    expect(r.verdict).toBe('unsafe');
    expect(r.detectedAnimal.map((d) => d.canonical)).toContain('egg');
  });

  test("'shrimps, salt' (informal plural) → unsafe + matches 'shrimp'", () => {
    const r = classifyEnglishVegan('shrimps, salt');
    expect(r.verdict).toBe('unsafe');
    expect(r.detectedAnimal.map((d) => d.canonical)).toContain('shrimp');
  });

  test("'hams, bread' (rare plural but legit) → unsafe", () => {
    const r = classifyEnglishVegan('hams, bread');
    expect(r.verdict).toBe('unsafe');
    expect(r.detectedAnimal.map((d) => d.canonical)).toContain('ham');
  });

  test("'pork-derived enzyme, water' → unsafe", () => {
    const r = classifyEnglishVegan('pork-derived enzyme, water');
    expect(r.verdict).toBe('unsafe');
    expect(r.detectedAnimal.map((d) => d.canonical)).toContain('pork');
  });

  test("'beef-flavored chips, salt' → CAUTION (not safe, not unsafe)", () => {
    // Flavor marker should escalate a RED match into AMBER, not zero it out.
    // The source of "beef flavor" could be real beef extract.
    const r = classifyEnglishVegan('beef-flavored chips, salt');
    expect(r.verdict).toBe('caution');
    expect(r.detectedAmbiguous.map((d) => d.canonical)).toContain('beef');
  });

  test("'chicken-style nugget, salt' → CAUTION", () => {
    const r = classifyEnglishVegan('chicken-style nugget, salt');
    expect(r.verdict).toBe('caution');
    expect(r.detectedAmbiguous.map((d) => d.canonical)).toContain('chicken');
  });
});

describe('animalIngredientsEn — dictionary size requirement', () => {
  test('RED_LIST covers >= 30 animal terms (story 1 AC)', () => {
    expect(RED_LIST.length).toBeGreaterThanOrEqual(30);
  });

  test('RED_LIST covers all major categories', () => {
    const allTerms = RED_LIST.flatMap((e) => [e.term, ...(e.aliases ?? [])]);
    const has = (kw: string[]) => kw.some((k) => allTerms.some((t) => t.includes(k)));
    expect(has(['beef', 'pork', 'chicken'])).toBe(true); // meat
    expect(has(['milk', 'cheese', 'butter'])).toBe(true); // dairy
    expect(has(['egg', 'eggs'])).toBe(true); // eggs
    expect(has(['fish', 'shrimp', 'tuna'])).toBe(true); // seafood
    expect(has(['honey', 'gelatin'])).toBe(true); // additives
  });
});
