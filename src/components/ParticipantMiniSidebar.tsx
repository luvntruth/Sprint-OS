import type { AppState } from '../types';
import { currentPhase, overallProgress } from '../lib/checklists';

interface Props {
  state: AppState;
  mode: 'public' | 'admin';
  activeId?: string;
  onJump: (participantId: string) => void;
}

export function ParticipantMiniSidebar({ state, mode, activeId, onJump }: Props) {
  const visible = state.participants.filter((p) => mode === 'admin' || p.id !== 'P-0');
  if (visible.length === 0) return null;

  return (
    <div className="participant-mini-sidebar" aria-label="참가자 빠른 이동">
      <p className="mini-sidebar-label">참가자</p>
      <ul>
        {visible.map((p) => {
          const checklist = p.checklist ?? {};
          const here = currentPhase(checklist);
          const overall = overallProgress(checklist);
          const blocked = Boolean(p.blocker);
          const isActive = p.id === activeId;
          return (
            <li key={p.id}>
              <button
                type="button"
                className={`mini-card${isActive ? ' active' : ''}${blocked ? ' blocked' : ''}`}
                onClick={() => onJump(p.id)}
                aria-label={`${p.displayName || p.id} — ${here} 단계, ${overall.done}/${overall.total} 완료${blocked ? ', 막힘' : ''}`}
              >
                <span className="mini-id">{p.id}</span>
                <span className="mini-name">{p.displayName || '이름 미정'}</span>
                <span className="mini-phase">{here}</span>
                <span className="mini-bar" aria-hidden>
                  <span style={{ width: `${overall.ratio * 100}%` }} />
                </span>
                {blocked ? <span className="mini-blocker-dot" title={p.blocker?.reason} /> : null}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
