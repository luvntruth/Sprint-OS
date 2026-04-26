import type { AppState } from '../types';
import { exportMarkdown } from '../exportMarkdown';

interface Props { state: AppState; }

function exportFileName(title: string) {
  const safeTitle = title.replace(/[^a-zA-Z0-9가-힣-_]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
  const date = new Date().toISOString().slice(0, 10);
  return `${date}-${safeTitle || 'ax-hr-sprint-os'}-export.md`;
}

export function ExportPanel({ state }: Props) {
  const markdown = exportMarkdown(state);
  const filename = exportFileName(state.sprint.title);
  const download = () => {
    const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section className="panel export-panel">
      <div className="section-head clean-head">
        <div>
          <p className="eyebrow">Obsidian Export</p>
          <h1>Markdown 내보내기</h1>
        </div>
        <span>{filename}</span>
      </div>
      <div className="notice">
        <strong>Export 구성</strong>
        <ul>
          <li>YAML frontmatter와 Obsidian wikilink 포함</li>
          <li>단계별 티켓 체크리스트와 참가자별 Case Note 포함</li>
          <li>Public Sharing Snapshot은 교육생 공유 가능 내용만 따로 분리</li>
          <li>Facilitator Notes는 비공개 운영자용 섹션으로 명시</li>
        </ul>
      </div>
      <div className="toolbar">
        <button onClick={() => navigator.clipboard.writeText(markdown)}>Markdown 복사</button>
        <button className="subtle" onClick={download}>파일 다운로드</button>
      </div>
      <textarea className="export-textarea" readOnly value={markdown} />
    </section>
  );
}
