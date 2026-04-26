# Claude Code Review Context — AX x HR Sprint OS / Humanistic Practice Lab

## 1. Project Overview

This project is called **AX x HR Sprint OS**.

It is a Vite + React + TypeScript web app built to operate the first cohort of an **AX x HR practice group** led by the founder of **Humanistic**, an HR AX consulting company.

The app is not just a generic project management tool. It is intended to become an operating system for a project-based practice community where HR practitioners bring their own real workplace problems, use AI to turn those problems into small projects, test outputs in the field, and reflect on the results.

The deeper business/philosophical umbrella is:

```text
Humanistic Practice Lab
```

The core philosophy is:

```text
조직은 우리답게,
개인은 자기답게 일해야 한다.
```

Rough English meaning:

```text
Organizations should work in their own way,
and individuals should work as themselves.
```

The app exists to support a structured operating loop:

```text
problem listening
→ problem structuring
→ project shaping
→ small execution
→ field test
→ reflection
→ methodology accumulation
```

The first cohort is intentionally small:

```text
P-0: Founder / facilitator / HR AX consultant-in-training
P-1: Participant 1
P-2: Participant 2
P-3: Participant 3
```

The first cohort’s purpose priority is:

```text
1. Train the founder as an HR AX consultant.
2. Help 3 participants solve their own workplace problems with AI in a small, practical way.
3. Accumulate Humanistic’s HR AX consulting methodology v0.1.
4. Naturally discover possible Leader’s High scenarios, pilots, content, or consulting opportunities.
```

Important: This is **not primarily a sales funnel**. It may later produce business insight, but the first purpose is founder training and participant value.

---

## 2. Business Context

### Humanistic

Humanistic is the founder’s HR AX consulting company.

Positioning:

```text
Humanistic helps HR and organizational leaders adopt AI in practical human-centered work,
starting from real HR problems and conversation-based execution systems.
```

### Leader’s High

Leader’s High is the founder’s first service/product. It is a leadership conversation training product, especially useful for difficult conversations, feedback conversations, goal-setting conversations, and leadership practice.

Leader’s High is related to this project, but it is not the main focus of the first cohort.

The natural connection is:

```text
AX x HR practice group
→ real HR problems
→ leadership/conversation scenarios
→ Leader’s High scenario/content/pilot opportunities
```

But again, the first cohort must not feel like a sales funnel.

---

## 3. Core Methodology — OURS Method

The app and community are organized around **OURS Method v0.1**:

```text
O — Own the Problem
U — Understand the System
R — Run a Small Project
S — Share, Reflect, Systemize
```

Meaning:

```text
O: Define the problem in the participant’s own language.
U: Understand the people, flow, information, tools, goals, and conversations that make the problem repeat.
R: Reduce the problem into a small project that can be tested in 3 weeks.
S: Share, reflect, and systemize the learning into reusable practice/methodology.
```

AI is not the center as “AI education.”  
AI is treated as an execution and conversation amplifier:

```text
AI does not replace conversation.
AI makes conversation, execution, and reflection clearer and more repeatable.
```

---

## 4. First Cohort Operating Model

The first cohort runs for 3 weeks.

```text
Week 0 / Prep:
- Create Google Form pre-survey.
- Send survey to 3 participants.
- Collect responses.
- Enter participant data into Sprint OS.
- Prepare follow-up questions.
- Rehearse first session and screen sharing.

Week 1:
- Problem definition.
- Each participant defines one problem statement.
- Each participant chooses one v0.1 output candidate.
- Each participant defines a success criterion.
- Founder writes facilitator reflection.

Week 2:
- Build v0.1 output.
- Output can be a prompt, checklist, conversation script, document template, simple workflow, etc.
- Keep scope small enough to test in the field.
- Reflect on what questions and interventions helped.

Week 3:
- Field test.
- Each participant uses the v0.1 output once in a real work context.
- Capture reaction, blockage, learning, and next improvement.
- Write Before/After Case Note.

Wrap-up:
- Update Humanistic methodology v0.1.
- Write public-safe first cohort practice record.
- Decide whether to run second cohort, corporate workshop, consulting offer, or Leader’s High connection.
- Collect Sprint OS improvement backlog.
```

