import type { AppState, Participant, Stage, Ticket } from './types';
import { nextActionableItem, overallProgress } from './lib/checklists';

export const stageOrder: Stage[] = ['prep', 'week1', 'week2', 'week3', 'wrapup'];

export const stageMeta: Record<Stage, { label: string; shortLabel: string; purpose: string; outcome: string }> = {
  prep: {
    label: '0. 시작 전 준비',
    shortLabel: '준비',
    purpose: '참가자 정보와 운영 환경을 가볍게 준비합니다.',
    outcome: '설문, 링크, 참가자 카드, 첫 모임 진행안이 준비된 상태',
  },
  week1: {
    label: '1주차. 답답함 정리',
    shortLabel: '답답함 정리',
    purpose: '각자의 답답한 상황을 한 문장과 작게 만들어볼 결과물 후보로 다듬습니다.',
    outcome: '답답함 한 문장, 작게 만들 결과물 후보, 충분함의 기준',
  },
  week2: {
    label: '2주차. 작게 만들어보기',
    shortLabel: '만들어보기',
    purpose: 'AI와 함께 현업에서 한 번 돌려볼 수 있는 작은 결과물을 만듭니다.',
    outcome: '프롬프트, 체크리스트, 대화 스크립트, 문서 템플릿 등 첫 결과물',
  },
  week3: {
    label: '3주차. 한 번 돌려보기',
    shortLabel: '돌려보기',
    purpose: '만든 결과물을 실제 상황에서 한 번 써보고 함께 회고합니다.',
    outcome: '현업에서 한 번 돌려본 기록, Before/After 케이스, 회고',
  },
  wrapup: {
    label: '마무리. 함께 정리',
    shortLabel: '정리',
    purpose: '1기 경험을 다음 코호트와 Humanistic 방법론 자산으로 옮깁니다.',
    outcome: 'OURS Method 업데이트, 1기 실천 기록, 2기/컨설팅 판단',
  },
};

export function getStageIndex(stage: Stage) {
  return stageOrder.indexOf(stage);
}

export function getStageProgressPercent(tickets: Ticket[]) {
  if (tickets.length === 0) return 0;
  const done = tickets.filter((ticket) => ticket.status === 'done').length;
  return Math.round((done / tickets.length) * 100);
}

export function getTicketsByStage(tickets: Ticket[], stage: Stage) {
  return tickets.filter((ticket) => ticket.stage === stage);
}

export function getTicketCounts(tickets: Ticket[]) {
  const done = tickets.filter((ticket) => ticket.status === 'done').length;
  const doing = tickets.filter((ticket) => ticket.status === 'doing').length;
  const blocked = tickets.filter((ticket) => ticket.status === 'blocked').length;
  const todo = tickets.filter((ticket) => ticket.status === 'todo').length;
  return { total: tickets.length, done, doing, blocked, todo, open: tickets.length - done };
}

export function getStageCompletion(tickets: Ticket[], stage: Stage) {
  const stageTickets = getTicketsByStage(tickets, stage);
  const done = stageTickets.filter((ticket) => ticket.status === 'done').length;
  return {
    total: stageTickets.length,
    done,
    percent: stageTickets.length === 0 ? 0 : Math.round((done / stageTickets.length) * 100),
  };
}

export function getNextTicket(tickets: Ticket[], stage: Stage) {
  const priorityWeight: Record<Ticket['priority'], number> = { high: 0, medium: 1, low: 2 };
  return getTicketsByStage(tickets, stage)
    .filter((ticket) => ticket.status !== 'done')
    .sort((a, b) => priorityWeight[a.priority] - priorityWeight[b.priority])[0];
}

export function getParticipantStatus(participant: Participant) {
  const checklist = participant.checklist ?? {};
  const { done, total, ratio } = overallProgress(checklist);
  if (ratio === 1) return '완료';
  if (done === 0 && !participant.problemStatement) return '대기';
  return `진행 중 ${done}/${total}`;
}

export function getParticipantNextAction(participant: Participant) {
  if (participant.nextAction) return participant.nextAction;
  const next = nextActionableItem(participant.checklist ?? {});
  if (next) return `OURS ${next.phase}: ${next.label}`;
  return '한 장 케이스 노트와 배운 점을 정리합니다.';
}

export function getPublicSummary(state: AppState) {
  const stage = state.sprint.currentStage;
  const stageTickets = getTicketsByStage(state.tickets, stage);
  const completion = getStageCompletion(state.tickets, stage);
  const nextTicket = getNextTicket(state.tickets, stage);
  return {
    stage,
    stageMeta: stageMeta[stage],
    stageTickets,
    completion,
    nextTicket,
    progressPercent: getStageProgressPercent(state.tickets),
  };
}
