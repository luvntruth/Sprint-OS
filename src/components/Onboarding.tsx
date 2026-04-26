import { useState } from 'react';

const STORAGE_KEY = 'ax-hr-sprint-os-onboarding-dismissed-v1';

interface Props {
  mode: 'public' | 'admin';
}

const PUBLIC_STEPS = [
  { title: '내 OURS 위치 확인', body: '현황판과 교육생 화면에서 내 OURS 단계와 다음 체크를 봅니다.' },
  { title: '다음 체크 한 줄 실천', body: '"다음 체크" 한 항목을 골라 모임 전 작은 행동 하나를 합니다.' },
  { title: '결과물 한 번 써보기', body: '3주 안에 만든 작은 결과물을 현업에서 한 번 써보고 변화를 적습니다.' },
];

const ADMIN_STEPS = [
  { title: '데이터 탭에서 참가자 추가', body: '운영실 → 원본 데이터에서 참가자 정보를 입력합니다.' },
  { title: '프로젝트 랩에서 OURS 체크', body: '참가자와 대화하며 OURS 4단계 체크리스트를 함께 채웁니다.' },
  { title: '회고 → 방법론 축적', body: '회고 탭에 운영 메모를 남기고, 효과적인 패턴을 방법론 탭으로 옮깁니다.' },
];

export function Onboarding({ mode }: Props) {
  const [dismissed, setDismissed] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) === '1';
    } catch {
      return false;
    }
  });

  if (dismissed) return null;

  const dismiss = () => {
    try {
      localStorage.setItem(STORAGE_KEY, '1');
    } catch {
      /* noop */
    }
    setDismissed(true);
  };

  const steps = mode === 'public' ? PUBLIC_STEPS : ADMIN_STEPS;

  return (
    <aside className="onboarding-card" aria-label="처음 사용 가이드">
      <div className="onboarding-head">
        <div>
          <p className="eyebrow">처음 오셨나요?</p>
          <h2>Sprint OS · OURS 흐름 1쪽 가이드</h2>
        </div>
        <button type="button" className="subtle" onClick={dismiss} aria-label="가이드 닫기">
          닫기
        </button>
      </div>
      <ol className="onboarding-steps">
        {steps.map((step, index) => (
          <li key={step.title}>
            <span className="onboarding-step-num">{index + 1}</span>
            <div>
              <strong>{step.title}</strong>
              <small>{step.body}</small>
            </div>
          </li>
        ))}
      </ol>
      <p className="onboarding-foot">
        OURS = Own the Problem · Understand the System · Run a Small Project · Share/Reflect/Systemize
      </p>
    </aside>
  );
}
