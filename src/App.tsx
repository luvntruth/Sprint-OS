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
import { OnePager } from './components/OnePager';
import { OneOnOne } from './components/OneOnOne';
import { stageMeta } from './uiModel';

type Tab =
  | 'dashboard'
  | 'room'
  | 'projectLab'
  | 'tickets'
  | 'onepager'
  | 'oneonone'
  | 'cockpit'
  | 'method'
  | 'analysis'
  | 'reflection'
  | 'participants'
  | 'export';

type ViewMode = 'public' | 'admin';
type NavSection = 'shared' | 'operations' | 'learning';

const sectionLabels: Record<NavSection, string> = {
  shared: '공유 화면',
  operations: '운영 입력',
  learning: '분석·축적',
};

const allTabs: Array<{ id: Tab; label: string; eyebrow: string; description: string; visibility: ViewMode | 'both'; section: NavSection }> = [
  { id: 'dashboard', label: '홈', eyebrow: '현재 위치', description: '지금 단계와 오늘 할 일', visibility: 'both', section: 'shared' },
  { id: 'room', label: '우리 카드', eyebrow: '참가자 진행', description: '문제·결과물·다음 액션', visibility: 'both', section: 'shared' },
  { id: 'tickets', label: '이번 주 할 일', eyebrow: '오늘 할 일', description: '이번 단계의 실행 목록', visibility: 'both', section: 'shared' },
  { id: 'onepager', label: '한 장 요약', eyebrow: '공유 요약', description: '인쇄·PDF 가능한 요약', visibility: 'both', section: 'shared' },
  { id: 'projectLab', label: '프로젝트 설계', eyebrow: 'OURS 설계', description: '참가자별 OURS 체크', visibility: 'admin', section: 'operations' },
  { id: 'oneonone', label: '1:1 노트', eyebrow: '개별 운영', description: '참가자별 통합 노트', visibility: 'admin', section: 'operations' },
  { id: 'participants', label: '참가자 데이터', eyebrow: '원본 데이터', description: '상세 정보와 설문 입력', visibility: 'admin', section: 'operations' },
  { id: 'cockpit', label: '운영 메모', eyebrow: '비공개 메모', description: '진단·질문·개입 기록', visibility: 'admin', section: 'operations' },
  { id: 'analysis', label: 'AI 분석', eyebrow: '분석 보조', description: '분석 프롬프트와 결과', visibility: 'admin', section: 'learning' },
  { id: 'reflection', label: '회고', eyebrow: '운영 회고', description: '회차별 회고와 다음 액션', visibility: 'admin', section: 'learning' },
  { id: 'method', label: '방법론', eyebrow: '방법론 축적', description: 'Humanistic 자산화', visibility: 'admin', section: 'learning' },
  { id: 'export', label: '내보내기', eyebrow: 'Markdown', description: 'Obsidian 내보내기', visibility: 'admin', section: 'learning' },
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
  return 'dashboard';
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

  useEffect(() => saveState(state), [state]);

  const reset = () => {
    if (confirm('저장된 로컬 데이터를 초기화할까요?')) {
      clearSavedState();
      setState(initialState);
      setTab('dashboard');
    }
  };

  return (
    <div className={`app-shell ${mode === 'public' ? 'public-mode' : 'admin-mode'}`}>
      <aside className="sidebar">
        <div className="brand-block">
          <div className="brand-mark">↯</div>
          <div>
            <strong>Sprint OS</strong>
            <span>{mode === 'public' ? '3주 실천 진행판' : '운영자 확장 화면'}</span>
          </div>
        </div>

        <div className={mode === 'public' ? 'mode-card public' : 'mode-card admin'}>
          <strong>{mode === 'public' ? '참가자와 함께 보는 화면' : '운영자(문턱장) 화면'}</strong>
          <p>{mode === 'public' ? '지금 단계, 내 문제, 만들 결과물, 다음 액션만 확인합니다. 보기 전용입니다.' : '공유 화면을 관리하고 참가자 데이터, 운영 메모, 분석, 회고를 입력합니다. 실제 권한 보호는 아직 없습니다.'}</p>
        </div>

        <nav className="side-nav" aria-label="Primary navigation">
          {(['shared', 'operations', 'learning'] as NavSection[]).map((section) => {
            const sectionTabs = tabs.filter((item) => item.section === section);
            if (sectionTabs.length === 0) return null;
            return (
              <div className="nav-section" key={section}>
                {mode === 'admin' && <p>{sectionLabels[section]}</p>}
                {sectionTabs.map((item) => (
                  <button
                    key={item.id}
                    className={tab === item.id ? 'nav-item active' : 'nav-item'}
                    onClick={() => setTab(item.id)}
                  >
                    <span>{item.label}</span>
                    <small>{item.description}</small>
                  </button>
                ))}
              </div>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <p>조직은 우리답게, 개인은 자기답게.</p>
          {mode === 'admin' && (
            <>
              <button className="subtle full" onClick={() => navigator.clipboard.writeText(publicUrl)}>공유 링크 복사</button>
              <button className="danger subtle full" onClick={reset}>개발용 초기화</button>
            </>
          )}
          {mode === 'public' && <small className="mode-note">함께 보는 진행 화면입니다. 민감한 정보나 운영자 메모는 이 화면에 적지 않습니다.</small>}
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
            <strong>{stageMeta[state.sprint.currentStage]?.shortLabel ?? state.sprint.currentStage}</strong>
          </div>
        </header>

        {tab === 'dashboard' && <Dashboard state={state} setState={setState} mode={mode} />}
        {tab === 'room' && <ParticipantRoom state={state} setState={setState} readOnly={mode === 'public'} />}
        {tab === 'projectLab' && <ProjectLab state={state} setState={setState} readOnly={mode === 'public'} />}
        {tab === 'tickets' && <TicketBoard state={state} setState={setState} readOnly={mode === 'public'} />}
        {tab === 'onepager' && <OnePager state={state} mode={mode} />}
        {mode === 'admin' && tab === 'oneonone' && <OneOnOne state={state} setState={setState} />}
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
