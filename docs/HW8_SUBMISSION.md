# HW8 — kardens.io 제출 답변

> Part 1 (user interview)은 본인이 직접 사람 만나야 하는 부분이라 보류.
> 이 파일에는 Part 2와 Part 3의 답변만 정리되어 있습니다.

---

## Part 1 — User interview

⏭️ **보류 (본인이 사용자 1명 인터뷰 후 직접 작성)**

추천 진행:
- 비건/알레르기 있는 친구·룸메이트·가족 누구든 5~10분 잠깐 잡고
- 현재 앱 (`feature/hw8-multilingual-vegan-loop` 브랜치 빌드 또는 데모) 보여주거나
- 더 가볍게: "외국에서 음식 살 때 어떻게 성분 확인해?" 만 물어보고 답을 메모
- 답변 3개 인사이트 → 1개 fix 선택 → 코드 푸시 → 커밋 URL 받기

---

## Part 2 — /health + 테스트 인프라

### Q2a. What is the major lesson after setting up and running the comprehensive tests?

```
/health 대시보드는 "도구가 통과하는가"만 측정하지, "도구가 무엇을 보는가"
는 측정하지 않는다.

처음 /health를 돌렸을 때 composite score 8.68/10이 나왔다. 숫자만 보면
건강한 프로젝트로 보였다. 하지만 진짜 상태는:

  - 소스 파일: 29개
  - 테스트 파일: 1개 (한국어 비건 분류기에 대한 30개 테스트)
  - 즉 파일 단위 커버리지 3.4%

8.68점이 의미하는 건 "내가 가진 한 개의 망원경이 깨끗하다"는 것이고,
"내가 어디를 보고 있다"는 뜻이 아니었다. Firebase 서비스, RN 화면들,
LLM 응답 파싱, i18n 번들, 식당 데이터 — 전부 망원경의 사각지대였다.

이 깨달음에서 시작해서 인프라 구축:
  - tsconfig types 수정 (bun:test 타입 추가) → typecheck 1 error → 0
  - package.json scripts: test / test:watch / typecheck / health
  - HEALTH.md — health stack 명시 (다음 /health가 detection 단계 스킵)
  - .github/workflows/health.yml — push/PR마다 typecheck + test 자동
  - 4개 신규 테스트 파일 (총 46개 신규 테스트):
    * utils/animalIngredientsKo.test.ts (12) — 사전 무결성
    * constants/dietary.test.ts (16) — 식이 상수 id/label
    * constants/translations.test.ts (8) — 5개 언어 i18n 일관성
    * data/restaurants.test.ts (10) — restaurants.json 스키마

결과: 테스트 30 → 76 (+153%), expect() 47 → 585 (+1144%),
       파일 커버리지 3.4% → 17.2%, typecheck 1 error → 0, composite 8.68 → 10.0

하지만 두 번째 교훈도 있다: composite가 10이 됐어도 여전히 17% 커버리지다.
대시보드 만점은 "지금 가진 테스트가 다 통과한다"는 뜻이지,
"테스트 커버리지가 충분하다"는 뜻이 아니다.

따라서 "comprehensive tests"의 진짜 의미는 두 가지를 함께 봐야 한다:
  1) 대시보드 점수 (도구가 통과하는가)
  2) 커버리지 매트릭스 (도구가 무엇을 보는가)

이 두 가지를 짝으로 들고 있어야 health가 보인다. 둘 중 하나만으로는
어느 쪽이든 잘못된 안심을 준다.

상세 리포트: docs/HEALTH_REPORT.md
브랜치: https://github.com/Marker4com/IMMSgroup11/tree/feature/hw8-test-infrastructure
```

---

## Part 3 — oh-my-claudecode loop (3+ iterations)

### 진행 요약

- **설치:** `npm i -g oh-my-claude-sisyphus@latest && omc setup`
- **사용한 패턴:** `ralph` (PRD-driven persistence loop with verify/fix)
- **빌드한 feature:** 다국어 비건 성분 분류기
  (영어 분류기 + 자동 언어 감지 + 통합 dispatcher — `WEDGE.md`의 V2 확장)
- **PRD:** `.omc/prd.json` — 3개 user story, 각 story마다 acceptance criteria
- **Progress 로그:** `.omc/progress.md` — 각 iteration의 plan, 결과, 학습
- **브랜치:** https://github.com/Marker4com/IMMSgroup11/tree/feature/hw8-multilingual-vegan-loop

### 3개 iteration

| Iter | Story | 결과 |
|---|---|---|
| 1 | 영어 비건 분류기 (단어 경계 매칭, RED 38 + AMBER 10) | 14 tests pass |
| 2 | 복수형/대소문자/하이픈 + flavor-marker AMBER 승격 | 4 fail → 수정 → 22 pass |
| 3 | 다국어 dispatcher (detectLanguage + classifyVegan) | 15 pass, 전체 115 pass |

