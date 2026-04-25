import type { AppState, Participant } from '../types';

interface Props { state: AppState; setState: (state: AppState) => void; }
const fields: Array<[keyof Participant, string, 'input' | 'textarea']> = [
  ['displayName', '이름/닉네임', 'input'], ['role', '역할', 'input'], ['surveyRawText', '설문 원문', 'textarea'],
  ['problemStatement', '문제 정의', 'textarea'], ['problemType', '문제 유형', 'input'], ['desiredOutcome', '원하는 변화', 'textarea'],
  ['aiLeveragePoint', 'AI 적용 가능 지점', 'textarea'], ['outputCandidate', '3주 결과물 후보', 'textarea'],
  ['successCriteria', '성공 기준', 'textarea'], ['consultingTrainingPoint', '문턱장 컨설팅 훈련 포인트', 'textarea'],
  ['leaderHighRelevance', "Leader's High 연결 가능성", 'textarea'], ['publicSummary', '참가자 공유용 요약', 'textarea'],
  ['currentProgress', '현재 진행상황', 'textarea'],
  ['nextAction', '다음 액션', 'textarea'],
  ['participantUpdate', '참가자 업데이트/메모', 'textarea'],
  ['analysisMarkdown', 'AI 분석 결과(운영자용)', 'textarea'],
];

export function Participants({ state, setState }: Props) {
  const update = (id: string, patch: Partial<Participant>) => {
    setState({ ...state, participants: state.participants.map((p) => p.id === id ? { ...p, ...patch } : p) });
  };
  return <section className="panel"><h1>Participants</h1>{state.participants.map((p) => <details key={p.id} open={p.id === 'P-0'} className="participant"><summary>{p.id} · {p.displayName}</summary><div className="grid two">{fields.map(([key,label,type]) => <label key={key} className={type === 'textarea' ? 'wide' : ''}>{label}{type === 'textarea' ? <textarea value={String(p[key] ?? '')} onChange={(e)=>update(p.id,{[key]:e.target.value} as Partial<Participant>)} /> : <input value={String(p[key] ?? '')} onChange={(e)=>update(p.id,{[key]:e.target.value} as Partial<Participant>)} />}</label>)}</div></details>)}</section>;
}
