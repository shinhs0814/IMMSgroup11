# Can I Eat? — CLAUDE.md

AI agent instructions for the **Can I Eat?** term project (KAIST BIZ 69911, Team 11).
Read this file before touching any code in this repo.

---

## Project Overview

**Can I Eat?** is a React Native (Expo) mobile app that helps foreign residents and travelers in Korea check whether food is safe for them based on their dietary profile (allergies, restrictions, preferences).

Core flow:
1. User sets up a dietary profile (allergies, restrictions, preferences) via a 3-step survey on first launch.
2. User scans food — either by taking a photo, choosing from gallery, or typing a food name.
3. Claude Vision API analyzes the food and returns a safety verdict: **safe / caution / unsafe**.
4. User can save results to a personal library, share them, or show their QR Passport to restaurant staff.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React Native + Expo (~54) |
| Language | TypeScript (strict mode) |
| Auth | Firebase Authentication (email/password) |
| Database | Firestore (Firebase) |
| AI | Anthropic Claude API (`claude-sonnet-4-6`) |
| Test runner | Bun (`bun test`) |
| Font | Jost, Nanum Gothic, Noto Sans JP |

---

## Project Structure

```
can_I_eat/
├── src/
│   ├── components/        # Shared UI components (AppText, SettingsSidebar)
│   ├── constants/
│   │   ├── colors.ts      # Design tokens (Colors.primary, Colors.safe, etc.)
│   │   ├── dietary.ts     # ALLERGIES, DIETARY_RESTRICTIONS, DIETARY_PREFERENCES arrays
│   │   └── translations.ts # All UI strings for 5 languages (en, ko, es, fr, ja)
│   ├── context/
│   │   ├── AuthContext.tsx     # Firebase auth + dietaryProfile state
│   │   ├── FoodContext.tsx     # Saved foods + food groups state
│   │   └── LanguageContext.tsx # Current language + t (translation object)
│   ├── navigation/        # Bottom tab + stack navigator
│   ├── screens/
│   │   ├── analysis/      # CameraScreen, ResultScreen
│   │   ├── auth/          # SignInScreen, SignUpScreen
│   │   ├── home/          # HomeScreen (saved food library)
│   │   ├── passport/      # QRPassportScreen
│   │   ├── restaurant/    # RestaurantListScreen, RestaurantDetailScreen
│   │   ├── search/        # SearchScreen (text food search)
│   │   ├── settings/      # ProfileEditScreen
│   │   └── survey/        # SurveyScreen (onboarding)
│   ├── services/
│   │   ├── anthropic.ts   # Claude API calls (analyzeFoodImage, analyzeFoodText)
│   │   ├── firebase.ts    # Firebase app init
│   │   ├── imageSearch.ts # Wikipedia image lookup by food name
│   │   └── storage.ts     # Firestore CRUD (users, savedFoods, foodGroups)
│   ├── types/             # restaurant.ts type definitions
│   └── utils/
│       ├── koreanVeganClassifier.ts      # Rule-based Korean vegan guardrail
│       └── __tests__/                    # All test files (bun test)
└── docs/                  # SPEC files for each feature
```

---

## Key Patterns

### Translations
Always use the `t` object from `useLanguage()` for UI strings. Never hardcode English strings in components.
```tsx
const { t } = useLanguage();
// Good
<Text>{t.allergiesTitle}</Text>
// Bad
<Text>Allergies</Text>
```

When adding a new UI string, add it to **all 5 languages** in `translations.ts` — TypeScript will catch missing keys.

### Dietary constants
When referencing allergy/restriction/preference IDs, always use the `id` field from `ALLERGIES`, `DIETARY_RESTRICTIONS`, `DIETARY_PREFERENCES` in `constants/dietary.ts`. Never hardcode string IDs.

### Korean vegan classifier
`koreanVeganClassifier.ts` runs as a guardrail **after** Claude's response. If it disagrees with Claude (Claude says safe but classifier finds animal ingredients), `veganWarning` is set on the result. Do not bypass this check.

### Variable declaration order
Declare all variables **before** using them. The QR Passport bug (May 2026) happened because `qrLines` referenced `allergyLabels` before it was declared. Always declare computed values first.

---

## Git & Branch Conventions

- Branch naming: `hwangbci-<feature-name>` (use dashes, not slashes)
- One feature per branch — do not bundle multiple features
- Commit message format: `feat|fix|docs|test|chore(scope): description`
- Always run `tsc --noEmit` before committing — 0 TypeScript errors required
- Run `bun test src/utils/__tests__` before committing — all 74 tests must pass

### npm scripts
```bash
bun test src/utils/__tests__   # Run all tests
npx tsc --noEmit               # Type check
expo start                     # Run dev server
```

---

## Environment Variables

Stored in `.env` (not committed). Required keys:
```
EXPO_PUBLIC_FIREBASE_API_KEY
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN
EXPO_PUBLIC_FIREBASE_PROJECT_ID
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
EXPO_PUBLIC_FIREBASE_APP_ID
EXPO_PUBLIC_ANTHROPIC_API_KEY
```

---

## Known Gotchas

- `bun` binary is at `C:\Users\hwang\.bun\bin\bun.exe` on Windows — the npm shim is broken. Use PowerShell with the full path.
- `moduleResolution: bundler` (from expo tsconfig) requires `@types/bun` for test files to type-check cleanly.
- Restaurant data is loaded from a local JSON file, not a live API.
- `Share` from `react-native` is used for both QR Passport sharing and Result sharing — same API, same pattern.

---

## Lesson Log

| Date | Lesson |
|------|--------|
| 2026-05-23 | "Working" ≠ "correct" — 16 hidden TS errors found only after running health check |
| 2026-05-23 | Translation keys must be added to all 5 locales simultaneously — TypeScript enforces this |
| 2026-05-26 | Variable declaration order matters — use before declare causes silent runtime bugs in bundlers |
| 2026-05-27 | AI image analysis cannot detect hidden ingredients (broth, sauces) — always show a disclaimer |
