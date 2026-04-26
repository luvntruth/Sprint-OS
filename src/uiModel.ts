import type { AppState, Participant, Stage, Ticket } from './types';
import { nextActionableItem, overallProgress } from './lib/checklists';

export const stageOrder: Stage[] = ['prep', 'week1', 'week2', 'week3', 'wrapup'];

export const stageMeta: Record<Stage, { label: string; shortLabel: string; purpose: string; outcome: string }> = {
  prep: {
    label: '0. 시작 전 준비',
    shortLabel: '준비',
    purpose: '참가자 정보와 운영 환경을 준비합니다.',
    outcome: '설문, 링크, 참가자 카드, 첫 모임 진행안이 준비된 상태',
  },
  week1: {
    label: '1주차. 문제 정의',
    shortLabel: '문제 정의',
    purpose: '각자의 현업 문제를 한 문장과 작은 프로젝트 후보로 바꿉니다.',
    outcome: 'Problem Statement, v0.1 결과물 후보, 성공 기준',
  },
  week2: {
    label: '2주차. v0.1 제작',
    shortLabel: '제작',
    purpose: 'AI와 함께 현장에서 한 번 써볼 수 있는 결과물 초안을 만듭니다.',
    outcome: '프롬프트, 체크리스트, 대화 스크립트, 문서 템플릿 등 v0.1 산출물',
  },
  week3: {
    label: '3주차. 현업 테스트',
    shortLabel: '테스트/회고',
    purpose: 'v0.1을 실제 맥락에서 한 번 사용하고 배운 점을 회고합니다.',
    outcome: '현업 테스트 기록, Before/After Case Note, 회고',
  },
  wrapup: {
    label: '마무리. 방법론화',
    shortLabel: '방법론화',
    purpose: '1기 경험을 Humanistic 방법론과 다음 기수 운영 자산으로 전환합니다.',
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
  return 'Before/After Case Note와 배운 점을 정리합니다.';
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
