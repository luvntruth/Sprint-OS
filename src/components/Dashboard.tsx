import type { AppState, Stage } from '../types';
import {
  getParticipantNextAction,
  getPublicSummary,
  getStageCompletion,
  getTicketCounts,
  stageMeta,
  stageOrder,
} from '../uiModel';
import { OursProgress, PhasePill } from './OursProgress';
import { currentPhase, overallProgress } from '../lib/checklists';
import { Onboarding } from './Onboarding';
import { OursDistribution } from './OursDistribution';
import { WeekKanbanMini } from './WeekKanbanMini';

interface Props {
  state: AppState;
  setState: (state: AppState) => void;
  mode?: 'public' | 'admin';
  setTab?: (tab: string) => void;
  onJumpToParticipant?: (participantId: string) => void;
}

function participantActionForStage(stage: Stage) {
  if (stage === 'prep') {
    return {
      title: '사전 질문에 답하고 내 문제 후보 떠올리기',
      description: '첫 모임 전, 요즘 일에서 반복해서 막히는 장면 1~2개만 편하게 적어오면 됩니다.',
    };
  }
  return {
    title: '내 카드에서 다음 작은 행동 확인하기',
    description: '내 문제, 만들 결과물, 다음 액션을 확인하고 다음 만남 전 작게 한 번 시도합니다.',
  };
}

