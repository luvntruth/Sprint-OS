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

type Tab = 'dashboard' | 'room' | 'projectLab' | 'cockpit' | 'method' | 'participants' | 'analysis' | 'tickets' | 'reflection' | 'export';
const tabs: Array<[Tab, string]> = [['dashboard','Dashboard'], ['room','Shared Room'], ['projectLab','Project Lab'], ['cockpit','Cockpit'], ['method','Method'], ['participants','Participants'], ['analysis','Analysis'], ['tickets','Tickets'], ['reflection','Reflection'], ['export','Export']];

function App() {
  const [state, setState] = useState<AppState>(() => loadState(initialState));
  const [tab, setTab] = useState<Tab>('dashboard');
  useEffect(() => saveState(state), [state]);
  const reset = () => { if (confirm('저장된 로컬 데이터를 초기화할까요?')) { clearSavedState(); setState(initialState); } };
  return <main><nav className="topbar"><div><strong>AX x HR Sprint OS</strong><span>문턱장 HR AX 컨설턴트 훈련 운영툴</span></div><div className="tabs">{tabs.map(([id,label])=><button className={tab===id?'active':''} onClick={()=>setTab(id)} key={id}>{label}</button>)}<button className="danger" onClick={reset}>Reset</button></div></nav>{tab==='dashboard' && <Dashboard state={state} setState={setState}/>} {tab==='room' && <ParticipantRoom state={state} setState={setState}/>} {tab==='projectLab' && <ProjectLab state={state} setState={setState}/>} {tab==='cockpit' && <FacilitatorCockpit state={state} setState={setState}/>} {tab==='method' && <MethodLibrary state={state} setState={setState}/>} {tab==='participants' && <Participants state={state} setState={setState}/>} {tab==='analysis' && <AnalysisInbox state={state} setState={setState}/>} {tab==='tickets' && <TicketBoard state={state} setState={setState}/>} {tab==='reflection' && <ReflectionPanel state={state} setState={setState}/>} {tab==='export' && <ExportPanel state={state}/>}</main>;
}
export default App;
