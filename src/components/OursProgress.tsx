import type { ChecklistState, OursPhase } from '../types';
import { OURS_PHASES, currentPhase, overallProgress, phaseProgress } from '../lib/checklists';

interface Props {
  checklist: ChecklistState;
  variant?: 'compact' | 'detailed';
}

export function OursProgress({ checklist, variant = 'compact' }: Props) {
  const overall = overallProgress(checklist);
  const here = currentPhase(checklist);

  return (
    <div className={`ours-progress ours-progress-${variant}`}>
      <div className="ours-progress-bars">
        {OURS_PHASES.map(({ phase, label }) => {
          const { ratio, done, total } = phaseProgress(checklist, phase);
          const status: 'done' | 'active' | 'pending' =
            ratio === 1 ? 'done' : phase === here ? 'active' : 'pending';
          return (
            <div
              key={phase}
              className={`ours-segment ours-segment-${status}`}
              title={`${label}: ${done}/${total}`}
            >
              <div className="ours-segment-fill" style={{ width: `${ratio * 100}%` }} />
              <span className="ours-segment-label">
                <strong>{phase}</strong>
                {variant === 'detailed' ? <small>{label}</small> : null}
              </span>
              {variant === 'detailed' ? (
                <span className="ours-segment-count">
                  {done}/{total}
                </span>
              ) : null}
            </div>
          );
        })}
      </div>
      <div className="ours-progress-meta">
        <span className="ours-progress-here">현재 {here}</span>
        <span className="ours-progress-overall">
          전체 {overall.done}/{overall.total} · {Math.round(overall.ratio * 100)}%
        </span>
      </div>
    </div>
  );
}

export function PhasePill({ phase }: { phase: OursPhase }) {
  const meta = OURS_PHASES.find((p) => p.phase === phase);
  return (
    <span className={`phase-pill phase-pill-${phase.toLowerCase()}`} title={meta?.tagline}>
      <strong>{phase}</strong>
      <small>{meta?.label}</small>
    </span>
  );
}
