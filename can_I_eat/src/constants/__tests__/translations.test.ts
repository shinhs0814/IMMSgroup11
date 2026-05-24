/**
 * i18n consistency tests for translations.ts.
 *
 * The app supports 5 languages (en, ko, es, fr, ja). TypeScript's
 * `Record<AppLanguage, TranslationKeys>` enforces that every language
 * has every key at compile time, but it does NOT catch:
 *   - empty string values (forgot to translate)
 *   - placeholder values like "TODO" or copy-pasted English in another locale
 *   - missing supported languages in LANGUAGE_LABELS / LANGUAGE_NAMES
 *
 * These runtime tests catch those.
 */

import { describe, expect, test } from 'bun:test';
import {
  TRANSLATIONS,
  LANGUAGE_LABELS,
  LANGUAGE_NAMES,
  type AppLanguage,
  type TranslationKeys,
} from '../translations';

const SUPPORTED_LANGUAGES: AppLanguage[] = ['en', 'ko', 'es', 'fr', 'ja'];

describe('translations — completeness', () => {
  test('TRANSLATIONS has all 5 supported languages', () => {
    for (const lang of SUPPORTED_LANGUAGES) {
      expect(TRANSLATIONS[lang]).toBeDefined();
    }
  });

  test('every language has the same set of keys', () => {
    const enKeys = Object.keys(TRANSLATIONS.en).sort();
    for (const lang of SUPPORTED_LANGUAGES) {
      const langKeys = Object.keys(TRANSLATIONS[lang]).sort();
      expect(langKeys).toEqual(enKeys);
    }
  });

  test('every translation value is a non-empty string', () => {
    const empty: string[] = [];
    for (const lang of SUPPORTED_LANGUAGES) {
      const bundle = TRANSLATIONS[lang] as Record<string, string>;
      for (const [key, value] of Object.entries(bundle)) {
        if (typeof value !== 'string' || value.trim().length === 0) {
          empty.push(`${lang}.${key}`);
        }
      }
    }
    expect(empty).toEqual([]);
  });

  test('no translation value contains TODO / FIXME markers', () => {
    const flagged: string[] = [];
    const MARKERS = ['TODO', 'FIXME', 'XXX', '???'];
    for (const lang of SUPPORTED_LANGUAGES) {
      const bundle = TRANSLATIONS[lang] as Record<string, string>;
      for (const [key, value] of Object.entries(bundle)) {
        for (const m of MARKERS) {
          if (value.includes(m)) flagged.push(`${lang}.${key}: "${value}"`);
        }
      }
    }
    expect(flagged).toEqual([]);
  });
});

describe('translations — language metadata', () => {
  test('LANGUAGE_LABELS covers every supported language', () => {
    for (const lang of SUPPORTED_LANGUAGES) {
      expect(LANGUAGE_LABELS[lang]).toBeDefined();
      expect(LANGUAGE_LABELS[lang].length).toBeGreaterThan(0);
    }
  });

  test('LANGUAGE_NAMES covers every supported language', () => {
    for (const lang of SUPPORTED_LANGUAGES) {
      expect(LANGUAGE_NAMES[lang]).toBeDefined();
      expect(LANGUAGE_NAMES[lang].length).toBeGreaterThan(0);
    }
  });

  test('LANGUAGE_NAMES values are English (used in LLM prompts)', () => {
    // anthropic.ts passes LANGUAGE_NAMES[language] to the Claude prompt
    // as the desired output language. If we put native names here, the
    // LLM may hallucinate or refuse. Must stay English.
    const ENGLISH_ONLY = /^[A-Za-z][A-Za-z\s-]*$/;
    for (const lang of SUPPORTED_LANGUAGES) {
      expect(LANGUAGE_NAMES[lang]).toMatch(ENGLISH_ONLY);
    }
  });
});

describe('translations — heuristic content checks', () => {
  test('Korean bundle should contain Hangul characters', () => {
    const ko = TRANSLATIONS.ko as Record<string, string>;
    const hangulRe = /[가-힯]/;
    let hangulCount = 0;
    for (const value of Object.values(ko)) {
      if (hangulRe.test(value)) hangulCount++;
    }
    // At least 50% of Korean strings should contain Hangul.
    // Allows for short tokens (e.g. "OK") that have no Korean equivalent.
    const totalKeys = Object.keys(ko).length;
    expect(hangulCount / totalKeys).toBeGreaterThan(0.5);
  });

  test('Japanese bundle should contain Kana or Kanji characters', () => {
    const ja = TRANSLATIONS.ja as Record<string, string>;
    const kanaKanji = /[぀-ヿ一-鿿]/;
    let cjkCount = 0;
    for (const value of Object.values(ja)) {
      if (kanaKanji.test(value)) cjkCount++;
    }
    const totalKeys = Object.keys(ja).length;
    expect(cjkCount / totalKeys).toBeGreaterThan(0.5);
  });
});
