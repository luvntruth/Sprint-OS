# Claude 코드 리뷰 맥락 — AX x HR Sprint OS / Humanistic Practice Lab

## 1. 프로젝트 개요

이 프로젝트의 이름은 **AX x HR Sprint OS**입니다.

이 앱은 HR AX 컨설팅 회사 **Humanistic**의 창업자가 이끄는 **AX x HR 실천 모임** 1기를 운영하기 위해 만든 Vite + React + TypeScript 웹 앱입니다.

이 앱은 일반적인 프로젝트 관리 도구가 아닙니다. HR 실무자들이 각자의 실제 업무 문제를 가져오고, AI를 활용해 그 문제를 작은 프로젝트로 전환하고, 현장에서 결과물을 테스트하고, 그 결과를 회고하는 프로젝트 기반 실천 커뮤니티의 운영체제가 되는 것을 목표로 합니다.

이 프로젝트의 더 깊은 사업적/철학적 우산은 다음과 같습니다.

```text
Humanistic Practice Lab
```

핵심 철학은 다음과 같습니다.

```text
조직은 우리답게,
개인은 자기답게 일해야 한다.
```

대략적인 영어 의미는 다음과 같습니다.

```text
Organizations should work in their own way,
and individuals should work as themselves.
```

이 앱은 다음과 같은 구조화된 운영 루프를 돕기 위해 존재합니다.

```text
문제 듣기
→ 문제 구조화
→ 프로젝트화
→ 작은 실행
→ 현장 테스트
→ 회고
→ 방법론 축적
```

첫 번째 코호트는 의도적으로 작게 운영됩니다.

```text
P-0: 창업자 / 퍼실리테이터 / HR AX 컨설턴트 훈련자
P-1: 참가자 1
P-2: 참가자 2
P-3: 참가자 3
```

첫 번째 코호트의 목적 우선순위는 다음과 같습니다.

```text
1. 창업자를 HR AX 컨설턴트로 훈련한다.
2. 참가자 3명이 각자의 실제 업무 문제를 AI와 함께 작고 실용적인 방식으로 해결하도록 돕는다.
3. Humanistic의 HR AX 컨설팅 방법론 v0.1을 축적한다.
4. 가능한 Leader’s High 시나리오, 파일럿, 콘텐츠, 컨설팅 기회를 자연스럽게 발견한다.
```

중요: 이 프로젝트는 **주로 세일즈 퍼널이 아닙니다**. 이후 사업적 인사이트가 생길 수는 있지만, 첫 번째 목적은 창업자 훈련과 참가자 가치입니다.

---

## 2. 비즈니스 맥락

### Humanistic

Humanistic은 창업자의 HR AX 컨설팅 회사입니다.

포지셔닝:

```text
Humanistic은 실제 HR 문제와 대화 기반 실행 시스템에서 출발해,
HR 및 조직 리더가 AI를 인간 중심적이고 실용적인 방식으로 도입하도록 돕는다.
```

### Leader’s High

Leader’s High는 창업자의 첫 번째 서비스/제품입니다. 리더십 대화 훈련 제품이며, 특히 어려운 대화, 피드백 대화, 목표 설정 대화, 리더십 연습에 유용합니다.

Leader’s High는 이 프로젝트와 관련이 있지만, 첫 번째 코호트의 주된 초점은 아닙니다.

자연스러운 연결은 다음과 같습니다.

```text
AX x HR 실천 모임
→ 실제 HR 문제
→ 리더십/대화 시나리오
→ Leader’s High 시나리오/콘텐츠/파일럿 기회
```

하지만 다시 강조하면, 첫 번째 코호트가 세일즈 퍼널처럼 느껴져서는 안 됩니다.

---

## 3. 핵심 방법론 — OURS Method

앱과 커뮤니티는 **OURS Method v0.1**을 중심으로 구성됩니다.

```text
O — Own the Problem
U — Understand the System
R — Run a Small Project
S — Share, Reflect, Systemize
```

의미:

