import { useState } from 'react';
import type { Analysis, AppState } from '../types';
import { generateNextTicketPrompt, generateSurveyAnalysisPrompt } from '../prompts';

interface Props {
  state: AppState;
  setState: (state: AppState) => void;
}

export function AnalysisInbox({ state, setState }: Props) {
  const [participantId, setParticipantId] = useState(state.participants[0]?.id ?? 'P-0');
  const [result, setResult] = useState('');
  const [context, setContext] = useState('');
  const participant = state.participants.find((p) => p.id === participantId) ?? state.participants[0];
  const prompt = participant ? generateSurveyAnalysisPrompt(participant) : '';
  const ticketPrompt = generateNextTicketPrompt(state.sprint.currentStage, context || result || '현재 참가자 분석 결과를 바탕으로 다음 티켓을 제안해줘.');

  const saveAnalysis = () => {
    if (!participant) return;
    const analysis: Analysis = {
      id: crypto.randomUUID(),
      sprintId: state.sprint.id,
      participantId: participant.id,
      inputText: participant.surveyRawText,
      outputMarkdown: result,
      analysisType: 'survey',
      createdAt: new Date().toISOString(),
    };
    setState({
      ...state,
      analyses: [analysis, ...state.analyses],
      participants: state.participants.map((p) => (p.id === participant.id ? { ...p, analysisMarkdown: result } : p)),
    });
    setResult('');
  };

  return (
    <section className="panel analysis-page">
      <div className="screen-heading">
        <div>
          <p className="eyebrow">분석 보조</p>
          <h1>AI 분석</h1>
          <p>참가자 설문과 운영 맥락을 분석용 프롬프트로 정리하고, 결과를 다시 Sprint OS에 저장합니다.</p>
        </div>
        <span className="screen-mode-pill">운영자 전용</span>
      </div>

      <div className="form-sections">
        <article className="form-section">
          <header>
            <span>1</span>
            <div>
              <h2>분석할 참가자 선택</h2>
              <p>설문 원문과 현재 입력값을 바탕으로 분석 프롬프트를 만듭니다.</p>
            </div>
          </header>
          <div className="grid two">
            <label>
              대상 참가자
              <select value={participantId} onChange={(e) => setParticipantId(e.target.value)}>
                {state.participants.map((p) => (
                  <option key={p.id} value={p.id}>{p.id} · {p.displayName}</option>
                ))}
              </select>
            </label>
            <button type="button" onClick={() => navigator.clipboard.writeText(prompt)}>분석 프롬프트 복사</button>
          </div>
          <label>설문 분석 프롬프트<textarea readOnly value={prompt} /></label>
        </article>

        <article className="form-section">
          <header>
            <span>2</span>
            <div>
              <h2>분석 결과 저장</h2>
              <p>AI가 반환한 Markdown을 붙여넣으면 참가자 카드에 함께 저장됩니다.</p>
            </div>
          </header>
          <label>AI 분석 결과<textarea value={result} onChange={(e) => setResult(e.target.value)} placeholder="AI가 분석한 Markdown을 여기에 붙여넣기" /></label>
          <button type="button" onClick={saveAnalysis} disabled={!result.trim()}>분석 결과 저장</button>
        </article>

        <article className="form-section">
          <header>
            <span>3</span>
            <div>
              <h2>다음 티켓 만들기</h2>
              <p>분석 결과를 바탕으로 다음 실행 티켓 후보를 만들 때 사용합니다.</p>
            </div>
          </header>
          <label>추가 맥락<textarea value={context} onChange={(e) => setContext(e.target.value)} /></label>
          <label>티켓 생성 프롬프트<textarea readOnly value={ticketPrompt} /></label>
          <button type="button" onClick={() => navigator.clipboard.writeText(ticketPrompt)}>티켓 생성 프롬프트 복사</button>
        </article>
      </div>
    </section>
  );
}
