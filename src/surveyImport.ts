import type { Participant, Stage } from './types';

const fieldLabels: Array<[keyof Participant, string[]]> = [
  ['displayName', ['이름', '성함', '닉네임', '호칭']],
  ['role', ['역할', '직무', '소속', '하는 일', '업무']],
  ['problemStatement', ['문제', '현업 문제', '해결하고 싶은 문제', '다루고 싶은 문제', '불편한 상황', '반복되는 문제']],
  ['problemType', ['문제 유형', '유형', '카테고리']],
  ['desiredOutcome', ['원하는 변화', '기대 결과', '바라는 결과', '3주 후 변화', '목표']],
  ['aiLeveragePoint', ['AI 활용', 'AI 적용', 'AI로', '인공지능', '자동화', '도움받고 싶은 지점']],
  ['outputCandidate', ['결과물', '산출물', '만들고 싶은 것', 'v0.1', '프로토타입', '템플릿']],
  ['successCriteria', ['성공 기준', '성공', '어떻게 알 수', '완료 기준']],
  ['currentProgress', ['현재 상황', '지금 상황', '진행상황', '어디까지']],
  ['participantUpdate', ['메모', '추가 설명', '비고', '업데이트']],
];

function normalize(text: string) {
  return text.toLowerCase().replace(/\s+/g, ' ').trim();
}

function cleanAnswer(value: string) {
  return value
    .replace(/^[:：\-–—\s]+/, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function lineLooksLikeLabel(line: string) {
  const normalized = normalize(line.replace(/[:：?？]$/, ''));
  return fieldLabels.some(([, labels]) => labels.some((label) => normalized.includes(normalize(label))));
}

function extractField(rawText: string, labels: string[]) {
  const lines = rawText.split(/\r?\n/);
  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    const normalizedLine = normalize(line);
    const matched = labels.some((label) => normalizedLine.includes(normalize(label)));
    if (!matched) continue;

    const inlineMatch = line.match(/[:：]\s*(.+)$/);
    if (inlineMatch?.[1]?.trim()) return cleanAnswer(inlineMatch[1]);

    const answerLines: string[] = [];
    for (let next = index + 1; next < lines.length; next += 1) {
      const candidate = lines[next];
      if (candidate.trim() && lineLooksLikeLabel(candidate)) break;
      if (candidate.trim()) answerLines.push(candidate.trim());
    }
    const answer = cleanAnswer(answerLines.join('\n'));
    if (answer) return answer;
  }
  return '';
}

function fallbackProblem(rawText: string) {
  const lines = rawText.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  const useful = lines.filter((line) => !lineLooksLikeLabel(line) && line.length > 12);
  return useful[0] ?? '';
}

export function parseSurveyText(rawText: string): Partial<Participant> {
  const patch: Partial<Participant> = { surveyRawText: rawText.trim() };
  for (const [field, labels] of fieldLabels) {
    const extracted = extractField(rawText, labels);
    if (extracted) {
      (patch as Record<string, string>)[field] = extracted;
    }
  }

  if (!patch.problemStatement) {
    const fallback = fallbackProblem(rawText);
    if (fallback) patch.problemStatement = fallback;
  }

  return patch;
}

export function mergeSurveyPatch(participant: Participant, patch: Partial<Participant>) {
  const merged: Partial<Participant> = { surveyRawText: patch.surveyRawText ?? participant.surveyRawText };
  for (const key of Object.keys(patch) as Array<keyof Participant>) {
    const value = patch[key];
    if (typeof value === 'string' && value.trim() && !String(participant[key] ?? '').trim()) {
      (merged as Record<string, string>)[key] = value;
    }
  }
  return merged;
}

export function suggestNextAction(participant: Participant, stage: Stage) {
  if (!participant.surveyRawText.trim()) {
    return '사전 설문에 답하고, 최근 현업에서 반복해서 막히는 상황 예시 1~2개를 적어옵니다.';
  }
  if (!participant.problemStatement.trim()) {
    return '설문 응답을 바탕으로 내가 다루고 싶은 문제를 한 문장으로 정리합니다.';
  }
  if (stage === 'prep') {
    return '첫 모임 전까지 문제 상황 예시 2개와 관련 이해관계자/대화 맥락을 준비합니다.';
  }
  if (stage === 'week1' && !participant.outputCandidate.trim()) {
    return '문제 정의를 바탕으로 3주 안에 만들 수 있는 v0.1 결과물 후보 1개를 정합니다.';
  }
  if (stage === 'week1' && !participant.successCriteria.trim()) {
    return 'v0.1 결과물이 충분히 도움이 됐는지 판단할 성공 기준 1개를 정합니다.';
  }
  if (stage === 'week2' && !participant.lifecycle.smallProject.trim()) {
    return 'v0.1 결과물을 실제 문서/프롬프트/체크리스트 형태로 한 번 만들어봅니다.';
  }
  if (stage === 'week3' && !participant.lifecycle.fieldTest.trim()) {
    return '만든 v0.1 결과물을 실제 현업 맥락에서 한 번 사용하고 반응을 기록합니다.';
  }
  if (!participant.lifecycle.caseNote.trim()) {
    return 'Before/After Case Note로 문제, 만든 것, 사용 반응, 배운 점을 정리합니다.';
  }
  return '이번 실험에서 배운 점과 다음에 반복할 수 있는 방식을 3문장으로 정리합니다.';
}

export function buildPublicSummary(participant: Participant) {
  if (participant.publicSummary.trim()) return participant.publicSummary;
  if (participant.problemStatement.trim() && participant.outputCandidate.trim()) {
    return `${participant.problemStatement}\n\n3주 결과물 후보: ${participant.outputCandidate}`;
  }
  if (participant.problemStatement.trim()) return participant.problemStatement;
  return '첫 모임에서 함께 문제를 정리할 예정입니다.';
}
