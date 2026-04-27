import type { AppState, ChecklistState, Participant, WeekKey } from '../types';
import { getParticipantNextAction, getParticipantStatus } from '../uiModel';
import { OursProgress, PhasePill } from './OursProgress';
import { currentPhase, nextActionableItem } from '../lib/checklists';

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

interface Props {
  state: AppState;
  setState: (state: AppState) => void;
  readOnly?: boolean;
}

export function ParticipantRoom({ state, setState, readOnly = false }: Props) {
  const update = (id: string, patch: Partial<Participant>) => {
    if (readOnly) return;
    setState({
      ...state,
      participants: state.participants.map((p) => (p.id === id ? { ...p, ...patch } : p)),
    });
  };

  const toggleCheck = (participant: Participant, itemId: string) => {
    const next: ChecklistState = { ...(participant.checklist ?? {}) };
    if (next[itemId]) delete next[itemId];
    else next[itemId] = true;
    update(participant.id, { checklist: next });
  };

  const updateWeekly = (participant: Participant, week: WeekKey, value: string) => {
    update(participant.id, {
      weeklyReflection: { ...(participant.weeklyReflection ?? {}), [week]: value },
    });
  };

  const currentWeek = deriveCurrentWeek(state.sprint.currentStage);

  return (
    <section className="panel participant-room clean-room">
      <div className="screen-heading">
        <div>
          <p className="eyebrow">참가자 진행</p>
          <h1>{readOnly ? '우리 카드' : '우리 카드 편집'}</h1>
          <p>
            각 참가자가 다룰 문제, 만들 결과물, 다음 액션을 한 장씩 확인합니다.
            민감한 회사명/개인명은 적지 않고 필요한 내용만 간단히 공유합니다.
          </p>
        </div>
        <span className="screen-mode-pill">{readOnly ? '보기 전용' : '운영자 편집 가능'}</span>
      </div>

      <div className="notice room-notice">
        <strong>이 화면에서 확인할 것</strong>
        <ul>
          <li>내 문제는 무엇인가?</li>
          <li>3주 안에 만들거나 써볼 결과물은 무엇인가?</li>
          <li>다음 모임 전 해볼 작은 행동은 무엇인가?</li>
        </ul>
      </div>

      <div className="participant-progress-grid public-cards">
        {state.participants.filter((participant) => !readOnly || participant.id !== 'P-0').map((p) => {
          const checklist = p.checklist ?? {};
          const here = currentPhase(checklist);
          const nextItem = nextActionableItem(checklist);
          return (
            <article className="participant-progress-card public-card" key={p.id}>
              <div className="participant-line">
                <span className="badge">{p.id}</span>
                <div>
                  {readOnly ? (
                    <strong>{p.displayName}</strong>
                  ) : (
                    <input
                      value={p.displayName}
                      onChange={(e) => update(p.id, { displayName: e.target.value })}
                      aria-label={`${p.id} 이름`}
                    />
                  )}
                  <small>{p.role || '역할/맥락 미입력'}</small>
                </div>
                <PhasePill phase={here} />
                <em>{getParticipantStatus(p)}</em>
              </div>

              <OursProgress checklist={checklist} variant="compact" />

              {nextItem ? (
                <p className="next-check-hint">
                  <span className="label">다음 체크</span>
                  <strong>{nextItem.label}</strong>
                  {nextItem.helper ? <small>{nextItem.helper}</small> : null}
                </p>
              ) : (
                <p className="next-check-hint done">
                  <strong>OURS 4단계 모두 완료 — 회고와 케이스 정리만 남았습니다.</strong>
                </p>
              )}

              {readOnly ? (
                <>
                  <dl className="participant-public-fields">
                    <div><dt>현재 OURS 단계</dt><dd><PhasePill phase={here} /></dd></div>
                    <div><dt>문제</dt><dd>{p.problemStatement || '첫 모임에서 함께 정리합니다.'}</dd></div>
                    <div><dt>만들 결과물</dt><dd>{p.outputCandidate || '아직 정하지 않았습니다.'}</dd></div>
                    <div><dt>다음 액션</dt><dd>{getParticipantNextAction(p)}</dd></div>
                  </dl>
                  {WEEK_ORDER.filter((w) => (p.weeklyReflection ?? {})[w]).length > 0 ? (
                    <div className="weekly-reflections">
                      <span className="block-label">주차별 한 줄 회고</span>
                      <ul>
                        {WEEK_ORDER.filter((w) => (p.weeklyReflection ?? {})[w]).map((w) => (
                          <li key={w}>
                            <em>{WEEK_LABELS[w]}</em>
                            <span>{(p.weeklyReflection ?? {})[w]}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                </>
              ) : (
                <>
                  <div className="room-edit-grid">
                    <label>역할 / 맥락<input value={p.role} onChange={(e) => update(p.id, { role: e.target.value })} /></label>
                    <label>내가 다룰 문제 한 문장<textarea value={p.problemStatement} onChange={(e) => update(p.id, { problemStatement: e.target.value })} placeholder="나는 [상황]에서 [반복되는 문제]를 겪고 있다." /></label>
                    <label>3주 후 만들고 싶은 결과물<textarea value={p.outputCandidate} onChange={(e) => update(p.id, { outputCandidate: e.target.value })} placeholder="프롬프트, 체크리스트, 챗봇, 문서 템플릿 등" /></label>
                    <label>현재 진행상황<textarea value={p.currentProgress} onChange={(e) => update(p.id, { currentProgress: e.target.value })} placeholder="예: 문제 후보 작성 완료 / 결과물 범위 줄이는 중" /></label>
                    <label>다음 액션<textarea value={p.nextAction} onChange={(e) => update(p.id, { nextAction: e.target.value })} placeholder="예: 첫 모임 전 문제 상황 예시 2개 정리" /></label>
                    <label>참가자 업데이트 / 메모<textarea value={p.participantUpdate} onChange={(e) => update(p.id, { participantUpdate: e.target.value })} placeholder="참가자가 직접 남기는 짧은 업데이트" /></label>
                  </div>

                  {nextItem ? (
                    <div className="quick-check-row">
                      <button
                        type="button"
                        className="subtle"
                        onClick={() => toggleCheck(p, nextItem.id)}
                      >
                        ✓ "{nextItem.label}" 체크하기
                      </button>
                      <small>운영자가 참가자와 대화하며 함께 체크합니다. 상세 체크는 프로젝트 랩에서.</small>
                    </div>
                  ) : null}

                  {currentWeek ? (
                    <label className="weekly-input">
                      <span className="block-label">{WEEK_LABELS[currentWeek]} 한 줄 회고</span>
                      <input
                        value={(p.weeklyReflection ?? {})[currentWeek] ?? ''}
                        onChange={(e) => updateWeekly(p, currentWeek, e.target.value)}
                        placeholder="이번 주 한 줄 — 무엇이 도움됐고 무엇이 막혔는지"
                      />
                    </label>
                  ) : (
                    <small className="muted-em">현재 단계는 회고 주차가 아닙니다 (prep). 1주차부터 입력 가능합니다.</small>
                  )}
                </>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}