export function Dashboard({ state, setState, mode = 'admin', setTab, onJumpToParticipant }: Props) {
  const summary = getPublicSummary(state);
  const visibleParticipants = state.participants.filter((p) => mode === 'admin' || p.id !== 'P-0');
  const participantTickets = state.tickets.filter((ticket) => ticket.owner === 'participant');
  const dashboardTickets = mode === 'public' ? participantTickets : state.tickets;
  const ticketCounts = getTicketCounts(dashboardTickets);
  const dashboardProgressPercent = ticketCounts.total === 0 ? 0 : Math.round((ticketCounts.done / ticketCounts.total) * 100);
  const stageCompletion = getStageCompletion(dashboardTickets, state.sprint.currentStage);
  const blockedTickets = dashboardTickets.filter((ticket) => ticket.status === 'blocked');
  const publicNextAction = participantActionForStage(state.sprint.currentStage);
  const nextAction = mode === 'public'
    ? publicNextAction
    : summary.nextTicket
      ? { title: summary.nextTicket.title, description: summary.nextTicket.description }
      : { title: '이번 단계 티켓은 모두 완료됨', description: '다음 단계로 이동하거나 회고를 남기면 됩니다.' };

  const updateSprint = (patch: Partial<typeof state.sprint>) => {
    setState({ ...state, sprint: { ...state.sprint, ...patch } });
  };

  const dateMissing = mode === 'admin' && (!state.sprint.startDate || !state.sprint.endDate);
  const scrollToSetup = () => {
    document.getElementById('admin-setup')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const cohortOursRatio =
    visibleParticipants.length === 0
      ? 0
      : visibleParticipants.reduce((sum, p) => sum + overallProgress(p.checklist ?? {}).ratio, 0) /
        visibleParticipants.length;

  return (
    <section className="dashboard-page">
      <Onboarding mode={mode} />

      {dateMissing ? (
        <div className="setup-banner" role="status">
          <div>
            <strong>스프린트 시작일·종료일이 비어 있어요.</strong>
            <small>입력해두면 운영자가 전체 흐름을 더 정확하게 볼 수 있습니다.</small>
          </div>
          <button type="button" className="subtle" onClick={scrollToSetup}>
            운영 설정으로 이동
          </button>
        </div>
      ) : null}

      <section className="home-header panel">
        <div>
          <p className="eyebrow">AX x HR 3주 실천 모임 진행판</p>
          <h1>{mode === 'admin' ? '공유 화면과 운영 입력을 한 곳에서 관리합니다' : '지금 어디에 있고, 무엇을 하면 되는지 확인합니다'}</h1>
          <p>{state.sprint.purpose}</p>
        </div>
      </section>

      <section className="panel compact-panel cohort-flow-panel" aria-label="코호트 분포와 이번 단계">
        <div className="section-head clean-head">
          <div>
            <p className="eyebrow">코호트 한눈에</p>
            <h2>OURS 단계 분포 · 이번 주 흐름</h2>
          </div>
          <span>참가자 {visibleParticipants.length}명 · 평균 {Math.round(cohortOursRatio * 100)}%</span>
        </div>
        <div className="cohort-flow-grid">
          <OursDistribution state={state} mode={mode} onJump={mode === 'admin' ? onJumpToParticipant : undefined} />
          <WeekKanbanMini
            tickets={dashboardTickets}
            stage={state.sprint.currentStage}
            onJump={setTab ? () => setTab('tickets') : undefined}
          />
        </div>
      </section>

      <section className="home-summary-grid" aria-label="현재 요약">
        <article className="summary-card primary">
          <span>현재 단계</span>
          <strong>{summary.stageMeta.label}</strong>
          <p>{summary.stageMeta.purpose}</p>
        </article>
        <article className="summary-card action">
          <span>오늘 할 일</span>
          <strong>{nextAction.title}</strong>
          <p>{nextAction.description}</p>
        </article>
        <article className={blockedTickets.length > 0 ? 'summary-card risk' : 'summary-card'}>
          <span>막힌 것</span>
          <strong>{blockedTickets.length > 0 ? `${blockedTickets.length}개 확인 필요` : '막힌 항목 없음'}</strong>
          <p>{blockedTickets[0]?.title ?? '현재 단계에서 바로 풀어야 할 막힘은 없습니다.'}</p>
        </article>
      </section>

      <section className="panel compact-panel flow-panel">
        <div className="section-head clean-head">
          <div>
            <p className="eyebrow">3주 흐름</p>
            <h2>준비부터 회고까지 한눈에 보기</h2>
          </div>
          <span>전체 완료 {dashboardProgressPercent}% · OURS 평균 {Math.round(cohortOursRatio * 100)}%</span>
        </div>
        <div className="progress-track" aria-label="스프린트 진행률">
          <span style={{ width: `${dashboardProgressPercent}%` }} />
        </div>
        <div className="stage-roadmap compact-roadmap">
          {stageOrder.map((stage) => {
            const visibleStageTickets = dashboardTickets.filter((ticket) => ticket.stage === stage);
            const completion = getStageCompletion(dashboardTickets, stage);
            const isActive = state.sprint.currentStage === stage;
            const isPast = stageOrder.indexOf(stage) < stageOrder.indexOf(state.sprint.currentStage);
            return (
              <button
                key={stage}
                className={isActive ? 'stage-step active' : isPast ? 'stage-step past' : 'stage-step'}
                onClick={() => updateSprint({ currentStage: stage })}
                disabled={mode === 'public'}
              >
                <span>{stageMeta[stage].shortLabel}</span>
                <strong>{mode === 'public' ? `${visibleStageTickets.length || 1}개` : `${completion.done}/${completion.total}`}</strong>
                <small>{stageMeta[stage].outcome}</small>
              </button>
            );
          })}
        </div>
      </section>

      {mode === 'admin' ? (
        <section className="dashboard-grid">
          <article className="panel action-panel">
            <p className="eyebrow">공유 화면에 보이는 내용</p>
            <h2>참가자에게 지금 보이는 핵심</h2>
            <ul className="clarity-list">
              <li><strong>현재 단계:</strong> {summary.stageMeta.label}</li>
              <li><strong>참가자 할 일:</strong> {publicNextAction.title}</li>
              <li><strong>현재 단계 완료:</strong> {stageCompletion.done}/{stageCompletion.total || 1}</li>
            </ul>
          </article>
          <article className="panel action-panel">
            <p className="eyebrow">운영자가 오늘 입력할 것</p>
            <h2>운영 입력 체크</h2>
            <ul className="clarity-list">
              <li><strong>참가자 데이터:</strong> 설문 원문과 문제 후보를 최신으로 맞춥니다.</li>
              <li><strong>프로젝트 설계:</strong> 대화 후 OURS 체크와 다음 액션을 갱신합니다.</li>
              <li><strong>회고:</strong> 모임 직후 질문, 막힘, 다음 개입 포인트를 남깁니다.</li>
            </ul>
          </article>
        </section>
      ) : null}

      <section className="panel compact-panel participant-overview-panel">
        <div className="section-head clean-head">
          <div>
            <p className="eyebrow">참가자 진행</p>
            <h2>내 문제, 만들 결과물, 다음 액션</h2>
          </div>
          <span>문제 → 결과물 → 현업 테스트 → 회고</span>
        </div>

        <div className="participant-overview-list">
          <div className="participant-overview-head">
            <span>참가자</span>
            <span>현재 OURS 단계</span>
            <span>문제</span>
            <span>다음 액션</span>
          </div>
          {visibleParticipants.map((participant) => {
            const checklist = participant.checklist ?? {};
            return (
              <article className="participant-overview-row" key={participant.id}>
                <div>
                  <strong>{participant.displayName}</strong>
                  <small>{participant.role || participant.id}</small>
                </div>
                <div>
                  <PhasePill phase={currentPhase(checklist)} />
                  <OursProgress checklist={checklist} variant="compact" />
                </div>
                <p>{participant.problemStatement || '첫 모임에서 함께 정리합니다.'}</p>
                <p>{getParticipantNextAction(participant)}</p>
              </article>
            );
          })}
        </div>
      </section>

      {mode === 'admin' && (
        <section id="admin-setup" className="panel compact-panel admin-controls-panel">
          <div className="section-head clean-head">
            <div>
              <p className="eyebrow">운영 설정</p>
              <h2>스프린트 기본 정보</h2>
            </div>
            <span>참가자에게는 보이지 않는 운영 정보</span>
          </div>
          <div className="grid two">
            <label>시작일<input value={state.sprint.startDate} onChange={(event) => updateSprint({ startDate: event.target.value })} placeholder="YYYY-MM-DD" /></label>
            <label>종료일<input value={state.sprint.endDate} onChange={(event) => updateSprint({ endDate: event.target.value })} placeholder="YYYY-MM-DD" /></label>
          </div>
          <label>운영 메모<textarea value={state.sprint.notes} onChange={(event) => updateSprint({ notes: event.target.value })} /></label>
        </section>
      )}
    </section>
  );
}
