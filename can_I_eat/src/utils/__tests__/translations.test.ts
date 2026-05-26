/**
 * Translation completeness tests.
 *
 * Verifies that every supported language (en, ko, es, fr, ja) has:
 *  1. Exactly the same set of keys as English (the reference locale)
 *  2. No empty / blank values
 *  3. A translation key for every allergy, restriction, and preference
 *     defined in the dietary constants
 *
 * Run with: bun test
 */

import { describe, expect, test } from 'bun:test';
import { TRANSLATIONS, type AppLanguage } from '../../constants/translations';
import {
  ALLERGIES,
  DIETARY_RESTRICTIONS,
  DIETARY_PREFERENCES,
} from '../../constants/dietary';

const LANGUAGES: AppLanguage[] = ['en', 'ko', 'es', 'fr', 'ja'];

describe('TRANSLATIONS — structure', () => {
  test('all 5 languages are registered', () => {
    expect(Object.keys(TRANSLATIONS).sort()).toEqual(['en', 'es', 'fr', 'ja', 'ko']);
  });

  test('all languages have identical keys to English', () => {
    const enKeys = Object.keys(TRANSLATIONS.en).sort();
    for (const lang of LANGUAGES) {
      const langKeys = Object.keys(TRANSLATIONS[lang]).sort();
      expect(langKeys, `Language '${lang}' key set differs from English`).toEqual(enKeys);
    }
  });
});

describe('TRANSLATIONS — no empty values', () => {
  for (const lang of LANGUAGES) {
    test(`${lang}: no key has an empty or whitespace-only value`, () => {
      const t = TRANSLATIONS[lang] as Record<string, string>;
      for (const [key, value] of Object.entries(t)) {
        expect(
          value.trim().length,
          `'${lang}.${key}' is empty or blank`
        ).toBeGreaterThan(0);
      }
    });
  }
});

describe('TRANSLATIONS — dietary key coverage', () => {
  for (const lang of LANGUAGES) {
    test(`${lang}: has a translation for every ALLERGY id`, () => {
      const t = TRANSLATIONS[lang] as Record<string, string>;
      for (const allergy of ALLERGIES) {
        const key = `allergy_${allergy.id}`;
        expect(t[key], `'${lang}' missing key '${key}'`).toBeTruthy();
      }
    });

    test(`${lang}: has a translation for every DIETARY_RESTRICTION id`, () => {
      const t = TRANSLATIONS[lang] as Record<string, string>;
      for (const restriction of DIETARY_RESTRICTIONS) {
        const key = `restriction_${restriction.id}`;
        expect(t[key], `'${lang}' missing key '${key}'`).toBeTruthy();
      }
    });

    test(`${lang}: has a translation for every DIETARY_PREFERENCE id`, () => {
      const t = TRANSLATIONS[lang] as Record<string, string>;
      for (const pref of DIETARY_PREFERENCES) {
        const key = `pref_${pref.id}`;
        expect(t[key], `'${lang}' missing key '${key}'`).toBeTruthy();
      }
    });
  }
});
