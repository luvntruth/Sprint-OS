import type { AppState, ChecklistState, OursPhase, Participant, ProjectLifecycle } from '../types';
import {
  OURS_CHECKLIST,
  OURS_PHASES,
  checklistByPhase,
  currentPhase,
  isChecked,
  phaseProgress,
} from '../lib/checklists';
import { OursProgress, PhasePill } from './OursProgress';

interface Props {
  state: AppState;
  setState: (state: AppState) => void;
  readOnly?: boolean;
}

const lifecycleByPhase: Record<OursPhase, Array<[keyof ProjectLifecycle, string]>> = {
  O: [
    ['ownProblem', '문제 자기 언어로 정의'],
    ['goalConversation', '목표 설정 대화'],
  ],
  U: [['understandSystem', '시스템 이해 (사람·흐름·정보·도구·대화·목표)']],
  R: [
    ['smallProject', '3주 안 작은 프로젝트'],
    ['strategyConversation', '전략 수립 대화'],
    ['fieldTest', '현업 테스트 기록'],
  ],
  S: [
    ['shareReflectSystemize', '공유·회고·시스템화'],
    ['retrospectiveConversation', '회고 대화'],
    ['caseNote', 'Case Note (Before/Project/Conversation/After/Learning/System)'],
  ],
};

export function ProjectLab({ state, setState, readOnly = false }: Props) {
  const update = (id: string, patch: Partial<Participant>) => {
    if (readOnly) return;
    setState({
      ...state,
      participants: state.participants.map((p) => (p.id === id ? { ...p, ...patch } : p)),
    });
  };

  const updateLifecycle = (participant: Participant, key: keyof ProjectLifecycle, value: string) => {
    update(participant.id, { lifecycle: { ...participant.lifecycle, [key]: value } });
  };

  const toggleCheck = (participant: Participant, itemId: string) => {
    if (readOnly) return;
    const next: ChecklistState = { ...(participant.checklist ?? {}) };
    if (next[itemId]) delete next[itemId];
    else next[itemId] = true;
    update(participant.id, { checklist: next });
  };

  const visibleParticipants = state.participants.filter((p) => !readOnly || p.id !== 'P-0');

  return (
    <section className="panel project-lab">
      <div className="screen-heading">
        <div>
        <p className="eyebrow">OURS 설계</p>
        <h1>{readOnly ? 'OURS 단계, 우리는 어디쯤?' : '프로젝트 설계'}</h1>
        <p>
          {readOnly
            ? '답답함을 작게 다듬어가는 4단계 흐름입니다. 체크는 운영자가 함께 확인하며 채워드립니다.'
            : '체크리스트로 단계별 완료 신호를 남기고, 자유 메모로 맥락을 보강합니다. 참가자와 대화하며 함께 체크합니다.'}
        </p>
        </div>
        <span className="screen-mode-pill">운영 입력</span>
      </div>

      {visibleParticipants.length === 0 ? (
        <div className="empty-state">
          <p>표시할 참가자가 없습니다.</p>
          {!readOnly ? <small>데이터 탭에서 참가자를 추가하세요.</small> : null}
        </div>
      ) : null}

      {visibleParticipants.map((participant) => {
        const checklist = participant.checklist ?? {};
        return (
          <details className="participant project-lab-card" key={participant.id} open={participant.id === 'P-0'}>
            <summary>
              <span className="participant-id">{participant.id} · {participant.displayName}</span>
              <PhasePill phase={currentPhase(checklist)} />
              <span className="lab-progress-mini">
                {Object.values(checklist).filter(Boolean).length}/{OURS_CHECKLIST.length}
              </span>
            </summary>

            <OursProgress checklist={checklist} variant="detailed" />

            {OURS_PHASES.map(({ phase, label, tagline }) => {
              const items = checklistByPhase(phase);
              const { done, total, ratio } = phaseProgress(checklist, phase);
              const memos = lifecycleByPhase[phase];
              return (
                <section key={phase} className={`phase-block phase-block-${phase.toLowerCase()}`}>
                  <header className="phase-block-head">
                    <div>
                      <strong>{phase} — {label}</strong>
                      <small>{tagline}</small>
                    </div>
                    <span className="phase-block-count">
                      {done}/{total} · {Math.round(ratio * 100)}%
                    </span>
                  </header>

                  <ul className="phase-checklist">
                    {items.map((item) => (
                      <li key={item.id}>
                        <label>
                          <input
                            type="checkbox"
                            checked={isChecked(checklist, item.id)}
                            onChange={() => toggleCheck(participant, item.id)}
                            disabled={readOnly}
                          />
                          <span>
                            <strong>{item.label}</strong>
                            {item.helper ? <small>{item.helper}</small> : null}
                          </span>
                        </label>
                      </li>
                    ))}
                  </ul>

                  <div className="phase-memos">
                    {memos.map(([key, memoLabel]) => (
                      <label key={key} className="wide">
                        {memoLabel}
                        {readOnly ? (
                          <p className="readonly-memo">
                            {participant.lifecycle[key] || <em className="muted-em">아직 비어 있어요</em>}
                          </p>
                        ) : (
                          <textarea
                            value={participant.lifecycle[key]}
                            onChange={(event) => updateLifecycle(participant, key, event.target.value)}
                          />
                        )}
                      </label>
                    ))}
                  </div>
                </section>
              );
            })}
          </details>
        );
      })}
    </section>
  );
}
