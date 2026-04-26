import { useState } from 'react';
import type { AppState, FacilitatorNote, Participant } from '../types';
import { OursProgress, PhasePill } from './OursProgress';
import { currentPhase, nextActionableItem } from '../lib/checklists';
import { generateNextTicketPrompt, generateSurveyAnalysisPrompt } from '../prompts';

interface Props {
  state: AppState;
  setState: (state: AppState) => void;
}

const FACILITATOR_FIELDS: Array<[keyof FacilitatorNote, string, string]> = [
  ['diagnosis', '진단', '내가 들은 핵심 / 표면 vs 진짜 문제'],
  ['followUpQuestions', '후속 질문', '다음 1on1 또는 모임에서 물어볼 질문'],
  ['scopeReduction', '범위 축소 제안', '"이번엔 안 한다"로 정리해 줄 부분'],
  ['missedQuestions', '놓친 질문', '오늘 못 물어본 것 — 다음에 시도'],
  ['interventionLog', '개입 로그', '내가 한 개입과 그 효과 기록'],
];

function pickFirstParticipantId(participants: Participant[]): string {
  const candidate = participants.find((p) => p.id !== 'P-0');
  return (candidate ?? participants[0])?.id ?? '';
}

export function OneOnOne({ state, setState }: Props) {
  const [activeId, setActiveId] = useState<string>(() => pickFirstParticipantId(state.participants));
  const [copied, setCopied] = useState<string | null>(null);

  const active = state.participants.find((p) => p.id === activeId) ?? state.participants[0];

  if (!active) {
    return (
      <section className="panel">
        <div className="empty-state">
          <p>참가자가 없습니다.</p>
          <small>원본 데이터 탭에서 참가자를 추가하세요.</small>
        </div>
      </section>
    );
  }

  const update = (patch: Partial<Participant>) => {
    setState({
      ...state,
      participants: state.participants.map((p) => (p.id === active.id ? { ...p, ...patch } : p)),
    });
  };

  const updateNote = (key: keyof FacilitatorNote, value: string) => {
    update({ facilitatorNote: { ...active.facilitatorNote, [key]: value } });
  };

  const copyPrompt = async (label: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(label);
      window.setTimeout(() => setCopied(null), 2000);
    } catch {
      setCopied('복사 실패');
    }
  };

  const checklist = active.checklist ?? {};
  const here = currentPhase(checklist);
  const next = nextActionableItem(checklist);

  return (
    <section className="panel one-on-one">
      <div className="hero-card soft">
        <p className="eyebrow">1on1 통합 노트</p>
        <h1>한 참가자, 한 화면</h1>
        <p>운영실·회고·원본 데이터·분석 프롬프트를 한 화면에서 채웁니다. 모든 데이터는 같은 참가자 카드에 저장됩니다.</p>
      </div>

      <div className="participant-picker" role="tablist" aria-label="참가자 선택">
        {state.participants.map((p) => (
          <button
            key={p.id}
            type="button"
            role="tab"
            aria-selected={p.id === active.id}
            className={p.id === active.id ? 'pill active' : 'pill'}
            onClick={() => setActiveId(p.id)}
          >
            <strong>{p.id}</strong>
            <span>{p.displayName || '이름 미정'}</span>
          </button>
        ))}
      </div>

      <div className="oneonone-grid">
        <article className="panel sub-panel">
          <header className="section-head clean-head">
            <div>
              <p className="eyebrow">Participant</p>
              <h2>참가자 한눈에</h2>
            </div>
            <PhasePill phase={here} />
          </header>

          <OursProgress checklist={checklist} variant="detailed" />

          {next ? (
            <p className="next-check-hint">
              <span className="label">다음 체크</span>
              <strong>{next.label}</strong>
              {next.helper ? <small>{next.helper}</small> : null}
            </p>
          ) : (
            <p className="next-check-hint done">
              <strong>OURS 4단계 완료 — 회고와 케이스 정리만 남음</strong>
            </p>
          )}

          <div className="quick-edit-grid">
            <label>
              이름
              <input value={active.displayName} onChange={(e) => update({ displayName: e.target.value })} />
            </label>
            <label>
              역할 / 맥락
              <input value={active.role} onChange={(e) => update({ role: e.target.value })} />
            </label>
            <label className="wide">
              답답한 상황 한 문장
              <textarea
                value={active.problemStatement}
                onChange={(e) => update({ problemStatement: e.target.value })}
                placeholder="나는 [상황]에서 [이게 반복돼서] 답답하다."
              />
            </label>
            <label className="wide">
              3주 안 결과물 후보
              <textarea
                value={active.outputCandidate}
                onChange={(e) => update({ outputCandidate: e.target.value })}
              />
            </label>
            <label className="wide">
              이번 주 다음 행동
              <textarea
                value={active.nextAction}
                onChange={(e) => update({ nextAction: e.target.value })}
              />
            </label>
          </div>
        </article>

        <article className="panel sub-panel">
          <header className="section-head clean-head">
            <div>
              <p className="eyebrow">Facilitator Note</p>
              <h2>운영자 진단·개입</h2>
            </div>
            <small className="muted-em">참가자에게는 보이지 않습니다</small>
          </header>

          <div className="facilitator-fields">
            {FACILITATOR_FIELDS.map(([key, label, helper]) => (
              <label key={key} className="wide">
                <span className="field-label">
                  <strong>{label}</strong>
                  <small>{helper}</small>
                </span>
                <textarea
                  value={active.facilitatorNote[key]}
                  onChange={(e) => updateNote(key, e.target.value)}
                />
              </label>
            ))}
          </div>

          <div className="prompt-actions">
            <button
              type="button"
              className="subtle"
              onClick={() => copyPrompt('설문 분석', generateSurveyAnalysisPrompt(active))}
            >
              📋 설문 분석 프롬프트 복사
            </button>
            <button
              type="button"
              className="subtle"
              onClick={() =>
                copyPrompt(
                  '다음 티켓',
                  generateNextTicketPrompt(
                    state.sprint.currentStage,
                    `참가자: ${active.displayName} (${active.id})\n` +
                      `역할: ${active.role}\n` +
                      `답답함: ${active.problemStatement}\n` +
                      `결과물 후보: ${active.outputCandidate}\n` +
                      `진단: ${active.facilitatorNote.diagnosis}\n` +
                      `후속질문: ${active.facilitatorNote.followUpQuestions}`,
                  ),
                )
              }
            >
              📋 다음 티켓 프롬프트 복사
            </button>
            {copied ? <small className="copied-flash">✓ "{copied}" 복사됨</small> : null}
          </div>
        </article>
      </div>
    </section>
  );
}
