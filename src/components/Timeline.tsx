import type { Sprint, Stage } from '../types';

const STAGES: Array<{ id: Stage; label: string }> = [
  { id: 'prep', label: '준비' },
  { id: 'week1', label: '1주차' },
  { id: 'week2', label: '2주차' },
  { id: 'week3', label: '3주차' },
  { id: 'wrapup', label: '마무리' },
];

interface Props {
  sprint: Sprint;
  today?: Date;
}

function parseDate(value: string): Date | null {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function todayProgressRatio(start: Date | null, end: Date | null, today: Date): number | null {
  if (!start || !end) return null;
  const span = end.getTime() - start.getTime();
  if (span <= 0) return null;
  const elapsed = today.getTime() - start.getTime();
  if (elapsed < 0) return 0;
  if (elapsed > span) return 1;
  return elapsed / span;
}

function formatDate(date: Date | null): string {
  if (!date) return '미정';
  return date.toISOString().slice(0, 10);
}

export function Timeline({ sprint, today = new Date() }: Props) {
  const start = parseDate(sprint.startDate);
  const end = parseDate(sprint.endDate);
  const progress = todayProgressRatio(start, end, today);
  const currentIndex = STAGES.findIndex((s) => s.id === sprint.currentStage);

  return (
    <div className="timeline" role="img" aria-label="스프린트 진행 타임라인">
      <div className="timeline-meta">
        <span className="timeline-date">시작 {formatDate(start)}</span>
        <span className="timeline-current">현재 {STAGES[currentIndex]?.label ?? sprint.currentStage}</span>
        <span className="timeline-date">종료 {formatDate(end)}</span>
      </div>

      <div className="timeline-track">
        {progress !== null && (
          <div
            className="timeline-today"
            style={{ left: `${progress * 100}%` }}
            aria-label={`오늘 위치 ${Math.round(progress * 100)}%`}
          >
            <span className="timeline-today-dot" />
            <span className="timeline-today-label">오늘</span>
          </div>
        )}
        <ol className="timeline-stages">
          {STAGES.map((stage, index) => {
            const status =
              index < currentIndex ? 'past' : index === currentIndex ? 'current' : 'future';
            return (
              <li key={stage.id} className={`timeline-stage timeline-stage-${status}`}>
                <span className="timeline-stage-marker" aria-hidden />
                <span className="timeline-stage-label">{stage.label}</span>
              </li>
            );
          })}
        </ol>
      </div>

      {!start || !end ? (
        <p className="timeline-hint">시작일·종료일을 입력하면 오늘 위치 마커가 표시됩니다.</p>
      ) : null}
    </div>
  );
}
