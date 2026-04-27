import { useState } from 'react';
import type {
  AppState,
  ChecklistState,
  FacilitatorNote,
  OursPhase,
  Participant,
  ParticipantBlocker,
  ProjectLifecycle,
  WeekKey,
} from '../types';
import { OursProgress, PhasePill } from './OursProgress';
import {
  OURS_CHECKLIST,
  OURS_PHASES,
  checklistByPhase,
  currentPhase,
  isChecked,
  nextActionableItem,
  phaseProgress,
} from '../lib/checklists';
import { generateNextTicketPrompt, generateSurveyAnalysisPrompt } from '../prompts';

interface Props {
  state: AppState;
  setState: (state: AppState) => void;
  initialParticipantId?: string;
}

const FACILITATOR_FIELDS: Array<[keyof FacilitatorNote, string, string]> = [
  ['diagnosis', '진단', '내가 들은 핵심 / 표면 vs 진짜 문제'],
  ['followUpQuestions', '후속 질문', '다음 1on1 또는 모임에서 물어볼 질문'],
  ['scopeReduction', '범위 축소 제안', '"이번엔 안 한다"로 정리해 줄 부분'],
  ['missedQuestions', '놓친 질문', '오늘 못 물어본 것 — 다음에 시도'],
  ['interventionLog', '개입 로그', '내가 한 개입과 그 효과 기록'],
];

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

const WEEK_LABELS: Record<WeekKey, string> = {
  week1: '1주차',
  week2: '2주차',
  week3: '3주차',
  wrapup: '마무리',
};
const WEEK_ORDER: WeekKey[] = ['week1', 'week2', 'week3', 'wrapup'];

function deriveCurrentWeek(stage: string): WeekKey | null {
  return (WEEK_ORDER as string[]).includes(stage) ? (stage as WeekKey) : null;
}

function pickFirstParticipantId(participants: Participant[]): string {
  const candidate = participants.find((p) => p.id !== 'P-0');
  return (candidate ?? participants[0])?.id ?? '';
}

