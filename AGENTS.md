# AGENTS.md

> This file is a contract for automated coding agents (Codex).
> Follow these rules strictly before making changes or creating PRs.

## 0. Goals

- Make minimal, correct changes aligned with existing patterns.
- Keep CI green (lint/test/build must pass).
- Prefer readability and maintainability over cleverness.

---

## 1. Tech Stack (Assumed)

- React + TypeScript
- Tooling may include one of:
  - Vite
  - CRA
  - Custom bundler
- Testing may include:
  - Vitest / Jest
  - React Testing Library
- Linting/formatting may include:
  - ESLint
  - Prettier

If a tool is not present in the repo, do not introduce it unless explicitly requested.

---

## 2. Repository Orientation

Before editing code:

1. Read `package.json` scripts and dependency list.
2. Identify the test runner, linter, formatter, and build command.
3. Follow existing folder conventions.

Do NOT introduce new folders at repo root unless necessary.

---

## 3. Required Commands (Must Run / Must Validate)

### 3.1 Install

Prefer the repository's package manager:

- If `pnpm-lock.yaml` exists → use `pnpm`
- Else if `yarn.lock` exists → use `yarn`
- Else → use `npm`

Install:

- `pnpm install` OR `yarn` OR `npm install`

### 3.2 Lint / Format / Typecheck / Test / Build

Run the most appropriate available scripts from `package.json`:

Priority order (run what exists):

1. `lint`
2. `typecheck` (or `tsc -p . --noEmit` if script exists)
3. `test` (or `test:ci`)
4. `build`

If a script is missing:

- Do not invent new scripts.
- Use the closest existing script.
- If no test command exists, add tests only if requested or if change is risky.

CI must pass for PRs.

---

## 4. Code Change Policy (Very Important)

### 4.1 Minimal Diff

- Change only what's needed for the requested task.
- Avoid unrelated refactors.
- Avoid formatting-only PRs.

### 4.2 No Breaking Changes

- Do not change public APIs without explicit instruction.
- If you must, include migration notes in the PR description.

### 4.3 No New Dependencies

- Do not add dependencies unless explicitly requested.
- If absolutely necessary, justify clearly in PR description.

---

## 5. TypeScript Rules

- Avoid `any`. Prefer `unknown` + narrowing.
- Prefer explicit types for public APIs (exported functions/components/hooks).
- Prefer `type` aliases; use `interface` only when extension/merging is needed.
- Use discriminated unions when modeling variants.
- Do not silence errors with `@ts-ignore`. If unavoidable, use `@ts-expect-error` and explain why.

---

## 6. React Rules

### 6.1 Component Style

- Prefer function components.
- Keep components small and focused.
- Prefer composition over inheritance.

### 6.2 Keys

- Do NOT use array index as `key` unless list is static and never reorders.

### 6.3 Hooks

- Keep hooks pure and deterministic.
- Avoid triggering side effects during render.
- Avoid `useEffect` if the same can be done with derived state.
- When using `useEffect`, ensure correct dependency arrays.

### 6.4 Performance (Practical)

- Do not add `useMemo/useCallback` by default.
- Only add memoization when there is a clear re-render problem.

---

## 7. Data Fetching / Async (If Applicable)

- Avoid duplicate requests.
- Prefer idempotent fetchers.
- Handle error states explicitly.
- Do not swallow errors silently.

If the repo uses React Query / SWR / custom fetchers, follow existing patterns.

---

## 8. Testing Rules

- Prefer React Testing Library for UI behavior.
- Avoid implementation-detail tests (e.g., testing internal state directly).
- Test user-visible outcomes.
- If changing behavior, update/add tests accordingly.

If tests are flaky or failing:

- Fix root cause rather than disabling tests.

---

## 9. Formatting & Style

- Respect existing ESLint/Prettier config.
- Do not reformat unrelated files.
- Prefer existing utility functions and patterns over new ones.

---

## 10. Git / PR Rules

### 10.1 Branching

Do not push directly to `main` unless explicitly permitted.
Prefer:

- `codex/<short-task-name>` branch
- Open a PR to `main`

This avoids protected-branch issues and required checks.

### 10.2 Commit Messages

- Keep commits atomic and descriptive.
- Prefer conventional-ish style:
  - `feat: ...`
  - `fix: ...`
  - `refactor: ...`
  - `test: ...`
  - `chore: ...`

### 10.3 PR Description (Must Include)

- What changed
- Why changed
- How to test (commands)
- Any risks / edge cases

---

## 11. What NOT To Do

- Do not commit secrets.
- Do not modify lockfiles unless required by dependency changes.
- Do not disable CI checks.
- Do not delete large chunks of code unless required.

---

## 12. When Uncertain

If requirements are ambiguous:

- Make the smallest safe change.
- Add a note in PR describing assumptions.

End of contract.

---

