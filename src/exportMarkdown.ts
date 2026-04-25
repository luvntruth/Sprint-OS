import type { AppState } from './types';

export function exportMarkdown(state: AppState): string {
  const { sprint, participants, tickets, analyses, reflections } = state;
  return `# ${sprint.title} 운영 Export

## Sprint
- 목적: ${sprint.purpose}
- 현재 단계: ${sprint.currentStage}
- 기간: ${sprint.startDate || '-'} ~ ${sprint.endDate || '-'}

## Notes
${sprint.notes || '-'}

## Participants
${participants.map((p) => `### ${p.id} — ${p.displayName}
- 역할: ${p.role || '-'}
- 문제 정의: ${p.problemStatement || '-'}
- 문제 유형: ${p.problemType || '-'}
- 원하는 변화: ${p.desiredOutcome || '-'}
- AI 적용 지점: ${p.aiLeveragePoint || '-'}
- 결과물 후보: ${p.outputCandidate || '-'}
- 성공 기준: ${p.successCriteria || '-'}
- 공유용 요약: ${p.publicSummary || '-'}
- 현재 진행상황: ${p.currentProgress || '-'}
- 다음 액션: ${p.nextAction || '-'}
- 참가자 업데이트: ${p.participantUpdate || '-'}
- 컨설팅 훈련 포인트: ${p.consultingTrainingPoint || '-'}
- Leader's High 연결: ${p.leaderHighRelevance || '-'}

#### OURS Lifecycle
- O / Own the Problem: ${p.lifecycle.ownProblem || '-'}
- U / Understand the System: ${p.lifecycle.understandSystem || '-'}
- R / Run a Small Project: ${p.lifecycle.smallProject || '-'}
- S / Share, Reflect, Systemize: ${p.lifecycle.shareReflectSystemize || '-'}
- 목표 설정 대화: ${p.lifecycle.goalConversation || '-'}
- 전략 수립 대화: ${p.lifecycle.strategyConversation || '-'}
- 회고 대화: ${p.lifecycle.retrospectiveConversation || '-'}
- 현업 테스트: ${p.lifecycle.fieldTest || '-'}
- Case Note: ${p.lifecycle.caseNote || '-'}

#### Facilitator Notes
- 진단: ${p.facilitatorNote.diagnosis || '-'}
- 후속 질문: ${p.facilitatorNote.followUpQuestions || '-'}
- 범위 축소: ${p.facilitatorNote.scopeReduction || '-'}
- 놓친 질문: ${p.facilitatorNote.missedQuestions || '-'}
- 개입 기록: ${p.facilitatorNote.interventionLog || '-'}

#### 분석 결과
${p.analysisMarkdown || '-'}
`).join('\n')}

## Method Library
- 이름: ${state.methodLibrary.methodName}
- 철학: ${state.methodLibrary.philosophy}
- 원칙: ${state.methodLibrary.principles}
- 효과적 질문: ${state.methodLibrary.effectiveQuestions || '-'}
- AI 활용 패턴: ${state.methodLibrary.aiUsePatterns || '-'}
- 범위 축소 패턴: ${state.methodLibrary.scopeReductionPatterns || '-'}
- 대화 패턴: ${state.methodLibrary.dialoguePatterns || '-'}
- 기수 회고: ${state.methodLibrary.cohortRetrospective || '-'}

## Tickets
${tickets.map((t) => `- [${t.status}] (${t.stage}/${t.priority}/${t.owner}) ${t.title}\n  - ${t.description}`).join('\n')}

## Analyses
${analyses.map((a) => `### ${a.analysisType} — ${a.createdAt}\n${a.outputMarkdown}`).join('\n\n') || '-'}

## Reflections
${reflections.map((r) => `### ${r.stage} — ${r.createdAt}\n\n#### Raw\n${r.rawText}\n\n#### Consultant Reflection\n${r.consultantReflectionMarkdown}\n\n#### Next Actions\n${r.nextActionsMarkdown}`).join('\n\n') || '-'}
`;
}
