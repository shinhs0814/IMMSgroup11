# SPEC: 인증 (Authentication)

**파일:** `src/screens/auth/SignInScreen.tsx`, `src/screens/auth/SignUpScreen.tsx`  
**서비스:** `src/services/firebase.ts`, `src/context/AuthContext.tsx`

---

## 목적

Firebase Authentication 기반 이메일/비밀번호 인증. 로그인 상태에 따라 앱 진입 흐름을 제어한다.

---

## 화면 구성

### SignInScreen (로그인)

| 항목 | 내용 |
|---|---|
| **입력** | 이메일, 비밀번호 |
| **액션** | 로그인 버튼, 회원가입 탭으로 전환 |
| **에러 처리** | Firebase 오류 코드를 사용자 친화적 메시지로 변환 |

### SignUpScreen (회원가입)

| 항목 | 내용 |
|---|---|
| **입력** | 표시 이름(Display Name), 이메일, 비밀번호 |
| **액션** | 회원가입 버튼, 로그인 탭으로 전환 |
| **성공 시** | Firebase 계정 생성 → 자동으로 SurveyScreen으로 이동 |

---

## 인증 흐름

```
앱 시작
  └─ 로딩 중 → SplashScreen
  └─ 비로그인 → SignInScreen / SignUpScreen
  └─ 로그인 + 설문 미완료 → SurveyScreen
  └─ 로그인 + 설문 완료 → HomeScreen (메인 앱)
```

---

## Firebase 설정

- **플랫폼별 persistence 분기**
  - Web: `browserLocalPersistence`
  - Native (iOS/Android): `getReactNativePersistence(AsyncStorage)`
- 환경변수: `EXPO_PUBLIC_FIREBASE_*` (`.env`에 저장, Git에 포함하지 않음)

---

## 계정 삭제

ProfileEditScreen에서 2단계 확인(Alert × 2) 후 `deleteAllUserData()`를 호출:
1. `users/{userId}` 문서 삭제
2. 해당 유저의 모든 `foodGroups` 삭제
3. 해당 유저의 모든 `savedFoods` 삭제
4. Firebase Auth 계정 삭제

재로그인이 필요한 경우(`auth/requires-recent-login`) 별도 안내 메시지 표시.
