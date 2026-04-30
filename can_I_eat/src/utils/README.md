# utils — Korean Vegan Classifier

A deterministic, rule-based guardrail that complements `services/anthropic.ts`.

## Why

The LLM (Claude Vision in `anthropic.ts`) does the heavy lifting — OCR, multilingual ingredient extraction, dietary analysis — in a single prompt. That is convenient but brittle:

- **Hallucinations** — the LLM may invent or omit ingredients.
- **Inconsistency** — the same image can yield different verdicts across runs.
- **Untestable** — no deterministic ground truth to unit-test against.

This module addresses [PREMORTEM #1](../../../docs/PREMORTEM.md) ("잘못된 판정으로 신뢰를 잃는다") by adding a deterministic second opinion for the wedge defined in [WEDGE.md](../../../docs/WEDGE.md): Korean ingredient text → vegan verdict.

## Files

- `data/animalIngredientsKo.ts` — curated dictionary (`RED_LIST` for confirmed animal-derived terms, `AMBER_LIST` for ambiguous-source terms).
- `koreanVeganClassifier.ts` — `classifyKoreanVegan(text)` and `disagreesWithLLM(llmVerdict, result)`.
- `__tests__/koreanVeganClassifier.test.ts` — Bun-based unit tests.

## Usage

```ts
import { classifyKoreanVegan, disagreesWithLLM } from './utils/koreanVeganClassifier';

const text = '소맥분, 팜유, 정제소금, 쇠고기분말';
const result = classifyKoreanVegan(text);
// result.verdict === 'unsafe'
// result.detectedAnimal[0].canonical === '쇠고기'
// result.reason === '동물성 성분 검출: 쇠고기'
```

As an LLM guardrail (after `analyzeFoodImage` returns):

```ts
const localCheck = classifyKoreanVegan(extractedKoreanText);
if (disagreesWithLLM(llmResult.overallStatus, localCheck)) {
  // Surface the conflict to the user — LLM said "safe" but we found
  // animal ingredients. Better to err conservative.
}
```

## Running tests

```bash
cd can_I_eat
bun test src/utils/__tests__/
```

Bun runs `.test.ts` files natively — no separate test runner config needed.

Requires [Bun](https://bun.sh) v1.0+ on the developer's machine. The Expo/React Native runtime itself does not depend on Bun.

## Scope

V1 covers only:

- Korean text input
- Vegan classification

Other diets (allergies, halal, kosher, diabetic) and other label languages are explicitly deferred — see [WEDGE.md](../../../docs/WEDGE.md) for the rationale and the V2+ expansion path.
