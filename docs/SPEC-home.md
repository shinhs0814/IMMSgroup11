# SPEC: 홈 화면 (Home Screen)

**파일:** `src/screens/home/HomeScreen.tsx`  
**컨텍스트:** `src/context/FoodContext.tsx`  
**서비스:** `src/services/storage.ts`

---

## 목적

사용자가 저장한 음식 분석 결과를 라이브러리 형태로 관리하는 메인 화면. 그룹 생성/삭제 및 음식 카드 이동/삭제를 지원한다.

---

## 화면 구성

### 헤더

- 사용자 이름 표시 (`displayName`의 첫 번째 단어)
- 프로필 버튼 (이니셜 아바타) → 설정 사이드바 열기

### 그룹 관리

| 기능 | 동작 |
|---|---|
| **그룹 생성** | "＋ 새 그룹" 버튼 → 모달에서 이름 입력 후 생성 |
| **그룹 삭제** | 그룹 우측 ✕ 버튼 → 확인 Alert 후 삭제 |
| **미분류** | 그룹에 속하지 않은 음식들의 기본 섹션 |

### 음식 카드

| 기능 | 동작 |
|---|---|
| **탭** | 해당 음식의 분석 결과 화면으로 이동 |
| **롱프레스** | 그룹 이동 모달 표시 |
| **삭제 버튼** | ×를 탭하면 확인 Alert 후 삭제 |
| **이미지** | base64 (카메라 촬영) 또는 URL (텍스트 검색) 또는 플레이스홀더 표시 |

### 판정 상태 표시

| 상태 | 이모지 | 색상 |
|---|---|---|
| safe | ✅ | `Colors.safe` |
| caution | ⚠️ | `Colors.caution` |
| unsafe | 🚫 | `Colors.unsafe` |

---

## 데이터 흐름

```
FoodContext (전역 상태)
  ├─ savedFoods: SavedFood[]
  ├─ groups: FoodGroup[]
  ├─ fetchAll() → Firestore에서 음식/그룹 로드
  ├─ addGroup(name) → 그룹 생성
  ├─ removeGroup(id) → 그룹 삭제 (음식은 미분류로 이동)
  ├─ removeFood(id) → 음식 삭제
  └─ moveFood(foodId, groupId) → 음식 그룹 이동
```

---

## 새로고침

`RefreshControl`로 당겨서 새로고침 지원. `fetchAll()`을 재호출.

---

## 빈 상태 처리

저장된 음식이 없을 때 📷 이모지와 안내 메시지 표시.
