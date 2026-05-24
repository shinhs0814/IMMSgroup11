/**
 * Data integrity tests for animalIngredientsKo dictionary.
 *
 * These are NOT classifier tests — those live in koreanVeganClassifier.test.ts.
 * These tests catch bugs in the dictionary itself: duplicate entries,
 * cross-list contamination, malformed shapes. Adding wrong entries to the
 * dictionary is the most likely future cause of misclassification, so
 * locking the dictionary's shape is a high-value test.
 */

import { describe, expect, test } from 'bun:test';
import {
  RED_LIST,
  AMBER_LIST,
  type IngredientEntry,
} from '../data/animalIngredientsKo';

function allTerms(list: IngredientEntry[]): string[] {
  return list.flatMap((e) => [e.term, ...(e.aliases ?? [])]);
}

describe('animalIngredientsKo — shape integrity', () => {
  test('every RED entry has non-empty term + english', () => {
    for (const entry of RED_LIST) {
      expect(entry.term.length).toBeGreaterThan(0);
      expect(entry.english.length).toBeGreaterThan(0);
    }
  });

  test('every AMBER entry has non-empty term + english', () => {
    for (const entry of AMBER_LIST) {
      expect(entry.term.length).toBeGreaterThan(0);
      expect(entry.english.length).toBeGreaterThan(0);
    }
  });

  test('aliases (when present) are non-empty arrays of non-empty strings', () => {
    for (const entry of [...RED_LIST, ...AMBER_LIST]) {
      if (entry.aliases !== undefined) {
        expect(Array.isArray(entry.aliases)).toBe(true);
        expect(entry.aliases.length).toBeGreaterThan(0);
        for (const alias of entry.aliases) {
          expect(typeof alias).toBe('string');
          expect(alias.length).toBeGreaterThan(0);
        }
      }
    }
  });
});

describe('animalIngredientsKo — uniqueness', () => {
  test('no duplicate canonical terms within RED_LIST', () => {
    const terms = RED_LIST.map((e) => e.term);
    const set = new Set(terms);
    if (set.size !== terms.length) {
      const dups = terms.filter((t, i) => terms.indexOf(t) !== i);
      throw new Error(`Duplicate RED canonicals: ${dups.join(', ')}`);
    }
    expect(set.size).toBe(terms.length);
  });

  test('no duplicate canonical terms within AMBER_LIST', () => {
    const terms = AMBER_LIST.map((e) => e.term);
    const set = new Set(terms);
    if (set.size !== terms.length) {
      const dups = terms.filter((t, i) => terms.indexOf(t) !== i);
      throw new Error(`Duplicate AMBER canonicals: ${dups.join(', ')}`);
    }
    expect(set.size).toBe(terms.length);
  });

  test('no term appears in both RED and AMBER', () => {
    const redTerms = new Set(RED_LIST.map((e) => e.term));
    const overlap = AMBER_LIST.map((e) => e.term).filter((t) => redTerms.has(t));
    expect(overlap).toEqual([]);
  });

  test('no alias collides with a different entry\'s canonical (within RED)', () => {
    const collisions: string[] = [];
    for (const entry of RED_LIST) {
      for (const alias of entry.aliases ?? []) {
        const collidingEntry = RED_LIST.find(
          (other) => other.term === alias && other.term !== entry.term
        );
        if (collidingEntry) {
          collisions.push(
            `alias "${alias}" of "${entry.term}" collides with canonical "${collidingEntry.term}"`
          );
        }
      }
    }
    expect(collisions).toEqual([]);
  });

  test('no alias is duplicated across different RED entries', () => {
    const aliasOwners = new Map<string, string>();
    const collisions: string[] = [];
    for (const entry of RED_LIST) {
      for (const alias of entry.aliases ?? []) {
        const existing = aliasOwners.get(alias);
        if (existing && existing !== entry.term) {
          collisions.push(`alias "${alias}" is shared by "${existing}" and "${entry.term}"`);
        } else {
          aliasOwners.set(alias, entry.term);
        }
      }
    }
    expect(collisions).toEqual([]);
  });
});

describe('animalIngredientsKo — domain expectations', () => {
  test('RED_LIST covers all major Korean animal protein categories', () => {
    // Domain check: at least one entry per major category.
    // Update this test if the dictionary explicitly drops a category.
    const allRedTerms = allTerms(RED_LIST);
    const hasMatch = (keywords: string[]) =>
      keywords.some((kw) => allRedTerms.some((t) => t.includes(kw)));

    expect(hasMatch(['쇠고기', '소고기', '우육'])).toBe(true); // beef
    expect(hasMatch(['돼지고기', '돈육'])).toBe(true); // pork
    expect(hasMatch(['닭고기', '계육'])).toBe(true); // chicken
    expect(hasMatch(['우유', '분유'])).toBe(true); // dairy
    expect(hasMatch(['계란', '달걀'])).toBe(true); // egg
    expect(hasMatch(['젤라틴'])).toBe(true); // gelatin
    expect(hasMatch(['꿀'])).toBe(true); // honey
    expect(hasMatch(['멸치'])).toBe(true); // anchovy (very common in KR snacks)
  });

  test('AMBER_LIST contains the dangerous-because-ambiguous standards', () => {
    const allAmberTerms = allTerms(AMBER_LIST);
    expect(allAmberTerms.some((t) => t.includes('향료'))).toBe(true);
    expect(allAmberTerms.some((t) => t.includes('유화제'))).toBe(true);
    expect(allAmberTerms.some((t) => t.toUpperCase().includes('L-시스테인') || t.includes('시스테인'))).toBe(true);
  });

  test('removed alias regression: "난" must not return as an egg alias', () => {
    // Recorded after AI review found "난" was too short and matched
    // "난방", "후난", etc. If this test fails, "난" was re-added.
    const egg = RED_LIST.find((e) => e.term === '계란');
    expect(egg).toBeDefined();
    expect(egg?.aliases ?? []).not.toContain('난');
  });
});
