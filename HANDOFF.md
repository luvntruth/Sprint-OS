# Sprint OS — Handoff Note

## 현재 상태 (2026-04-25 기준)
**Phase 1 완료** — UI/UX 시각화 강화 + OURS 체크리스트 도메인 도입
ESLint 0건 / TypeScript build 통과 / dev 서버 5174 포트에서 정상 기동 확인.

## 사용자 결정사항 (확정)
1. **백엔드**: Supabase 도입 (참가자 매직링크 + 실시간 동기화)
2. **신규 도메인 4개**: Question Inbox(태그 분석) / Blocker 카드 / Improvement Backlog / Activity Feed
3. **디자인 톤**: 데이터 시각화 강화 (타임라인/진행률 바/OURS 위치)

전체 계획 원문: `~/.claude/plans/repo-validated-hummingbird.md`

## Phase 1에서 변경/신규된 것

### 신규 파일
- `src/lib/checklists.ts` — OURS 16개 체크리스트 정의 + 진행률·현재 단계 추론
- `src/components/Timeline.tsx` — 시작·종료일 + 오늘 마커가 있는 5단계 타임라인
- `src/components/OursProgress.tsx` — OURS 4분할 진행률 바 + `PhasePill`
- `src/components/Onboarding.tsx` — public/admin 모드별 3단계 가이드 카드 (dismiss 가능)

### 수정 파일
- `src/types.ts` — `OursPhase`/`ChecklistItem`/`ChecklistState` 추가, `Participant.checklist` 신규 필드
- `src/initialState.ts` — 모든 참가자에 `checklist: {}` 시드
- `src/storage.ts` — 기존 v1 데이터에 `checklist` 누락 시 자동 보강
- `src/uiModel.ts` — `getParticipantStatus`/`getParticipantNextAction`을 OURS 체크리스트 기반으로 통일
- `src/components/Dashboard.tsx` — Timeline·코호트 평균·참가자별 OursProgress+PhasePill 통합
- `src/components/ParticipantRoom.tsx` — "다음 체크" 안내 + 운영자 빠른 체크 버튼
- `src/components/ProjectLab.tsx` — 9 textarea → 단계별 체크리스트 + 자유 메모 재구성
- `src/App.css` — Phase 1 시각화 토큰 추가 (~150줄 append)

## 다음 세션 시작 명령
```
git status && git log --oneline -5
cat HANDOFF.md
```
또는 자연어: "Sprint OS Phase 2 시작" → AI가 plan 파일 읽고 이어감.

## Phase 2 작업 (시작 전 확인 필요)
1. Supabase 프로젝트 생성 + 환경변수 (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`)
2. `supabase/schema.sql` 작성 (기존 6 테이블 + 신규 4 테이블)
3. RLS 정책 (참가자 본인 행만, 운영자 전체)
4. 매직링크 Auth + `participants.auth_user_id` 컬럼
5. `src/lib/supabase.ts` 클라이언트
6. `storage.ts` → 1회성 마이그레이션 헬퍼 (localStorage → Supabase)
7. 신규 화면 4개 (`QuestionInbox`/`BlockerBoard`/`ImprovementBacklog`/Activity Feed 임베드)
8. Realtime 구독을 Dashboard에 연결
9. 롤백 플래그 `VITE_USE_LOCAL_STORAGE=1` 도입

## 알려진 caveats / 약속만 한 항목
- **롤백 플래그 미구현** — Phase 2 도입 시 `VITE_USE_LOCAL_STORAGE=1`을 환경변수로 우선 검사하는 분기 코드 필요 (plan에서 약속)
- **자가 체크 양방향**은 Phase 2 백엔드 도입 후에야 진짜 동작 — 현재 Phase 1은 운영자 체크 → public 시각화만
- **`.bkit/`, `.omc/`** 는 git untracked 상태. 도구 임시 폴더로 추정 — 필요 시 `.gitignore`에 추가
- **Onboarding dismiss 키**: `ax-hr-sprint-os-onboarding-dismissed-v1` (재표시하려면 localStorage에서 삭제)

## OURS 체크리스트 정의 위치
`src/lib/checklists.ts`의 `OURS_CHECKLIST` 배열 — 16항목(O/U/R/S 각 4개). 도메인 변경 시 이 배열만 수정. 기존 데이터는 보존(없는 키는 false 취급).

## 검증 명령
```
npm run lint   # ESLint
npm run build  # tsc -b && vite build
npm run dev    # 5173 → 5174 (포트 충돌 시 자동 다음)
```
