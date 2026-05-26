/**
 * Tests for multilingualVeganClassifier — Story 3 acceptance criteria.
 */

import { describe, expect, test } from 'bun:test';
import {
  detectLanguage,
  classifyVegan,
} from '../multilingualVeganClassifier';

describe('detectLanguage', () => {
  test("'우유, 설탕' → 'ko'", () => {
    expect(detectLanguage('우유, 설탕')).toBe('ko');
  });

  test("'milk, sugar' → 'en'", () => {
    expect(detectLanguage('milk, sugar')).toBe('en');
  });

  test("'' → 'unknown'", () => {
    expect(detectLanguage('')).toBe('unknown');
  });

  test("'   ' (whitespace only) → 'unknown'", () => {
    expect(detectLanguage('   ')).toBe('unknown');
  });

  test("'日本語のテスト' (Japanese) → 'unknown'", () => {
    expect(detectLanguage('日本語のテスト')).toBe('unknown');
  });

  test('mixed Korean + English label → ko (Hangul wins)', () => {
    // Real Korean labels often include English brand names. The Hangul
    // presence is the primary signal.
    expect(detectLanguage('우유 (Milk), 설탕 (Sugar)')).toBe('ko');
  });

  test('digits and punctuation only → unknown', () => {
    expect(detectLanguage('1234, 5678')).toBe('unknown');
  });
});

describe('classifyVegan — routing', () => {
  test('Korean text routes to Korean classifier', () => {
    const r = classifyVegan('우유, 설탕');
    expect(r.language).toBe('ko');
    expect(r.verdict).toBe('unsafe');
    expect(r.detectedAnimal.map((d) => d.canonical)).toContain('우유');
  });

  test('English text routes to English classifier', () => {
    const r = classifyVegan('milk, sugar');
    expect(r.language).toBe('en');
    expect(r.verdict).toBe('unsafe');
    expect(r.detectedAnimal.map((d) => d.canonical)).toContain('milk');
  });

  test('Japanese text returns caution without crash', () => {
    const r = classifyVegan('日本語のテスト');
    expect(r.language).toBe('unknown');
    expect(r.verdict).toBe('caution');
    expect(r.reason).toContain('Unsupported');
  });

  test('empty input returns caution', () => {
    const r = classifyVegan('');
    expect(r.verdict).toBe('caution');
    expect(r.language).toBe('unknown');
  });

  test('Korean classifier still detects flavorings as caution via dispatcher', () => {
    const r = classifyVegan('밀가루, 향료');
    expect(r.language).toBe('ko');
    expect(r.verdict).toBe('caution');
  });

  test('English classifier still detects flavor-marker AMBER via dispatcher', () => {
    const r = classifyVegan('beef-flavored chips, salt');
    expect(r.language).toBe('en');
    expect(r.verdict).toBe('caution');
    expect(r.detectedAmbiguous.map((d) => d.canonical)).toContain('beef');
  });

  test('matchedText is preserved through dispatcher (Korean alias path)', () => {
    // '우육' is an alias of '쇠고기'.
    const r = classifyVegan('국수, 우육분말');
    expect(r.language).toBe('ko');
    expect(r.verdict).toBe('unsafe');
    expect(r.detectedAnimal[0].canonical).toBe('쇠고기');
    expect(r.detectedAnimal[0].matchedText).toBe('우육');
  });
});

describe('classifyVegan — no regression for either classifier', () => {
  // A handful of cherry-picked tests from each language to confirm the
  // dispatcher doesn't drop fidelity vs. calling the classifiers directly.

  test('Korean: "꿀맛 사탕" stays safe (false-positive defense)', () => {
    const r = classifyVegan('쌀, 꿀맛 사탕');
    expect(r.language).toBe('ko');
    expect(r.detectedAnimal.map((d) => d.canonical)).not.toContain('꿀');
  });

  test('English: "milky way bar" stays safe', () => {
    const r = classifyVegan('milky way bar, sugar');
    expect(r.language).toBe('en');
    expect(r.detectedAnimal.map((d) => d.canonical)).not.toContain('milk');
  });

  test('English: plural plus uppercase still detected', () => {
    const r = classifyVegan('EGGS, FLOUR');
    expect(r.language).toBe('en');
    expect(r.verdict).toBe('unsafe');
    expect(r.detectedAnimal.map((d) => d.canonical)).toContain('egg');
  });
});
