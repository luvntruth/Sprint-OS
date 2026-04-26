import type { ChecklistItem, ChecklistState, OursPhase, Participant } from '../types';

export const OURS_PHASES: Array<{ phase: OursPhase; label: string; tagline: string }> = [
  { phase: 'O', label: 'Own the Problem', tagline: '내 답답함을 내 언어로 꺼낸다' },
  { phase: 'U', label: 'Understand the System', tagline: '이 답답함이 왜 반복되는지 함께 본다' },
  { phase: 'R', label: 'Run a Small Project', tagline: '3주 안에 작게 만들어본다' },
  { phase: 'S', label: 'Share, Reflect, Systemize', tagline: '돌려보고, 회고하고, 다음에도 쓸 수 있게 정리한다' },
];

export const OURS_CHECKLIST: ChecklistItem[] = [
  { id: 'o-1', phase: 'O', label: '답답한 상황을 한 문장으로 정리했다', helper: '"나는 [상황]에서 [이게 반복돼서] 답답하다."' },
  { id: 'o-2', phase: 'O', label: '이게 누구의 문제인지 함께 확인했다', helper: '나의 일인지, 동료/조직 차원인지' },
  { id: 'o-3', phase: 'O', label: '왜 지금 이걸 다뤄보고 싶은지 적었다', helper: '가벼운 한 줄로 충분합니다' },
  { id: 'o-4', phase: 'O', label: '3주 후 어떤 모습이면 충분한지 적었다', helper: '작은 변화여도 OK' },

  { id: 'u-1', phase: 'U', label: '이 일과 관련된 사람을 적었다', helper: '같이 일하는 사람, 영향받는 사람' },
  { id: 'u-2', phase: 'U', label: '이 답답함이 반복되는 장면·흐름을 적었다', helper: '언제, 어디서 주로 일어나는지' },
  { id: 'u-3', phase: 'U', label: '이 일에 쓰는 도구·문서·대화를 적었다', helper: '무얼로 일하고 어떤 말이 오가는지' },
  { id: 'u-4', phase: 'U', label: 'AI가 도와줄 수 있을 지점을 1개 이상 적었다', helper: '한 부분만이라도 충분합니다' },

  { id: 'r-1', phase: 'R', label: '3주 안에 작게 만들어볼 결과물을 정했다', helper: '프롬프트·체크리스트·스크립트·문서 등' },
  { id: 'r-2', phase: 'R', label: '범위를 한 번 더 줄이는 결정을 했다', helper: '"이번엔 이건 안 한다"를 명시' },
  { id: 'r-3', phase: 'R', label: 'AI와 함께 만들어본 기록이 있다', helper: '대화 로그, 프롬프트, 만든 결과물' },
  { id: 'r-4', phase: 'R', label: '현업에서 한 번 돌려본 기록을 남겼다', helper: '실제 상황에서 1회 사용' },

  { id: 's-1', phase: 'S', label: '시작 전과 지금이 어떻게 다른지 적었다', helper: 'Before / After 한 줄씩' },
  { id: 's-2', phase: 'S', label: '무엇이 도움이 됐고 무엇이 막혔는지 회고했다', helper: '운영자나 동료와 짧게 이야기' },
  { id: 's-3', phase: 'S', label: '다음에 또 써볼 만한 패턴을 1개 정리했다', helper: '효과 있던 질문·방법 1개면 충분' },
  { id: 's-4', phase: 'S', label: '한 장 케이스 노트를 작성했다', helper: '문제 → 과정 → 결과 → 배운 점' },
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
