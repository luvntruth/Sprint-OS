import type { AppState } from '../types';
import {
  getParticipantNextAction,
  getParticipantStatus,
  getPublicSummary,
  getStageCompletion,
  getTicketCounts,
  stageMeta,
  stageOrder,
} from '../uiModel';
import { Timeline } from './Timeline';
import { OursProgress, PhasePill } from './OursProgress';
import { currentPhase, overallProgress } from '../lib/checklists';
import { Onboarding } from './Onboarding';

interface Props {
  state: AppState;
  setState: (state: AppState) => void;
  mode?: 'public' | 'admin';
}

export function Dashboard({ state, setState, mode = 'admin' }: Props) {
  const summary = getPublicSummary(state);
  const visibleParticipants = state.participants.filter((p) => mode === 'admin' || p.id !== 'P-0');
  const cohortOursRatio =
    visibleParticipants.length === 0
      ? 0
      : visibleParticipants.reduce((sum, p) => sum + overallProgress(p.checklist ?? {}).ratio, 0) /
        visibleParticipants.length;
  const participantTickets = state.tickets.filter((ticket) => ticket.owner === 'participant');
  const dashboardTickets = mode === 'public' ? participantTickets : state.tickets;
  const ticketCounts = getTicketCounts(dashboardTickets);
  const dashboardProgressPercent = ticketCounts.total === 0 ? 0 : Math.round((ticketCounts.done / ticketCounts.total) * 100);
  const publicNextAction = {
    priority: 'high',
    title: state.sprint.currentStage === 'prep' ? '사전 질문에 답하고 내 문제 후보 떠올리기' : '내 카드에서 다음 작은 행동 확인하기',
    description:
      state.sprint.currentStage === 'prep'
        ? '첫 모임 전, 요즘 일에서 반복해서 막히는 장면 1~2개만 편하게 적어오면 됩니다. 완성된 답보다 실제 장면이 더 중요합니다.'
        : '내 프로젝트 카드에서 지금 단계와 다음 행동을 확인하고, 다음 만남 전 작게 한 번 시도해봅니다.',
  };
  const updateSprint = (patch: Partial<typeof state.sprint>) => {
    setState({ ...state, sprint: { ...state.sprint, ...patch } });
  };

  const dateMissing = mode === 'admin' && (!state.sprint.startDate || !state.sprint.endDate);
  const scrollToSetup = () => {
    document.getElementById('admin-setup')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section className="dashboard-page">
      <Onboarding mode={mode} />
      {dateMissing ? (
        <div className="setup-banner" role="status">
          <div>
            <strong>스프린트 시작일·종료일이 비어 있어요.</strong>
            <small>입력해두면 타임라인에 오늘 위치 마커가 뜹니다.</small>
          </div>
          <button type="button" className="subtle" onClick={scrollToSetup}>
            운영 설정으로 이동 →
          </button>
        </div>
      ) : null}
      <div className={mode === 'admin' ? 'command-hero admin-hero' : 'command-hero public-hero'}>
        <div>
          <p className="eyebrow">{mode === 'admin' ? 'Operator Command Center' : 'Participant Home'}</p>
          <h1>{mode === 'admin' ? '1기 운영 현황판' : '오늘 우리가 어디에 있고, 무엇을 하면 되는지'}</h1>
          <p>{state.sprint.purpose}</p>
        </div>
        <div className="hero-now-card">
          <span>현재 단계</span>
          <strong>{summary.stageMeta.label}</strong>
          <small>{summary.stageMeta.purpose}</small>
        </div>
      </div>

      <div className="panel compact-panel timeline-panel">
        <div className="section-head clean-head">
          <div>
            <p className="eyebrow">Sprint Timeline</p>
            <h2>오늘 우리는 어디에 있는가</h2>
          </div>
          <span>코호트 평균 OURS {Math.round(cohortOursRatio * 100)}%</span>
        </div>
        <Timeline sprint={state.sprint} />
      </div>

      <div className="progress-shell panel compact-panel">
        <div className="progress-header">
          <div>
            <p className="eyebrow">3-Week Sprint Flow</p>
            <h2>전체 프로젝트 진행 상황</h2>
          </div>
          <strong>{dashboardProgressPercent}%</strong>
        </div>
        <div className="progress-track" aria-label="스프린트 진행률">
          <span style={{ width: `${dashboardProgressPercent}%` }} />
        </div>
        <div className="stage-roadmap">
          {stageOrder.map((stage) => {
            const visibleStageTickets = mode === 'public' ? participantTickets.filter((ticket) => ticket.stage === stage) : state.tickets.filter((ticket) => ticket.stage === stage);
            const completion = mode === 'public'
              ? {
                  total: visibleStageTickets.length || 1,
                  done: visibleStageTickets.filter((ticket) => ticket.status === 'done').length,
                }
              : getStageCompletion(state.tickets, stage);
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
                <strong>{completion.done}/{completion.total}</strong>
                <small>{stageMeta[stage].outcome}</small>
              </button>
            );
          })}
        </div>
      </div>

      <div className="dashboard-grid">
        <section className="panel action-panel">
          <p className="eyebrow">Right Now</p>
          <h2>지금 해야 할 일</h2>
          {mode === 'public' ? (
            <article className="next-action-card">
              <span className="priority-dot high">교육생</span>
              <div>
                <strong>{publicNextAction.title}</strong>
                <p>{publicNextAction.description}</p>
              </div>
            </article>
          ) : summary.nextTicket ? (
            <article className="next-action-card">
              <span className={`priority-dot ${summary.nextTicket.priority}`}>{summary.nextTicket.priority}</span>
              <div>
                <strong>{summary.nextTicket.title}</strong>
                <p>{summary.nextTicket.description}</p>
              </div>
            </article>
          ) : (
            <article className="next-action-card done">
              <strong>이번 단계 티켓은 모두 완료됨</strong>
              <p>다음 단계로 이동하거나 회고를 남기면 됩니다.</p>
            </article>
          )}
          <div className="quick-stats">
            <div><strong>{mode === 'public' ? `${participantTickets.filter((ticket) => ticket.stage === state.sprint.currentStage && ticket.status === 'done').length}/${participantTickets.filter((ticket) => ticket.stage === state.sprint.currentStage).length || 1}` : `${summary.completion.done}/${summary.completion.total}`}</strong><span>현재 단계 완료</span></div>
            <div><strong>{mode === 'public' ? state.participants.filter((participant) => participant.id !== 'P-0').length : ticketCounts.open}</strong><span>{mode === 'public' ? '교육생 프로젝트' : '전체 열린 티켓'}</span></div>
            <div><strong>{ticketCounts.blocked}</strong><span>막힌 티켓</span></div>
          </div>
        </section>

        <section className="panel action-panel">
          <p className="eyebrow">Role Clarity</p>
          <h2>{mode === 'admin' ? '문턱장이 볼 것' : '오늘 같이 확인할 것'}</h2>
          {mode === 'admin' ? (
            <ul className="clarity-list">
              <li><strong>운영:</strong> 티켓 탭에서 단계별 실행 상태를 갱신합니다.</li>
              <li><strong>진단:</strong> 운영실에서 참가자별 병목과 후속 질문을 남깁니다.</li>
              <li><strong>방법론:</strong> 회고 후 효과 있었던 질문과 AI 활용 패턴을 방법론에 축적합니다.</li>
            </ul>
          ) : (
            <ul className="clarity-list">
              <li><strong>내 문제:</strong> 요즘 일에서 반복해서 막히는 장면을 한 문장으로 확인합니다.</li>
              <li><strong>내 결과물:</strong> 3주 안에 작게 만들어볼 v0.1 산출물을 확인합니다.</li>
              <li><strong>다음 행동:</strong> 다음 만남 전 내가 해볼 작은 시도 하나를 정합니다.</li>
            </ul>
          )}
        </section>
      </div>

      <section className="panel compact-panel">
        <div className="section-head clean-head">
          <div>
            <p className="eyebrow">Participants</p>
            <h2>참가자별 진행 상황</h2>
          </div>
          <span>문제 → v0.1 → 현업 테스트 → 케이스</span>
        </div>

        <div className="participant-progress-grid">
          {visibleParticipants.map((participant) => {
            const checklist = participant.checklist ?? {};
            const here = currentPhase(checklist);
            return (
              <article className="participant-progress-card" key={participant.id}>
                <div className="participant-line">
                  <span className="badge">{participant.id}</span>
                  <div>
                    <strong>{participant.displayName}</strong>
                    <small>{participant.role || '역할/맥락 미입력'}</small>
                  </div>
                  <PhasePill phase={here} />
                  <em>{getParticipantStatus(participant)}</em>
                </div>
                <OursProgress checklist={checklist} variant="compact" />
                <dl>
                  <div>
                    <dt>문제</dt>
                    <dd>{participant.problemStatement || '아직 문제 정의 전'}</dd>
                  </div>
                  <div>
                    <dt>결과물</dt>
                    <dd>{participant.outputCandidate || 'v0.1 결과물 후보 미정'}</dd>
                  </div>
                  <div>
                    <dt>다음 액션</dt>
                    <dd>{getParticipantNextAction(participant)}</dd>
                  </div>
                </dl>
              </article>
            );
          })}
        </div>
      </section>

      {mode === 'admin' && (
        <section id="admin-setup" className="panel compact-panel admin-controls-panel">
          <div className="section-head clean-head">
            <div>
              <p className="eyebrow">Admin Setup</p>
              <h2>운영 설정</h2>
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
