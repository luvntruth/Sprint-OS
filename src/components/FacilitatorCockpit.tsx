import type { AppState, FacilitatorNote, Participant } from '../types';

interface Props {
  state: AppState;
  setState: (state: AppState) => void;
}

const fields: Array<[keyof FacilitatorNote, string, string]> = [
  ['diagnosis', '진단 노트', '이 사람의 진짜 병목은 무엇인가? 현상과 원인을 구분합니다.'],
  ['followUpQuestions', '후속 질문', '첫 모임/다음 모임에서 물어볼 좋은 질문을 쌓습니다.'],
  ['scopeReduction', '범위 축소 제안', '3주 안에 실행 가능한 수준으로 줄이는 방법을 적습니다.'],
  ['missedQuestions', '놓친 질문', '운영자로서 놓친 질문과 다음에 더 잘할 점을 기록합니다.'],
  ['interventionLog', '운영자 개입 기록', '언제 어떤 도움/개입을 했고, 그것이 적절했는지 남깁니다.'],
];

export function FacilitatorCockpit({ state, setState }: Props) {
  const update = (id: string, patch: Partial<Participant>) => {
    setState({ ...state, participants: state.participants.map((p) => p.id === id ? { ...p, ...patch } : p) });
  };

  const updateNote = (participant: Participant, key: keyof FacilitatorNote, value: string) => {
    update(participant.id, { facilitatorNote: { ...participant.facilitatorNote, [key]: value } });
  };

  return (
    <section className="panel cockpit">
      <div className="hero-card private">
        <p className="eyebrow">Private Facilitator Cockpit</p>
        <h1>문턱장 컨설턴트 훈련실</h1>
        <p>참가자와 공유하지 않는 운영자 전용 공간입니다. 사람을 돕는 방식, 질문, 개입, 놓친 지점을 훈련 데이터로 축적합니다.</p>
      </div>

      {state.participants.map((participant) => (
        <details className="participant" key={participant.id} open={participant.id === 'P-0'}>
          <summary>{participant.id} · {participant.displayName}</summary>
          <div className="grid two">
            {fields.map(([key, label, help]) => (
              <label key={key} className="wide">
                {label}
                <small>{help}</small>
                <textarea value={participant.facilitatorNote[key]} onChange={(event) => updateNote(participant, key, event.target.value)} />
              </label>
            ))}
          </div>
        </details>
      ))}
    </section>
  );
}
