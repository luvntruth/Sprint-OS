# Sprint OS

AX x HR 실천 모임 1기 운영을 위한 프로젝트 기반 실천 커뮤니티 OS입니다.

## Purpose

Sprint OS는 단순 프로젝트 관리툴이 아니라, 문턱장이 사람들의 실제 문제를 프로젝트로 전환해 돕는 방식을 훈련하고 축적하기 위한 운영 도구입니다.

핵심 철학:

- 조직은 **우리답게** 일해야 한다.
- 개인은 **자기답게** 일해야 한다.
- 목표 달성은 의지만이 아니라 구조화된 시스템과 대화에서 나온다.
- AI는 대화를 대체하지 않고, 실행과 회고를 더 잘 일어나게 하는 증폭 장치다.

## Method

OURS Method:

- **O — Own the Problem**: 문제를 자기 언어로 소유한다.
- **U — Understand the System**: 문제가 발생하는 시스템을 이해한다.
- **R — Run a Small Project**: 작고 실제적인 프로젝트로 실험한다.
- **S — Share, Reflect, Systemize**: 공유하고 회고하며 반복 가능한 시스템으로 만든다.

## Features

- Dashboard: 스프린트 운영 현황
- Shared Room: 참가자와 함께 보는 진행상황 화면
- Project Lab: OURS Method 기반 참가자별 프로젝트 관리
- Cockpit: 운영자/컨설턴트 전용 진단·질문·개입 기록
- Method: Humanistic 방법론 라이브러리
- Participants: 참가자 상세 정보와 설문 원문 관리
- Analysis: 로키/AI 분석 프롬프트 생성 및 결과 저장
- Tickets: 단계별 실행 티켓 관리
- Reflection: 운영자 회고 및 다음 액션 정리
- Export: Obsidian용 Markdown export

## Local Development

```bash
npm install
npm run dev
```

Open:

```text
http://127.0.0.1:5173
```

## Build

```bash
npm run build
```

Output directory:

```text
dist
```

## Vercel Deployment

Recommended Vercel settings:

- Framework Preset: `Vite`
- Install Command: `npm install`
- Build Command: `npm run build`
- Output Directory: `dist`
- Root Directory: `./`

## Current Scope

This is MVP 0.1/0.1.5:

- single-user/local-first
- browser localStorage persistence
- no login
- no external AI API
- semi-automatic AI workflow through copy-paste prompts

Future versions may add Supabase/Firebase, participant login, AI API integration, Paperclip issue sync, and Obsidian direct export.
