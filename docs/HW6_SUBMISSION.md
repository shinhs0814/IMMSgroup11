# HW6 — kardens.io 제출용 답변

> 이 파일은 kardens.io 제출 폼에 그대로 복사해 넣을 수 있는 답변 모음입니다.
> 두 부분으로 구성됨: Part 1 (`/office-hours`)과 Part 2 (feature branch).

---

## Part 1 — Review the direction with AI

### Q1. What is the biggest lesson?

비전(MANIFESTO, WHYTREE)과 위험 시나리오(PREMORTEM)는 잘 정리되어 있고
React Native + Claude Vision 기반 앱도 이미 작동하지만,
**"한 학기 안에 4명이 만들 수 있는 가장 작은 1개 버전(wedge)"이 정의되어 있지 않다**는 것.
다국어 × 다국가 × 모든 식이제한 × 모든 환경을 한 LLM 프롬프트에
욱여넣으면 PREMORTEM #1("잘못된 판정으로 신뢰를 잃는다")의 위험이
오히려 더 커진다. LLM 단독으로는 검증/테스트가 불가능하기 때문.

좁히는 것이 곧 신뢰의 시작이다.

### Q2. What are the action items? Which one did you choose?

`/office-hours` 진단(YC 6가지 forcing question 스타일)에서 5개 액션이 도출됨:

- **A. Wedge 정의** — 1언어 × 1식이 × 1환경으로 좁히기
- B. 30분 사용자 관찰 (비건 친구가 파파고 워크플로우 시도하는 것 옆에서 보기)
- C. 3명 named persona 작성
- D. Future-fit 차별화 정의 (ChatGPT 시대에도 살아남는 1가지 이유)
- E. MVP feature spec 작성

**선택: A (Wedge 정의)**

이유: 다른 모든 액션의 prerequisite. wedge가 없으면 persona, MVP spec,
moat 정의 모두 너무 광범위해진다. 또한 HW6 Part 2(새 브랜치 기능
빌드)와 직결되어 Part 1 결과를 Part 2로 자연스럽게 이어갈 수 있음.

### Q3. What is the result of the action item?

`docs/WEDGE.md` 작성. 핵심 결정:

- **선택된 wedge: "한국 편의점 비건 스캐너"**
- **3차원 압축**: 한국어만 / 비건만 / 편의점 가공식품 라벨만
- **명시적 out-of-scope (10개)**: 영어/일본어 라벨, 알레르기/할랄/당뇨,
  식당 메뉴판, 손글씨, 바코드, 사용자 프로필 저장, 커뮤니티 신고 등
- **성공 기준 정량화**: OCR 정확도 ≥ 80%, 비건 판정 정확도 ≥ 95%, 응답 ≤ 5초
- **4명 팀 분담안**: 백엔드(OCR) / 백엔드(성분사전) / 프론트(UI) / 데이터(테스트셋)
- **V2~V4 확장 경로**: 영어 라벨 → 식당 메뉴판 → 사용자 프로필 → 커뮤니티 데이터 → 다국가 통합

상세: `docs/OFFICE_HOURS.md` (진단 전체) + `docs/WEDGE.md` (액션 결과)

---

## Part 2 — Build a feature in a separate branch

### Q1. Your git branch URL

**https://github.com/Marker4com/IMMSgroup11/tree/feature/vegan-classifier-ko**

기능: **한국어 비건 성분 검증기 (LLM 가드레일)**

- `can_I_eat/src/utils/koreanVeganClassifier.ts` — 메인 분류기
- `can_I_eat/src/utils/data/animalIngredientsKo.ts` — 동물성 성분 사전 (RED_LIST + AMBER_LIST)
- `can_I_eat/src/utils/__tests__/koreanVeganClassifier.test.ts` — Bun 단위 테스트 30개 (전부 통과)
- `can_I_eat/src/utils/README.md` — 사용법 + 통합 가이드

기능의 역할: 기존 `services/anthropic.ts`의 Claude Vision LLM이 잘못
판정하는 위험을 잡기 위한 결정론적 보조 분류기. LLM이 "safe"라고
했지만 라벨에 명백한 동물성 성분이 있으면 `disagreesWithLLM()`이
true를 반환하여 사용자에게 경고를 띄울 수 있게 함.

### Q2. What is the biggest challenge in building a feature?

**기존 코드베이스의 실제 상태를 파악하는 것.**

처음에는 docs/MANIFESTO와 PREMORTEM만 보고 "프로젝트가 기획 단계"라고
가정해서 wedge 분석을 진행했다. 하지만 `git fetch upstream` 해보니
팀원들이 이미 React Native + Anthropic SDK + Firebase로 작동하는 앱을
만들어 놓은 상태였다. 만들 기능을 처음부터 다시 정의해야 했다.

또한 Korean 텍스트 매칭에서 substring 매칭이 "꿀" → "꿀맛", "닭" →
"닭갈비향" 같은 false positive를 만든다는 것을 처음에는 인지 못 했다.
한국어는 형태소 경계가 공백 없이 붙어 있어서 영어식 substring 검색이
위험하다는 것을 AI 리뷰가 짚어준 후에야 깨달았다.

