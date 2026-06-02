# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Can I Eat?** is a React Native / Expo app that helps users with dietary restrictions identify safe foods. Users scan food packaging, photograph dishes, search by name, or scan barcodes. The app uses Claude Vision (claude-sonnet-4-6) to analyze images/text and returns a dietary safety verdict (safe / caution / unsafe) based on the user's personal dietary profile.

The app targets iOS, Android, and Web (with feature fallbacks — e.g. QR Passport is mobile-only).

## Repository Structure

```
IMMSgroup11/
├── can_I_eat/       ← Expo app (all source code lives here)
│   ├── App.tsx      ← Root: loads fonts, wraps with LanguageProvider > AuthProvider > AppNavigator
│   ├── src/
│   │   ├── navigation/AppNavigator.tsx   ← Manual screen-state router (no React Navigation)
│   │   ├── context/                      ← AuthContext, LanguageContext, FoodContext
│   │   ├── screens/                      ← Grouped by feature
│   │   ├── services/                     ← anthropic.ts, firebase.ts, storage.ts, imageSearch.ts
│   │   ├── utils/                        ← Deterministic vegan classifiers (tested with Bun)
│   │   ├── constants/                    ← colors, dietary, fonts, translations
│   │   └── components/                   ← AppText (auto-font by language)
│   └── ...
└── docs/            ← Spec docs, design docs (SPEC-*.md, WEDGE.md, PREMORTEM.md, etc.)
```

## Commands

All commands run from `can_I_eat/`:

```bash
# Start dev server (choose platform)
npx expo start
npx expo start --ios
npx expo start --android
npx expo start --web

# Run unit tests (Bun required)
bun test src/utils/__tests__

# Watch mode
bun test --watch src/utils/__tests__

# Run a single test file
bun test src/utils/__tests__/koreanVeganClassifier.test.ts

# Type-check
npx tsc --noEmit
```

Tests use Bun natively (`@types/bun`); no separate Jest/Vitest config is needed. Tests only cover `src/utils/__tests__/` — pure TypeScript utility functions.

## Environment Setup

Copy `.env.example` to `.env` and fill in:

```
EXPO_PUBLIC_ANTHROPIC_API_KEY=   # from console.anthropic.com
EXPO_PUBLIC_FIREBASE_API_KEY=
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=
EXPO_PUBLIC_FIREBASE_PROJECT_ID=
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
EXPO_PUBLIC_FIREBASE_APP_ID=
```

All env vars must be prefixed with `EXPO_PUBLIC_` to be accessible in Expo.

## Architecture

### Navigation

Navigation is **manual state machine** — no `@react-navigation` stack is used for the main flow. `AppNavigator.tsx` holds a `screen: Screen` enum state and conditionally renders the appropriate screen component. This means "going back" is done by calling `setScreen('home')` or similar prop callbacks, not via a navigation library.

Auth flow gating:
1. **SplashScreen** always shown first
2. No user → **SignIn / SignUp**
3. User but no dietary profile → **SurveyScreen**
4. Fully authenticated → **AuthenticatedApp** (Home + bottom tab bar + sidebar)

### Context Providers (layered at App root)

- **LanguageProvider** — persists language choice to AsyncStorage; provides `t` (translation keys) and `language` (`'en' | 'ko' | 'es' | 'fr' | 'ja'`)
- **AuthProvider** — Firebase Auth state; exposes `user`, `dietaryProfile`, `hasSurveyCompleted`
- **FoodProvider** — wraps authenticated app only; manages saved foods & groups via Firestore

### AI Analysis Pipeline (`services/anthropic.ts`)

Three exported functions:
- `analyzeFoodImage(base64, mimeType, profile, uiLanguage)` — photo/label → `AnalysisResult`
- `analyzeFoodText(query, profile, uiLanguage)` — text query → `AnalysisResult`
- `analyzeMenu(base64, mimeType, profile, uiLanguage)` — restaurant menu photo → `MenuAnalysisItem[]`

The AI prompt instructs the model to respond in the user's chosen `uiLanguage` (one of English, Korean, Spanish, French, Japanese). All response content including ingredient names and summaries are in the UI language.

### Deterministic Vegan Guardrail (`utils/`)

A rule-based second opinion layered on top of the LLM, addressing hallucination risk for vegan/vegetarian users. After `analyzeFoodImage` returns:

