# SPEC: AI 분석 서비스 (Anthropic Service)

**파일:** `src/services/anthropic.ts`  
**모델:** `claude-sonnet-4-6`

---

## 목적

Claude API를 사용하여 식품 이미지 또는 음식 이름을 분석하고, 사용자의 식이 프로필과 대조하여 안전성 판정을 반환한다.

---

## 타입 정의

```ts
type AnalysisResult = {
  foodName: string;
  englishName?: string;          // 이미지 검색용 (항상 영어)
  originalName?: string;         // 라벨의 원본 언어 표기
  originalIngredients?: string[]; // 원본 언어 성분 (비건 분류기용)
  labelLanguage?: string;        // 라벨 언어 (예: "Korean")
  type: 'food_image' | 'label';
  overallStatus: 'safe' | 'caution' | 'unsafe';
  summary: string;
  ingredients?: string[];
  flags: FoodFlag[];
  calories?: string;
  nutritionHighlights?: string[];
  veganWarning?: {               // 한국어 비건 분류기 경고
    detectedAnimal: DetectedIngredient[];
    detectedAmbiguous: DetectedIngredient[];
    reason: string;
  };
};

type FoodFlag = {
  ingredient: string;
  reason: string;
  severity: 'safe' | 'caution' | 'unsafe';
};
```

---

## 함수

### `analyzeFoodImage(base64, mimeType, dietaryProfile, uiLanguage)`

이미지 기반 분석 (카메라 스캔).

- **입력**: base64 이미지, MIME 타입, 사용자 프로필, UI 언어
- **출력**: `AnalysisResult`
- **동작**: Claude Vision API에 이미지 + 텍스트 프롬프트 전송

### `analyzeFoodText(foodQuery, dietaryProfile, uiLanguage)`

텍스트 기반 분석 (음식명 검색).

- **입력**: 음식 이름 (다국어), 사용자 프로필, UI 언어
- **출력**: `AnalysisResult`
- **동작**: Claude API에 텍스트 프롬프트만 전송

---

## 프롬프트 설계 원칙

1. **다국어 라벨 지원**: 어떤 언어의 라벨이든 읽고 분석
2. **UI 언어 분리**: 응답은 항상 `uiLanguage`로 작성, `originalName`/`originalIngredients`만 원본 언어 유지
3. **JSON 전용 응답**: 마크다운 코드블록 없이 순수 JSON만 반환
4. **판정 기준**:
   - `safe`: 사용자 프로필 기준 문제 없음
   - `caution`: 불확실한 성분 또는 가능성 있는 위험
   - `unsafe`: 확인된 알레르기 유발 물질 또는 식이 제한 위반

---

## 에러 처리

JSON 파싱 실패 시 raw 텍스트 앞 300자를 `summary`로 하여 `caution` 판정 반환. 앱이 크래시하지 않고 사용자에게 일부 정보라도 제공.

---

## 환경변수

```
EXPO_PUBLIC_ANTHROPIC_API_KEY
```

`dangerouslyAllowBrowser: true` — Expo/React Native 환경에서 클라이언트 사이드 API 호출 허용.