### Q3. What is the biggest meta-cognition lesson?

**AI에 처음부터 "이걸 만들어줘"라고 시키지 말고, "이게 문제야 — 어디서부터
시작할까?"라고 물어보는 것.**

처음 충동은 바로 코드를 짜기 시작하는 것이었다. 하지만 `/office-hours`로
한 단계 멈춰서 "정말 이게 만들 가치가 있는가? 가장 작은 1개는 무엇인가?"를
먼저 따지자, MANIFESTO에 적힌 거대한 비전 중 4명이 학기 안에 실제로
만들 수 있는 부분이 명확해졌다. 그 다음에야 "비건 분류기"라는 구체적
feature가 나왔다.

또 하나: **AI에 코드를 짜게 한 후 다른 AI에게 리뷰시키는 것이 단일 AI
세션보다 압도적으로 더 좋은 결과를 낸다.** 첫 구현은 20개 테스트가 통과해서
"끝났다"고 생각했지만, 리뷰 AI는 substring false positive, 잘못된 alias
배치, 빠진 핵심 성분 등 즉시 잡을 만한 버그 4가지를 지적했다. 코드 작성과
검토를 분리하는 것이 신뢰성을 만든다.

### Q4. What is the biggest technical lesson?

**한국어 텍스트 매칭은 영어와 다르다. Substring includes는 위험하다.**

영어로는 "milk"가 "milky way"에 substring으로 걸리는 게 문제지만 단어
경계가 공백으로 분리되어 있어서 토큰화로 쉽게 해결된다. 한국어는 어절
안에 공백 없이 형태소가 붙어서 "꿀맛", "닭갈비향", "쇠고기향분말"
같은 합성어가 흔하다. 이런 케이스에서 substring 매칭은:

- "꿀맛" → "꿀"(honey)에 매칭 → 잘못된 unsafe 판정
- "닭갈비향" → "닭"(chicken alias)에 매칭 → 잘못된 unsafe 판정
- "쇠고기향" → "쇠고기"(beef)에 매칭 → 잘못된 unsafe 판정

해결: 라벨 구분자(쉼표/괄호) 기반 토큰화 + 토큰 안에 candidate 뒤로
flavor suffix(`향`, `맛`, `풍미`, `풍`, `스타일`)가 등장하면 매칭 거부.
이렇게 30개 테스트 (false positive 방어 7개 포함) 모두 통과.

추가로 배운 것:
- LLM에 대한 결정론적 가드레일은 단위 테스트가 가능하다는 것 자체로
  큰 가치가 있다 (LLM 출력은 테스트 어려움).
- "출처가 모호한" 카테고리(AMBER_LIST)를 별도 둠으로써 binary 판정의
  false positive를 완화할 수 있다 — `caution` 상태가 신뢰 디자인의 핵심.

### Q5. What are the responses from your team members?

> ⚠️ **이 부분은 본인이 팀원에게 직접 보여주고 받은 피드백을 기록해야 합니다.**
>
> 추천 진행 방법:
> 1. PR 생성: https://github.com/Marker4com/IMMSgroup11/pull/new/feature/vegan-classifier-ko
>    또는 upstream(`shinhs0814/IMMSgroup11`)에 PR 보내기
> 2. 팀 단톡/Discord에 브랜치 URL 공유 + 짧은 설명:
>    > "기존 LLM 한 번에 다 시키는 방식이 잘못 판정할 위험이 커서,
>    >  한국어 비건 성분 사전 기반 결정론적 분류기를 가드레일로
>    >  추가했어. `disagreesWithLLM()`으로 LLM이 'safe'인데 라벨에
>    >  쇠고기/우유 같은 게 보이면 경고 띄울 수 있게. 사전이랑 매칭
>    >  로직이 어색한 부분 있으면 알려줘."
> 3. 팀원 피드백 항목별로 정리:
>    - [팀원 1 이름]: ___
>    - [팀원 2 이름]: ___
>    - [팀원 3 이름]: ___
> 4. 채택한/거절한 피드백 + 이유 1줄씩

---

## 부록: 진행 과정 타임라인

| 단계 | 산출물 |
|---|---|
| 1. gstack 설치 | `~/.claude/skills/gstack/` (23개 스킬 활성화) |
| 2. `/office-hours` 진단 | `docs/OFFICE_HOURS.md` |
| 3. 액션 A 실행 — Wedge 정의 | `docs/WEDGE.md` |
| 4. 새 브랜치 생성 | `feature/vegan-classifier-ko` |
| 5. 기능 구현 | utils/koreanVeganClassifier.ts + 사전 + 테스트 20개 |
| 6. AI 리뷰 (sub-agent) | substring false positive, 잘못된 alias 등 4건 지적 |
| 7. 리뷰 반영 수정 | 토큰화 + flavor-suffix 거부 + 사전 정리, 테스트 30개 통과 |
| 8. push | https://github.com/Marker4com/IMMSgroup11/tree/feature/vegan-classifier-ko |
