# Ralph Loop — Progress Log

Branch: `feature/hw8-multilingual-vegan-loop`
Feature: English vegan classifier + multilingual dispatcher (Wedge V2)
Total stories: 3

Iterations run below in chronological order. Each iteration follows the
ralph pattern: pick story → implement → verify acceptance criteria → mark
complete → loop.

---

## Iteration 1 — Story 1: English vegan classifier

**Plan:**
- Mirror koreanVeganClassifier shape but with English-specific tokenization.
- Use word-boundary check (`[a-z0-9]` adjacency) instead of Korean's
  "any flavor suffix after candidate" check, because English has explicit
  word boundaries (spaces / hyphens).
- Flavor markers: `flavored`, `flavor`, `flavour`, `flavoured`, `style`.

**Files written:**
- `can_I_eat/src/utils/data/animalIngredientsEn.ts` (RED_LIST 38 entries, AMBER 10)
- `can_I_eat/src/utils/englishVeganClassifier.ts`
- `can_I_eat/src/utils/__tests__/englishVeganClassifier.test.ts`

**Verification (`bun test src/utils/__tests__/englishVeganClassifier.test.ts`):**
- 14 pass / 0 fail / 35 expect()

**Acceptance criteria check:**
- ✅ `classifyEnglishVegan('milk, sugar, salt')` → unsafe + 'milk'
- ✅ `'whole milk powder, beef stock'` → both flagged
- ✅ `'milky way bar, sugar'` does NOT false-match (word boundary)
- ✅ `'flour, sugar, vegetable oil'` → safe
- ✅ `'flour, natural flavoring'` → caution
- ✅ Dictionary has 38 RED entries (>= 30 required)
- ✅ All tests pass

**Story 1: passes = true.** Continue to Iteration 2.

---

## Iteration 2 — Story 2: Lexical variation + flavor-marker promotion

**Plan (TDD-style — write failing tests, then fix):**
1. Write 8 new tests for: Title case, UPPERCASE plural, lowercase plural,
   `shrimps`, `hams`, hyphenated (`pork-derived`), and the two flavor-marker
   cases (`beef-flavored` and `chicken-style`) which should escalate to AMBER.
2. Run them — expect ~4 fails based on iteration-1 implementation.
3. Fix root causes, not the tests.

**Test results before fix:** 18 pass / 4 fail.
- ❌ `shrimps` (plural not in dict)
- ❌ `hams` (plural not in dict)
- ❌ `beef-flavored chips` → returned `safe`, should be `caution`
- ❌ `chicken-style nugget` → returned `safe`, should be `caution`

**Root cause diagnosis:**
- Plural handling was per-entry alias lists. Inefficient and incomplete.
- Flavor-marker logic in iteration 1 zeroed out the RED match entirely
  instead of promoting it to AMBER.

**Fix:**
1. `checkTokenMatch()` now accepts trailing `'s'` followed by a boundary as
   a match. One rule, covers all regular English plurals — no per-entry
   alias bloat.
2. Returns `'flavor-rejected'` (instead of `false`) when surrounded by a
   flavor marker. Caller (`findMatches`) collects these as
   `flavorPromoted` and merges into AMBER results.

**Files modified:**
- `can_I_eat/src/utils/englishVeganClassifier.ts` — refactored matching.
- `can_I_eat/src/utils/__tests__/englishVeganClassifier.test.ts` — added 8 tests.

**Verification (`bun run test` and `bun run typecheck`):**
- 98 pass / 0 fail / 636 expect() (full suite, 6 test files)
- `tsc --noEmit` exit 0

**Acceptance criteria check:**
- ✅ Title case 'Milk'
- ✅ UPPERCASE 'EGGS'
- ✅ Plural 'eggs' → 'egg'
- ✅ Hyphenated 'pork-derived' → 'pork'
- ✅ 'beef-flavored chips' → caution (AMBER)
- ✅ All previously passing tests still pass (no regression)

**Story 2: passes = true.** Continue to Iteration 3.

---

## Iteration 3 — Story 3: Multilingual dispatcher

**Plan:**
- Single entry point `classifyVegan(text)` for the rest of the app.
- `detectLanguage(text)` uses character-class heuristics:
  - Hangul present → 'ko'
  - >=70 % Latin letters of wordlike chars → 'en'
  - Otherwise → 'unknown' (returns caution)
- Dispatcher wraps each language-specific classifier and unifies the
  return type (`MultilingualResult`) so callers don't switch on language.

**Files written:**
- `can_I_eat/src/utils/multilingualVeganClassifier.ts`
- `can_I_eat/src/utils/__tests__/multilingualVeganClassifier.test.ts`

**Verification (`bun run health`, which runs `typecheck && test`):**
- ✅ `tsc --noEmit` exit 0
- ✅ `bun test src` — 115 pass / 0 fail / 670 expect()
- ✅ 7 test files (up from 5 in HW8 Part 2, and 1 at start of HW8)

**Acceptance criteria check:**
- ✅ `detectLanguage('우유, 설탕')` → 'ko'
- ✅ `detectLanguage('milk, sugar')` → 'en'
- ✅ `detectLanguage('')` → 'unknown'
- ✅ `classifyVegan('우유, 설탕')` routes to KR, returns unsafe + '우유'
- ✅ `classifyVegan('milk, sugar')` routes to EN, returns unsafe + 'milk'
- ✅ `classifyVegan('日本語のテスト')` returns caution with unsupported-language reason
- ✅ No regressions in either KR or EN classifier (full suite green)
- ✅ `bun run health` exits clean

**Story 3: passes = true.**

---

## Completion summary

All 3 stories in `.omc/prd.json` are now `passes: true`.

**Test growth across iterations:**

| Stage | Test files | Tests | expect() calls |
|---|---|---|---|
| HW6 ship (start of HW8) | 1 | 30 | 47 |
| HW8 Part 2 finish | 5 | 76 | 585 |
| Iteration 1 done | 6 | 90 | 620 |
| Iteration 2 done | 6 | 98 | 636 |
| Iteration 3 done | 7 | 115 | 670 |

**Behavioral growth:**
1. Korean-only classifier (1 language)
2. + English classifier with word-boundary matching (2 languages)
3. + Plural / uppercase / hyphen tolerance + flavor-marker AMBER promotion
4. + Auto language dispatcher with graceful unsupported-language fallback

**Most important learning from running the ralph-style loop:**

Tests fail in iteration 2 are not embarrassing — they ARE the value. The
iteration 1 implementation looked sensible but had a subtle design flaw
(flavor markers zeroed out matches instead of promoting them to AMBER).
That flaw was invisible until we wrote a test that codified the actual
desired UX. The loop is what made the design choice visible.

The "minimum 3 iterations" rule in HW8 implicitly bakes this in: the
first iteration almost always over-claims completeness, and the second
iteration's job is to find the holes.