export function OneOnOne({ state, setState, initialParticipantId }: Props) {
  const [activeId, setActiveId] = useState<string>(
    () => initialParticipantId ?? pickFirstParticipantId(state.participants),
  );
  const [prevInitialId, setPrevInitialId] = useState<string | undefined>(initialParticipantId);
  const [copied, setCopied] = useState<string | null>(null);

  // Sync activeId when parent passes a new initialParticipantId (derived state pattern,
  // see https://react.dev/reference/react/useState#storing-information-from-previous-renders)
  if (initialParticipantId !== prevInitialId) {
    setPrevInitialId(initialParticipantId);
    if (initialParticipantId) {
      setActiveId(initialParticipantId);
    }
  }

  const active = state.participants.find((p) => p.id === activeId) ?? state.participants[0];
  if (!active) {
    return (
      <section className="panel">
        <div className="empty-state">
          <p>참가자가 없습니다.</p>
          <small>데이터 입력 탭에서 참가자를 추가하세요.</small>
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

  const updateLifecycle = (key: keyof ProjectLifecycle, value: string) => {
    update({ lifecycle: { ...active.lifecycle, [key]: value } });
  };

  const toggleCheck = (itemId: string) => {
    const next: ChecklistState = { ...(active.checklist ?? {}) };
    if (next[itemId]) delete next[itemId];
    else next[itemId] = true;
    update({ checklist: next });
  };

  const updateWeekly = (week: WeekKey, value: string) => {
    update({ weeklyReflection: { ...(active.weeklyReflection ?? {}), [week]: value } });
  };

  const setBlocker = (next: ParticipantBlocker | null) => {
    update({ blocker: next });
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
  const currentWeek = deriveCurrentWeek(state.sprint.currentStage);
  const totalChecked = Object.values(checklist).filter(Boolean).length;
  const blockerActive = Boolean(active.blocker);

  return (
    <section className="panel one-on-one">
      <div className="screen-heading">
        <div>
          <p className="eyebrow">1:1 워크북</p>
          <h1>한 참가자, 한 화면에서 전부</h1>
          <p>OURS 체크 · 운영자 메모 · AI 분석 · 막힘 진단을 한 곳에서 작성합니다.</p>
        </div>
        <button
          type="button"
          className={blockerActive ? 'blocker-toggle on' : 'blocker-toggle'}
          onClick={() => setBlocker(blockerActive ? null : { reason: '막힘 발생', openedAt: new Date().toISOString() })}
          aria-pressed={blockerActive}
        >
          {blockerActive ? '● 막힘 표시 중 — 클릭해 해제' : '○ 막힘으로 표시'}
        </button>
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
            {p.blocker ? <span className="dist-blocker-dot" aria-label="막힘" /> : null}
          </button>
        ))}
      </div>

      {blockerActive ? (
        <div className="blocker-banner" role="status">
          <strong>● 이 참가자는 현재 막혀 있어요</strong>
          <input
            value={active.blocker?.reason ?? ''}
            onChange={(e) =>
              setBlocker({ reason: e.target.value, openedAt: active.blocker?.openedAt ?? new Date().toISOString() })
            }
            placeholder="막힌 이유 한 줄"
            aria-label="막힌 이유"
          />
          <small>발생: {(active.blocker?.openedAt ?? '').slice(0, 10) || '—'}</small>
        </div>
      ) : null}

      <div className="oneonone-grid">
        <article className="panel sub-panel">
          <header className="section-head clean-head">
            <div>
              <p className="eyebrow">참가자 요약</p>
              <h2>지금 어디?</h2>
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

          <div className="weekly-reflections-block">
            <span className="block-label">주차별 한 줄 회고</span>
            {currentWeek ? (
              <label className="weekly-input">
                <small>{WEEK_LABELS[currentWeek]} (현재)</small>
                <input
                  value={(active.weeklyReflection ?? {})[currentWeek] ?? ''}
                  onChange={(e) => updateWeekly(currentWeek, e.target.value)}
                  placeholder="이번 주 한 줄 — 무엇이 도움됐고 무엇이 막혔는지"
                />
              </label>
            ) : (
              <small className="muted-em">현재 단계는 회고 주차가 아닙니다 (prep).</small>
            )}
            {WEEK_ORDER.filter((w) => w !== currentWeek && (active.weeklyReflection ?? {})[w]).length > 0 ? (
              <ul className="weekly-history">
                {WEEK_ORDER.filter((w) => w !== currentWeek && (active.weeklyReflection ?? {})[w]).map((w) => (
                  <li key={w}>
                    <em>{WEEK_LABELS[w]}</em>
                    <span>{(active.weeklyReflection ?? {})[w]}</span>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </article>

        <article className="panel sub-panel">
          <details open className="workbook-section">
            <summary>
              <strong>OURS 체크리스트</strong>
              <span className="lab-progress-mini">{totalChecked}/{OURS_CHECKLIST.length}</span>
            </summary>
            {OURS_PHASES.map(({ phase, label, tagline }) => {
              const items = checklistByPhase(phase);
              const { done, total, ratio } = phaseProgress(checklist, phase);
              return (
                <section key={phase} className={`phase-block phase-block-${phase.toLowerCase()}`}>
                  <header className="phase-block-head">
                    <div>
                      <strong>{phase} — {label}</strong>
                      <small>{tagline}</small>
                    </div>
                    <span className="phase-block-count">{done}/{total} · {Math.round(ratio * 100)}%</span>
                  </header>
                  <ul className="phase-checklist">
                    {items.map((item) => (
                      <li key={item.id}>
                        <label>
                          <input type="checkbox" checked={isChecked(checklist, item.id)} onChange={() => toggleCheck(item.id)} />
                          <span>
                            <strong>{item.label}</strong>
                            {item.helper ? <small>{item.helper}</small> : null}
                          </span>
                        </label>
                      </li>
                    ))}
                  </ul>
                </section>
              );
            })}
          </details>

          <details className="workbook-section">
            <summary><strong>단계별 자유 메모</strong><span className="muted-em">9 필드</span></summary>
            {OURS_PHASES.map(({ phase, label }) => (
              <section key={phase} className={`phase-block phase-block-${phase.toLowerCase()}`}>
                <header className="phase-block-head">
                  <div><strong>{phase} — {label}</strong></div>
                </header>
                <div className="phase-memos">
                  {lifecycleByPhase[phase].map(([key, memoLabel]) => (
                    <label key={key} className="wide">
                      {memoLabel}
                      <textarea value={active.lifecycle[key]} onChange={(e) => updateLifecycle(key, e.target.value)} />
                    </label>
                  ))}
                </div>
              </section>
            ))}
          </details>

          <details open className="workbook-section">
            <summary><strong>운영자 메모 (비공개)</strong></summary>
            <div className="facilitator-fields">
              {FACILITATOR_FIELDS.map(([key, label, helper]) => (
                <label key={key} className="wide">
                  <span className="field-label">
                    <strong>{label}</strong>
                    <small>{helper}</small>
                  </span>
                  <textarea value={active.facilitatorNote[key]} onChange={(e) => updateNote(key, e.target.value)} />
                </label>
              ))}
            </div>
          </details>

          <details className="workbook-section">
            <summary><strong>AI 분석 도우미</strong></summary>
            <div className="prompt-actions">
              <button type="button" className="subtle" onClick={() => copyPrompt('설문 분석', generateSurveyAnalysisPrompt(active))}>
                설문 분석 프롬프트 복사
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
                다음 티켓 프롬프트 복사
              </button>
              {copied ? <small className="copied-flash">✓ "{copied}" 복사됨</small> : null}
            </div>
            <label className="wide">
              <span className="field-label">
                <strong>AI 분석 결과 붙여넣기</strong>
                <small>Claude/ChatGPT에서 받은 마크다운을 그대로 붙여넣기</small>
              </span>
              <textarea
                value={active.analysisMarkdown}
                onChange={(e) => update({ analysisMarkdown: e.target.value })}
                rows={10}
                placeholder="AI 분석 결과를 여기에 붙여넣어 보존합니다."
              />
            </label>
          </details>
        </article>
      </div>
    </section>
  );
}