```text
O: 참가자 자신의 언어로 문제를 정의한다.
U: 문제가 반복되게 만드는 사람, 흐름, 정보, 도구, 목표, 대화를 이해한다.
R: 문제를 3주 안에 테스트할 수 있는 작은 프로젝트로 줄인다.
S: 학습을 공유하고 회고하며 재사용 가능한 실천/방법론으로 시스템화한다.
```

AI는 “AI 교육”이라는 의미에서 중심이 아닙니다.  
AI는 실행과 대화를 증폭하는 도구로 다룹니다.

```text
AI는 대화를 대체하지 않는다.
AI는 대화, 실행, 회고를 더 명확하고 반복 가능하게 만든다.
```

---

## 4. 첫 번째 코호트 운영 모델

첫 번째 코호트는 3주 동안 진행됩니다.

```text
Week 0 / 준비:
- Google Form 사전 설문을 만든다.
- 참가자 3명에게 설문을 보낸다.
- 응답을 수집한다.
- 참가자 데이터를 Sprint OS에 입력한다.
- 후속 질문을 준비한다.
- 첫 세션과 화면 공유를 리허설한다.

Week 1:
- 문제를 정의한다.
- 각 참가자가 하나의 문제 진술문을 정의한다.
- 각 참가자가 하나의 v0.1 결과물 후보를 선택한다.
- 각 참가자가 성공 기준을 정의한다.
- 창업자가 퍼실리테이터 회고를 작성한다.

Week 2:
- v0.1 결과물을 만든다.
- 결과물은 프롬프트, 체크리스트, 대화 스크립트, 문서 템플릿, 간단한 워크플로우 등이 될 수 있다.
- 현장에서 테스트할 수 있을 만큼 범위를 작게 유지한다.
- 어떤 질문과 개입이 도움이 되었는지 회고한다.

Week 3:
- 현장 테스트를 진행한다.
- 각 참가자가 실제 업무 맥락에서 v0.1 결과물을 한 번 사용한다.
- 반응, 막힘, 배움, 다음 개선점을 기록한다.
- Before/After Case Note를 작성한다.

마무리:
- Humanistic 방법론 v0.1을 업데이트한다.
- 외부 공개가 가능한 첫 번째 코호트 실천 기록을 작성한다.
- 두 번째 코호트, 기업 워크숍, 컨설팅 제안, Leader’s High 연결 여부를 결정한다.
- Sprint OS 개선 백로그를 수집한다.
```

주차별 결과물은 다음과 같습니다.

```text
Week 1: Problem Statement
Week 2: v0.1 Output
Week 3: Before/After Case Note
```

---

## 5. 저장소 / 기술 맥락

저장소:

```text
https://github.com/luvntruth/Sprint-OS.git
```

로컬 프로젝트 경로:

```text
/home/luvntruth/workspaces/leaders-high/ax-hr-sprint-os
```

기술 스택:

```text
Vite
React
TypeScript
localStorage
CSS
```

중요 스크립트:

```bash
npm run dev
npm run build
npm run lint
```

로컬 개발 명령:

```bash
cd /home/luvntruth/workspaces/leaders-high/ax-hr-sprint-os
npm run dev -- --host 127.0.0.1
```

로컬 URL:

```text
Admin:
http://127.0.0.1:5173/?view=admin

Public / participant:
http://127.0.0.1:5173/?view=public
```

Vercel 설정:

```text
Framework Preset: Vite
Root Directory: ./
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

현재 저장 모델:

```text
localStorage only
```

중요한 한계:

```text
아직 공유 클라우드 데이터가 없다.
Vercel에 배포하더라도 각 브라우저가 각자의 localStorage를 가진다.
참가자와 창업자는 실시간으로 같은 데이터를 공유하지 않는다.
현재 권장되는 첫 번째 코호트 운영 방식은 협업 편집이 아니라 화면 공유다.
```

아직 Supabase/Firebase/Auth는 없습니다.

---

## 6. 현재 앱 구조

중요 소스 파일:

```text
src/types.ts
src/storage.ts
src/initialState.ts
src/uiModel.ts
src/prompts.ts
src/exportMarkdown.ts
src/App.tsx
src/App.css
```

주요 컴포넌트:

```text
src/components/Dashboard.tsx
src/components/ParticipantRoom.tsx
src/components/Participants.tsx
src/components/AnalysisInbox.tsx
src/components/TicketBoard.tsx
src/components/ReflectionPanel.tsx
src/components/ExportPanel.tsx
src/components/ProjectLab.tsx
src/components/FacilitatorCockpit.tsx
src/components/MethodLibrary.tsx
```

`initialState.ts`에 포함된 내용:

- 스프린트 메타데이터
- P-0 창업자 참가자
- P-1~P-3 플레이스홀더 참가자
- 준비/week1/week2/week3/wrapup 단계에 걸친 25개 템플릿 티켓
- 초기 방법론 라이브러리 필드

`uiModel.ts`에는 다음과 같은 공통 UI/도메인 헬퍼 함수가 들어 있습니다.

- 단계 메타데이터
- 단계 순서
- 티켓 카운트
- 단계 완료 여부
- 다음 티켓
- 참가자 상태
- 참가자 다음 액션
- 공개용 요약

---

## 7. 현재 화면 모드

현재 앱은 URL 쿼리 파라미터로 화면을 구분합니다.

```text
?view=admin
?view=public
```

중요: 이것은 **실제 보안이 아닙니다**. 표시 방식/UX 차원의 분리일 뿐입니다.

UI는 다음 내용을 명시적으로 전달해야 합니다.

```text
이것은 로그인 기반 권한 부여가 아니다.
Admin/Public 분리는 화면 모드 구분일 뿐이다.
공개로 공유되는 화면에는 민감한 정보를 저장하지 말아야 한다.
```

### Admin View

Admin URL:

```text
?view=admin
```

Admin은 창업자/퍼실리테이터를 위한 화면입니다.

현재 Admin 메뉴:

```text
현황판
참가자 화면
할 일
프로젝트 랩
운영실
방법론
분석
회고
원본 데이터
내보내기
```

Admin은 다음을 할 수 있어야 합니다.

```text
- 전체 프로젝트 진행 상황을 본다.
- 현재 단계를 본다.
- 다음에 무엇을 해야 하는지 본다.
- 참가자 진행 상황을 추적한다.
- 티켓 상태/우선순위/담당자를 수정한다.
- 참가자 원본 데이터를 입력한다.
- 프롬프트를 통해 설문 응답을 분석한다.
- 퍼실리테이터 회고를 작성한다.
- 방법론을 축적한다.
- Obsidian용 Markdown을 내보낸다.
```

### Public View

Public URL:

```text
?view=public
```

Public/참가자 화면은 참가자와 화면을 공유하기 위한 화면입니다.

현재 Public 메뉴:

```text
현황판
참가자 화면
할 일
```

Public 화면은 다음을 해야 합니다.

```text
- Admin 전용 메뉴를 숨긴다.
- P-0 창업자 카드를 숨긴다.
- P-1~P-3 참가자 상태만 보여준다.
- 읽기 전용이어야 한다.
- 다음에 집중한다.
  - 지금 코호트가 어디에 있는지
  - 각 참가자가 무엇을 하고 있는지
  - 다음 액션이 무엇인지
  - 현재 단계에서 기대되는 것이 무엇인지
```

Public 화면은 운영/진단/퍼실리테이터 비공개 정보를 보여주면 안 됩니다.

---

## 8. 현재 티켓 모델

현재 25개의 템플릿 티켓이 있습니다.

단계:

```text
prep: 6
week1: 5
week2: 5
week3: 5
wrapup: 4
```

단계 정의:

```text
prep:
- Google Form 사전 설문
- 사전 설문 발송
- Sprint OS URL 확인
- 설문 응답 입력
- 후속 질문 준비
- 첫 세션/화면 공유 리허설