전체 테스트 증가: 76 → 90 → 98 → 115 (HW8 시작 시 30개 대비 +283%)

### Q3a. What surprised you most about multi-iteration AI-assisted development?

```
"2번째 iteration에서 의도적으로 실패하는 테스트를 먼저 쓰니까,
1번째 iteration이 자신만만하게 '완성'이라고 선언한 코드의 디자인 결함이
드러난다." — 이게 가장 놀라웠다.

구체적으로: iteration 1에서 영어 분류기를 만들었고 14개 테스트가 전부
통과했다. 그 시점에 "끝났다"고 felt. flavor marker(-flavored, -style)
처리도 들어가 있었고, 'milky way bar' 같은 false positive도 막혀
있었다. 14 pass / 0 fail.

iteration 2에서 "이런 케이스도 잡혀야 하지 않을까?" 하고 추가 테스트
8개를 적으면서 'beef-flavored chips, salt' 입력에 대해 'caution'을
기대값으로 박았다. 돌렸더니 'safe'가 나왔다. 4 fail.

여기서 깨달음: iteration 1의 디자인이 '동물성 단어가 flavor marker로
싸여 있으면 매칭 무효'였는데, 이건 사실 잘못된 UX였다.
"beef-flavored"는 실제 비프 추출물일 가능성이 0이 아니다 — 그러니
safe가 아니라 caution이 맞다. 1번 iteration만 돌렸으면 이 결함은
그대로 production에 갔고, 비건 사용자에게 잘못된 안심을 줬을 것이다.

수정: flavor marker는 RED 매치를 무효화하지 말고 AMBER로 승격.
3줄짜리 디자인 변경이지만, 강제 iteration 없이는 이 결정을 내릴 기회
자체가 없었다.

추가로 놀라운 두 가지:

1. PRD를 미리 적는 게 효과가 컸다. ralph 패턴이 'acceptance criteria를
   먼저 적고 → 구현 → 검증'을 강제하니까, 'AC가 만족되면 끝'이라는
   객관적 멈춤 신호가 생긴다. AC 없이 그냥 짜면 LLM이 끝없이 polish
   할 수 있다.

2. iteration 2의 4개 실패가 부끄러운 게 아니라 그게 가치였다. AI 단독
   세션은 종종 "통과하는 테스트를 짜는" 경로로 빠진다 (자기가 만든
   코드에 자기가 통과하는 테스트). iteration 사이에 '의도적으로 안 풀리는
   다음 케이스'를 명시적으로 끼워넣는 게 이 함정을 깬다.

요약하면: AI는 한 번에는 합리적이지만 종종 design-incomplete한 답을
내놓는다. 명시적 multi-iteration이 그 incomplete-ness를 노출시키고
강제로 reflect 시킨다. AI 협업에서 가장 신뢰할 수 있는 결과물은
"한 큰 프롬프트"가 아니라 "여러 작은 iter + 그 사이의 강제 검증"
사이클에서 나온다.
```

### 사용한 oh-my-claudecode 기능

- `omc setup` — 19개 agent + 36개 skill 설치
- `ralph` 스킬 패턴 — `.omc/prd.json` + `.omc/progress.md`로 state 보존
- 3 iteration 사이클: pick story → implement → verify AC → mark passes:true → next

---

## 제출용 링크 모음

| 파트 | URL |
|---|---|
| Part 2 브랜치 | https://github.com/Marker4com/IMMSgroup11/tree/feature/hw8-test-infrastructure |
| Part 3 브랜치 | https://github.com/Marker4com/IMMSgroup11/tree/feature/hw8-multilingual-vegan-loop |
| Part 2 핵심 commit | `153ffc2` (chore(health): /health 진단 + 테스트 인프라 구축) |
| Part 3 핵심 commit | `dc48f29` (feat: 다국어 비건 분류기 — ralph 3-iter 루프) |

---

## 본인이 마저 해야 할 것

1. **Part 1 인터뷰** — 사용자 1명 5분만 잡고:
   - "외국에서 음식 살 때 성분 어떻게 확인해?" 같은 자유로운 질문
   - 인사이트 3개 정리 + fix 1개 결정 → 본인이 commit 1개 push → 그 commit URL 제출
2. **Part 2, Part 3 답변** — 위 텍스트 그대로 kardens.io에 복붙
3. **(선택) Part 2/3을 upstream에 PR로 보낼지 결정**
   - Part 2 PR: https://github.com/Marker4com/IMMSgroup11/pull/new/feature/hw8-test-infrastructure
   - Part 3 PR: https://github.com/Marker4com/IMMSgroup11/pull/new/feature/hw8-multilingual-vegan-loop
