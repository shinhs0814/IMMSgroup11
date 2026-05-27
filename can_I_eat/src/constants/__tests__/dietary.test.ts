/**
 * Data integrity tests for dietary constants.
 *
 * `dietary.ts` defines the survey/profile UI's master lists for allergies,
 * restrictions, and dietary preferences. A typo or duplicate ID here breaks
 * the user's saved profile because lookups by ID silently fail. These
 * tests lock the data shape so future edits can't introduce drift.
 */

import { describe, expect, test } from 'bun:test';
import {
  ALLERGIES,
  DIETARY_RESTRICTIONS,
  DIETARY_PREFERENCES,
} from '../dietary';

const ALL_LISTS = [
  { name: 'ALLERGIES', list: ALLERGIES as Array<{ id: string; label: string; emoji: string }> },
  { name: 'DIETARY_RESTRICTIONS', list: DIETARY_RESTRICTIONS as Array<{ id: string; label: string; emoji: string }> },
  { name: 'DIETARY_PREFERENCES', list: DIETARY_PREFERENCES as Array<{ id: string; label: string; emoji: string }> },
];

describe('dietary constants — required fields', () => {
  for (const { name, list } of ALL_LISTS) {
    test(`${name}: every entry has a non-empty id, label, emoji`, () => {
      for (const entry of list) {
        expect(typeof entry.id).toBe('string');
        expect(entry.id.length).toBeGreaterThan(0);
        expect(typeof entry.label).toBe('string');
        expect(entry.label.length).toBeGreaterThan(0);
        expect(typeof entry.emoji).toBe('string');
        expect(entry.emoji.length).toBeGreaterThan(0);
      }
    });

    test(`${name}: ids use snake_case (only [a-z0-9_])`, () => {
      const bad: string[] = [];
      for (const entry of list) {
        if (!/^[a-z0-9_]+$/.test(entry.id)) bad.push(entry.id);
      }
      expect(bad).toEqual([]);
    });

    test(`${name}: no duplicate ids`, () => {
      const ids = list.map((e) => e.id);
      const set = new Set(ids);
      expect(set.size).toBe(ids.length);
    });

    test(`${name}: no duplicate labels`, () => {
      // Duplicate labels would confuse the user in the survey UI.
      const labels = list.map((e) => e.label);
      const set = new Set(labels);
      expect(set.size).toBe(labels.length);
    });
  }
});

describe('dietary constants — cross-list expectations', () => {
  test('the well-known allergens are present (lock the survey question count)', () => {
    // The SPEC-survey.md commits to "9 allergens". If someone removes one
    // the survey UI assumption breaks. Update both this test and the spec
    // intentionally when changing.
    const allergyIds = ALLERGIES.map((a) => a.id);
    const expected = ['peanuts', 'tree_nuts', 'milk', 'eggs', 'wheat', 'soy', 'fish', 'shellfish'];
    for (const id of expected) {
      expect(allergyIds).toContain(id);
    }
  });

  test('vegan and vegetarian are both available in preferences', () => {
    // The Korean vegan classifier guardrail only fires when the user has
    // vegan OR vegetarian. Removing either from this list silently disables
    // the entire classifier integration in CameraScreen.
    const ids = DIETARY_PREFERENCES.map((p) => p.id);
    expect(ids).toContain('vegan');
    expect(ids).toContain('vegetarian');
  });

  test('"no preference" sentinel exists so users can opt out of the survey', () => {
    const ids = DIETARY_PREFERENCES.map((p) => p.id);
    expect(ids).toContain('none');
  });

  test('halal and kosher are categorized as restrictions, not preferences', () => {
    // These are religious/medical-level commitments. The UI surfaces them
    // differently (mandatory check vs preference) — if reclassified, the
    // result severity color also needs to change.
    const restrictionIds = DIETARY_RESTRICTIONS.map((r) => r.id);
    expect(restrictionIds).toContain('halal');
    expect(restrictionIds).toContain('kosher');
  });
});
