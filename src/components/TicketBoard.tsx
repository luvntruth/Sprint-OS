import { useState } from 'react';
import type { AppState, Stage, Ticket, TicketStatus } from '../types';
import { getStageCompletion, getTicketCounts, stageMeta, stageOrder } from '../uiModel';

interface Props {
  state: AppState;
  setState: (state: AppState) => void;
  readOnly?: boolean;
}

const statuses: TicketStatus[] = ['todo', 'doing', 'blocked', 'done'];
const statusLabel: Record<TicketStatus, string> = {
  todo: '해야 함',
  doing: '진행 중',
  blocked: '막힘',
  done: '완료',
};
const ownerLabel: Record<Ticket['owner'], string> = {
  operator: '문턱장',
  participant: '교육생',
  ai: 'AI/로키',
};

export function TicketBoard({ state, setState, readOnly = false }: Props) {
  const [stage, setStage] = useState<Stage>(state.sprint.currentStage);
  const [title, setTitle] = useState('');
  const getVisibleTickets = (targetStage: Stage) => {
    const stageTickets = state.tickets.filter((ticket) => ticket.stage === targetStage);
    return readOnly ? stageTickets.filter((ticket) => ticket.owner === 'participant') : stageTickets;
  };
  const visibleTickets = getVisibleTickets(stage);
  const publicFallbackTicket: Ticket = {
    id: 'public-fallback-action',
    sprintId: state.sprint.id,
    stage,
    title: stage === 'prep' ? '사전 설문 응답과 문제 상황 예시 준비' : '내 프로젝트 카드의 다음 액션 실행',
    description:
      stage === 'prep'
        ? '첫 모임 전 설문에 답하고, 내가 다루고 싶은 현업 문제 상황 예시 1~2개를 준비합니다.'
        : '교육생 화면에서 내 다음 액션을 확인하고, 다음 모임 전 작게 실행합니다.',
    owner: 'participant',
    status: 'todo',
    priority: 'high',
    generatedBy: 'template',
  };
  const displayTickets = readOnly && visibleTickets.length === 0 ? [publicFallbackTicket] : visibleTickets;
  const counts = getTicketCounts(displayTickets);
  const completion = readOnly
    ? {
        total: displayTickets.length,
        done: displayTickets.filter((ticket) => ticket.status === 'done').length,
      }
    : getStageCompletion(state.tickets, stage);

  const update = (id: string, patch: Partial<Ticket>) => {
    if (readOnly) return;
    setState({ ...state, tickets: state.tickets.map((ticket) => (ticket.id === id ? { ...ticket, ...patch } : ticket)) });
  };

  const add = () => {
    if (readOnly || !title.trim()) return;
    setState({
      ...state,
      tickets: [
        ...state.tickets,
        {
          id: crypto.randomUUID(),
          sprintId: state.sprint.id,
          stage,
          title: title.trim(),
          description: '',
          owner: 'operator',
          status: 'todo',
          priority: 'medium',
          generatedBy: 'manual',
        },
      ],
    });
    setTitle('');
  };

  return (
    <section className="panel ticket-board-page">
      <div className={readOnly ? 'command-hero public-hero slim-hero' : 'command-hero admin-hero slim-hero'}>
        <div>
          <p className="eyebrow">Execution Board</p>
          <h1>{readOnly ? '이번 단계 할 일' : '운영 티켓 보드'}</h1>
          <p>{readOnly ? '교육생은 지금 단계에서 무엇을 했고 무엇을 해야 하는지만 확인합니다.' : '문턱장은 단계별 티켓을 움직이며 1기 운영을 관리합니다.'}</p>
        </div>
        <div className="hero-now-card">
          <span>{stageMeta[stage].label}</span>
          <strong>{completion.done}/{completion.total} 완료</strong>
          <small>{stageMeta[stage].purpose}</small>
        </div>
      </div>

      <div className="stage-selector-strip">
        {stageOrder.map((item) => {
          const itemCompletion = getStageCompletion(state.tickets, item);
          return (
            <button key={item} className={stage === item ? 'stage-chip active' : 'stage-chip'} onClick={() => setStage(item)}>
              <span>{stageMeta[item].shortLabel}</span>
              <strong>{readOnly ? `${getVisibleTickets(item).length || 1}개` : `${itemCompletion.done}/${itemCompletion.total}`}</strong>
            </button>
          );
        })}
      </div>

      <div className="ticket-summary-row">
        <div><strong>{counts.todo}</strong><span>해야 함</span></div>
        <div><strong>{counts.doing}</strong><span>진행 중</span></div>
        <div><strong>{counts.blocked}</strong><span>막힘</span></div>
        <div><strong>{counts.done}</strong><span>완료</span></div>
      </div>

      {!readOnly && (
        <div className="toolbar refined-toolbar">
          <input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="새 운영 티켓 제목" />
          <button onClick={add}>티켓 추가</button>
        </div>
      )}

      <div className={readOnly ? 'ticket-list read-only-list' : 'ticket-list'}>
        {displayTickets.map((ticket) => (
          <article className={`ticket-row status-${ticket.status}`} key={ticket.id}>
            <div className="ticket-main">
              <div className="ticket-badges">
                <span className={`status-badge status-${ticket.status}`}>{statusLabel[ticket.status]}</span>
                <span className={`priority-dot ${ticket.priority}`}>{ticket.priority}</span>
                <span className="owner-badge">{ownerLabel[ticket.owner]}</span>
              </div>
              {readOnly ? (
                <>
                  <h3>{ticket.title}</h3>
                  <p>{ticket.description}</p>
                </>
              ) : (
                <>
                  <input value={ticket.title} onChange={(event) => update(ticket.id, { title: event.target.value })} />
                  <textarea value={ticket.description} onChange={(event) => update(ticket.id, { description: event.target.value })} />
                </>
              )}
            </div>
            {!readOnly && (
              <div className="ticket-controls">
                <label>상태<select value={ticket.status} onChange={(event) => update(ticket.id, { status: event.target.value as TicketStatus })}>{statuses.map((status) => <option key={status} value={status}>{statusLabel[status]}</option>)}</select></label>
                <label>우선순위<select value={ticket.priority} onChange={(event) => update(ticket.id, { priority: event.target.value as Ticket['priority'] })}><option value="high">high</option><option value="medium">medium</option><option value="low">low</option></select></label>
                <label>담당<select value={ticket.owner} onChange={(event) => update(ticket.id, { owner: event.target.value as Ticket['owner'] })}><option value="operator">문턱장</option><option value="participant">교육생</option><option value="ai">AI/로키</option></select></label>
              </div>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
