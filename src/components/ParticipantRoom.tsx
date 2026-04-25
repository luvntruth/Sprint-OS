import type { AppState, Participant } from '../types';
import { getParticipantNextAction, getParticipantStatus } from '../uiModel';

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

  return (
    <section className="panel participant-room clean-room">
      <div className="command-hero public-hero slim-hero">
        <div>
          <p className="eyebrow">Shared Sprint Room</p>
          <h1>{readOnly ? '교육생 공유 화면' : '공유룸 편집 화면'}</h1>
          <p>
            참가자와 함께 보는 공간입니다. 각자의 문제, 결과물 후보, 현재 상태, 다음 액션만 확인합니다.
            회사명/개인명/민감정보는 적지 않습니다.
          </p>
        </div>
        <div className="hero-now-card">
          <span>공유 원칙</span>
          <strong>{readOnly ? '보기 전용' : '운영자 편집 가능'}</strong>
          <small>1기에서는 화면 공유 중심으로 운영합니다.</small>
        </div>
      </div>

      <div className="notice room-notice">
        <strong>오늘 이 화면에서 확인할 것</strong>
        <ul>
          <li>나는 지금 어떤 문제를 다루고 있는가?</li>
          <li>3주 안에 만들 작은 결과물은 무엇인가?</li>
          <li>다음 모임 전 내가 해야 할 행동 하나는 무엇인가?</li>
        </ul>
      </div>

      <div className="participant-progress-grid public-cards">
        {state.participants.filter((participant) => !readOnly || participant.id !== 'P-0').map((p) => (
          <article className="participant-progress-card public-card" key={p.id}>
            <div className="participant-line">
              <span className="badge">{p.id}</span>
              <div>
                {readOnly ? (
                  <strong>{p.displayName}</strong>
                ) : (
                  <input value={p.displayName} onChange={(e) => update(p.id, { displayName: e.target.value })} aria-label={`${p.id} 이름`} />
                )}
                <small>{p.role || '역할/맥락 미입력'}</small>
              </div>
              <em>{getParticipantStatus(p)}</em>
            </div>

            {readOnly ? (
              <dl>
                <div><dt>문제</dt><dd>{p.problemStatement || '첫 모임에서 함께 정리합니다.'}</dd></div>
                <div><dt>3주 결과물</dt><dd>{p.outputCandidate || '아직 정하지 않았습니다.'}</dd></div>
                <div><dt>현재 상황</dt><dd>{p.currentProgress || '준비 중'}</dd></div>
                <div><dt>다음 액션</dt><dd>{getParticipantNextAction(p)}</dd></div>
              </dl>
            ) : (
              <div className="room-edit-grid">
                <label>역할 / 맥락<input value={p.role} onChange={(e) => update(p.id, { role: e.target.value })} /></label>
                <label>내가 다룰 문제 한 문장<textarea value={p.problemStatement} onChange={(e) => update(p.id, { problemStatement: e.target.value })} placeholder="나는 [상황]에서 [반복되는 문제]를 겪고 있다." /></label>
                <label>3주 후 만들고 싶은 결과물<textarea value={p.outputCandidate} onChange={(e) => update(p.id, { outputCandidate: e.target.value })} placeholder="프롬프트, 체크리스트, 챗봇, 문서 템플릿 등" /></label>
                <label>현재 진행상황<textarea value={p.currentProgress} onChange={(e) => update(p.id, { currentProgress: e.target.value })} placeholder="예: 문제 후보 작성 완료 / 결과물 범위 줄이는 중" /></label>
                <label>다음 액션<textarea value={p.nextAction} onChange={(e) => update(p.id, { nextAction: e.target.value })} placeholder="예: 첫 모임 전 문제 상황 예시 2개 정리" /></label>
                <label>참가자 업데이트 / 메모<textarea value={p.participantUpdate} onChange={(e) => update(p.id, { participantUpdate: e.target.value })} placeholder="참가자가 직접 남기는 짧은 업데이트" /></label>
              </div>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
