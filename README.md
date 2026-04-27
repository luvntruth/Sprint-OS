# Sprint OS

AX x HR 실천 모임 1기 운영을 위한 프로젝트 기반 실천 커뮤니티 OS입니다.

## 목적

Sprint OS는 단순한 프로젝트 관리 도구가 아니라, 문턱장이 사람들의 실제 문제를 프로젝트로 전환해 돕는 방식을 훈련하고 축적하기 위한 운영 도구입니다.

핵심 철학:

- 조직은 **우리답게** 일해야 한다.
- 개인은 **자기답게** 일해야 한다.
- 목표 달성은 의지만이 아니라 구조화된 시스템과 대화에서 나온다.
- AI는 대화를 대체하지 않고, 실행과 회고를 더 잘 일어나게 하는 증폭 장치다.

## 방법론

OURS Method:

- **O — 문제 소유하기(Own the Problem)**: 문제를 자기 언어로 소유한다.
- **U — 시스템 이해하기(Understand the System)**: 문제가 반복해서 발생하는 시스템을 이해한다.
- **R — 작은 프로젝트 실행하기(Run a Small Project)**: 작고 실제적인 프로젝트로 실험한다.
- **S — 공유·회고·시스템화하기(Share, Reflect, Systemize)**: 공유하고 회고하며 반복 가능한 시스템으로 만든다.

## 주요 기능

- 현황판: 스프린트 운영 현황
- 우리 실천방: 참가자와 함께 보는 진행상황 화면
- 프로젝트 랩: OURS Method 기반 참가자별 프로젝트 관리
- 운영실: 운영자/컨설턴트 전용 진단·질문·개입 기록
- 방법론: Humanistic 방법론 라이브러리
- 원본 데이터: 참가자 상세 정보와 설문 원문 관리
- 분석: 로키/AI 분석 프롬프트 생성 및 결과 저장
- 이번 주 할 일: 단계별 실행 티켓 관리
- 회고: 운영자 회고 및 다음 액션 정리
- 내보내기: Obsidian용 Markdown 내보내기

## 로컬 개발

```bash
npm install
npm run dev
```

브라우저에서 열기:

```text
http://127.0.0.1:5173
```

## 빌드

```bash
npm run build
```

빌드 결과물 디렉터리:

```text
dist
```

## Vercel 배포

권장 Vercel 설정:

- Framework Preset: `Vite`
- Install Command: `npm install`
- Build Command: `npm run build`
- Output Directory: `dist`
- Root Directory: `./`

## 현재 범위

현재 버전은 MVP 0.1/0.1.5입니다.

- 단일 사용자/로컬 우선 구조
- 브라우저 `localStorage` 기반 저장
- 로그인 없음
- 외부 AI API 없음
- 복사/붙여넣기 프롬프트를 통한 반자동 AI 워크플로우

향후 버전에서는 Supabase/Firebase, 참가자 로그인, AI API 연동, Paperclip 이슈 동기화, Obsidian 직접 내보내기 등을 추가할 수 있습니다.