week1:
- 목적과 OURS Method 설명
- 참가자 문제 진술문 정의
- v0.1 결과물 후보와 성공 기준 선택
- 퍼실리테이터 회고 작성
- Week 1 Problem Statement 결과물 저장

week2:
- v0.1 범위 줄이기
- 참가자 v0.1 결과물 만들기
- 동료/퍼실리테이터 피드백 수집
- v0.1 결과물 저장
- Week 2 퍼실리테이터 회고 작성

week3:
- 현장 테스트 계획 확인
- v0.1을 현장에서 한 번 사용
- Before/After Case Note 작성
- Week 3 회고 대화 진행
- Case Note와 회고 저장

wrapup:
- Humanistic 방법론 v0.1 업데이트
- 첫 번째 코호트 실천 기록 작성
- 다음 코호트/워크숍/컨설팅/Leader’s High 연결 결정
- Sprint OS 개선 백로그 작성
```

티켓 속성:

```ts
id
sprintId
stage
title
description
owner: 'operator' | 'participant' | 'ai'
status: 'todo' | 'doing' | 'done' | 'blocked'
priority: 'low' | 'medium' | 'high'
generatedBy: 'template' | 'ai' | 'manual'
```

최근 UX 변경으로 Admin 티켓 보드에서 담당자 편집이 추가되었습니다.

Public 티켓 화면은 일반적으로 참가자 담당 티켓만 보여주거나, 해당 단계에 참가자 담당 티켓이 없으면 참가자 액션 폴백을 보여줘야 합니다.

---

## 9. 최근 UI/UX 문제와 개선 사항

창업자는 이전 UI가 어수선하고 명확하지 않다고 말했습니다.

```text
화면이 정리가 안되어서 조잡해.
어드민과 참가자용으로 정확히 구분이 필요하고.
대시보드에는 프로젝트 진행 상황을 한 눈에 확인 할 수 있어야 해.
메뉴를 통해서 나와 참가자가 정확히 어떤 상황에서 무얼 했고 무얼 해야 하는지를 화면만 보고도 알 수 있게 직관적으로 알 수 있어야 해.
```

최근 구현된 개선 사항:

```text
- 사이드바 라벨을 재작업했다.
- Admin View와 Public View를 명확히 구분했다.
- Dashboard가 현재 단계, 진행률, 로드맵, 다음 액션, 역할 명확성, 참가자 진행 상황을 보여준다.
- Public View는 메뉴를 3개만 보여준다.
- Public View는 P-0을 숨긴다.
- Public View에서 Admin 링크 복사 버튼을 제거했다.
- Public View의 ParticipantRoom과 TicketBoard는 읽기 전용이다.
- TicketBoard를 어수선한 칸반에서 단계 기반 실행 목록으로 변경했다.
- Admin 티켓 보드에서 상태, 우선순위, 담당자 편집을 지원한다.
- UI 문구는 화면 분리가 실제 권한 부여가 아니라는 점을 명시한다.
- 빌드와 lint가 통과했다.
```

최근 커밋:

```text
b7b3a1c style: clarify sprint os admin and participant views
```

이전 커밋:

```text
21e4bfc feat: build AX x HR Sprint OS MVP
b795197 docs: add Sprint OS deployment notes
f9fe7b8 style: redesign Sprint OS navigation and dashboard UX
fd7ad88 feat: separate public and admin views
f4c220f feat: add cohort execution checklist tickets
b7b3a1c style: clarify sprint os admin and participant views
```

---

## 10. Obsidian 문서 맥락

이 프로젝트는 창업자의 Obsidian vault에 문서화되어 있습니다.

주요 폴더:

```text
/home/luvntruth/Documents/Obsidian Vault/Leader's High/Paperclip HR Consulting Company/
```

스프린트 랩 자산 폴더:

```text
/home/luvntruth/Documents/Obsidian Vault/Leader's High/Paperclip HR Consulting Company/ax-hr-sprint-lab-assets/
```

중요 문서:

```text
00-ax-hr-1st-cohort-ops-index.md
01-3week-operating-plan.md
02-kickoff-message-script.md
03-participant-project-worksheet.md
04-weekly-check-in-questions.md
05-humanistic-insight-extraction-template.md
06-leaders-high-connection-map.md
07-ceo-recommendation-before-kickoff.md
08-action-plan-from-recruiting-post.md
09-consultant-training-centered-strategy.md
10-step-by-step-execution-plan-and-action-items.md
11-pre-kickoff-survey.md
12-ax-hr-sprint-os-mvp-prd.md
13-ax-hr-sprint-os-implementation-plan.md
14-long-term-project-based-community-os-strategy.md
15-humanistic-practice-lab-business-philosophy.md
16-ours-method-v0-1.md
17-sprint-os-operation-and-sharing-manual.md
18-community-benchmark-and-stolen-time.md
```

참가자 문서:

```text
participant-tracker.md
participant-P-0-founder-worksheet.md
participant-P-1-worksheet.md
participant-P-2-worksheet.md
participant-P-3-worksheet.md
```

앱의 Markdown 내보내기는 궁극적으로 앱 상태를 다시 Obsidian으로 옮기는 흐름을 지원해야 합니다.

---

## 11. 중요한 제품 원칙

앱은 다음 원칙에 비추어 평가해야 합니다.

### A. 다음에 무엇을 해야 하는지 명확해야 한다

퍼실리테이터나 참가자가 화면을 열었을 때 즉시 다음 질문에 답할 수 있어야 합니다.

```text
3주 스프린트에서 우리는 지금 어디에 있는가?
무엇이 완료되었는가?
무엇이 막혀 있는가?
나는 다음에 무엇을 해야 하는가?
각 참가자는 다음에 무엇을 해야 하는가?
```

### B. Admin 화면과 참가자 화면은 의도적으로 다르게 느껴져야 한다

Admin View는 다음처럼 느껴져야 합니다.

```text
운영자 커맨드 센터
```

Public View는 다음처럼 느껴져야 합니다.

```text
참가자용 진행 상황 공유방
```

### C. 앱은 단순한 할 일 추적이 아니라 퍼실리테이션을 지원해야 한다

앱은 창업자가 다음을 더 잘하도록 도와야 합니다.

```text
더 잘 듣기
더 좋은 후속 질문하기
문제 범위 줄이기
모호한 문제를 작은 프로젝트로 전환하기
회고 작성하기
방법론 추출하기
```

### D. 세일즈 퍼널처럼 느껴지지 않아야 한다

참가자-facing 경험은 다음처럼 느껴지면 안 됩니다.

```text
리드 수집
영업 파이프라인
제품 퍼널
```

다음처럼 느껴져야 합니다.

```text
안전한 실천 모임
나의 실제 문제
작은 실험
동료 학습
현장 테스트
회고
```

### E. 퍼실리테이터 비공개 메모를 보호해야 한다

참가자-facing 화면은 다음을 노출하면 안 됩니다.

```text
퍼실리테이터 진단
놓친 질문
개입 로그
컨설팅 추출 메모
Leader’s High 사업 기회 메모
민감한 원본 설문 응답
```

### F. 현재 한계를 정직하게 알려야 한다

현재 앱에는 인증도 공유 데이터베이스도 없습니다.

구현되어 있지 않은 실제 보안, 실제 협업, 클라우드 저장을 암시하면 안 됩니다.

---

## 12. 알려진 한계 / 향후 작업

현재 한계:

```text
- localStorage만 사용한다.
- 로그인 기능이 없다.
- 실제 Admin/참가자 권한 부여가 없다.
- 공유 클라우드 데이터베이스가 없다.
- 실시간 협업이 없다.
- Public/Admin 분리는 쿼리 파라미터 기반일 뿐이다.
- 참가자는 공개 배포 화면에 민감한 정보를 직접 입력하면 안 된다.
```

가능성이 높은 향후 아키텍처:

```text
Supabase 또는 Firebase
인증/로그인
역할 기반 권한
공유 코호트 데이터베이스
참가자별 접근
실제 클라우드 영속성
분석을 위한 AI API 연동 가능성
```

가능한 향후 기능:

```text
- 참가자 로그인
- 코호트 관리
- 클라우드 동기화 티켓
- 실제 참가자 제출
- AI 보조 설문 분석
- AI 생성 후속 질문
- Case Note 생성기
- Obsidian 내보내기 자동화
- Method Library 버전 관리
- 공개 코호트 리포트 생성
```

---

## 13. Claude Code에 리뷰 요청하고 싶은 것

위 맥락을 바탕으로 현재 코드베이스와 제품 디자인을 리뷰해 주세요.

특히 다음에 집중해 주세요.

### 1. UX / 정보 구조

다음을 확인해 주세요.

```text
- Admin과 Public 분리가 명확한가?
- 대시보드에서 프로젝트 진행 상황이 명확하게 보이는가?
- 참가자가 자신이 해야 할 일을 이해할 수 있는가?
- 창업자가 다음에 무엇을 해야 하는지 이해할 수 있는가?
- 메뉴가 어수선하지 않은가?
- 한국어 HR/퍼실리테이션 맥락에서 라벨이 직관적인가?
```

### 2. React / TypeScript 품질

다음을 확인해 주세요.

```text
- 컴포넌트 책임
- 반복 로직
- 타입 안정성
- 상태 처리
- localStorage 마이그레이션/병합 동작
- 헬퍼 함수가 uiModel.ts에 있어도 적절한지
- Dashboard/TicketBoard가 너무 커지고 있지는 않은지
```

### 3. 보안 / 프라이버시

다음을 확인해 주세요.

```text
- Admin/Public 보안에 대한 오해를 일으키는 가정이 있는지
- Public 모드로 Admin 전용 정보가 새어 나가는지
- Public 모드가 UI 수준에서 실제로 읽기 전용인지
- UI 문구가 이것이 실제 권한 부여가 아니라는 점을 제대로 경고하는지
```

### 4. 제품 적합성

앱이 실제로 다음을 지원하는지 확인해 주세요.

```text
- OURS Method
- 3주 코호트 운영
- 퍼실리테이터 훈련
- 참가자 가치
- 회고와 방법론 축적
```

### 5. 다음 개선 추천

구체적인 다음 단계를 우선순위 순서로 제안해 주세요.

가능한 카테고리:

```text
P0: 첫 코호트 전에 반드시 고쳐야 할 것
P1: 곧 개선하면 좋은 것
P2: 이후 제품화 단계에서 볼 것
```

---

## 14. 리뷰 명령

다음을 실행해 주세요.

```bash
npm run build
npm run lint
```

필요하면 앱을 로컬에서 실행해 주세요.

```bash
npm run dev -- --host 127.0.0.1
```

다음 라우트를 리뷰해 주세요.

```text
http://127.0.0.1:5173/?view=admin
http://127.0.0.1:5173/?view=public
http://127.0.0.1:5173/?view=admin&tab=tickets
http://127.0.0.1:5173/?view=public&tab=tickets
http://127.0.0.1:5173/?view=public&tab=room
```

---

## 15. 원하는 출력 형식

다음 형식으로 반환해 주세요.

```markdown
# AX x HR Sprint OS 리뷰

## 종합 판단

## 잘 작동하는 점

## P0 이슈 — 첫 코호트 전에 반드시 고칠 것

## P1 개선 — 곧 개선하면 좋은 것

## P2 향후 제품화

## Admin/Public 분리 리뷰

## 대시보드/진행 상황 리뷰

## 코드 품질 리뷰

## 보안/프라이버시 리뷰

## 다음 구현 계획 제안
```

직설적이고 실용적으로 작성해 주세요. 이것은 이론적 디자인 연습이 아니라 실제 첫 번째 코호트를 위한 리뷰입니다.
