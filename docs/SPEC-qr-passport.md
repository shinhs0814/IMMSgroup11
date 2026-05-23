# SPEC: QR 여권 화면 (QR Passport Screen)

**파일:** `src/screens/passport/QRPassportScreen.tsx`  
**라이브러리:** `react-native-qrcode-svg`

---

## 목적

사용자의 식이 프로필(알레르기, 식이 제한, 선호도)을 QR코드로 생성하여, 식당 직원이나 타인에게 빠르게 공유할 수 있도록 하는 화면. 언어 장벽 없이 식이 정보를 전달하는 핵심 기능.

---

## 진입 조건

`dietaryProfile`이 `null`이면 렌더링하지 않고 `null` 반환. 설문 완료 후에만 접근 가능.

---

## QR 코드

### 페이로드 구조 (JSON)

```json
{
  "name": "사용자 표시 이름",
  "allergies": ["gluten", "dairy"],
  "restrictions": ["halal"],
  "preferences": ["vegan"]
}
```

### 렌더링

- 라이브러리: `react-native-qrcode-svg`
- 크기: 180×180px
- 배경: 흰색 (`#FFFFFF`)
- 전경: `Colors.text`

---

## 식이 정보 표시

| 카테고리 | 색상 | 의미 |
|---|---|---|
| 알레르기 🚨 | 빨강 (`#FEE2E2` / `#DC2626`) | 건강 위험, 절대 제공 금지 |
| 식이 제한 ⚠️ | 노랑 (`#FEF3C7` / `#D97706`) | 종교/윤리적 제한 |
| 선호도 🌿 | 초록 (`#D1FAE5` / `#059669`) | 선호하지만 필수는 아님 |

아무 정보도 없을 때: "✅ No dietary restrictions" 표시.

---

## 공유 기능

"Share My Profile" 버튼 → OS 기본 공유 시트 실행.

공유 텍스트 형식:
```
🍽️ {이름}'s Dietary Profile

🚨 Allergies:
  • 🥜 Peanuts
  • 🥛 Dairy

⚠️ Dietary Restrictions:
  • 🌙 Halal

🌿 Dietary Preferences:
  • 🌱 Vegan

Shared via Can I Eat? 🍱
```

---

## Props

```ts
type Props = {
  onBack: () => void;
};
```

---

## 네비게이션 진입점

설정 사이드바(SettingsSidebar)의 "QR Passport" 메뉴 탭 → AppNavigator에서 `screen === 'qr_passport'`로 라우팅.
