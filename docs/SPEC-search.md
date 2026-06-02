# SPEC: 검색 화면 (Search Screen)

**파일:** `src/screens/search/SearchScreen.tsx`  
**서비스:** `src/services/anthropic.ts`, `src/services/imageSearch.ts`

---

## 목적

음식 이름을 텍스트로 입력하거나 식당을 검색할 수 있는 통합 검색 화면. 탭으로 두 가지 모드를 전환한다.

---

## 탭 구성

### 탭 1 — 음식 검색 (Food)

| 항목 | 내용 |
|---|---|
| **입력** | 텍스트 (다국어 지원 — 한국어, 영어, 일본어, 프랑스어 등) |
| **출력** | `AnalysisResult` + 음식 이미지 URL |
| **이동** | ResultScreen |

**검색 처리 흐름:**
```
사용자 입력 (예: "김치", "Pad Thai", "Poulet rôti")
  → analyzeFoodText() + fetchFoodImageUrl() 병렬 실행
  → 이미지가 없고 englishName이 다를 경우, englishName으로 재시도
  → onResult(result, imageUrl) → ResultScreen
```

### 탭 2 — 식당 검색 (Restaurants)

`RestaurantListScreen` 컴포넌트 임베드. 식당 선택 시 `onRestaurantSelect()` 콜백 → `RestaurantDetailScreen`으로 이동.

---

## 이미지 검색

`fetchFoodImageUrl(query)` — Wikipedia API를 통해 음식 이미지 URL 조회.
- 첫 시도: 사용자 입력 쿼리로 검색
- 실패 시: `result.englishName`으로 재시도 (비영어 입력의 경우)

---

## UX 세부사항

- `autoFocus`: 음식 탭 활성화 시 키보드 자동 표시
- 검색 버튼: 쿼리가 비어있거나 로딩 중일 때 비활성화
- `KeyboardAvoidingView`: iOS에서 키보드가 입력창을 가리지 않도록 처리
- 팁 섹션: 다국어 입력 가능하다는 안내 표시

---

## Props

```ts
type Props = {
  onResult: (result: AnalysisResult, imageUrl: string | null) => void;
  onCancel: () => void;
  onRestaurantSelect: (restaurant: Restaurant) => void;
};
```
