# Health Dashboard — Can I Eat?

> Output of running gstack's `/health` skill against `can_I_eat/` on branch
> `feature/hw8-test-infrastructure`. This file is the audit trail for HW8 Part 2.

Date: 2026-05-24
Project root: `can_I_eat/`

---

## Step 1 — Detected health stack

Auto-detection against the project root produced:

| Category | Tool | Detected? |
|---|---|---|
| Type check | `tsc --noEmit` | ✅ (tsconfig.json present) |
| Lint | biome / eslint / ruff | ❌ no config file |
| Test | bun test / npm test | ⚠️ no `test` script before this PR |
| Dead code | knip | ❌ not installed |
| Shell lint | shellcheck | ❌ not installed |
| GBrain (D6) | gbrain doctor | ❌ not installed |

→ Only 2 of 6 categories were available. The dashboard's composite score
must be interpreted with that in mind.

---

## Step 2 — Initial run (BEFORE building test infrastructure)

```
CODE HEALTH DASHBOARD
=====================
Project: can_I_eat
Branch:  feature/hw8-test-infrastructure  (= upstream/main at this point)
Date:    2026-05-24

Category      Tool              Score   Status     Duration   Details
----------    ----------------  -----   --------   --------   -------
Type check    tsc --noEmit       7/10   WARNING    7s         1 error (bun:test types missing)
Lint          (skipped)         N/A     SKIP                  no config
Tests         bun test          10/10   CLEAN      <1s        30/30 passed (only koreanVeganClassifier)
Dead code     (skipped)         N/A     SKIP                  knip not installed
Shell lint    (skipped)         N/A     SKIP                  shellcheck not installed
GBrain        (skipped)         N/A     SKIP                  gbrain not installed

WEIGHT REDISTRIBUTION: typecheck 0.44, test 0.56 (others skipped)
COMPOSITE SCORE: 8.68 / 10
```

### Real story behind the 8.68 score

The composite looks healthy because /health measures whether tools
**pass**, not whether the project is well-covered. Coverage breakdown
of the can_I_eat/ source tree at this point:

- 29 source files
- **1 test file** (`koreanVeganClassifier.test.ts`)
- → 3.4 % file-level coverage. Effectively 0 % for everything that
  touches Firebase, RN screens, the LLM service, the i18n bundle,
  the restaurants dataset, or the dietary constants.

**Lesson:** the /health dashboard tells you whether your tools are
green; it does NOT tell you whether your tools are watching anything
meaningful. Both numbers matter. A green dashboard against a single
test is a green light to a thin wall.

---

## Step 3 — Gaps identified

| Gap | Severity | Fix |
|---|---|---|
| `tsc --noEmit` failed because `bun:test` had no types | medium | add `@types/bun` + `"types": ["bun"]` in tsconfig |
| No `test` script in package.json | high | add `"test": "bun test src"` |
| No CI to keep typecheck/tests green | high | add `.github/workflows/health.yml` |
| Dictionary (`animalIngredientsKo.ts`) untested for structural bugs (duplicates, alias collisions) | high | add data-integrity tests |
| `dietary.ts` constants untested — typo in an id silently breaks saved profiles | high | add id uniqueness + format tests |
| `translations.ts` runtime untested — empty values, TODO leftovers, wrong-script content slip past TypeScript | medium | add i18n consistency tests |
| `restaurants.json` schema untested — converter regressions invisible | medium | add schema validation tests |

---

## Step 4 — Applied fixes (this PR)

- ✅ `package.json`: added `test`, `test:watch`, `typecheck`, `health` scripts
- ✅ `package.json`: added `@types/bun` to devDependencies
- ✅ `tsconfig.json`: `"types": ["bun"]` so `import { ... } from 'bun:test'` typechecks
- ✅ `HEALTH.md` at project root: declares the health stack so future `/health` runs skip detection
- ✅ `.github/workflows/health.yml`: CI workflow runs `typecheck` + `test` on every push and PR
- ✅ `src/utils/__tests__/animalIngredientsKo.test.ts` — 12 dictionary integrity tests
- ✅ `src/constants/__tests__/dietary.test.ts` — 16 dietary-constants tests
- ✅ `src/constants/__tests__/translations.test.ts` — 8 i18n consistency tests
- ✅ `src/data/__tests__/restaurants.test.ts` — 10 dataset schema tests

---

## Step 5 — Re-run after fixes (AFTER)

```
CODE HEALTH DASHBOARD
=====================
Project: can_I_eat
Branch:  feature/hw8-test-infrastructure
Date:    2026-05-24 (post-fix)

Category      Tool              Score   Status     Duration   Details
----------    ----------------  -----   --------   --------   -------
Type check    tsc --noEmit      10/10   CLEAN      7s         0 errors
Lint          (skipped)         N/A     SKIP                  intentionally deferred
Tests         bun test          10/10   CLEAN      <1s        76/76 passed (5 test files)
Dead code     (skipped)         N/A     SKIP                  deferred
Shell lint    (skipped)         N/A     SKIP                  deferred
GBrain        (skipped)         N/A     SKIP                  not used

WEIGHT REDISTRIBUTION: typecheck 0.44, test 0.56 (others skipped)
COMPOSITE SCORE: 10.0 / 10
```

### Real story behind the 10.0

The composite is now maxed because both active tools exit clean.
**But** coverage is still a fraction of the codebase:

- 29 source files
- 5 test files
- → 17 % file-level coverage

That's a 5x improvement (1 → 5 files; 30 → 76 tests). The remaining
gap is the React Native UI layer and the Firebase / Anthropic / fetch
services, which need test-harness work (mocks, RN testing library)
before they can be covered. Those are tracked in `HEALTH.md` under
"What's NOT covered."

---

## Step 6 — Trend & recommendation

This is the first /health run for this project, so there is no trend yet.
Starting from this PR, every CI run will record a new dashboard entry
(via the GitHub Actions log). The next /health run should also append
to `~/.gstack/projects/<slug>/health-history.jsonl` so the trend chart
becomes usable.

**Next /health iteration should focus on:**

1. Service-layer tests (anthropic.ts, imageSearch.ts) — extract pure
   parsers from the network calls so they're testable without mocks.
2. RN component tests — at least one snapshot test per screen.
3. Add biome (or eslint) for a real lint signal.

---

## What gets submitted to kardens.io

The Q2a answer ("major lesson after setting up and running the
comprehensive tests") draws from this report. Punchline:

> The /health dashboard tells you whether your tools are passing;
> coverage tells you whether your tools are watching anything. A clean
> dashboard against a thin test suite is a green light to a wall with
> no monitor behind it. Always pair the dashboard with a coverage
> report when judging health.
