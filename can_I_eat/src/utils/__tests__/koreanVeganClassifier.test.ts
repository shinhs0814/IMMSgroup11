/**
 * Tests for koreanVeganClassifier.
 *
 * Run with: bun test
 *
 * Test data is based on real Korean convenience store products
 * (GS25 / CU / 7-Eleven). Ingredient strings are taken from actual
 * 성분 sections on packaging.
 */

import { describe, expect, test } from 'bun:test';
import {
  classifyKoreanVegan,
  disagreesWithLLM,
} from '../koreanVeganClassifier';

describe('classifyKoreanVegan — clear unsafe cases', () => {
  test('진라면 (instant ramen with beef) → unsafe', () => {
    const text = '소맥분, 팜유, 정제소금, 쇠고기분말, 양파분말, 마늘분말';
    const result = classifyKoreanVegan(text);
    expect(result.verdict).toBe('unsafe');
    expect(result.detectedAnimal.map((d) => d.canonical)).toContain('쇠고기');
  });

  test('치즈볼 (cheese ball snack) → unsafe (cheese)', () => {
    const text = '옥수수, 식물성유지, 치즈분말, 정제소금, 향미증진제';
    const result = classifyKoreanVegan(text);
    expect(result.verdict).toBe('unsafe');
    expect(result.detectedAnimal.map((d) => d.canonical)).toContain('치즈');
  });

  test('우유빵 (milk bread) → unsafe (milk + egg)', () => {
    const text = '밀가루, 설탕, 우유, 계란, 버터, 효모';
    const result = classifyKoreanVegan(text);
    expect(result.verdict).toBe('unsafe');
    const canonicals = result.detectedAnimal.map((d) => d.canonical);
    expect(canonicals).toContain('우유');
    expect(canonicals).toContain('계란');
    expect(canonicals).toContain('버터');
  });

  test('alias matches: 우육 → 쇠고기', () => {
    const text = '면, 양념분말(우육분말, 양파)';
    const result = classifyKoreanVegan(text);
    expect(result.verdict).toBe('unsafe');
    expect(result.detectedAnimal[0].canonical).toBe('쇠고기');
    expect(result.detectedAnimal[0].matchedText).toBe('우육');
  });

  test('알리오올리오 (with anchovy sauce) → unsafe', () => {
    const text = '파스타면, 올리브유, 마늘, 멸치액젓, 페퍼론치노';
    const result = classifyKoreanVegan(text);
    expect(result.verdict).toBe('unsafe');
    expect(result.detectedAnimal.map((d) => d.canonical)).toContain('액젓');
  });
});

describe('classifyKoreanVegan — caution cases', () => {
  test('과자 with 향료 only → caution', () => {
    const text = '밀가루, 설탕, 식물성유지, 정제소금, 향료';
    const result = classifyKoreanVegan(text);
    expect(result.verdict).toBe('caution');
    expect(result.detectedAmbiguous.map((d) => d.canonical)).toContain('향료');
  });

  test('두부 with 글리세린 → caution (could be plant or animal)', () => {
    const text = '대두, 정제수, 글리세린, 응고제';
    const result = classifyKoreanVegan(text);
    expect(result.verdict).toBe('caution');
  });

  test('콩과자 with L-시스테인 → caution', () => {
    const text = '대두, 식물성유지, 정제소금, L-시스테인';
    const result = classifyKoreanVegan(text);
    expect(result.verdict).toBe('caution');
    expect(result.detectedAmbiguous.map((d) => d.canonical)).toContain('L-시스테인');
  });
});

describe('classifyKoreanVegan — clear safe cases', () => {
  test('plain rice → safe', () => {
    const text = '쌀';
    const result = classifyKoreanVegan(text);
    expect(result.verdict).toBe('safe');
  });

  test('두부 plain → safe', () => {
    const text = '대두, 정제수, 응고제';
    const result = classifyKoreanVegan(text);
    expect(result.verdict).toBe('safe');
  });

  test('plant-based snack → safe', () => {
    const text = '감자, 식물성유지, 정제소금, 양파분말';
    const result = classifyKoreanVegan(text);
    expect(result.verdict).toBe('safe');
  });
});

describe('classifyKoreanVegan — edge cases', () => {
  test('empty string → caution', () => {
    const result = classifyKoreanVegan('');
    expect(result.verdict).toBe('caution');
  });

  test('whitespace only → caution', () => {
    const result = classifyKoreanVegan('   \n\t  ');
    expect(result.verdict).toBe('caution');
  });

  test('parentheses are stripped before matching', () => {
    const text = '면(쇠고기향), 양념';
    const result = classifyKoreanVegan(text);
    expect(result.verdict).toBe('unsafe');
  });

  test('priority: red-flag wins over amber even if both present', () => {
    const text = '밀가루, 향료, 우유';
    const result = classifyKoreanVegan(text);
    expect(result.verdict).toBe('unsafe');
    expect(result.detectedAnimal.length).toBeGreaterThan(0);
    expect(result.detectedAmbiguous.length).toBeGreaterThan(0);
  });

  test('reason string includes Korean canonical names', () => {
    const text = '밀가루, 우유';
    const result = classifyKoreanVegan(text);
    expect(result.reason).toContain('우유');
  });
});

describe('disagreesWithLLM — guardrail behavior', () => {
  test('LLM says safe but classifier finds beef → flag disagreement', () => {
    const text = '면, 쇠고기분말';
    const result = classifyKoreanVegan(text);
    expect(disagreesWithLLM('safe', result)).toBe(true);
  });

  test('LLM says safe and classifier agrees → no disagreement', () => {
    const text = '쌀, 정제수';
    const result = classifyKoreanVegan(text);
    expect(disagreesWithLLM('safe', result)).toBe(false);
  });

  test('LLM says unsafe but classifier says safe → no disagreement (trust LLM breadth)', () => {
    const text = '쌀';
    const result = classifyKoreanVegan(text);
    expect(disagreesWithLLM('unsafe', result)).toBe(false);
  });

  test('LLM says safe but classifier finds amber ingredient → flag (be conservative)', () => {
    const text = '밀가루, 향료';
    const result = classifyKoreanVegan(text);
    expect(disagreesWithLLM('safe', result)).toBe(true);
  });
});
