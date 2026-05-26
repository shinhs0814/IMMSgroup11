# SPEC: 식당 상세 화면 (Restaurant Detail Screen)

**파일:** `src/screens/restaurant/RestaurantDetailScreen.tsx`

---

## 목적

선택한 식당의 상세 정보를 표시하고, 구글 지도 연동 및 전화 걸기 기능을 제공하는 화면.

---

## 표시 정보

### 식당 이름 카드

| 항목 | 표시 조건 |
|---|---|
| 식당 이름 | 항상 표시 |
| 카테고리 | `restaurant.category`가 있을 때 |
| 식이 뱃지 | 해당하는 것만 표시 |

### 식이 뱃지

| 뱃지 | 필드 | 배경색 | 텍스트색 |
|---|---|---|---|
| 채식 🥗 | `vegetarian` | `#E8F5E9` | `#4CAF50` |
| 할랄 🌙 | `halal` | `#E3F2FD` | `#2196F3` |
| 글루텐프리 🌾 | `glutenFree` | `#FFF3E0` | `#FF9800` |

### 정보 카드

| 항목 | 표시 조건 |
|---|---|
| 주소 📍 | 항상 표시 (정보 없으면 "정보없음" 텍스트) |
| 시군구 | 값이 있고 `'정보없음'`이 아닐 때 |
| 평일 영업시간 🕐 | 항상 표시 |
| 주말 영업시간 | 항상 표시 |
| 전화번호 📞 | 값이 있고 비어있지 않을 때만 표시 |

---

## 외부 연동

### 구글 지도

주소가 있을 때 "길 찾기" 버튼 표시.

```
https://maps.google.com/?q={encodeURIComponent(restaurant.address)}
```

브라우저 또는 구글맵 앱으로 열림. 실패 시 Alert.

### 전화 걸기

전화번호가 있을 때 전화번호 행을 탭하면 실행.

```
tel:{restaurant.phone}
```

---

## 정보 없음 처리

`isInfoAvailable(val)` 헬퍼: 값이 비어있거나 `'정보없음'`이면 `false` 반환 → "정보없음" 대체 텍스트 표시.

---

## Props

```ts
type Props = {
  restaurant: Restaurant;
  onBack: () => void;
};
```
