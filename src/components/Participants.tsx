import { useState } from 'react';
import type { AppState, Participant } from '../types';
import { buildPublicSummary, mergeSurveyPatch, parseSurveyText, suggestNextAction } from '../surveyImport';

interface Props { state: AppState; setState: (state: AppState) => void; }

const fields: Array<[keyof Participant, string, 'input' | 'textarea']> = [
  ['displayName', '이름/닉네임', 'input'],
  ['role', '역할', 'input'],
  ['surveyRawText', '설문 원문', 'textarea'],
  ['problemStatement', '문제 정의', 'textarea'],
  ['problemType', '문제 유형', 'input'],
  ['desiredOutcome', '원하는 변화', 'textarea'],
  ['aiLeveragePoint', 'AI 적용 가능 지점', 'textarea'],
  ['outputCandidate', '3주 결과물 후보', 'textarea'],
  ['successCriteria', '성공 기준', 'textarea'],
  ['consultingTrainingPoint', '문턱장 컨설팅 훈련 포인트', 'textarea'],
  ['leaderHighRelevance', "Leader's High 연결 가능성", 'textarea'],
  ['publicSummary', '참가자 공유용 요약', 'textarea'],
  ['currentProgress', '현재 진행상황', 'textarea'],
  ['nextAction', '다음 액션', 'textarea'],
  ['participantUpdate', '참가자 업데이트/메모', 'textarea'],
  ['analysisMarkdown', 'AI 분석 결과(운영자용)', 'textarea'],
];

export function Participants({ state, setState }: Props) {
  const participantOptions = state.participants.filter((participant) => participant.id !== 'P-0');
  const [quickParticipantId, setQuickParticipantId] = useState(participantOptions[0]?.id ?? state.participants[0]?.id ?? 'P-1');
  const [quickSurveyText, setQuickSurveyText] = useState('');
  const [lastImportMessage, setLastImportMessage] = useState('');

  const update = (id: string, patch: Partial<Participant>) => {
    setState({ ...state, participants: state.participants.map((p) => p.id === id ? { ...p, ...patch } : p) });
  };

  const quickParticipant = state.participants.find((participant) => participant.id === quickParticipantId) ?? state.participants[0];

  const importSurvey = () => {
    if (!quickParticipant || !quickSurveyText.trim()) return;
    const parsed = parseSurveyText(quickSurveyText);
    const patch = mergeSurveyPatch(quickParticipant, parsed);
    const nextAction = suggestNextAction({ ...quickParticipant, ...patch }, state.sprint.currentStage);
    const publicSummary = buildPublicSummary({ ...quickParticipant, ...patch });
    update(quickParticipant.id, {
      ...patch,
      nextAction: quickParticipant.nextAction.trim() ? quickParticipant.nextAction : nextAction,
      publicSummary: quickParticipant.publicSummary.trim() ? quickParticipant.publicSummary : publicSummary,
      currentProgress: quickParticipant.currentProgress.trim() ? quickParticipant.currentProgress : '사전 설문 응답 수집 완료 — 문제 정의 준비 중',
    });
    setLastImportMessage(`${quickParticipant.id} 설문을 저장하고 빈 필드를 자동 채웠습니다.`);
    setQuickSurveyText('');
  };

  const applySuggestedNextActions = () => {
    setState({
      ...state,
      participants: state.participants.map((participant) => ({
        ...participant,
        nextAction: suggestNextAction(participant, state.sprint.currentStage),
        publicSummary: buildPublicSummary(participant),
      })),
    });
    setLastImportMessage('참가자별 다음 액션과 공유 요약을 현재 단계 기준으로 다시 정리했습니다.');
  };

  return (
    <section className="panel participants-panel">
      <div className="section-head clean-head">
        <div>
          <p className="eyebrow">Participant Data</p>
          <h1>참가자 원본 데이터</h1>
        </div>
        <span>설문 → 문제 정의 → 다음 액션</span>
      </div>

      <div className="quick-import-card">
        <div>
          <p className="eyebrow">Google Form Quick Paste</p>
          <h2>사전 설문 빠른 입력</h2>
          <p>Google Form 응답을 그대로 붙여넣으면 설문 원문을 저장하고, 이름/역할/문제/결과물 후보/다음 액션을 빈 칸 위주로 자동 채웁니다.</p>
        </div>
        <div className="grid two">
          <label>
            대상 참가자
            <select value={quickParticipantId} onChange={(event) => setQuickParticipantId(event.target.value)}>
              {state.participants.map((participant) => <option key={participant.id} value={participant.id}>{participant.id} · {participant.displayName}</option>)}
            </select>
          </label>
          <div className="quick-actions">
            <button onClick={importSurvey} disabled={!quickSurveyText.trim()}>설문 저장 + 자동 채우기</button>
            <button className="subtle" onClick={applySuggestedNextActions}>다음 액션 전체 재정리</button>
          </div>
        </div>
        <label>
          Google Form 응답 붙여넣기
          <textarea
            value={quickSurveyText}
            onChange={(event) => setQuickSurveyText(event.target.value)}
            placeholder={`예시:\n이름: 홍길동\n역할: HRBP\n해결하고 싶은 문제: 팀장 피드백 대화가 형식적으로 끝납니다.\n원하는 변화: 팀장이 실제로 쓸 수 있는 질문지를 만들고 싶습니다.`}
          />
        </label>
        {lastImportMessage && <p className="import-message">{lastImportMessage}</p>}
      </div>

      {state.participants.map((p) => (
        <details key={p.id} open={p.id === 'P-0'} className="participant">
          <summary>{p.id} · {p.displayName}</summary>
          <div className="participant-toolbar">
            <button className="subtle" onClick={() => update(p.id, { nextAction: suggestNextAction(p, state.sprint.currentStage) })}>다음 액션 추천 적용</button>
            <button className="subtle" onClick={() => update(p.id, { publicSummary: buildPublicSummary(p) })}>공유 요약 자동 작성</button>
          </div>
          <div className="grid two">
            {fields.map(([key, label, type]) => (
              <label key={key} className={type === 'textarea' ? 'wide' : ''}>
                {label}
                {type === 'textarea'
                  ? <textarea value={String(p[key] ?? '')} onChange={(e) => update(p.id, { [key]: e.target.value } as Partial<Participant>)} />
                  : <input value={String(p[key] ?? '')} onChange={(e) => update(p.id, { [key]: e.target.value } as Partial<Participant>)} />}
              </label>
            ))}
          </div>
        </details>
      ))}
    </section>
  );
}
