import { useEffect, useState } from 'react';
import './App.css';
import type { AppState } from './types';
import { initialState } from './initialState';
import { clearSavedState, loadState, saveState } from './storage';
import { Dashboard } from './components/Dashboard';
import { Participants } from './components/Participants';
import { AnalysisInbox } from './components/AnalysisInbox';
import { TicketBoard } from './components/TicketBoard';
import { ReflectionPanel } from './components/ReflectionPanel';
import { ExportPanel } from './components/ExportPanel';
import { ParticipantRoom } from './components/ParticipantRoom';
import { ProjectLab } from './components/ProjectLab';
import { FacilitatorCockpit } from './components/FacilitatorCockpit';
import { MethodLibrary } from './components/MethodLibrary';

type Tab =
  | 'dashboard'
  | 'room'
  | 'projectLab'
  | 'tickets'
  | 'cockpit'
  | 'method'
  | 'analysis'
  | 'reflection'
  | 'participants'
  | 'export';

const tabs: Array<{ id: Tab; label: string; eyebrow: string; description: string }> = [
  { id: 'dashboard', label: '홈', eyebrow: 'Overview', description: '오늘의 운영 상태' },
  { id: 'room', label: '공유룸', eyebrow: 'Public', description: '참가자와 함께 보는 화면' },
  { id: 'projectLab', label: '프로젝트 랩', eyebrow: 'OURS', description: '문제를 프로젝트로 전환' },
  { id: 'tickets', label: '티켓', eyebrow: 'Execution', description: '단계별 실행 티켓' },
  { id: 'cockpit', label: '운영실', eyebrow: 'Private', description: '운영자 진단/개입 기록' },
  { id: 'method', label: '방법론', eyebrow: 'Library', description: 'Humanistic 방법론 축적' },
  { id: 'analysis', label: '분석', eyebrow: 'AI', description: '로키 분석 프롬프트' },
  { id: 'reflection', label: '회고', eyebrow: 'Learning', description: '컨설턴트 회고' },
  { id: 'participants', label: '데이터', eyebrow: 'Raw', description: '참가자 상세 데이터' },
  { id: 'export', label: '내보내기', eyebrow: 'Markdown', description: 'Obsidian 내보내기' },
];

function App() {
  const [state, setState] = useState<AppState>(() => loadState(initialState));
  const [tab, setTab] = useState<Tab>('dashboard');
  const currentTab = tabs.find((item) => item.id === tab) ?? tabs[0];

  useEffect(() => saveState(state), [state]);

  const reset = () => {
    if (confirm('저장된 로컬 데이터를 초기화할까요?')) {
      clearSavedState();
      setState(initialState);
      setTab('dashboard');
    }
  };

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand-block">
          <div className="brand-mark">S</div>
          <div>
            <strong>Sprint OS</strong>
            <span>Practice Lab 운영체계</span>
          </div>
        </div>

        <nav className="side-nav" aria-label="Primary navigation">
          {tabs.map((item) => (
            <button
              key={item.id}
              className={tab === item.id ? 'nav-item active' : 'nav-item'}
              onClick={() => setTab(item.id)}
            >
              <span>{item.label}</span>
              <small>{item.description}</small>
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <p>조직은 우리답게, 개인은 자기답게.</p>
          <button className="danger subtle" onClick={reset}>개발용 초기화</button>
        </div>
      </aside>

      <main className="workspace">
        <header className="workspace-header">
          <div>
            <p className="eyebrow">{currentTab.eyebrow}</p>
            <h1>{currentTab.label}</h1>
            <p>{currentTab.description}</p>
          </div>
          <div className="stage-pill">
            <span>Current stage</span>
            <strong>{state.sprint.currentStage}</strong>
          </div>
        </header>

        {tab === 'dashboard' && <Dashboard state={state} setState={setState} />}
        {tab === 'room' && <ParticipantRoom state={state} setState={setState} />}
        {tab === 'projectLab' && <ProjectLab state={state} setState={setState} />}
        {tab === 'tickets' && <TicketBoard state={state} setState={setState} />}
        {tab === 'cockpit' && <FacilitatorCockpit state={state} setState={setState} />}
        {tab === 'method' && <MethodLibrary state={state} setState={setState} />}
        {tab === 'analysis' && <AnalysisInbox state={state} setState={setState} />}
        {tab === 'reflection' && <ReflectionPanel state={state} setState={setState} />}
        {tab === 'participants' && <Participants state={state} setState={setState} />}
        {tab === 'export' && <ExportPanel state={state} />}
      </main>
    </div>
  );
}

export default App;
