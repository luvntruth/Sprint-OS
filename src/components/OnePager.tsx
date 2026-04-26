import type { AppState } from '../types';
import { Timeline } from './Timeline';
import { OursProgress, PhasePill } from './OursProgress';
import { currentPhase, overallProgress, nextActionableItem } from '../lib/checklists';
import { stageMeta } from '../uiModel';

interface Props {
  state: AppState;
  mode?: 'public' | 'admin';
}

export function OnePager({ state, mode = 'public' }: Props) {
  const visible = state.participants.filter((p) => mode === 'admin' || p.id !== 'P-0');

  const cohortRatio =
    visible.length === 0
      ? 0
      : visible.reduce((sum, p) => sum + overallProgress(p.checklist ?? {}).ratio, 0) / visible.length;

  const blockedTickets = state.tickets.filter((t) => t.status === 'blocked');
  const stageInfo = stageMeta[state.sprint.currentStage];
  const today = new Date().toISOString().slice(0, 10);

  const handlePrint = () => window.print();

  return (
    <section className="onepager-page">
      <div className="onepager-toolbar no-print">
        <div>
          <p className="eyebrow">One Pager</p>
          <h1>3주 한 페이지 요약</h1>
          <p>참가자·운영자 누구나 한 장으로 본인의 위치와 다음 행동을 확인합니다.</p>
        </div>
        <button type="button" onClick={handlePrint}>인쇄 / PDF로 저장</button>
      </div>

      <article className="onepager-sheet" aria-label="3주 한 페이지 요약 시트">
        <header className="op-head">
          <div>
            <p className="eyebrow">{state.sprint.title || 'AX × HR Sprint OS'}</p>
            <h2>{stageInfo.label}</h2>
            <p className="op-purpose">{state.sprint.purpose}</p>
          </div>
          <div className="op-meta-block">
            <div>
              <span>기간</span>
              <strong>
                {state.sprint.startDate || '미정'} ~ {state.sprint.endDate || '미정'}
              </strong>
            </div>
            <div>
              <span>오늘</span>
              <strong>{today}</strong>
            </div>
            <div>
              <span>코호트 평균 OURS</span>
              <strong>{Math.round(cohortRatio * 100)}%</strong>
            </div>
          </div>
        </header>

        <section className="op-timeline">
          <Timeline sprint={state.sprint} />
        </section>

        <section className="op-participants">
          <header className="op-section-head">
            <h3>참가자별 진행</h3>
            <small>{visible.length}명 · OURS 위치 · 다음 행동</small>
          </header>
          <div className="op-participant-grid">
            {visible.map((p) => {
              const checklist = p.checklist ?? {};
              const here = currentPhase(checklist);
              const next = nextActionableItem(checklist);
              const overall = overallProgress(checklist);
              return (
                <article key={p.id} className="op-participant-card">
                  <div className="op-participant-head">
                    <strong>{p.id} · {p.displayName || '이름 미정'}</strong>
                    <PhasePill phase={here} />
                  </div>
                  <small className="op-role">{p.role || '역할/맥락 미입력'}</small>

                  <OursProgress checklist={checklist} variant="compact" />

                  <dl className="op-fields">
                    <div>
                      <dt>답답함</dt>
                      <dd>{p.problemStatement || '아직 정리 전'}</dd>
                    </div>
                    <div>
                      <dt>결과물 후보</dt>
                      <dd>{p.outputCandidate || '미정'}</dd>
                    </div>
                    <div>
                      <dt>이번 주 행동</dt>
                      <dd>{p.nextAction || (next ? `${next.phase}: ${next.label}` : '회고와 케이스 정리')}</dd>
                    </div>
                  </dl>

                  <div className="op-progress-foot">
                    <small>완료 {overall.done}/{overall.total}</small>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section className="op-blockers">
          <header className="op-section-head">
            <h3>지금 막힌 것</h3>
            <small>{blockedTickets.length}건</small>
          </header>
          {blockedTickets.length === 0 ? (
            <p className="op-empty">현재 막힌 항목 없음.</p>
          ) : (
            <ul className="op-blocker-list">
              {blockedTickets.map((t) => (
                <li key={t.id}>
                  <strong>{t.title}</strong>
                  <small>{stageMeta[t.stage].shortLabel} · {t.owner}</small>
                </li>
              ))}
            </ul>
          )}
        </section>

        <footer className="op-foot">
          <small>
            Humanistic Practice Lab · AX × HR Sprint OS · {new Date().toLocaleString('ko-KR')}
          </small>
        </footer>
      </article>
    </section>
  );
}
