/**
 * Dietary constants integrity tests.
 *
 * Verifies that ALLERGIES, DIETARY_RESTRICTIONS, and DIETARY_PREFERENCES:
 *  - Have all required fields (id, label, emoji)
 *  - Have globally unique IDs (no duplicates within or across lists)
 *  - Are non-empty lists
 *
 * Run with: bun test
 */

import { describe, expect, test } from 'bun:test';
import {
  ALLERGIES,
  DIETARY_RESTRICTIONS,
  DIETARY_PREFERENCES,
} from '../../constants/dietary';

describe('ALLERGIES', () => {
  test('list is non-empty', () => {
    expect(ALLERGIES.length).toBeGreaterThan(0);
  });

  test('every item has id, label, and emoji', () => {
    for (const item of ALLERGIES) {
      expect(item.id.trim(), `allergy missing id`).toBeTruthy();
      expect(item.label.trim(), `allergy '${item.id}' missing label`).toBeTruthy();
      expect(item.emoji.trim(), `allergy '${item.id}' missing emoji`).toBeTruthy();
    }
  });

  test('all IDs are unique', () => {
    const ids = ALLERGIES.map((a) => a.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe('DIETARY_RESTRICTIONS', () => {
  test('list is non-empty', () => {
    expect(DIETARY_RESTRICTIONS.length).toBeGreaterThan(0);
  });

  test('every item has id, label, and emoji', () => {
    for (const item of DIETARY_RESTRICTIONS) {
      expect(item.id.trim(), `restriction missing id`).toBeTruthy();
      expect(item.label.trim(), `restriction '${item.id}' missing label`).toBeTruthy();
      expect(item.emoji.trim(), `restriction '${item.id}' missing emoji`).toBeTruthy();
    }
  });

  test('all IDs are unique', () => {
    const ids = DIETARY_RESTRICTIONS.map((r) => r.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe('DIETARY_PREFERENCES', () => {
  test('list is non-empty', () => {
    expect(DIETARY_PREFERENCES.length).toBeGreaterThan(0);
  });

  test('every item has id, label, emoji, and description', () => {
    for (const item of DIETARY_PREFERENCES) {
      expect(item.id.trim(), `preference missing id`).toBeTruthy();
      expect(item.label.trim(), `preference '${item.id}' missing label`).toBeTruthy();
      expect(item.emoji.trim(), `preference '${item.id}' missing emoji`).toBeTruthy();
      expect(item.description.trim(), `preference '${item.id}' missing description`).toBeTruthy();
    }
  });

  test('all IDs are unique', () => {
    const ids = DIETARY_PREFERENCES.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe('Cross-list ID uniqueness', () => {
  test('no ID appears in more than one list', () => {
    const allergyIds = new Set(ALLERGIES.map((a) => a.id));
    const restrictionIds = new Set(DIETARY_RESTRICTIONS.map((r) => r.id));
    const prefIds = new Set(DIETARY_PREFERENCES.map((p) => p.id));

    for (const id of allergyIds) {
      expect(restrictionIds.has(id), `'${id}' is in both ALLERGIES and RESTRICTIONS`).toBe(false);
      expect(prefIds.has(id), `'${id}' is in both ALLERGIES and PREFERENCES`).toBe(false);
    }
    for (const id of restrictionIds) {
      expect(prefIds.has(id), `'${id}' is in both RESTRICTIONS and PREFERENCES`).toBe(false);
    }
  });
});
