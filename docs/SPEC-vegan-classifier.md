# SPEC: 한국어 비건 분류기 (Korean Vegan Classifier)

**파일:** `src/utils/koreanVeganClassifier.ts`, `src/utils/data/animalIngredientsKo.ts`  
**테스트:** `src/utils/__tests__/koreanVeganClassifier.test.ts` (30개, 전부 통과)

---

## 목적

Claude Vision LLM의 비건 판정이 잘못될 위험을 보완하는 결정론적 보조 분류기. LLM이 "safe"로 판정하더라도, 한국어 라벨에 동물성 성분이 명시된 경우 이를 잡아내어 경고한다.

- LLM은 할루시네이션이 발생할 수 있지만, 규칙 기반 분류기는 단위 테스트로 검증 가능
- `docs/WEDGE.md`에서 정의한 wedge("한국 편의점 비건 스캐너")와 직접 연결

---

## 타입 정의

```ts
type VeganVerdict = 'safe' | 'caution' | 'unsafe';

type DetectedIngredient = {
  matchedText: string;  // 라벨에서 매칭된 텍스트
  canonical: string;    // 사전의 대표 성분명
  english: string;      // UI 표시용 영어 이름
};

type ClassifierResult = {
  verdict: VeganVerdict;
  detectedAnimal: DetectedIngredient[];    // RED_LIST 매칭
  detectedAmbiguous: DetectedIngredient[]; // AMBER_LIST 매칭
  reason: string;                           // 한국어 사유
};
```

---

## 성분 사전

### RED_LIST (동물성 성분 — `unsafe` 판정)

명확히 동물에서 유래한 성분. 예: 우유, 계란, 쇠고기, 돼지고기, 닭고기, 젤라틴, 꿀, 버터, 치즈, 생선, 새우 등

### AMBER_LIST (출처 모호 — `caution` 판정)

동물성일 수도, 식물성일 수도 있는 성분. 예: 비타민D, 카르민, L-시스테인, 라놀린, 글리세린 등

---

## 판정 로직

```
입력 텍스트 → normalize() → tokenize()
  ↓
RED_LIST 매칭 → 1개 이상: verdict = 'unsafe'
AMBER_LIST 매칭 → 1개 이상: verdict = 'caution'
둘 다 없음: verdict = 'safe'
입력 비어있음: verdict = 'caution'
```

---

## 핵심 기술: 한국어 토큰화 + 향료 suffix 거부

한국어는 공백 없이 형태소가 결합되어 단순 substring 검색 시 false positive 발생.

**토큰화:** 쉼표, 세미콜론, 괄호, 슬래시 기준으로 성분 분리

**향료 suffix 거부:** 토큰 내 후보 성분 뒤에 `향`, `맛`, `풍미`, `스타일`, `풍`이 오면 매칭 거부

```
"닭갈비향" → "닭" 매칭 시도 → 뒤에 "향" 있음 → 거부 ✓
"닭고기"   → "닭고기" 매칭 → 뒤에 향료 suffix 없음 → unsafe ✓
"꿀맛"     → "꿀" 매칭 시도 → 뒤에 "맛" 있음 → 거부 ✓
```

---

## LLM 교차 검증

```ts
disagreesWithLLM(llmVerdict, classifierResult): boolean
```

| LLM 판정 | 분류기 판정 | 반환값 | 설명 |
|---|---|---|---|
| `safe` | `unsafe` | `true` | 위험 — 경고 표시 |
| `safe` | `caution` | `true` | 주의 — 경고 표시 |
| 그 외 | 모두 | `false` | 경고 없음 |

LLM이 `unsafe`인데 분류기가 `safe`인 경우는 플래그하지 않음 — LLM이 사전에 없는 성분을 더 넓게 알기 때문.

---

## 범위 (V1)

| 포함 | 제외 |
|---|---|
| 한국어 텍스트 | 영어/일본어 라벨 |
| 비건 판정 | 알레르기/할랄/당뇨 |
| 성분 텍스트 입력 | OCR (텍스트 추출은 외부 처리) |
