/**
 * Schema validation for restaurants.json.
 *
 * The dataset comes from 한국문화정보원 (Korea Culture Information Service)
 * and is converted from raw_restaurants.csv. Conversion bugs and stale
 * dataset rows show up as wrong types, missing fields, or empty names.
 *
 * If the dataset is regenerated, these tests should still pass — if they
 * fail, either the converter is wrong or the schema in
 * src/types/restaurant.ts is out of date.
 */

import { describe, expect, test } from 'bun:test';
import restaurants from '../restaurants.json';
import type { Restaurant } from '../../types/restaurant';

const data = restaurants as Restaurant[];

describe('restaurants.json — top-level shape', () => {
  test('is a non-empty array', () => {
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBeGreaterThan(0);
  });

  test('has a meaningful number of restaurants (>500)', () => {
    // Sanity check — if conversion truncated the dataset, this catches it.
    expect(data.length).toBeGreaterThan(500);
  });
});

describe('restaurants.json — per-entry schema', () => {
  const REQUIRED_STRING_FIELDS: (keyof Restaurant)[] = [
    'name',
    'category',
    'address',
    'district',
    'region',
    'weekdayHours',
    'weekendHours',
    'phone',
  ];

  const REQUIRED_BOOLEAN_FIELDS: (keyof Restaurant)[] = [
    'vegetarian',
    'halal',
    'glutenFree',
  ];

  test('every entry has all required string fields (typed as string, may be empty)', () => {
    const bad: string[] = [];
    for (let i = 0; i < data.length; i++) {
      const entry = data[i];
      for (const field of REQUIRED_STRING_FIELDS) {
        if (typeof entry[field] !== 'string') {
          bad.push(`row ${i} (${entry.name ?? '<no name>'}): ${String(field)} is ${typeof entry[field]}`);
        }
      }
      if (bad.length > 5) break; // limit error spam
    }
    expect(bad).toEqual([]);
  });

  test('every entry has all required boolean fields', () => {
    const bad: string[] = [];
    for (let i = 0; i < data.length; i++) {
      const entry = data[i];
      for (const field of REQUIRED_BOOLEAN_FIELDS) {
        if (typeof entry[field] !== 'boolean') {
          bad.push(`row ${i} (${entry.name}): ${String(field)} is ${typeof entry[field]}`);
        }
      }
      if (bad.length > 5) break;
    }
    expect(bad).toEqual([]);
  });

  test('every entry has a non-empty name (used as React list key)', () => {
    const empty: number[] = [];
    for (let i = 0; i < data.length; i++) {
      if (!data[i].name || data[i].name.trim().length === 0) empty.push(i);
    }
    expect(empty).toEqual([]);
  });

  test('every entry has either a region or a district (else address row is useless)', () => {
    const orphans: string[] = [];
    for (const entry of data) {
      if (entry.region.trim().length === 0 && entry.district.trim().length === 0) {
        orphans.push(entry.name);
      }
    }
    expect(orphans.slice(0, 5)).toEqual([]);
  });
});

describe('restaurants.json — domain expectations', () => {
  test('at least 5 restaurants are vegetarian-friendly (filterable demo set)', () => {
    const vegCount = data.filter((r) => r.vegetarian).length;
    expect(vegCount).toBeGreaterThanOrEqual(5);
  });

  test('regions are non-trivial (more than 3 distinct values)', () => {
    // Real KR dataset spans many 시도. A bug where every row gets the same
    // region would be caught here.
    const regions = new Set(data.map((r) => r.region).filter((r) => r.length > 0));
    expect(regions.size).toBeGreaterThan(3);
  });

  test('category strings are present and not all the same', () => {
    const categories = new Set(data.map((r) => r.category).filter((c) => c.length > 0));
    expect(categories.size).toBeGreaterThan(3);
  });

  test('no entry has obvious sentinel garbage in its name', () => {
    // Watch for converter leftovers
    const SENTINEL_MARKERS = ['undefined', 'null', 'NaN', '[object Object]', 'TODO'];
    const flagged: string[] = [];
    for (const entry of data) {
      for (const sentinel of SENTINEL_MARKERS) {
        if (entry.name.includes(sentinel)) flagged.push(entry.name);
      }
    }
    expect(flagged).toEqual([]);
  });
});
