# SPEC: 식당 목록 화면 (Restaurant List Screen)

**파일:** `src/screens/restaurant/RestaurantListScreen.tsx`  
**데이터:** `src/data/restaurants.json`  
**타입:** `src/types/restaurant.ts`

---

## 목적

한국문화정보원 전국 세계 음식점 데이터를 기반으로, 사용자의 식이 조건(채식/할랄/글루텐프리)에 맞는 식당을 검색하고 필터링하는 화면. SearchScreen의 "식당" 탭으로 임베드된다.

---

## 데이터 소스

| 항목 | 내용 |
|---|---|
| **출처** | 한국문화정보원 전국 세계 음식점 데이터 (2022-11-30) |
| **파일** | `can_I_eat/src/data/restaurants.json` |
| **규모** | 약 9,500개 |
| **원본** | `can_I_eat/src/data/raw_restaurants.csv` |

---

## 필터 기능

| 필터 | 필드 | 색상 |
|---|---|---|
| 채식 (Vegetarian) | `restaurant.vegetarian === true` | 초록 `#4CAF50` |
| 할랄 (Halal) | `restaurant.halal === true` | 파랑 `#2196F3` |
| 글루텐프리 (Gluten-Free) | `restaurant.glutenFree === true` | 주황 `#FF9800` |
| 지역 (Region) | `restaurant.region === selectedRegion` | Primary |

- 모든 필터는 **AND 조건**으로 동시 적용
- 지역 필터는 모달(바텀 시트) 방식으로 선택
- 텍스트 검색은 `name`과 `address` 필드를 대소문자 구분 없이 검색

---

## 성능 최적화

- `useMemo`로 필터 결과 메모이제이션 (필터 조건 변경 시에만 재계산)
- `useCallback`으로 카드 렌더 함수 메모이제이션
- `FlatList` 설정:
  - `initialNumToRender: 20`
  - `maxToRenderPerBatch: 20`
  - `windowSize: 10`

---

## 결과 없음 처리

검색/필터 결과가 없을 때 🍽️ 이모지와 안내 메시지 표시.

---

## Props

```ts
type Props = {
  onSelect: (restaurant: Restaurant) => void;
};
```

선택 시 `onSelect`를 통해 상위 컴포넌트(SearchScreen)가 `RestaurantDetailScreen`으로 이동 처리.
