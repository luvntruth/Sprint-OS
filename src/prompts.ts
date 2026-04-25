import type { Participant, Stage } from './types';

export function generateSurveyAnalysisPrompt(participant: Participant): string {
  return `아래 참가자 설문 응답을 HR AX 컨설턴트 훈련 관점에서 분석해줘.

중요한 우선순위:
1. 문턱장이 HR AX 컨설턴트로 훈련되는 것
2. 참가자가 자기 현업 문제를 작게 해결해보는 것
3. Humanistic 방법론 자산을 축적하는 것
4. Leader's High 연결 가능성은 자연스럽게만 확인하는 것

참가자: ${participant.id} / ${participant.displayName}
역할: ${participant.role || '(미입력)'}

[설문 원문]
${participant.surveyRawText || '(설문 원문 없음)'}

출력 형식은 아래 Markdown을 반드시 지켜줘.

## 1. 원문 pain 요약

## 2. 문제 유형

## 3. 현재 workaround

## 4. 원하는 변화

## 5. AI 적용 가능 지점

## 6. 3주 결과물 후보

## 7. 범위 축소 제안

## 8. 첫 모임 후속 질문 3개
1.
2.
3.

## 9. 문턱장 컨설팅 훈련 포인트

## 10. Humanistic 방법론 후보

## 11. Leader's High 연결 가능성
`;
}

export function generateReflectionPrompt(stage: Stage, rawText: string): string {
  return `아래는 AX x HR 실천 모임 ${stage} 단계 이후 문턱장의 운영 메모/회고 원문이야.
문턱장이 HR AX 컨설턴트로 훈련되는 관점에서 분석하고 다음 단계 티켓을 제안해줘.

[회고 원문]
${rawText || '(회고 원문 없음)'}

출력 형식:

## 1. 오늘 내가 들은 문제

## 2. 처음에는 문제처럼 보였지만, 더 깊이 보니 달랐던 것

## 3. 내가 잘한 질문

## 4. 내가 놓친 질문

## 5. AI 적용 판단
- 적합했던 지점:
- 부적합하거나 조심해야 할 지점:

## 6. 내가 제안한 실험 범위 평가

## 7. 참가자가 실제로 실행 가능해 보였는가

## 8. 다음번 같은 상황에서 더 잘할 점

## 9. Humanistic 방법론으로 남길 문장

## 10. 다음 단계 티켓 제안
- [ ]
- [ ]
- [ ]
`;
}

export function generateNextTicketPrompt(stage: Stage, context: string): string {
  return `AX x HR 실천 모임의 현재 단계는 ${stage}야.
아래 맥락을 바탕으로 다음 단계 티켓을 생성해줘.

[맥락]
${context}

출력 형식:

## 추천 티켓
### 1. 제목
- stage:
- owner:
- priority:
- description:
- done 기준:

### 2. 제목
- stage:
- owner:
- priority:
- description:
- done 기준:

### 3. 제목
- stage:
- owner:
- priority:
- description:
- done 기준:
`;
}
