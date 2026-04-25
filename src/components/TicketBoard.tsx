import { useState } from 'react';
import type { AppState, Stage, Ticket, TicketStatus } from '../types';

interface Props { state: AppState; setState: (state: AppState) => void; }
const statuses: TicketStatus[] = ['todo','doing','done','blocked'];
const stages: Stage[] = ['prep','week1','week2','week3','wrapup'];

export function TicketBoard({ state, setState }: Props) {
  const [stage, setStage] = useState<Stage>(state.sprint.currentStage);
  const [title, setTitle] = useState('');
  const filtered = state.tickets.filter((t)=>t.stage===stage);
  const update = (id:string, patch:Partial<Ticket>) => setState({...state, tickets: state.tickets.map((t)=>t.id===id?{...t,...patch}:t)});
  const add = () => { if(!title.trim()) return; setState({...state, tickets:[...state.tickets,{id:crypto.randomUUID(), sprintId:state.sprint.id, stage, title, description:'', owner:'operator', status:'todo', priority:'medium', generatedBy:'manual'}]}); setTitle(''); };
  return <section className="panel"><h1>Ticket Board</h1><div className="toolbar"><select value={stage} onChange={(e)=>setStage(e.target.value as Stage)}>{stages.map((s)=><option key={s}>{s}</option>)}</select><input value={title} onChange={(e)=>setTitle(e.target.value)} placeholder="새 티켓 제목"/><button onClick={add}>추가</button></div><div className="kanban">{statuses.map((status)=><div className="column" key={status}><h2>{status}</h2>{filtered.filter((t)=>t.status===status).map((t)=><article className="ticket" key={t.id}><input value={t.title} onChange={(e)=>update(t.id,{title:e.target.value})}/><textarea value={t.description} onChange={(e)=>update(t.id,{description:e.target.value})}/><div className="ticket-meta"><select value={t.status} onChange={(e)=>update(t.id,{status:e.target.value as TicketStatus})}>{statuses.map((s)=><option key={s}>{s}</option>)}</select><select value={t.priority} onChange={(e)=>update(t.id,{priority:e.target.value as Ticket['priority']})}><option>low</option><option>medium</option><option>high</option></select></div></article>)}</div>)}</div></section>;
}
