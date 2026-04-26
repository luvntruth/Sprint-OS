import type { AppState, Participant } from './types';
import { getParticipantNextAction, getParticipantStatus, getStageCompletion, getTicketCounts, stageMeta, stageOrder } from './uiModel';

function value(text?: string) {
  return text?.trim() || '-';
}

function oneLine(text?: string) {
  return value(text).replace(/\s+/g, ' ');
}

function block(text?: string) {
  return value(text).replace(/\n/g, '\n  ');
}

function tableCell(text?: string) {
  return oneLine(text).replace(/\|/g, '\\|');
}

function heading(text?: string) {
  return oneLine(text).replace(/#/g, '\\#');
}

function yamlString(text?: string) {
  return JSON.stringify(value(text));
}

function fencedCode(text?: string, language = 'text') {
  const content = value(text);
  const longestFence = Math.max(2, ...Array.from(content.matchAll(/`+/g), (match) => match[0].length));
  const fence = '`'.repeat(longestFence + 1);
  return `${fence}${language}\n${content}\n${fence}`;
}

function participantSection(p: Participant) {
  return `### ${p.id} — ${heading(p.displayName)}

| 항목 | 내용 |
|---|---|
| 역할 | ${tableCell(p.role)} |
| 상태 | ${tableCell(getParticipantStatus(p))} |
| 문제 유형 | ${tableCell(p.problemType)} |
| 다음 액션 | ${tableCell(p.nextAction || getParticipantNextAction(p))} |

#### 문제 정의
${value(p.problemStatement)}

#### 원하는 변화
${value(p.desiredOutcome)}

#### AI 적용 가능 지점
${value(p.aiLeveragePoint)}

#### 3주 결과물 후보
${value(p.outputCandidate)}

#### 성공 기준
${value(p.successCriteria)}

#### 참가자 공유용 요약
${value(p.publicSummary)}

#### 현재 진행상황 / 업데이트
- 현재 진행상황: ${value(p.currentProgress)}
- 참가자 업데이트: ${value(p.participantUpdate)}

#### OURS Lifecycle
- **O / Own the Problem:** ${block(p.lifecycle.ownProblem)}
- **U / Understand the System:** ${block(p.lifecycle.understandSystem)}
- **R / Run a Small Project:** ${block(p.lifecycle.smallProject)}
- **S / Share, Reflect, Systemize:** ${block(p.lifecycle.shareReflectSystemize)}
- **목표 설정 대화:** ${block(p.lifecycle.goalConversation)}
- **전략 수립 대화:** ${block(p.lifecycle.strategyConversation)}
- **회고 대화:** ${block(p.lifecycle.retrospectiveConversation)}
- **현업 테스트:** ${block(p.lifecycle.fieldTest)}
- **Case Note:** ${block(p.lifecycle.caseNote)}

#### Facilitator Notes — 비공개 운영자용
- **진단:** ${block(p.facilitatorNote.diagnosis)}
- **후속 질문:** ${block(p.facilitatorNote.followUpQuestions)}
- **범위 축소:** ${block(p.facilitatorNote.scopeReduction)}
- **놓친 질문:** ${block(p.facilitatorNote.missedQuestions)}
- **개입 기록:** ${block(p.facilitatorNote.interventionLog)}

#### 문턱장 훈련 / 사업 연결
- 컨설팅 훈련 포인트: ${value(p.consultingTrainingPoint)}
- Leader's High 연결 가능성: ${value(p.leaderHighRelevance)}

#### 설문 원문
${fencedCode(p.surveyRawText)}

#### AI 분석 결과
${value(p.analysisMarkdown)}
`;
}

export function exportMarkdown(state: AppState): string {
  const { sprint, participants, tickets, analyses, reflections, methodLibrary } = state;
  const ticketCounts = getTicketCounts(tickets);
  const now = new Date().toISOString();
  const publicParticipants = participants.filter((participant) => participant.id !== 'P-0');

  return `---
type: ${yamlString('sprint-os-export')}
project: ${yamlString('AX x HR Sprint OS')}
sprint: ${yamlString(sprint.title)}
stage: ${yamlString(sprint.currentStage)}
exported_at: ${yamlString(now)}
tags:
  - Humanistic
  - AX-HR
  - Sprint-OS
  - OURS-Method
---

# ${heading(sprint.title)} 운영 Export

> [[15-humanistic-practice-lab-business-philosophy]] · [[16-ours-method-v0-1]] · [[17-sprint-os-operation-and-sharing-manual]]

## 1. Executive Summary

- **목적:** ${sprint.purpose}
- **현재 단계:** ${stageMeta[sprint.currentStage]?.label ?? sprint.currentStage}
- **기간:** ${sprint.startDate || '-'} ~ ${sprint.endDate || '-'}
- **전체 티켓:** ${ticketCounts.done}/${ticketCounts.total} 완료, ${ticketCounts.open} open, ${ticketCounts.blocked} blocked
- **참가자:** ${participants.length}명 incl. P-0 / 교육생 ${publicParticipants.length}명

## 2. 운영 메모

${value(sprint.notes)}

## 3. Stage Progress

${stageOrder.map((stage) => {
  const completion = getStageCompletion(tickets, stage);
  const stageTickets = tickets.filter((ticket) => ticket.stage === stage);
  return `### ${stageMeta[stage].label}

- 목적: ${stageMeta[stage].purpose}
- 산출물: ${stageMeta[stage].outcome}
- 완료: ${completion.done}/${completion.total}

${stageTickets.map((ticket) => `- [${ticket.status === 'done' ? 'x' : ' '}] **${ticket.title}** \`${ticket.owner}/${ticket.priority}/${ticket.status}\`\n  - ${ticket.description || '-'}`).join('\n') || '- 티켓 없음'}
`;
}).join('\n')}

## 4. Participant Case Notes

${participants.map(participantSection).join('\n---\n')}

## 5. Public Sharing Snapshot

> 참가자와 공유 가능한 요약입니다. 민감한 회사명/개인명/운영자 진단은 제외하고 사용하세요.

${publicParticipants.map((participant) => `### ${participant.id}
${value(participant.publicSummary)}

- 상태: ${value(getParticipantStatus(participant))}
- 다음 액션: ${value(participant.nextAction || getParticipantNextAction(participant))}
`).join('\n') || '-'}

## 6. Method Library

- **이름:** ${methodLibrary.methodName}
- **철학:** ${methodLibrary.philosophy}
- **원칙:** ${methodLibrary.principles}
- **효과적 질문:** ${value(methodLibrary.effectiveQuestions)}
- **AI 활용 패턴:** ${value(methodLibrary.aiUsePatterns)}
- **범위 축소 패턴:** ${value(methodLibrary.scopeReductionPatterns)}
- **대화 패턴:** ${value(methodLibrary.dialoguePatterns)}
- **기수 회고:** ${value(methodLibrary.cohortRetrospective)}

## 7. Analyses

${analyses.map((analysis) => `### ${analysis.analysisType} — ${analysis.createdAt}

- participant: ${analysis.participantId || '-'}

${value(analysis.outputMarkdown)}`).join('\n\n') || '-'}

## 8. Reflections

${reflections.map((reflection) => `### ${reflection.stage} — ${reflection.createdAt}

#### Raw
${value(reflection.rawText)}

#### Consultant Reflection
${value(reflection.consultantReflectionMarkdown)}

#### Next Actions
${value(reflection.nextActionsMarkdown)}`).join('\n\n') || '-'}

## 9. Next Operating Checklist

- [ ] Google Form 응답 최신 상태 확인
- [ ] P-1~P-3 다음 액션이 실제 행동 문장인지 확인
- [ ] Public View에서 민감정보가 보이지 않는지 확인
- [ ] 모임 직후 Reflection 탭에 문턱장 회고 작성
- [ ] Export 내용을 Obsidian 운영 노트로 저장
`;
}