The weekly outputs are:

```text
Week 1: Problem Statement
Week 2: v0.1 Output
Week 3: Before/After Case Note
```

---

## 5. Repository / Technical Context

Repository:

```text
https://github.com/luvntruth/Sprint-OS.git
```

Local project path:

```text
/home/luvntruth/workspaces/leaders-high/ax-hr-sprint-os
```

Tech stack:

```text
Vite
React
TypeScript
localStorage
CSS
```

Important scripts:

```bash
npm run dev
npm run build
npm run lint
```

Local dev command:

```bash
cd /home/luvntruth/workspaces/leaders-high/ax-hr-sprint-os
npm run dev -- --host 127.0.0.1
```

Local URLs:

```text
Admin:
http://127.0.0.1:5173/?view=admin

Public / participant:
http://127.0.0.1:5173/?view=public
```

Vercel settings:

```text
Framework Preset: Vite
Root Directory: ./
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

Current storage model:

```text
localStorage only
```

Critical limitation:

```text
The app does not have shared cloud data yet.
If deployed to Vercel, each browser has its own localStorage.
Participants and founder do not share live data.
The current recommended first-cohort operation is screen sharing, not collaborative editing.
```

No Supabase/Firebase/auth yet.

---

## 6. Current App Structure

Important source files:

```text
src/types.ts
src/storage.ts
src/initialState.ts
src/uiModel.ts
src/prompts.ts
src/exportMarkdown.ts
src/App.tsx
src/App.css
```

Main components:

```text
src/components/Dashboard.tsx
src/components/ParticipantRoom.tsx
src/components/Participants.tsx
src/components/AnalysisInbox.tsx
src/components/TicketBoard.tsx
src/components/ReflectionPanel.tsx
src/components/ExportPanel.tsx
src/components/ProjectLab.tsx
src/components/FacilitatorCockpit.tsx
src/components/MethodLibrary.tsx
```

`initialState.ts` contains:

- Sprint metadata
- P-0 founder participant
- P-1~P-3 placeholder participants
- 25 template tickets across prep/week1/week2/week3/wrapup
- Initial method library fields

`uiModel.ts` contains shared UI/domain helper functions such as:

- stage metadata
- stage order
- ticket counts
- stage completion
- next ticket
- participant status
- participant next action
- public summary

---

## 7. Current View Modes

The app currently separates views using URL query parameter:

```text
?view=admin
?view=public
```

Important: This is **not real security**. It is presentation/UX separation only.

The UI should explicitly communicate:

```text
This is not login-based authorization.
Admin/public separation is a screen-mode distinction only.
Do not store sensitive data if this is shared publicly.
```

### Admin View

Admin URL:

```text
?view=admin
```

Admin is for the founder/facilitator.

Admin menus currently include:

```text
현황판
교육생 화면
할 일
프로젝트 랩
운영실
방법론
분석
회고
원본 데이터
내보내기
```

Admin should be able to:

```text
- See overall project progress.
- See current stage.
- See what to do next.
- Track participant progress.
- Edit ticket status/priority/owner.
- Enter raw participant data.
- Analyze survey responses via prompts.
- Write facilitator reflections.
- Accumulate methodology.
- Export Markdown to Obsidian.
```

### Public View

Public URL:

```text
?view=public
```

Public/participant view is meant for screen sharing with participants.

Public menus currently include:

```text
현황판
교육생 화면
할 일
```

Public view should:

```text
- Hide admin-only menus.
- Hide P-0 founder card.
- Show only P-1~P-3 participant status.
- Be read-only.
- Focus on:
  - where the cohort is now
  - what each participant is working on
  - what the next action is
  - what the current stage expects
```

Public view should not show operational/diagnostic/facilitator-private information.

---

## 8. Current Ticket Model

There are currently 25 template tickets.

Stages:

```text
prep: 6
week1: 5
week2: 5
week3: 5
wrapup: 4
```

Stage definitions:

```text
prep:
- Google Form pre-survey
- send pre-survey
- confirm Sprint OS URLs
- enter survey responses
- prepare follow-up questions
- rehearse first session/screen sharing

week1:
- explain purpose and OURS Method
- define participant problem statements
- choose v0.1 output candidates and success criteria
- write facilitator reflection
- save Week 1 Problem Statement outputs

