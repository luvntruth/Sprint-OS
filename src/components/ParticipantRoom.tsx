import type { AppState, Participant } from '../types';

interface Props {
  state: AppState;
  setState: (state: AppState) => void;
}

export function ParticipantRoom({ state, setState }: Props) {
  const update = (id: string, patch: Partial<Participant>) => {
    setState({
      ...state,
      participants: state.participants.map((p) => (p.id === id ? { ...p, ...patch } : p)),
    });
  };

  return (
    <section className="panel participant-room">
      <div className="hero-card soft">
        <p className="eyebrow">Shared Sprint Room</p>
        <h1>AX x HR 실천 모임 진행상황</h1>
        <p>
          이 화면은 참가자와 함께 보는 공간입니다. 각자의 문제, 3주 결과물 후보, 현재 진행상황,
          다음 액션만 가볍게 확인합니다. 민감한 회사/개인 정보는 적지 않습니다.
        </p>
      </div>

      <div className="notice">
        <strong>운영 원칙</strong>
        <ul>
          <li>완벽한 결과물보다 “현장에서 한 번 써본 학습”이 중요합니다.</li>
          <li>서로의 문제를 평가하지 않고, 작게 실험 가능한 형태로 줄입니다.</li>
          <li>회사명/개인명/민감정보는 익명화하거나 일반화합니다.</li>
        </ul>
      </div>

      <div className="participant-grid">
        {state.participants.map((p) => (
          <article className="shared-card" key={p.id}>
            <div className="shared-card-head">
              <span className="badge">{p.id}</span>
              <input
                value={p.displayName}
                onChange={(e) => update(p.id, { displayName: e.target.value })}
                aria-label={`${p.id} 이름`}
              />
            </div>

            <label>
              역할 / 맥락
              <input value={p.role} onChange={(e) => update(p.id, { role: e.target.value })} />
            </label>

            <label>
              내가 다룰 문제 한 문장
              <textarea
                value={p.problemStatement}
                onChange={(e) => update(p.id, { problemStatement: e.target.value })}
                placeholder="나는 [상황]에서 [반복되는 문제]를 겪고 있다."
              />
            </label>

            <label>
              3주 후 만들고 싶은 결과물
              <textarea
                value={p.outputCandidate}
                onChange={(e) => update(p.id, { outputCandidate: e.target.value })}
                placeholder="프롬프트, 체크리스트, 챗봇, 문서 템플릿 등"
              />
            </label>

            <label>
              현재 진행상황
              <textarea
                value={p.currentProgress}
                onChange={(e) => update(p.id, { currentProgress: e.target.value })}
                placeholder="예: 문제 후보 작성 완료 / 결과물 범위 줄이는 중"
              />
            </label>

            <label>
              다음 액션
              <textarea
                value={p.nextAction}
                onChange={(e) => update(p.id, { nextAction: e.target.value })}
                placeholder="예: 첫 모임 전 문제 상황 예시 2개 정리"
              />
            </label>

            <label>
              참가자 업데이트 / 메모
              <textarea
                value={p.participantUpdate}
                onChange={(e) => update(p.id, { participantUpdate: e.target.value })}
                placeholder="참가자가 직접 남기는 짧은 업데이트"
              />
            </label>
          </article>
        ))}
      </div>
    </section>
  );
}
