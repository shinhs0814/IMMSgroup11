# can_I_eat — Health Stack

This file is read by gstack's `/health` skill to know which checks to run.
It is also the entry point for new contributors who want to verify the
repo passes its quality gates locally.

## Health Stack

- typecheck: `bun run typecheck` (= `tsc --noEmit`)
- test: `bun run test` (= `bun test src`)

> Lint, dead-code, shell-lint, and gbrain are intentionally **out of scope
> for this homework iteration**. They can be added later by appending lines
> to this section; the next `/health` run will pick them up.

## How to run locally

```bash
cd can_I_eat
bun install
bun run health        # runs typecheck + tests
```

Or step by step:

```bash
bun run typecheck     # exit 0 expected
bun run test          # exit 0 expected
```

## What's covered today

| Module | Test file | Tests |
|---|---|---|
| `utils/koreanVeganClassifier.ts` | `utils/__tests__/koreanVeganClassifier.test.ts` | 30 |
| `utils/data/animalIngredientsKo.ts` | `utils/__tests__/animalIngredientsKo.test.ts` | 12 |
| `constants/dietary.ts` | `constants/__tests__/dietary.test.ts` | 16 |
| `constants/translations.ts` | `constants/__tests__/translations.test.ts` | 8 |
| `data/restaurants.json` | `data/__tests__/restaurants.test.ts` | 10 |
| **Total** | **5 files** | **76 tests** |

## What's NOT covered (next iteration targets)

- `services/anthropic.ts` — needs JSON-parse extraction + mock fixtures
- `services/imageSearch.ts` — needs fetch mock helper (msw or similar)
- `services/storage.ts` — needs firestore mock
- All React Native screens (`screens/**/*.tsx`) — need RN testing-library setup
- All contexts (`context/**/*.tsx`) — need React testing harness

## CI

`.github/workflows/health.yml` runs `typecheck` + `test` on every push to
`main` and every PR. Branches that don't pass go red on GitHub before merge.

## How to add a new test file

1. Create `<module-folder>/__tests__/<module>.test.ts`
2. Use Bun's built-in runner:
   ```ts
   import { describe, expect, test } from 'bun:test';
   ```
3. Run `bun run test` to confirm it's picked up
4. CI picks it up automatically — no glob to update.
