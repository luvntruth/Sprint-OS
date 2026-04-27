import type { AppState, OursPhase } from '../types';
import { OURS_PHASES, currentPhase } from '../lib/checklists';

interface Props {
  state: AppState;
  mode: 'public' | 'admin';
  onJump?: (participantId: string) => void;
}

export function OursDistribution({ state, mode, onJump }: Props) {
  const visible = state.participants.filter((p) => mode === 'admin' || p.id !== 'P-0');
  const byPhase: Record<OursPhase, typeof visible> = { O: [], U: [], R: [], S: [] };
  for (const p of visible) {
    byPhase[currentPhase(p.checklist ?? {})].push(p);
  }

  return (
    <div className="ours-distribution" aria-label="OURS 단계별 참가자 분포">
      {OURS_PHASES.map(({ phase, label, tagline }) => {
        const list = byPhase[phase];
        return (
          <article key={phase} className={`ours-dist-col ours-dist-col-${phase.toLowerCase()}`}>
            <header>
              <strong>{phase}</strong>
              <span className="ours-dist-label">{label}</span>
              <small>{tagline}</small>
            </header>
            <p className="ours-dist-count">{list.length}명</p>
            <ul className="ours-dist-list">
              {list.length === 0 ? (
                <li className="ours-dist-empty">—</li>
              ) : (
                list.map((p) => {
                  const blocked = Boolean(p.blocker);
                  const content = (
                    <>
                      <strong>{p.id}</strong>
                      <span>{p.displayName || '이름 미정'}</span>
                      {blocked ? <span className="dist-blocker-dot" aria-label="막힘" title={p.blocker?.reason} /> : null}
                    </>
                  );
                  return (
                    <li key={p.id} className={blocked ? 'blocked' : ''}>
                      {onJump ? (
                        <button type="button" onClick={() => onJump(p.id)}>{content}</button>
                      ) : (
                        <span>{content}</span>
                      )}
                    </li>
                  );
                })
              )}
            </ul>
          </article>
        );
      })}
    </div>
  );
}
