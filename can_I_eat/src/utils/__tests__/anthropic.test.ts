/**
 * Tests for the Anthropic service's pure utility functions.
 *
 * buildProfileDescription() converts a DietaryProfile into the
 * natural-language block that is sent to Claude inside the prompt.
 * These tests verify its output format without making any real API calls.
 *
 * Run with: bun test
 */

import { describe, expect, test } from 'bun:test';
import { buildProfileDescription } from '../../services/anthropic';
import type { DietaryProfile } from '../../constants/dietary';

const emptyProfile: DietaryProfile = {
  name: 'Test User',
  allergies: [],
  restrictions: [],
  preferences: [],
};

describe('buildProfileDescription — empty profile', () => {
  test('returns a fallback message when no restrictions exist', () => {
    const result = buildProfileDescription(emptyProfile);
    expect(result).toContain('No specific dietary restrictions');
  });

  test('does not contain allergy/restriction/preference lines when all are empty', () => {
    const result = buildProfileDescription(emptyProfile);
    expect(result).not.toContain('Allergies:');
    expect(result).not.toContain('Dietary restrictions:');
    expect(result).not.toContain('Dietary preferences:');
  });
});

describe('buildProfileDescription — allergies', () => {
  test('includes allergy IDs in the output', () => {
    const profile: DietaryProfile = {
      ...emptyProfile,
      allergies: ['peanuts', 'shellfish'],
    };
    const result = buildProfileDescription(profile);
    expect(result).toContain('peanuts');
    expect(result).toContain('shellfish');
  });

  test('labels the section correctly', () => {
    const profile: DietaryProfile = {
      ...emptyProfile,
      allergies: ['eggs'],
    };
    const result = buildProfileDescription(profile);
    expect(result).toContain('Allergies:');
  });

  test('does not show "No specific" when allergies exist', () => {
    const profile: DietaryProfile = {
      ...emptyProfile,
      allergies: ['milk'],
    };
    const result = buildProfileDescription(profile);
    expect(result).not.toContain('No specific dietary restrictions');
  });
});

describe('buildProfileDescription — restrictions', () => {
  test('includes restriction IDs in the output', () => {
    const profile: DietaryProfile = {
      ...emptyProfile,
      restrictions: ['halal', 'diabetic'],
    };
    const result = buildProfileDescription(profile);
    expect(result).toContain('halal');
    expect(result).toContain('diabetic');
  });

  test('labels the section correctly', () => {
    const profile: DietaryProfile = {
      ...emptyProfile,
      restrictions: ['kosher'],
    };
    const result = buildProfileDescription(profile);
    expect(result).toContain('Dietary restrictions:');
  });
});

describe('buildProfileDescription — preferences', () => {
  test('includes preference IDs in the output', () => {
    const profile: DietaryProfile = {
      ...emptyProfile,
      preferences: ['vegan'],
    };
    const result = buildProfileDescription(profile);
    expect(result).toContain('vegan');
  });

  test('labels the section correctly', () => {
    const profile: DietaryProfile = {
      ...emptyProfile,
      preferences: ['vegetarian'],
    };
    const result = buildProfileDescription(profile);
    expect(result).toContain('Dietary preferences:');
  });
});

describe('buildProfileDescription — combined profile', () => {
  test('all three sections appear when all are populated', () => {
    const profile: DietaryProfile = {
      name: 'Full Profile User',
      allergies: ['peanuts'],
      restrictions: ['halal'],
      preferences: ['vegan'],
    };
    const result = buildProfileDescription(profile);
    expect(result).toContain('Dietary preferences:');
    expect(result).toContain('Allergies:');
    expect(result).toContain('Dietary restrictions:');
    expect(result).toContain('peanuts');
    expect(result).toContain('halal');
    expect(result).toContain('vegan');
  });

  test('preferences appear before allergies in the output', () => {
    const profile: DietaryProfile = {
      ...emptyProfile,
      allergies: ['eggs'],
      preferences: ['keto'],
    };
    const result = buildProfileDescription(profile);
    const prefIndex = result.indexOf('preferences:');
    const allergyIndex = result.indexOf('Allergies:');
    expect(prefIndex).toBeLessThan(allergyIndex);
  });

  test('custom allergy entries (custom:xxx) are included in output', () => {
    const profile: DietaryProfile = {
      ...emptyProfile,
      allergies: ['custom:mango'],
    };
    const result = buildProfileDescription(profile);
    expect(result).toContain('custom:mango');
  });
});
