# Skill Reference

Full documentation for every skill in this library.

---

## `/daily-snapshot`

**Skill file:** `.claude/skills/daily-snapshot/SKILL.md`
**Output:** `daily-snapshot.md` at your repo root
**Audience:** Manager, team lead, VP of Engineering
**Cadence:** Daily — run every morning before standup

### What it analyzes

- Commits and merged PRs in the last 24 hours
- Open PRs and active branches
- Commit velocity per day for the last 7 days
- Per-contributor activity for 24h and 7d windows
- Stale branches and long-running PRs
- New TODO/FIXME/HACK added this week
- Hot files (most changed, most likely to regress)

### Output sections

| Section | Content |
|---|---|
| Executive Summary | 3–4 paste-ready sentences for Slack or standup |
| What Shipped | Commits and merged PRs from the last 24h |
| What's In Flight | Open PRs and active branches with status |
| Velocity (7-Day Trend) | Text chart of commits per day + trend verdict |
| Team Activity | Contributor table with bus factor note |
| Risk Signals | Stale branches, long PRs, single contributor, new debt |
| Hot Files | Top 5–8 most-changed files with risk context |
| Needs Decision | Blocked items waiting on a human |
| Yesterday vs. Today | Quick metrics table |

### Risk signals it looks for

- Branch or PR with no commit in 3+ days → **Stalled**
- PR open more than 5 days with no review decision → **Long-running PR**
- PR marked draft for more than 3 days → **Draft Stall**
- A single developer owning all activity → **Bus Factor Risk**
- New TODO/FIXME/HACK added this week → **New Tech Debt**
- Zero-activity day mid-week → **Gap Day**

### How to share the output

- **Slack**: Copy the Executive Summary and paste into your team channel
- **Standup**: Read from "What Shipped" and "Risk Signals"
- **Email**: The full file reads cleanly as plain text
- **GitHub**: The file lives in your repo — link to it directly

---

## `/git-scorecard` · `/create-report-card`

**Skill file:** `.claude/skills/repo-scorecard/SKILL.md`
**Output:** `repo-scorecard.md` at your repo root
**Audience:** Tech lead, architect, engineering manager
**Cadence:** Monthly or after each sprint

### Scoring dimensions

| # | Dimension | Max | What it checks |
|---|---|---|---|
| 1 | Intent Architecture | 20 | Intent files, feature docs, CLAUDE.md, structured sections |
| 2 | Test Maturity | 15 | Test dirs, test files, framework config, CI test runs, coverage |
| 3 | Documentation Quality | 15 | README completeness, architecture docs, API docs, CONTRIBUTING |
| 4 | Code Health | 15 | Linting config, formatter config, folder structure, TODO density |
| 5 | Security Posture | 10 | .env.example, .gitignore coverage, surface secret scan |
| 6 | CI/CD Readiness | 10 | CI workflow, trigger config, IaC or Dockerfile |
| 7 | Dependency Management | 5 | Lock file presence, version pinning hygiene |
| 8 | Observability | 5 | Logging library usage, health check endpoint |
| 9 | Evidence Standard | 5 | PR template, structured commit messages |
| | **Total** | **100** | |

### Grade scale

| Grade | Score | Readiness |
|---|---|---|
| A | 85–100 | Enterprise Ready |
| B | 70–84 | Nearly There |
| C | 55–69 | Needs Work |
| D | 40–54 | Significant Gaps |
| F | 0–39 | Not Ready |

### Output sections

| Section | Content |
|---|---|
| Overall Score | Numeric score, letter grade, readiness label |
| Scorecard | Per-dimension scores with status indicators |
| Pattern Findings | Concrete positives found + specific gaps with file paths |
| Risk Register | Risks ranked High / Medium / Low with likely impact |
| 30-Day Improvement Plan | Week-by-week tasks with specific file names |
| Recommended Intent Files | Suggested intent files by feature area |

---

## Coming Soon

| Command | Skill | What It Will Do |
|---|---|---|
| `/feature-kickoff` | `feature-kickoff` | Read a `feature.md` and produce a scoped implementation plan before any code is written |
| `/pr-evidence` | `pr-evidence` | Summarize changes, run tests, draft the PR body with evidence |
| `/intent-audit` | `intent-audit` | Flag active features that have no intent file |
| `/dead-code-scan` | `dead-code-scan` | Find unused exports, unreachable routes, orphaned files |
| `/dep-health` | `dep-health` | Flag outdated or vulnerable packages with upgrade recommendations |
| `/onboarding` | `onboarding` | Read the repo and produce a new-developer guide |
