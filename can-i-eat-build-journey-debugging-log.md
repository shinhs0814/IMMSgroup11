---
title: "Can I Eat — Build Journey & Debugging Log"
tags: ["can-i-eat", "debugging", "expo", "firebase", "ngrok", "anthropic-api", "build-log"]
created: 2026-06-08T06:58:31.790Z
updated: 2026-06-08T06:58:31.790Z
sources: ["can_I_eat_conversation.md"]
links: []
category: debugging
confidence: high
schemaVersion: 1
---

# Can I Eat — Build Journey & Debugging Log

# Can I Eat — Build Journey & Debugging Log

## Initial Brief (What Anna Asked For)
- Photo → dietary restriction checker
- Survey onboarding: allergies (nuts etc.) + restrictions (lactose) + preferences (vegan/vegetarian)
- AI reads labels AND recognizes dishes from photos
- Save "safe" foods with a heart button, organized into custom groups
- "Hello [name]" on home screen
- Fixed bottom nav: Home | Camera | Album

## Problems Hit During Build

### 1. Firebase Auth Persistence Warning
**Error:** `@firebase/auth: You are initializing Firebase Auth for React Native without providing AsyncStorage`
**Cause:** Firebase Auth in React Native defaults to in-memory persistence — user gets logged out on app restart
**Fix:** Install `@react-native-async-storage/async-storage`, update `firebase.ts` to use `getReactNativePersistence`

### 2. Deprecated ImagePicker API
**Error:** `[expo-image-picker] MediaTypeOptions have been deprecated`
**Fix:** Replace `ImagePicker.MediaTypeOptions.Images` with `ImagePicker.MediaType.Images` (or array form)

### 3. Network Error on First Launch
**Error:** App couldn't download bundle from Mac to phone
**Cause:** Phone and Mac on different WiFi networks (common with work/guest split)
**Fix options:**
- Same WiFi → just works
- `npx expo start --tunnel` → routes through Expo servers (bypasses network)
- Known Expo bug: `--tunnel` installs ngrok then still errors → workaround: `npm install -g @expo/ngrok@^4.1.0` first, then restart

### 4. Expo Tunnel Bug (ngrok)
**Error:** `CommandError: Install @expo/ngrok@^4.1.0 and try again` (even after installing it)
**Cause:** Known Expo/Mac bug — the global install doesn't register in the same path Expo looks for it
**Fix:** `npm install -g @expo/ngrok@^4.1.0` manually in terminal, then re-run `npx expo start --tunnel`

### 5. Anthropic API "Low Balance" Error
**Cause:** App was calling Claude Vision API but the API key wasn't linked to a funded account
**Key insight:** Claude Code subscription (for building the app) is SEPARATE from Anthropic API credits (for the app's runtime calls)
- Claude Code = monthly subscription billed to Anthropic account
- App API calls = pay-as-you-go, separate credit pool at console.anthropic.com
**Cost estimate:** ~$0.01–0.03 per food scan with claude-opus-4-6
**Fix:** Add $5 credit at console.anthropic.com → Settings → Plans & Billing
**Gotcha:** Balance sometimes takes 10-15 min to reflect after payment

### 6. FoodProvider Scope Issue
**Problem:** ResultScreen (where you save foods) couldn't access FoodContext
**Cause:** FoodProvider was wrapping only some screens, not the full navigator
**Fix:** Moved FoodProvider to wrap the entire AppNavigator

## Key Lessons
- Firebase JS SDK = use web config even for Android/iOS (only need native SDK for react-native-firebase)
- Hot reload in Expo is reliable; rarely need to kill/restart the server
- Shake phone → Reload menu is faster than restarting terminal
- API billing separation (subscription vs. runtime) is a common first-time gotcha for Claude API users
