export type Stage = 'prep' | 'week1' | 'week2' | 'week3' | 'wrapup';
export type TicketStatus = 'todo' | 'doing' | 'done' | 'blocked';
export type TicketOwner = 'operator' | 'participant' | 'ai';
export type AnalysisType = 'survey' | 'reflection' | 'weekly-review' | 'final-method';

export interface Sprint {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  purpose: string;
  currentStage: Stage;
  notes: string;
}

export interface ProjectLifecycle {
  ownProblem: string;
  understandSystem: string;
  smallProject: string;
  shareReflectSystemize: string;
  goalConversation: string;
  strategyConversation: string;
  retrospectiveConversation: string;
  fieldTest: string;
  caseNote: string;
}

export interface FacilitatorNote {
  diagnosis: string;
  followUpQuestions: string;
  scopeReduction: string;
  missedQuestions: string;
  interventionLog: string;
}

export interface Participant {
  id: string;
  displayName: string;
  role: string;
  surveyRawText: string;
  problemStatement: string;
  problemType: string;
  desiredOutcome: string;
  aiLeveragePoint: string;
  outputCandidate: string;
  successCriteria: string;
  leaderHighRelevance: string;
  consultingTrainingPoint: string;
  analysisMarkdown: string;
  publicSummary: string;
  currentProgress: string;
  nextAction: string;
  participantUpdate: string;
  lifecycle: ProjectLifecycle;
  facilitatorNote: FacilitatorNote;
}


export interface Ticket {
  id: string;
  sprintId: string;
  stage: Stage;
  title: string;
  description: string;
  owner: TicketOwner;
  status: TicketStatus;
  priority: 'low' | 'medium' | 'high';
  generatedBy: 'template' | 'ai' | 'manual';
}

export interface Analysis {
  id: string;
  sprintId: string;
  participantId?: string;
  inputText: string;
  outputMarkdown: string;
  analysisType: AnalysisType;
  createdAt: string;
}

export interface Reflection {
  id: string;
  sprintId: string;
  stage: Stage;
  rawText: string;
  consultantReflectionMarkdown: string;
  nextActionsMarkdown: string;
  createdAt: string;
}

export interface MethodLibrary {
  philosophy: string;
  methodName: string;
  principles: string;
  effectiveQuestions: string;
  aiUsePatterns: string;
  scopeReductionPatterns: string;
  dialoguePatterns: string;
  cohortRetrospective: string;
}

export interface AppState {
  sprint: Sprint;
  participants: Participant[];
  tickets: Ticket[];
  analyses: Analysis[];
  reflections: Reflection[];
  methodLibrary: MethodLibrary;
}
