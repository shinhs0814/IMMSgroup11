# SPEC: 데이터 저장 (Data Storage)

**파일:** `src/services/storage.ts`, `src/services/firebase.ts`  
**DB:** Firebase Firestore

---

## 목적

사용자 식이 프로필, 저장된 음식 분석 결과, 음식 그룹을 Firestore에 영구 저장하고 조회한다.

---

## Firestore 컬렉션 구조

```
users/{userId}
  └─ dietaryProfile: DietaryProfile

foodGroups/{groupId}
  ├─ userId: string
  ├─ name: string
  └─ createdAt: Timestamp

savedFoods/{foodId}
  ├─ userId: string
  ├─ groupId: string | null
  ├─ foodName: string
  ├─ imageBase64: string | null
  ├─ imageUrl: string | null
  ├─ analysisResult: AnalysisResult
  └─ savedAt: Timestamp
```

---

## 타입 정의

```ts
type FoodGroup = {
  id: string;
  name: string;
  userId: string;
  createdAt: Timestamp;
};

type SavedFood = {
  id: string;
  userId: string;
  groupId: string | null;  // null = 미분류
  foodName: string;
  imageBase64?: string;    // 카메라 촬영 결과
  imageUrl?: string;       // 텍스트 검색 결과 이미지
  analysisResult: AnalysisResult;
  savedAt: Timestamp;
};
```

---

## 함수 목록

### 사용자 프로필

| 함수 | 설명 |
|---|---|
| `saveUserProfile(userId, profile)` | 프로필 저장/업데이트 (merge) |
| `getUserProfile(userId)` | 프로필 조회 |

### 음식 그룹

| 함수 | 설명 |
|---|---|
| `createFoodGroup(userId, name)` | 그룹 생성, ID 반환 |
| `getFoodGroups(userId)` | 유저의 모든 그룹 조회 (생성일 오름차순) |
| `deleteFoodGroup(groupId)` | 그룹 삭제 |
| `renameFoodGroup(groupId, name)` | 그룹 이름 변경 |

### 저장된 음식

| 함수 | 설명 |
|---|---|
| `saveFood(userId, groupId, ...)` | 음식 저장, ID 반환 |
| `getSavedFoods(userId)` | 유저의 모든 저장 음식 조회 (최신순) |
| `deleteSavedFood(foodId)` | 음식 삭제 |
| `moveFoodToGroup(foodId, groupId)` | 음식 그룹 이동 (`null`이면 미분류) |

### 계정 전체 삭제

`deleteAllUserData(userId)` — 다음을 순서대로 삭제:
1. `users/{userId}` 문서
2. 해당 유저의 모든 `foodGroups`
3. 해당 유저의 모든 `savedFoods`

---

## 정렬 방식

Firestore 복합 인덱스 없이 클라이언트 사이드 정렬:
- **그룹**: `createdAt` 오름차순 (생성 순서 유지)
- **음식**: `savedAt` 내림차순 (최신 항목 상단 표시)
