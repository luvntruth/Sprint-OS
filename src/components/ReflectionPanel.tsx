import { useState } from 'react';
import type { AppState, Reflection } from '../types';
import { generateReflectionPrompt } from '../prompts';

interface Props { state: AppState; setState: (state: AppState) => void; }

export function ReflectionPanel({ state, setState }: Props) {
  const [raw, setRaw] = useState('');
  const [analysis, setAnalysis] = useState('');
  const [nextActions, setNextActions] = useState('');
  const prompt = generateReflectionPrompt(state.sprint.currentStage, raw);
  const save = () => {
    const reflection: Reflection = { id: crypto.randomUUID(), sprintId: state.sprint.id, stage: state.sprint.currentStage, rawText: raw, consultantReflectionMarkdown: analysis, nextActionsMarkdown: nextActions, createdAt: new Date().toISOString() };
    setState({ ...state, reflections: [reflection, ...state.reflections] });
    setRaw(''); setAnalysis(''); setNextActions('');
  };
  return <section className="panel"><h1>Consultant Reflection</h1><label>회차 후 원문 메모<textarea value={raw} onChange={(e)=>setRaw(e.target.value)} placeholder="모임 직후 기억나는 것, 질문, 반응, 막힌 지점 기록" /></label><label>로키 분석 프롬프트<textarea readOnly value={prompt}/></label><button onClick={()=>navigator.clipboard.writeText(prompt)}>회고 분석 프롬프트 복사</button><label>로키 분석 결과<textarea value={analysis} onChange={(e)=>setAnalysis(e.target.value)} /></label><label>다음 액션 / 티켓<textarea value={nextActions} onChange={(e)=>setNextActions(e.target.value)} /></label><button onClick={save} disabled={!raw.trim()}>회고 저장</button><h2>저장된 회고</h2>{state.reflections.map((r)=><details key={r.id}><summary>{r.stage} · {r.createdAt}</summary><pre>{r.consultantReflectionMarkdown || r.rawText}</pre></details>)}</section>;
}