1. If the label is Korean AND the user is vegan/vegetarian, run `classifyKoreanVegan(originalIngredients.join(', '))`
2. If `disagreesWithLLM(llmVerdict, classifierResult)` → set `result.veganWarning` on the result
3. `ResultScreen` surfaces the conflict to the user

The multilingual dispatcher `classifyVegan()` in `multilingualVeganClassifier.ts` auto-detects language (Korean vs. English via character heuristics) and routes to the appropriate classifier. Unknown languages return `caution`.

### Firebase Data Model (Firestore)

Collections:
- `users/{uid}` → `{ dietaryProfile: DietaryProfile, familyMembers?: FamilyMember[] }`
- `foodGroups/{id}` → `{ userId, name, createdAt }`
- `savedFoods/{id}` → `{ userId, groupId, foodName, analysisResult, imageBase64?, imageUrl?, savedAt }`
- `mealRecords/{id}` → `{ userId, foodName, date (YYYY-MM-DD), eatenAt, analysisResult, imageBase64?, imageUrl? }`

Firestore queries are filtered by `userId` client-side; composite indexes are avoided by sorting results in memory after fetching.

### Web Platform Differences

- `QRPassportScreen` has a `.web.tsx` sibling that replaces the native version with a stub message ("available on mobile app")
- Camera features require Expo Camera / Image Picker which may not be fully available on web

### Fonts & Text

Use `<AppText weight="700">` instead of `<Text>` throughout the app. `AppText` automatically selects:
- **Jost** for Latin scripts (en, es, fr)
- **NanumGothic** for Korean
- **NotoSansJP** for Japanese

### Barcode Scanning

`CameraScreen` supports barcode scan mode. Barcodes are looked up against the Open Food Facts API (`world.openfoodfacts.org/api/v0/product/{barcode}.json`). If found, the product name and ingredients text are passed to `analyzeFoodImage` as a `textOverride`.

## Key Patterns

### Translations
Always use the `t` object from `useLanguage()` for UI strings. Never hardcode English strings in components.
```tsx
const { t } = useLanguage();
// Good: <Text>{t.allergiesTitle}</Text>
// Bad:  <Text>Allergies</Text>
```
When adding a new UI string, add it to **all 5 languages** in `translations.ts` — TypeScript will catch missing keys at compile time.

### Dietary constants
Always reference IDs from `ALLERGIES`, `DIETARY_RESTRICTIONS`, `DIETARY_PREFERENCES` in `constants/dietary.ts`. Never hardcode string IDs.

### Variable declaration order
Declare all variables **before** using them. The QR Passport bug (May 2026) happened because `qrLines` referenced `allergyLabels` before it was declared.

## Git & Branch Conventions

- Branch naming: `<author>-<feature-name>` (use dashes, not slashes — e.g. `hwangbci-share-result`)
- One feature per branch — do not bundle multiple features
- Commit message format: `feat|fix|docs|test|chore(scope): description`
- Always run `tsc --noEmit` before committing — 0 TypeScript errors required
- Run `bun test src/utils/__tests__` before committing — all tests must pass
- Always sync with `origin/main` before creating a new branch to avoid merge conflicts

## Known Gotchas

- `bun` binary on Windows is at `C:\Users\hwang\.bun\bin\bun.exe` — the npm shim may be broken. Use PowerShell with the full path if needed.
- `moduleResolution: bundler` (from expo tsconfig) requires `@types/bun` for test files to type-check cleanly.
- Restaurant data is loaded from a local JSON file, not a live API.
- AI image analysis **cannot detect hidden ingredients** (broth, sauces, oils) — always show a disclaimer on the result screen.

## Lesson Log

| Date | Lesson |
|------|--------|
| 2026-05-23 | "Working" ≠ "correct" — 16 hidden TS errors found only after running health check |
| 2026-05-23 | Translation keys must be added to all 5 locales simultaneously — TypeScript enforces this |
| 2026-05-26 | Variable declaration order matters — use before declare causes silent runtime bugs in bundlers |
| 2026-05-27 | AI image analysis cannot detect hidden ingredients (broth, sauces) — always show a disclaimer |
| 2026-05-31 | Always sync with origin/main before creating a new branch — two members adding the same file causes a merge conflict |
