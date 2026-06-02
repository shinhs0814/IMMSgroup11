# SPEC: 프로필 수정 화면 (Profile Edit Screen)

**파일:** `src/screens/settings/ProfileEditScreen.tsx`  
**컨텍스트:** `src/context/AuthContext.tsx`

---

## 목적

가입 후 식이 프로필(알레르기, 식이 제한, 선호도)을 언제든지 수정할 수 있는 화면. 계정 삭제 기능도 이 화면에서 제공한다.

---

## 화면 구성

### 알레르기 섹션

- 사전 정의 알레르기 항목 칩 목록 (복수 선택)
- 커스텀 알레르기 직접 입력 + 추가 버튼
- 커스텀 항목은 `custom:` prefix로 저장, 탭하면 제거

### 식이 제한 섹션

- 사전 정의 항목 칩 목록 (복수 선택)

### 식이 선호도 섹션

- 사전 정의 항목 칩 목록 (복수 선택)

---

## 저장

- 하단 "저장" 버튼 → `updateDietaryProfile()` 호출
- 성공 시 Alert 표시 후 `onBack()` 호출
- 저장 중 `ActivityIndicator` 표시

---

## 계정 삭제

2단계 확인 Alert:

```
1차 Alert: "정말 계정을 삭제하시겠습니까?"
  → "모두 삭제" 선택
2차 Alert: "이 작업은 되돌릴 수 없습니다"
  → "네, 계정 삭제" 선택
    → deleteAccount() 호출
      → deleteAllUserData() (Firestore 데이터 전체 삭제)
      → Firebase Auth 계정 삭제
```

**에러 처리:**
- `auth/requires-recent-login`: 재로그인 필요 안내 Alert

---

## SurveyScreen과의 차이

| | SurveyScreen | ProfileEditScreen |
|---|---|---|
| **진입 시점** | 최초 가입 후 1회 | 언제든지 |
| **단계 구성** | 3단계 스텝 | 단일 스크롤 화면 |
| **완료 후** | 메인 앱 진입 | 이전 화면으로 복귀 |

---

## Props

```ts
type Props = {
  onBack: () => void;
};
```
