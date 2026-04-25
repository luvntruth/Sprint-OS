import type { AppState, Participant, ProjectLifecycle } from '../types';

interface Props {
  state: AppState;
  setState: (state: AppState) => void;
}

const lifecycleFields: Array<[keyof ProjectLifecycle, string, string]> = [
  ['ownProblem', 'O — Own the Problem', '내가 중요하게 느끼는 문제를 자기 언어로 정의합니다.'],
  ['understandSystem', 'U — Understand the System', '문제가 반복되는 사람/흐름/정보/대화/도구/목표 시스템을 이해합니다.'],
  ['smallProject', 'R — Run a Small Project', '3주 안에 현장에서 한 번 써볼 작은 프로젝트로 줄입니다.'],
  ['shareReflectSystemize', 'S — Share, Reflect, Systemize', '공유·회고·시스템화하여 다음에도 반복 가능한 구조로 남깁니다.'],
  ['goalConversation', '목표 설정 대화', '3주 뒤 어떤 변화가 있으면 충분한지 합의합니다.'],
  ['strategyConversation', '전략 수립 대화', '어디까지 줄이고, AI를 어디에 쓸지 정합니다.'],
  ['retrospectiveConversation', '회고 대화', '무엇이 달라졌고 다음에 무엇을 반복할지 정리합니다.'],
  ['fieldTest', '현업 테스트', '실제 맥락에서 한 번 써본 기록을 남깁니다.'],
  ['caseNote', 'Case Note', 'Before / Project / Conversation / After / Learning / System을 정리합니다.'],
];

export function ProjectLab({ state, setState }: Props) {
  const update = (id: string, patch: Partial<Participant>) => {
    setState({ ...state, participants: state.participants.map((p) => p.id === id ? { ...p, ...patch } : p) });
  };

  const updateLifecycle = (participant: Participant, key: keyof ProjectLifecycle, value: string) => {
    update(participant.id, { lifecycle: { ...participant.lifecycle, [key]: value } });
  };

  return (
    <section className="panel">
      <div className="hero-card soft">
        <p className="eyebrow">Project Lab</p>
        <h1>OURS Method 프로젝트 랩</h1>
        <p>각자의 문제를 O-U-R-S 흐름으로 프로젝트화합니다. 목표는 완벽한 산출물이 아니라 자기 문제를 AI와 대화를 통해 직접 해결해보는 경험입니다.</p>
      </div>

      {state.participants.map((participant) => (
        <details className="participant" key={participant.id} open={participant.id === 'P-0'}>
          <summary>{participant.id} · {participant.displayName}</summary>
          <div className="grid two">
            {lifecycleFields.map(([key, label, help]) => (
              <label key={key} className="wide">
                {label}
                <small>{help}</small>
                <textarea
                  value={participant.lifecycle[key]}
                  onChange={(event) => updateLifecycle(participant, key, event.target.value)}
                />
              </label>
            ))}
          </div>
        </details>
      ))}
    </section>
  );
}
