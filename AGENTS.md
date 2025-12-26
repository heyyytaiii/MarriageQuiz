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
