---
title: "Can I Eat — Setup Guide (Env & Firebase)"
tags: ["can-i-eat", "setup", "firebase", "anthropic-api", "environment", "expo"]
created: 2026-06-08T06:58:45.310Z
updated: 2026-06-08T06:58:45.310Z
sources: ["can_I_eat_conversation.md"]
links: []
category: environment
confidence: high
schemaVersion: 1
---

# Can I Eat — Setup Guide (Env & Firebase)

# Can I Eat — Setup Guide

## Prerequisites
- Node.js + npm installed
- Expo Go app on your phone

## Step 1: Anthropic API Key
1. Go to console.anthropic.com → sign in
2. Click **API Keys** in left sidebar → **Create Key**
3. Name it `can-i-eat-app`, copy the key (starts with `sk-ant-...`)
4. Note: Claude Code subscription ≠ API credits. You need separate credits at console.anthropic.com → Settings → Plans & Billing

## Step 2: Firebase Setup
1. console.firebase.google.com → Add project → name it `can-i-eat`
2. **Auth:** Build → Authentication → Get started → Email/Password → Enable
3. **Database:** Build → Firestore Database → Create database → Start in test mode
4. **Config keys:** Gear icon → Project settings → Your apps → `</>` (web icon)
   - Use web config even for Android/iOS (Firebase JS SDK doesn't need native config)
   - Copy: apiKey, authDomain, projectId, storageBucket, messagingSenderId, appId

## Step 3: .env File
```
EXPO_PUBLIC_ANTHROPIC_API_KEY=sk-ant-...
EXPO_PUBLIC_FIREBASE_API_KEY=AIza...
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
EXPO_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123
```
- Copy `.env.example` → rename to `.env` (press Cmd+Shift+. in Finder to show hidden files)

## Step 4: Run
```bash
cd /Users/annashin/Documents/can_I_eat/CanIEat
npx expo start
```
Scan QR with Expo Go. If network error → `npx expo start --tunnel`
