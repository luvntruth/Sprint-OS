import type { AppState, MethodLibrary as MethodLibraryType } from '../types';

interface Props {
  state: AppState;
  setState: (state: AppState) => void;
}

const fields: Array<[keyof MethodLibraryType, string]> = [
  ['philosophy', '비즈니스 철학'],
  ['methodName', '방법론 이름'],
  ['principles', '핵심 원칙'],
  ['effectiveQuestions', '효과적 질문'],
  ['aiUsePatterns', 'AI 활용 패턴'],
  ['scopeReductionPatterns', '프로젝트 범위 축소 패턴'],
  ['dialoguePatterns', '대화 패턴'],
  ['cohortRetrospective', '기수 회고 / 다음 기수 개선안'],
];

export function MethodLibrary({ state, setState }: Props) {
  const update = (patch: Partial<MethodLibraryType>) => {
    setState({ ...state, methodLibrary: { ...state.methodLibrary, ...patch } });
  };

  return (
    <section className="panel method-library">
      <div className="hero-card method">
        <p className="eyebrow">Method Library</p>
        <h1>OURS Method 방법론 라이브러리</h1>
        <p>조직은 우리답게, 개인은 자기답게 일하기 위한 Humanistic만의 실천 방법론을 축적합니다.</p>
      </div>

      <div className="method-grid">
        <article className="method-card"><strong>O</strong><span>Own the Problem</span><p>문제를 자기 언어로 소유한다.</p></article>
        <article className="method-card"><strong>U</strong><span>Understand the System</span><p>문제가 생기는 시스템을 이해한다.</p></article>
        <article className="method-card"><strong>R</strong><span>Run a Small Project</span><p>작고 실제적인 프로젝트로 실험한다.</p></article>
        <article className="method-card"><strong>S</strong><span>Share, Reflect, Systemize</span><p>공유하고 회고하며 시스템으로 만든다.</p></article>
      </div>

      {fields.map(([key, label]) => (
        <label key={key}>
          {label}
          <textarea value={state.methodLibrary[key]} onChange={(event) => update({ [key]: event.target.value } as Partial<MethodLibraryType>)} />
        </label>
      ))}
    </section>
  );
}
