---
title: "Can I Eat — App Overview & Architecture"
tags: ["can-i-eat", "expo", "react-native", "firebase", "claude-vision", "architecture", "food-safety"]
created: 2026-06-08T06:58:09.132Z
updated: 2026-06-08T06:58:09.132Z
sources: ["can_I_eat_conversation.md"]
links: []
category: architecture
confidence: high
schemaVersion: 1
---

# Can I Eat — App Overview & Architecture

# Can I Eat — App Overview & Architecture

## What It Is
A mobile app where users photograph food packaging labels or dishes to check against their personal dietary restrictions. Built with Expo + React Native.

## Core User Flow
1. **Splash** → animated logo
2. **Sign Up / Sign In** → tabbed auth screen
3. **Survey** → 3-step onboarding: Allergies (10 options) → Restrictions (lactose, gluten, etc.) → Dietary preference (vegan/vegetarian/etc.)
4. **Home** → "Hello, [Name]! 👋" + customizable food groups + uncategorized bucket
5. **Camera / Album** → pick or take photo → Claude Vision analyzes against user profile
6. **Result** → safe ✅ / caution ⚠️ / unsafe 🚫 verdict + per-ingredient breakdown + heart to save
7. **Bottom tabs** (fixed): 🏠 Home | 📷 Camera (center button) | 🖼️ Album

## Tech Stack
- **Expo** + React Navigation — cross-platform (iOS, Android, Web from one codebase)
- **Firebase** — Email/Password auth + Firestore for user profiles and saved foods
- **Anthropic Claude Vision API** — food recognition and label reading (chosen over food databases for label parsing capability)
- **Expo Camera + ImagePicker** — native camera and photo library access

## Project Structure
```
src/
├── constants/     colors.ts, dietary.ts (allergies/restrictions/preferences data)
├── context/       AuthContext.tsx, FoodContext.tsx
├── navigation/    AppNavigator.tsx (handles all screen routing)
├── screens/
│   ├── SplashScreen.tsx
│   ├── auth/      SignInScreen.tsx, SignUpScreen.tsx
│   ├── survey/    SurveyScreen.tsx (3-step onboarding)
│   ├── home/      HomeScreen.tsx
│   └── analysis/  CameraScreen.tsx, ResultScreen.tsx
└── services/      firebase.ts, anthropic.ts, storage.ts
```

## Key Design Decisions
- **Firebase JS SDK (not react-native-firebase)** → web config works for iOS, Android, and web
- **Claude Vision over food databases** → label reading requires understanding ingredient lists in natural language, not just barcode lookup
- **FoodProvider wraps entire navigator** (not just specific screens) → ResultScreen needs access to food context for the save/heart feature
- **AsyncStorage for auth persistence** → without it, Firebase Auth in React Native defaults to memory-only (loses login on app restart)
