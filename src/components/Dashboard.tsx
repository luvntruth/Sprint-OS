import type { AppState } from '../types';

const stages = ['prep', 'week1', 'week2', 'week3', 'wrapup'] as const;

interface Props {
  state: AppState;
  setState: (state: AppState) => void;
}

function getParticipantStatus(participant: AppState['participants'][number]) {
  if (participant.lifecycle.caseNote || participant.lifecycle.fieldTest) return '현업 테스트';
  if (participant.lifecycle.smallProject || participant.outputCandidate) return '제작 준비';
  if (participant.problemStatement) return '문제 정의';
  return '대기';
}

export function Dashboard({ state, setState }: Props) {
  const openTickets = state.tickets.filter((ticket) => ticket.status !== 'done').length;
  const doneTickets = state.tickets.filter((ticket) => ticket.status === 'done').length;
  const updateSprint = (patch: Partial<typeof state.sprint>) => {
    setState({ ...state, sprint: { ...state.sprint, ...patch } });
  };

  return (
    <section className="panel dashboard-panel">
      <div className="hero-card">
        <p className="eyebrow">Humanistic Practice Lab</p>
        <h1>{state.sprint.title}</h1>
        <p>{state.sprint.purpose}</p>
      </div>

      <div className="dashboard-metrics">
        <label className="metric-control">
          현재 단계
          <select value={state.sprint.currentStage} onChange={(event) => updateSprint({ currentStage: event.target.value as typeof stages[number] })}>
            {stages.map((stage) => <option key={stage}>{stage}</option>)}
          </select>
        </label>
        <div className="metric"><strong>{openTickets}</strong><span>열린 티켓</span></div>
        <div className="metric"><strong>{doneTickets}</strong><span>완료 티켓</span></div>
        <div className="metric"><strong>{state.participants.length}</strong><span>참여자</span></div>
      </div>

      <div className="grid two">
        <label>시작일<input value={state.sprint.startDate} onChange={(event) => updateSprint({ startDate: event.target.value })} placeholder="YYYY-MM-DD" /></label>
        <label>종료일<input value={state.sprint.endDate} onChange={(event) => updateSprint({ endDate: event.target.value })} placeholder="YYYY-MM-DD" /></label>
      </div>

      <label>운영 메모<textarea value={state.sprint.notes} onChange={(event) => updateSprint({ notes: event.target.value })} /></label>

      <div className="section-head">
        <div>
          <p className="eyebrow">Participants</p>
          <h2>참가자 진행</h2>
        </div>
        <span>문제 → 프로젝트 → 현업 테스트</span>
      </div>

      <div className="cards">
        {state.participants.map((participant) => (
          <article className="card participant-status-card" key={participant.id}>
            <div className="card-topline">
              <strong>{participant.id} · {participant.displayName}</strong>
              <span className="status-badge">{getParticipantStatus(participant)}</span>
            </div>
            <p>{participant.problemStatement || '문제 정의 대기'}</p>
            <small>{participant.outputCandidate || '결과물 후보 미정'}</small>
          </article>
        ))}
      </div>
    </section>
  );
}
