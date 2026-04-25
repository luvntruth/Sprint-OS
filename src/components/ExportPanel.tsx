import type { AppState } from '../types';
import { exportMarkdown } from '../exportMarkdown';

interface Props { state: AppState; }
export function ExportPanel({ state }: Props) {
  const markdown = exportMarkdown(state);
  const download = () => {
    const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ax-hr-sprint-os-export.md';
    a.click();
    URL.revokeObjectURL(url);
  };
  return <section className="panel"><h1>Markdown Export</h1><div className="toolbar"><button onClick={()=>navigator.clipboard.writeText(markdown)}>Markdown 복사</button><button onClick={download}>파일 다운로드</button></div><textarea readOnly value={markdown} /></section>;
}
