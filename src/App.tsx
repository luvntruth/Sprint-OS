import { useEffect, useMemo, useState } from 'react';
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

type ViewMode = 'public' | 'admin';

const allTabs: Array<{ id: Tab; label: string; eyebrow: string; description: string; visibility: ViewMode | 'both' }> = [
  { id: 'dashboard', label: '홈', eyebrow: 'Overview', description: '오늘의 운영 상태', visibility: 'both' },
  { id: 'room', label: '공유룸', eyebrow: 'Public', description: '참가자와 함께 보는 화면', visibility: 'both' },
  { id: 'projectLab', label: '프로젝트 랩', eyebrow: 'OURS', description: '문제를 프로젝트로 전환', visibility: 'both' },
  { id: 'tickets', label: '티켓', eyebrow: 'Execution', description: '단계별 실행 티켓', visibility: 'both' },
  { id: 'cockpit', label: '운영실', eyebrow: 'Private', description: '운영자 진단/개입 기록', visibility: 'admin' },
  { id: 'method', label: '방법론', eyebrow: 'Library', description: 'Humanistic 방법론 축적', visibility: 'admin' },
  { id: 'analysis', label: '분석', eyebrow: 'AI', description: '로키 분석 프롬프트', visibility: 'admin' },
  { id: 'reflection', label: '회고', eyebrow: 'Learning', description: '컨설턴트 회고', visibility: 'admin' },
  { id: 'participants', label: '데이터', eyebrow: 'Raw', description: '참가자 상세 데이터', visibility: 'admin' },
  { id: 'export', label: '내보내기', eyebrow: 'Markdown', description: 'Obsidian 내보내기', visibility: 'admin' },
];

function getInitialMode(): ViewMode {
  const params = new URLSearchParams(window.location.search);
  return params.get('view') === 'admin' ? 'admin' : 'public';
}

function getInitialTab(mode: ViewMode): Tab {
  const params = new URLSearchParams(window.location.search);
  const requestedTab = params.get('tab') as Tab | null;
  const visibleTabs = allTabs.filter((item) => item.visibility === 'both' || item.visibility === mode);
  if (requestedTab && visibleTabs.some((item) => item.id === requestedTab)) return requestedTab;
  return mode === 'public' ? 'room' : 'dashboard';
}

function App() {
  const [state, setState] = useState<AppState>(() => loadState(initialState));
  const [mode] = useState<ViewMode>(() => getInitialMode());
  const [tab, setTab] = useState<Tab>(() => getInitialTab(getInitialMode()));
  const tabs = useMemo(
    () => allTabs.filter((item) => item.visibility === 'both' || item.visibility === mode),
    [mode],
  );
  const currentTab = tabs.find((item) => item.id === tab) ?? tabs[0];
  const publicUrl = `${window.location.origin}${window.location.pathname}?view=public`;
  const adminUrl = `${window.location.origin}${window.location.pathname}?view=admin`;

  useEffect(() => saveState(state), [state]);

  useEffect(() => {
    if (!tabs.some((item) => item.id === tab)) setTab(tabs[0].id);
  }, [tab, tabs]);

  const reset = () => {
    if (confirm('저장된 로컬 데이터를 초기화할까요?')) {
      clearSavedState();
      setState(initialState);
      setTab(mode === 'public' ? 'room' : 'dashboard');
    }
  };

  return (
    <div className={`app-shell ${mode === 'public' ? 'public-mode' : 'admin-mode'}`}>
      <aside className="sidebar">
        <div className="brand-block">
          <div className="brand-mark">S</div>
          <div>
            <strong>Sprint OS</strong>
            <span>{mode === 'public' ? '교육생 공유 화면' : '운영자 콘솔'}</span>
          </div>
        </div>

        <div className={mode === 'public' ? 'mode-card public' : 'mode-card admin'}>
          <strong>{mode === 'public' ? 'Public View' : 'Admin View'}</strong>
          <p>{mode === 'public' ? '참가자와 함께 보는 메뉴만 표시됩니다.' : '운영자 전용 분석/회고/방법론 메뉴가 표시됩니다.'}</p>
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
          {mode === 'admin' ? (
            <>
              <button className="subtle full" onClick={() => navigator.clipboard.writeText(publicUrl)}>공유 링크 복사</button>
              <button className="danger subtle full" onClick={reset}>개발용 초기화</button>
            </>
          ) : (
            <button className="subtle full" onClick={() => navigator.clipboard.writeText(adminUrl)}>운영자 링크 복사</button>
          )}
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
            <span>{mode === 'public' ? '공유 모드' : '운영자 모드'}</span>
            <strong>{state.sprint.currentStage}</strong>
          </div>
        </header>

        {tab === 'dashboard' && <Dashboard state={state} setState={setState} />}
        {tab === 'room' && <ParticipantRoom state={state} setState={setState} />}
        {tab === 'projectLab' && <ProjectLab state={state} setState={setState} />}
        {tab === 'tickets' && <TicketBoard state={state} setState={setState} />}
        {mode === 'admin' && tab === 'cockpit' && <FacilitatorCockpit state={state} setState={setState} />}
        {mode === 'admin' && tab === 'method' && <MethodLibrary state={state} setState={setState} />}
        {mode === 'admin' && tab === 'analysis' && <AnalysisInbox state={state} setState={setState} />}
        {mode === 'admin' && tab === 'reflection' && <ReflectionPanel state={state} setState={setState} />}
        {mode === 'admin' && tab === 'participants' && <Participants state={state} setState={setState} />}
        {mode === 'admin' && tab === 'export' && <ExportPanel state={state} />}
      </main>
    </div>
  );
}

export default App;