week2:
- reduce v0.1 scope
- create participant v0.1 outputs
- collect peer/facilitator feedback
- save v0.1 outputs
- write Week 2 facilitator reflection

week3:
- confirm field test plan
- use v0.1 once in the field
- write Before/After Case Note
- run Week 3 retrospective conversation
- save case notes and reflection

wrapup:
- update Humanistic methodology v0.1
- write first cohort practice record
- decide next cohort/workshop/consulting/Leader’s High connection
- create Sprint OS improvement backlog
```

Ticket properties include:

```ts
id
sprintId
stage
title
description
owner: 'operator' | 'participant' | 'ai'
status: 'todo' | 'doing' | 'done' | 'blocked'
priority: 'low' | 'medium' | 'high'
generatedBy: 'template' | 'ai' | 'manual'
```

Recent UX change added owner editing in the admin ticket board.

Public ticket view should generally show participant-owned tickets only, or a fallback participant action if no participant ticket exists for the stage.

---

## 9. Recent UI/UX Issues and Improvements

The founder said the previous UI felt cluttered and unclear:

```text
화면이 정리가 안되어서 조잡해.
어드민과 교육생 용으로 정확히 구분이 필요하고.
대시보드에는 프로젝트 진행 상황을 한 눈에 확인 할 수 있어야 해.
메뉴를 통해서 나와 교육생이 정확히 어떤 상황에서 무얼 했고 무얼 해야 하는지를 화면만 보고도 알 수 있게 직관적으로 알 수 있어야 해.
```

Recent improvements implemented:

```text
- Reworked sidebar labels.
- Clarified Admin View vs Public View.
- Dashboard now shows current stage, progress, roadmap, next action, role clarity, and participant progress.
- Public View only shows 3 menus.
- Public View hides P-0.
- Public View removes admin-link copy button.
- Public View is read-only in ParticipantRoom and TicketBoard.
- TicketBoard changed from cluttered kanban to stage-based execution list.
- Admin ticket board supports status, priority, and owner editing.
- UI copy now states the view split is not real authorization.
- Build and lint passed.
```

Recent commit:

```text
b7b3a1c style: clarify sprint os admin and participant views
```

Prior commits include:

```text
21e4bfc feat: build AX x HR Sprint OS MVP
b795197 docs: add Sprint OS deployment notes
f9fe7b8 style: redesign Sprint OS navigation and dashboard UX
fd7ad88 feat: separate public and admin views
f4c220f feat: add cohort execution checklist tickets
b7b3a1c style: clarify sprint os admin and participant views
```

---

## 10. Obsidian Documentation Context

The project is documented in the founder’s Obsidian vault.

Main folder:

```text
/home/luvntruth/Documents/Obsidian Vault/Leader's High/Paperclip HR Consulting Company/
```

Sprint lab asset folder:

```text
/home/luvntruth/Documents/Obsidian Vault/Leader's High/Paperclip HR Consulting Company/ax-hr-sprint-lab-assets/
```

Important docs:

```text
00-ax-hr-1st-cohort-ops-index.md
01-3week-operating-plan.md
02-kickoff-message-script.md
03-participant-project-worksheet.md
04-weekly-check-in-questions.md
05-humanistic-insight-extraction-template.md
06-leaders-high-connection-map.md
07-ceo-recommendation-before-kickoff.md
08-action-plan-from-recruiting-post.md
09-consultant-training-centered-strategy.md
10-step-by-step-execution-plan-and-action-items.md
11-pre-kickoff-survey.md
12-ax-hr-sprint-os-mvp-prd.md
13-ax-hr-sprint-os-implementation-plan.md
14-long-term-project-based-community-os-strategy.md
15-humanistic-practice-lab-business-philosophy.md
16-ours-method-v0-1.md
17-sprint-os-operation-and-sharing-manual.md
18-community-benchmark-and-stolen-time.md
```

Participant docs:

```text
participant-tracker.md
participant-P-0-founder-worksheet.md
participant-P-1-worksheet.md
participant-P-2-worksheet.md
participant-P-3-worksheet.md
```

The app’s Markdown export should eventually support moving app state back into Obsidian.

---

## 11. Important Product Principles

Please evaluate the app against these principles:

### A. It must be obvious what to do next

A facilitator or participant should be able to open the screen and immediately answer:

```text
Where are we in the 3-week sprint?
What has been done?
What is blocked?
What should I do next?
What should each participant do next?
```

### B. Admin and participant views must feel intentionally different

Admin View should feel like:

```text
operator command center
```

Public View should feel like:

```text
participant-facing progress room
```

### C. The app should support facilitation, not just task tracking

The app should help the founder:

```text
listen better
ask better follow-up questions
reduce problem scope
turn vague problems into small projects
write reflections
extract methodology
```

### D. Avoid sales-funnel feeling

The participant-facing experience must not feel like:

```text
lead generation
sales pipeline
product funnel
```

It should feel like:

```text
safe practice group
my real problem
small experiment
peer learning
field test
reflection
```

### E. Protect private facilitator notes

Participant-facing screens should not expose:

```text
facilitator diagnosis
missed questions
intervention logs
consulting extraction notes
Leader’s High business opportunity notes
raw sensitive survey responses
```

### F. Be honest about current limitations

Current app has no auth and no shared database.

Do not imply real security, real collaboration, or cloud persistence unless implemented.

---

## 12. Known Limitations / Future Work

Current limitations:

```text
- localStorage only
- no login
- no real admin/participant authorization
- no shared cloud database
- no real-time collaboration
- public/admin split is query-param based only
- participants should not directly enter sensitive information into a public deployment
```

Likely future architecture:

```text
Supabase or Firebase
auth/login
role-based permissions
shared cohort database
participant-specific access
real cloud persistence
possibly AI API integration for analysis
```

Possible future features:

```text
- Participant login
- Cohort management
- Cloud-synced tickets
- Real participant submissions
- AI-assisted survey analysis
- AI-generated follow-up questions
- Case Note generator
- Obsidian export automation
- Method Library versioning
- Public cohort report generation
```

---

## 13. What I Want Claude Code To Review

Please review the current codebase and product design with the above context.

Focus especially on:

### 1. UX / Information Architecture

Check whether:

```text
- Admin vs Public separation is clear.
- The dashboard makes project progress obvious.
- Participants can understand what they need to do.
- The founder can understand what to do next.
- Menus are not cluttered.
- Labels are intuitive for Korean HR/facilitation context.
```

### 2. React / TypeScript Quality

Check:

```text
- Component responsibilities
- Repeated logic
- Type safety
- State handling
- localStorage migration/merge behavior
- Whether helper functions belong in uiModel.ts
- Whether Dashboard/TicketBoard are becoming too large
```

### 3. Security / Privacy

Check:

```text
- Any misleading admin/public security assumptions
- Any leakage of admin-only info into public mode
- Whether public mode is truly read-only at UI level
- Whether the UI copy properly warns that this is not real authorization
```

### 4. Product Fit

Check whether the app actually supports:

```text
- OURS Method
- 3-week cohort operation
- facilitator training
- participant value
- reflection and methodology accumulation
```

### 5. Next Improvement Recommendations

Please suggest concrete next steps in priority order.

Possible categories:

```text
P0: Must fix before first cohort
P1: Should improve soon
P2: Later productization
```

---

## 14. Review Commands

Please run:

```bash
npm run build
npm run lint
```

If useful, run the app locally:

```bash
npm run dev -- --host 127.0.0.1
```

Review the routes:

```text
http://127.0.0.1:5173/?view=admin
http://127.0.0.1:5173/?view=public
http://127.0.0.1:5173/?view=admin&tab=tickets
http://127.0.0.1:5173/?view=public&tab=tickets
http://127.0.0.1:5173/?view=public&tab=room
```

---

## 15. Desired Output Format

Please return:

```markdown
# AX x HR Sprint OS Review

## Overall Verdict

## What Works Well

## P0 Issues — Must Fix Before First Cohort

## P1 Improvements — Should Improve Soon

## P2 Future Productization

## Admin/Public Separation Review

## Dashboard/Progress Review

## Code Quality Review

## Security/Privacy Review

## Suggested Next Implementation Plan
```

Please be direct and practical. This is for a real first cohort, not a theoretical design exercise.
