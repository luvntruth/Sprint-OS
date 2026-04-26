import type { ChecklistItem, ChecklistState, OursPhase, Participant } from '../types';

export const OURS_PHASES: Array<{ phase: OursPhase; label: string; tagline: string }> = [
  { phase: 'O', label: 'Own the Problem', tagline: '내 언어로 문제를 소유한다' },
  { phase: 'U', label: 'Understand the System', tagline: '문제를 만든 시스템을 이해한다' },
  { phase: 'R', label: 'Run a Small Project', tagline: '3주 안에 작게 실험한다' },
  { phase: 'S', label: 'Share, Reflect, Systemize', tagline: '공유·회고하고 시스템화한다' },
];

export const OURS_CHECKLIST: ChecklistItem[] = [
  { id: 'o-1', phase: 'O', label: '문제를 한 문장으로 정의했다', helper: '"나는 [상황]에서 [반복되는 문제]를 겪고 있다."' },
  { id: 'o-2', phase: 'O', label: '이 문제가 누구의 문제인지 적었다', helper: '내 문제인지, 동료/조직의 문제인지' },
  { id: 'o-3', phase: 'O', label: '왜 지금 이 문제를 다루는지 적었다', helper: '시급성·중요성 1줄' },
  { id: 'o-4', phase: 'O', label: '성공 기준 1줄을 적었다', helper: '3주 후 무엇이 달라지면 충분한가' },

  { id: 'u-1', phase: 'U', label: '관련된 사람을 적었다', helper: '이해관계자, 영향 받는 사람' },
  { id: 'u-2', phase: 'U', label: '문제가 발생하는 흐름/맥락을 적었다', helper: '언제, 어디서, 어떤 트리거로' },
  { id: 'u-3', phase: 'U', label: '관련 정보·도구·대화를 적었다', helper: '쓰는 도구, 오가는 대화' },
  { id: 'u-4', phase: 'U', label: 'AI 적용 가능 지점을 1개 이상 적었다', helper: '어디에 AI를 끼워넣을 것인가' },

  { id: 'r-1', phase: 'R', label: '3주 안에 만들 결과물 후보 1개를 정했다', helper: '문서/체크리스트/프롬프트/스크립트 등' },
  { id: 'r-2', phase: 'R', label: '범위를 줄이는 결정을 1번 이상 했다', helper: '"이번엔 안 한다"를 명시' },
  { id: 'r-3', phase: 'R', label: 'AI를 실행 파트너로 사용한 기록이 있다', helper: '대화 로그·프롬프트' },
  { id: 'r-4', phase: 'R', label: '현업에서 한 번 써본 기록을 남겼다', helper: '실제 맥락에서 1회 사용' },

  { id: 's-1', phase: 'S', label: 'Before/After 비교를 적었다', helper: '시작 전과 지금이 어떻게 다른가' },
  { id: 's-2', phase: 'S', label: '회고 대화를 1회 이상 진행했다', helper: '운영자 또는 동료와' },
  { id: 's-3', phase: 'S', label: '다음에 반복할 패턴을 1개 이상 정리했다', helper: '효과적이었던 질문/방법' },
  { id: 's-4', phase: 'S', label: 'Case Note를 작성했다', helper: 'Before/Project/Conversation/After/Learning/System' },
];

export const TOTAL_CHECKLIST_COUNT = OURS_CHECKLIST.length;

export function emptyChecklistState(): ChecklistState {
  return {};
}

export function isChecked(state: ChecklistState, itemId: string): boolean {
  return Boolean(state[itemId]);
}

export function checklistByPhase(phase: OursPhase): ChecklistItem[] {
  return OURS_CHECKLIST.filter((item) => item.phase === phase);
}

export function phaseProgress(state: ChecklistState, phase: OursPhase): { done: number; total: number; ratio: number } {
  const items = checklistByPhase(phase);
  const done = items.reduce((acc, item) => acc + (isChecked(state, item.id) ? 1 : 0), 0);
  const total = items.length;
  return { done, total, ratio: total === 0 ? 0 : done / total };
}

export function overallProgress(state: ChecklistState): { done: number; total: number; ratio: number } {
  const done = OURS_CHECKLIST.reduce((acc, item) => acc + (isChecked(state, item.id) ? 1 : 0), 0);
  const total = OURS_CHECKLIST.length;
  return { done, total, ratio: total === 0 ? 0 : done / total };
}

export function currentPhase(state: ChecklistState): OursPhase {
  for (const { phase } of OURS_PHASES) {
    const { ratio } = phaseProgress(state, phase);
    if (ratio < 1) return phase;
  }
  return 'S';
}

export function isPhaseComplete(state: ChecklistState, phase: OursPhase): boolean {
  return phaseProgress(state, phase).ratio === 1;
}

export function nextActionableItem(state: ChecklistState): ChecklistItem | null {
  for (const item of OURS_CHECKLIST) {
    if (!isChecked(state, item.id)) return item;
  }
  return null;
}

export function ensureChecklistShape(participant: Participant): Participant {
  if (participant.checklist && typeof participant.checklist === 'object') return participant;
  return { ...participant, checklist: emptyChecklistState() };
}
