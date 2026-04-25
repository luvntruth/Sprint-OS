import { useState } from 'react';
import type { Analysis, AppState } from '../types';
import { generateNextTicketPrompt, generateSurveyAnalysisPrompt } from '../prompts';

interface Props { state: AppState; setState: (state: AppState) => void; }

export function AnalysisInbox({ state, setState }: Props) {
  const [participantId, setParticipantId] = useState(state.participants[0]?.id ?? 'P-0');
  const [result, setResult] = useState('');
  const [context, setContext] = useState('');
  const participant = state.participants.find((p) => p.id === participantId) ?? state.participants[0];
  const prompt = participant ? generateSurveyAnalysisPrompt(participant) : '';
  const ticketPrompt = generateNextTicketPrompt(state.sprint.currentStage, context || result || '현재 참가자 분석 결과를 바탕으로 다음 티켓을 제안해줘.');

  const saveAnalysis = () => {
    if (!participant) return;
    const analysis: Analysis = { id: crypto.randomUUID(), sprintId: state.sprint.id, participantId: participant.id, inputText: participant.surveyRawText, outputMarkdown: result, analysisType: 'survey', createdAt: new Date().toISOString() };
    setState({ ...state, analyses: [analysis, ...state.analyses], participants: state.participants.map((p) => p.id === participant.id ? { ...p, analysisMarkdown: result } : p) });
    setResult('');
  };

  return <section className="panel"><h1>Analysis Inbox</h1><div className="grid two"><label>대상 참가자<select value={participantId} onChange={(e)=>setParticipantId(e.target.value)}>{state.participants.map((p)=><option key={p.id} value={p.id}>{p.id} · {p.displayName}</option>)}</select></label><button onClick={() => navigator.clipboard.writeText(prompt)}>설문 분석 프롬프트 복사</button></div><label>설문 분석 프롬프트<textarea readOnly value={prompt} /></label><label>로키 분석 결과 붙여넣기<textarea value={result} onChange={(e)=>setResult(e.target.value)} placeholder="로키가 분석한 Markdown을 여기에 붙여넣기" /></label><button onClick={saveAnalysis} disabled={!result.trim()}>분석 결과 저장</button><hr/><h2>다음 티켓 생성 프롬프트</h2><label>추가 맥락<textarea value={context} onChange={(e)=>setContext(e.target.value)} /></label><label>프롬프트<textarea readOnly value={ticketPrompt}/></label><button onClick={()=>navigator.clipboard.writeText(ticketPrompt)}>티켓 생성 프롬프트 복사</button></section>;
}
