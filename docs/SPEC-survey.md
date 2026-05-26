# SPEC: 식이 프로필 설문 (Survey)

**파일:** `src/screens/survey/SurveyScreen.tsx`  
**상수:** `src/constants/dietary.ts`  
**컨텍스트:** `src/context/AuthContext.tsx`

---

## 목적

신규 가입자가 자신의 식이 프로필(알레르기, 식이 제한, 선호도)을 최초 1회 설정하는 온보딩 화면. 설문 완료 전까지 메인 앱에 진입할 수 없다.

---

## 단계 구성 (3단계)

### Step 1 — 알레르기 (Allergies)

- 사전 정의된 알레르기 항목 중 복수 선택 가능
- 직접 입력 추가 가능 (`custom:` prefix로 저장)
- 커스텀 알레르기는 칩을 탭하면 제거

| 사전 정의 항목 예시 |
|---|
| 글루텐, 유제품, 달걀, 견과류, 갑각류, 대두, 생선, 참깨 등 |

### Step 2 — 식이 제한 (Dietary Restrictions)

- 종교/윤리적 이유로 인한 식이 제한 복수 선택
- 예: 할랄, 코셔, 힌두 채식 등

### Step 3 — 식이 선호도 (Dietary Preferences)

- 단일 선택 (exclusive)
- 예: 비건, 채식주의자, 플렉시테리안, 제한 없음 등
- 각 항목에 설명 텍스트 포함

---

## 진행 인디케이터

- 상단에 3개 단계 도트 표시
- 완료된 단계는 `✓` 표시
- 현재 단계는 Primary 색상으로 강조

---

## 데이터 저장

설문 완료 시 `updateDietaryProfile()` 호출 → Firestore `users/{userId}.dietaryProfile`에 저장

```ts
type DietaryProfile = {
  name: string;
  allergies: string[];      // ['gluten', 'dairy', 'custom:새우']
  restrictions: string[];   // ['halal']
  preferences: string[];    // ['vegan']
};
```

---

## 다국어 지원

각 항목의 레이블은 `t.allergy_{id}`, `t.restriction_{id}`, `t.pref_{id}` 키로 번역. 키가 없으면 상수의 기본 `label`값 사용.
