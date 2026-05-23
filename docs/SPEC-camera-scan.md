# SPEC: 카메라 스캔 (Camera Scan)

**파일:** `src/screens/analysis/CameraScreen.tsx`  
**서비스:** `src/services/anthropic.ts`, `src/utils/koreanVeganClassifier.ts`

---

## 목적

사용자가 식품 라벨 또는 음식을 카메라/갤러리로 촬영하여 Claude Vision API로 식이 안전성을 분석하는 화면.

---

## 입력 방식

| 방식 | 동작 |
|---|---|
| **카메라 촬영** | `ImagePicker.launchCameraAsync()` — 카메라 권한 요청 후 촬영 |
| **갤러리 선택** | `ImagePicker.launchImageLibraryAsync()` — 미디어 라이브러리 권한 요청 후 선택 |

두 방식 모두 `aspect: [4, 3]`, `quality: 0.9`로 설정.

---

## 이미지 전처리

```
원본 이미지
  → ImageManipulator.manipulateAsync()
    - resize: width 1024px (비율 유지)
    - compress: 0.7 (JPEG)
    - base64 인코딩
  → Claude Vision API 전송
```

---

## 분석 흐름

```
1. 이미지 압축 → statusText: "압축 중..."
2. Claude Vision 호출 → statusText: "AI 분석 중..."
3. 결과 수신
4. [조건부] 한국어 비건 분류기 실행
5. onResult(result, base64) → ResultScreen으로 이동
```

---

## 한국어 비건 분류기 가드레일

다음 조건이 모두 충족될 때만 실행:

1. `result.labelLanguage`에 'korean' 포함
2. 사용자 프로필에 `vegan` 또는 `vegetarian` 선호도 포함
3. `result.originalIngredients` 배열이 비어있지 않음

`disagreesWithLLM()`이 `true`이면 `result.veganWarning`에 경고 데이터를 추가하여 ResultScreen에서 표시.

---

## 로딩 UI

분석 중에는 전체 화면을 덮는 로딩 오버레이 표시:
- `ActivityIndicator`
- 현재 단계 텍스트 (`statusText`)
- 프로필 기반 분석 중임을 알리는 부제목

---

## 에러 처리

- 권한 거부: Alert로 권한 요청 필요 안내
- API 오류: `e.message` 또는 기본 메시지 표시
- 이미지 선택 취소: 아무 동작 없음 (`result.canceled` 확인)
