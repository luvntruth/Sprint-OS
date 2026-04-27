interface Props {
  mode: 'public' | 'admin';
}

export function Onboarding({ mode }: Props) {
  return (
    <aside className="context-strip" aria-label="화면 맥락">
      <strong>{mode === 'public' ? '처음 보는 분을 위한 안내' : '운영자 화면 안내'}</strong>
      <span>
        {mode === 'public'
          ? '이 화면은 3주 실천 모임의 진행판입니다. 지금 단계, 내 카드, 이번 주 할 일을 순서대로 확인하면 됩니다.'
          : '이 화면은 참가자에게 보여줄 공유 화면을 관리하고, 운영자가 비공개 입력을 남기는 확장 화면입니다.'}
      </span>
    </aside>
  );
}
