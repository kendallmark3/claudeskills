# IDE Skills Library

Custom Claude Code skills for Intent-Driven Engineering teams.
Drop these into any repo. Run them as slash commands inside Claude Code.

---

## Available Skills

### `/git-scorecard` · `/create-report-card`
**Skill:** `repo-scorecard`
**Output:** `repo-scorecard.md`

Analyzes the repo across 9 dimensions and produces a scored enterprise readiness report. Scores Intent Architecture, Test Maturity, Documentation, Code Health, Security, CI/CD, Dependencies, Observability, and Evidence Standard out of 100. Includes a risk register and 30-day improvement plan.

**Audience:** Tech lead, architect, engineering manager
**Cadence:** Monthly or after each sprint

---

### `/daily-snapshot`
**Skill:** `daily-snapshot`
**Output:** `daily-snapshot.md`

Produces a plain-English delivery report for managers and team leads. Covers what shipped in the last 24 hours, what's in flight, 7-day velocity trend, team activity, risk signals, and what needs a decision today.

**Audience:** Manager, team lead, VP
**Cadence:** Daily

---

## Skill Ideas (Coming Soon)

| Skill | Command | What It Will Do |
|---|---|---|
| Feature Kickoff | `/feature-kickoff` | Read a `feature.md` and produce a scoped implementation plan before any code is written |
| PR Evidence | `/pr-evidence` | Summarize changes, run tests, draft the PR body with evidence |
| Intent Audit | `/intent-audit` | Flag active features that have no intent file |
| Dead Code Scan | `/dead-code-scan` | Find unused exports, unreachable routes, orphaned files |
| Dependency Health | `/dep-health` | Flag outdated or vulnerable packages with upgrade recommendations |
| Onboarding Guide | `/onboarding` | Read the repo and produce a new-developer guide |
