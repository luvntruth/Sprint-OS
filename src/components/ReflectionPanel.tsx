import { useState } from 'react';
import type { AppState, Reflection } from '../types';
import { generateReflectionPrompt } from '../prompts';
import { stageMeta } from '../uiModel';

interface Props {
  state: AppState;
  setState: (state: AppState) => void;
}

export function ReflectionPanel({ state, setState }: Props) {
  const [raw, setRaw] = useState('');
  const [analysis, setAnalysis] = useState('');
  const [nextActions, setNextActions] = useState('');
  const prompt = generateReflectionPrompt(state.sprint.currentStage, raw);

  const save = () => {
    const reflection: Reflection = {
      id: crypto.randomUUID(),
      sprintId: state.sprint.id,
      stage: state.sprint.currentStage,
      rawText: raw,
      consultantReflectionMarkdown: analysis,
      nextActionsMarkdown: nextActions,
      createdAt: new Date().toISOString(),
    };
    setState({ ...state, reflections: [reflection, ...state.reflections] });
    setRaw('');
    setAnalysis('');
    setNextActions('');
  };

  return (
    <section className="panel reflection-page">
      <div className="screen-heading">
        <div>
          <p className="eyebrow">운영 회고</p>
          <h1>회고</h1>
          <p>모임 직후 기억, 질문, 막힘, 다음 개입 포인트를 남겨 Humanistic 방법론으로 축적합니다.</p>
        </div>
        <span className="screen-mode-pill">{stageMeta[state.sprint.currentStage].label}</span>
      </div>

      <div className="form-sections">
        <article className="form-section">
          <header>
            <span>1</span>
            <div>
              <h2>회차 원문 메모</h2>
              <p>정리하지 않은 기억을 먼저 남깁니다. 좋은 질문, 반응, 막힌 장면이 중요합니다.</p>
            </div>
          </header>
          <label>원문 메모<textarea value={raw} onChange={(e) => setRaw(e.target.value)} placeholder="모임 직후 기억나는 것, 질문, 반응, 막힌 지점 기록" /></label>
        </article>

        <article className="form-section">
          <header>
            <span>2</span>
            <div>
              <h2>AI 회고 분석</h2>
              <p>원문 메모를 분석 프롬프트로 바꾼 뒤, 결과를 붙여넣습니다.</p>
            </div>
          </header>
          <label>회고 분석 프롬프트<textarea readOnly value={prompt} /></label>
          <button type="button" onClick={() => navigator.clipboard.writeText(prompt)}>회고 분석 프롬프트 복사</button>
          <label>AI 분석 결과<textarea value={analysis} onChange={(e) => setAnalysis(e.target.value)} /></label>
        </article>

        <article className="form-section">
          <header>
            <span>3</span>
            <div>
              <h2>다음 액션 저장</h2>
              <p>다음 모임 전에 해야 할 운영 액션이나 티켓 후보를 정리합니다.</p>
            </div>
          </header>
          <label>다음 액션 / 티켓<textarea value={nextActions} onChange={(e) => setNextActions(e.target.value)} /></label>
          <button type="button" onClick={save} disabled={!raw.trim()}>회고 저장</button>
        </article>
      </div>

      <section className="saved-list">
        <h2>저장된 회고</h2>
        {state.reflections.length === 0 ? (
          <p className="muted-em">아직 저장된 회고가 없습니다.</p>
        ) : (
          state.reflections.map((reflection) => (
            <details key={reflection.id}>
              <summary>{stageMeta[reflection.stage].label} · {reflection.createdAt}</summary>
              <pre>{reflection.consultantReflectionMarkdown || reflection.rawText}</pre>
            </details>
          ))
        )}
      </section>
    </section>
  );
}
