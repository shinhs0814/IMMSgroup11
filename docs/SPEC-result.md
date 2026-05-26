# SPEC: 분석 결과 화면 (Result Screen)

**파일:** `src/screens/analysis/ResultScreen.tsx`  
**컨텍스트:** `src/context/FoodContext.tsx`

---

## 목적

카메라 스캔 또는 텍스트 검색 후 Claude AI가 반환한 식이 안전성 분석 결과를 표시하고, 결과를 라이브러리에 저장하는 화면.

---

## Props

```ts
type Props = {
  result: AnalysisResult;
  imageBase64?: string;   // 카메라 촬영 이미지
  imageUrl?: string;      // 텍스트 검색 결과 이미지 (Wikipedia 등)
  savedFood?: SavedFood;  // 저장된 음식 재열람 시
  onBack: () => void;
  onSaved?: () => void;
};
```

---

## 화면 구성

### 이미지 영역

우선순위: `imageBase64` > `imageUrl` > 플레이스홀더(🍽️)

### 판정 배지

| 상태 | 배경색 | 텍스트색 | 이모지 |
|---|---|---|---|
| safe | `#EFF8F0` | `Colors.safe` | ✅ |
| caution | `#FFF8EC` | `Colors.caution` | ⚠️ |
| unsafe | `#FEECEC` | `Colors.unsafe` | 🚫 |

### 표시 정보 (순서대로)

1. 음식 이름 (`foodName`)
2. 원본 이름 + 라벨 언어 (`originalName · labelLanguage`)
3. 판정 배지
4. 요약 (`summary`)
5. **[조건부] 한국어 비건 분류기 경고 배너** (`veganWarning`)
6. 분석 유형 배지 (`label` / `food_image`)
7. 성분 플래그 목록 (`flags`)
8. 성분 목록 (`ingredients`)
9. 칼로리 (`calories`)
10. 영양 하이라이트 (`nutritionHighlights`)

### 비건 경고 배너

`result.veganWarning`이 있을 때만 표시. 노란 배경 + 주황 좌측 보더.
- 🔴 RED_LIST 검출 성분 (동물성)
- 🟡 AMBER_LIST 검출 성분 (출처 불명)

---

## 저장 기능

- 하단 "저장" 버튼 탭 → 그룹 선택 모달 표시
- 그룹 선택 후 `addFood()` 호출 → Firestore 저장
- 저장 완료 후 버튼이 ❤️로 변경되고 비활성화됨
- 이미 저장된 음식(`savedFood` prop 있음) 재열람 시 저장 버튼 숨김
