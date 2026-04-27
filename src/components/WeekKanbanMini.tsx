import type { Stage, Ticket } from '../types';

interface Props {
  tickets: Ticket[];
  stage: Stage;
  onJump?: () => void;
}

const COLUMNS: Array<{ key: Ticket['status']; label: string }> = [
  { key: 'todo', label: '할 일' },
  { key: 'doing', label: '진행' },
  { key: 'done', label: '완료' },
];

export function WeekKanbanMini({ tickets, stage, onJump }: Props) {
  const stageTickets = tickets.filter((t) => t.stage === stage);
  const blockedCount = stageTickets.filter((t) => t.status === 'blocked').length;

  const body = (
    <>
      <div className="kanban-mini-cols">
        {COLUMNS.map((col) => {
          const count = stageTickets.filter((t) => t.status === col.key).length;
          return (
            <div key={col.key} className={`kanban-mini-col kanban-${col.key}`}>
              <span className="kanban-mini-count">{count}</span>
              <span className="kanban-mini-label">{col.label}</span>
            </div>
          );
        })}
      </div>
      {blockedCount > 0 ? (
        <p className="kanban-mini-blocked">
          <span className="dist-blocker-dot" aria-hidden /> 막힘 {blockedCount}건
        </p>
      ) : null}
    </>
  );

  return onJump ? (
    <button type="button" onClick={onJump} className="week-kanban-mini interactive" aria-label="이번 단계 칸반 미니">
      {body}
    </button>
  ) : (
    <div className="week-kanban-mini" aria-label="이번 단계 칸반 미니">
      {body}
    </div>
  );
}
