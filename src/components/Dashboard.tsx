import type { AppState, Stage } from '../types';

const stages: Stage[] = ['prep', 'week1', 'week2', 'week3', 'wrapup'];

interface Props {
  state: AppState;
  setState: (state: AppState) => void;
}

export function Dashboard({ state, setState }: Props) {
  const openTickets = state.tickets.filter((t) => t.status !== 'done').length;
  const updateSprint = (patch: Partial<typeof state.sprint>) => {
    setState({ ...state, sprint: { ...state.sprint, ...patch } });
  };

  return (
    <section className="panel">
      <div className="hero-card">
        <p className="eyebrow">Humanistic internal tool</p>
        <h1>{state.sprint.title}</h1>
        <p>{state.sprint.purpose}</p>
      </div>

      <div className="grid two">
        <label>
          현재 단계
          <select value={state.sprint.currentStage} onChange={(e) => updateSprint({ currentStage: e.target.value as Stage })}>
            {stages.map((stage) => <option key={stage}>{stage}</option>)}
          </select>
        </label>
        <div className="metric"><strong>{openTickets}</strong><span>열린 티켓</span></div>
      </div>

      <div className="grid two">
        <label>시작일<input value={state.sprint.startDate} onChange={(e) => updateSprint({ startDate: e.target.value })} placeholder="YYYY-MM-DD" /></label>
        <label>종료일<input value={state.sprint.endDate} onChange={(e) => updateSprint({ endDate: e.target.value })} placeholder="YYYY-MM-DD" /></label>
      </div>

      <label>운영 메모<textarea value={state.sprint.notes} onChange={(e) => updateSprint({ notes: e.target.value })} /></label>

      <h2>참가자 진행</h2>
      <div className="cards">
        {state.participants.map((p) => (
          <article className="card" key={p.id}>
            <strong>{p.id} · {p.displayName}</strong>
            <p>{p.problemStatement || '문제 정의 대기'}</p>
            <small>{p.outputCandidate || '결과물 후보 미정'}</small>
          </article>
        ))}
      </div>
    </section>
  );
}