# 13. Application Policy Contract (Marriage Quiz App)

> This section defines PRODUCT & DATA policies.
> Agents must implement features consistent with these policies and must not silently change them.
> If a requested change conflicts with policies, explain the conflict in the PR description and propose the minimal compliant alternative.

## 13.1 Product Goal & Non-Goals

### Goal

- Help engaged couples (예비부부) compare and discuss values by answering objective/subjective questions and sharing results with each other in a structured way.

### Non-Goals (unless explicitly requested)

- Not a “compatibility scoring / fortune-telling” app.
- Not a counseling/therapy replacement.
- Not a public SNS. Default is private, couple-to-couple.

## 13.2 Core User Journey (MVP)

1. User A creates a “Couple Space” (커플 스페이스) and gets an invite code/link.
2. User B joins using the code/link.
3. They answer question sets:
   - Objective (single / multi choice)
   - Subjective (free text)
4. Results are shared within the Couple Space:
   - show “my answer vs partner answer”
   - highlight differences (diff) but do not judge
5. They can bookmark items to discuss and add notes.

Agents: any new UI/logic must map to one of the steps above, or be explicitly requested.

## 13.3 Data Model (Conceptual)

Use these domain terms consistently in code (naming may follow repo conventions):

- `CoupleSpace`
  - id, createdAt
  - members: [UserRef, UserRef]
  - status: `active | closed`
- `Question`
  - id, categoryId, type: `single | multi | text`
  - prompt, choices? (for objective)
- `Answer`
  - id, coupleSpaceId, questionId, userId
  - value: string | string[] (depending on question type)
  - updatedAt
- `DiscussionNote` (optional in MVP)
  - id, coupleSpaceId, questionId
  - body, createdBy, updatedAt

Do not introduce additional models unless needed.

## 13.4 Privacy & Sharing Rules (Hard Rules)

- Default visibility is **private to the Couple Space**.
- No public profiles, no public search, no public feeds.
- Invite mechanism:
  - Use short-lived invite codes/links where possible.
  - Do not expose personal info inside invite link (no name/email).
- Do not show partner’s answer before they submit (to avoid influence), unless explicitly requested.
- Export/share outside the app (image/pdf/link) is OFF by default; if implemented, it must be explicit opt-in.

## 13.5 Sensitive Content Handling (Hard Rules)

Because subjective answers can include sensitive info:

- Do not implement features that encourage collecting:
  - 주민번호/계좌/카드번호, 여권번호 등 고위험 개인정보
- If a user types such content, do not attempt to “process” it beyond normal display/storage.
- If any AI summarization/recommendation is added later, it MUST be:
  - opt-in
  - clearly labeled
  - avoid storing prompts/responses unnecessarily

## 13.6 Question Content Policy

- Categories should be neutral and discussion-oriented:
  - finances, family, kids, living, values, communication, religion(optional), career, lifestyle, boundaries, chores
- Avoid discriminatory or hateful prompts.
- Avoid sexual explicit content by default.

If adding seed questions, keep tone respectful and non-judgmental.

## 13.7 UX Rules (Couples-first)

- Always show both answers side-by-side once both submitted.
- Highlight differences as “discussion points”, not “right/wrong”.
- Provide “Talk about this” / “Bookmark for discussion” affordance.
- Keep flows short; allow saving progress.

## 13.8 Scoring Policy

Default MVP: **no numeric compatibility score**.

Allowed:

- “Difference count” or “agreement rate” at a section level (e.g., 7/10 aligned)
- But must be framed as “alignment overview”, not prediction.

If a numeric score is introduced:

- explain calculation in UI
- avoid strong claims (“성공 확률” etc.)

## 13.9 Account & Identity (MVP Friendly Defaults)

- Prefer minimal sign-in requirements (configurable):
  - anonymous local session OR simple login (email/social) depending on backend
- Regardless of auth, Couple Space membership must remain 2-person bound in MVP.

Agents: don’t add complex roles/admin systems.

## 13.10 Offline / Local-First (Optional)

If no backend exists yet:

- Use local storage/indexedDB patterns already used in repo
- Provide a clear boundary so backend migration is easy (repository/service layer)

Do not build a “fake backend” with heavy new deps.

## 13.11 Spec-Driven Development Workflow (How to implement features)

For any feature PR, include a mini-spec in the PR description:

- **User Story**: “As A/B, I want…, so that…”
- **Acceptance Criteria** (checklist)
- **Out of Scope**
- **Data/Privacy Impact** (Yes/No + brief)
- **How to Test** (commands + manual steps)

In code, prefer:

- a `spec` or `README` in the relevant feature folder only if repo already does this.
- otherwise document in PR only.

## 13.12 Feature Flags / Experiments

Do not introduce a new experimentation system.
If feature gating is needed, use the simplest existing pattern (env flag or config object).

End of application policy contract.
