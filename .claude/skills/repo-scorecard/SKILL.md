# Repo Scorecard Skill

## Purpose

Analyze this repository and produce `repo-scorecard.md` — an enterprise readiness scorecard that scores the repo across 9 dimensions, identifies missing patterns, registers risks, and produces a 30-day improvement plan.

This skill is invoked via `/git-scorecard` or `/create-report-card`.

---

## How to Run This Skill

When this skill is invoked, execute every step below in order. Do not skip steps. Do not ask the user for input unless a step explicitly says to.

---

## Step 1 — Discover the repo

Run these commands and collect the output. Read the results before scoring anything.

```bash
# Top-level structure
ls -la

# Check for intent files
find . -name "INTENT.md" -o -name "intent.md" -o -name "feature.md" -o -name "*.intent.md" 2>/dev/null | grep -v node_modules | grep -v ".git"
find . -type d -name "intent" 2>/dev/null | grep -v node_modules | grep -v ".git"

# Check for tests
find . -type d -name "__tests__" -o -type d -name "test" -o -type d -name "tests" -o -type d -name "spec" 2>/dev/null | grep -v node_modules | grep -v ".git"
find . -name "*.test.*" -o -name "*.spec.*" 2>/dev/null | grep -v node_modules | grep -v ".git" | head -20

# Check for CI/CD
find . -name "*.yml" -path "*/.github/workflows/*" 2>/dev/null
find . -name "Dockerfile" -o -name "docker-compose.yml" 2>/dev/null | grep -v node_modules
find . -name "*.tf" -o -name "cdk.json" 2>/dev/null | grep -v node_modules | head -5

# Check for docs
find . -name "README*" -o -name "CONTRIBUTING*" -o -name "CHANGELOG*" 2>/dev/null | grep -v node_modules | grep -v ".git"
find . -name "*.md" 2>/dev/null | grep -v node_modules | grep -v ".git" | head -30

# Check for security signals
find . -name ".env.example" -o -name ".env.sample" 2>/dev/null
find . -name ".env" 2>/dev/null | grep -v node_modules | grep -v ".git"
find . -name ".gitignore" 2>/dev/null | head -3

# Check for linting / formatting config
find . -name ".eslintrc*" -o -name ".prettierrc*" -o -name "pyproject.toml" -o -name ".flake8" -o -name "ruff.toml" 2>/dev/null | grep -v node_modules | head -10

# Check for PR templates
find . -name "PULL_REQUEST_TEMPLATE*" 2>/dev/null
find . -path "*/.github/PULL_REQUEST_TEMPLATE*" 2>/dev/null

# Check package files for dependency lock
ls package-lock.json yarn.lock pnpm-lock.yaml poetry.lock requirements.txt Pipfile.lock go.sum 2>/dev/null

# Git log — last 20 commits
git log --oneline -20

# Git contributors
git shortlog -sn --no-merges | head -10

# Observability signals
find . -name "*.py" -o -name "*.js" -o -name "*.ts" 2>/dev/null | grep -v node_modules | grep -v ".git" | xargs grep -l "logger\|logging\|console.log\|winston\|pino\|structlog" 2>/dev/null | head -10
find . -name "healthcheck*" -o -name "health.py" -o -name "health.js" -o -name "health.ts" 2>/dev/null | grep -v node_modules | head -5
```

---

## Step 2 — Score each dimension

Score each dimension based on what you found. Use the criteria below. Be honest — a low score is useful, a falsely high score is not.

### Dimension 1: Intent Architecture (0–20 pts)

| Criteria | Points |
|---|---|
| `/intent` folder or equivalent exists at repo root | +5 |
| `INTENT.md` or `intent.md` present at root or in `/intent` | +4 |
| Feature intent files (`feature.md`, `*.intent.md`) exist | +4 |
| Intent files contain structured sections (Goal, Scope, Acceptance Criteria) | +4 |
| Claude Code instructions file (`.claude/commands/` or `CLAUDE.md`) present | +3 |

### Dimension 2: Test Maturity (0–15 pts)

| Criteria | Points |
|---|---|
| Test directory exists (`__tests__`, `test/`, `tests/`, `spec/`) | +3 |
| Test files found (`.test.*`, `.spec.*`) | +4 |
| Test framework configured (jest.config, pytest.ini, vitest.config, etc.) | +3 |
| CI runs tests (workflow file references test command) | +3 |
| Code coverage config or reports found | +2 |

### Dimension 3: Documentation Quality (0–15 pts)

| Criteria | Points |
|---|---|
| README exists at root | +3 |
| README covers: what the project does, how to run it locally, and how to deploy | +4 |
| Architecture or design doc exists | +3 |
| API documentation (OpenAPI spec, JSDoc, docstrings) | +3 |
| CONTRIBUTING guide exists | +2 |

### Dimension 4: Code Health (0–15 pts)

| Criteria | Points |
|---|---|
| Linting config exists (ESLint, Ruff, flake8, Pylint, Checkstyle) | +4 |
| Formatter config exists (Prettier, Black, gofmt config) | +3 |
| Consistent file/folder structure (no obvious dumping grounds) | +4 |
| No obvious dead code or TODO-heavy files (sample check) | +4 |

### Dimension 5: Security Posture (0–10 pts)

| Criteria | Points |
|---|---|
| `.env.example` or `.env.sample` exists | +3 |
| `.env` is gitignored (check `.gitignore`) | +3 |
| No hardcoded secrets found in a surface scan | +4 |

For the surface scan run:
```bash
grep -r "password\s*=\s*['\"][^'\"]\|api_key\s*=\s*['\"][^'\"]\|secret\s*=\s*['\"][^'\"]" \
  --include="*.py" --include="*.js" --include="*.ts" --include="*.env" \
  --exclude-dir=node_modules --exclude-dir=.git . 2>/dev/null | grep -v ".example" | head -10
```

### Dimension 6: CI/CD Readiness (0–10 pts)

| Criteria | Points |
|---|---|
| CI workflow file exists (GitHub Actions, CircleCI, etc.) | +4 |
| CI runs on pull_request or push to main | +2 |
| Deployment pipeline or IaC present (Terraform, CDK, Dockerfile) | +4 |

### Dimension 7: Dependency Management (0–5 pts)

| Criteria | Points |
|---|---|
| Lock file present (package-lock.json, poetry.lock, go.sum, etc.) | +3 |
| Dependency file is clean (no `*` version pinning for production deps) | +2 |

### Dimension 8: Observability (0–5 pts)

| Criteria | Points |
|---|---|
| Logging library or pattern present in source files | +3 |
| Health check endpoint or script found | +2 |

### Dimension 9: Evidence Standard (0–5 pts)

| Criteria | Points |
|---|---|
| PR template exists | +2 |
| Commit messages are structured (not "fix", "update", "misc") | +3 |

---

## Step 3 — Produce repo-scorecard.md

Write the file `repo-scorecard.md` at the repo root using this exact template. Fill in every section with real findings. Do not leave placeholders.

```markdown
# Repo Scorecard
**Repo:** [repo name from package.json / pyproject.toml / directory name]
**Scored:** [today's date]
**Scored by:** Claude Code · repo-scorecard skill

---

## Overall Score

| Score | Grade | Readiness |
|---|---|---|
| [X] / 100 | [A/B/C/D/F] | [Enterprise Ready / Needs Work / Not Ready] |

**Grade scale:** A = 85–100 · B = 70–84 · C = 55–69 · D = 40–54 · F = below 40

---

## Scorecard

| Dimension | Score | Max | Status |
|---|---|---|---|
| Intent Architecture | X | 20 | ✅ / ⚠️ / ❌ |
| Test Maturity | X | 15 | ✅ / ⚠️ / ❌ |
| Documentation Quality | X | 15 | ✅ / ⚠️ / ❌ |
| Code Health | X | 15 | ✅ / ⚠️ / ❌ |
| Security Posture | X | 10 | ✅ / ⚠️ / ❌ |
| CI/CD Readiness | X | 10 | ✅ / ⚠️ / ❌ |
| Dependency Management | X | 5 | ✅ / ⚠️ / ❌ |
| Observability | X | 5 | ✅ / ⚠️ / ❌ |
| Evidence Standard | X | 5 | ✅ / ⚠️ / ❌ |
| **Total** | **X** | **100** | |

✅ = 80%+ of available points · ⚠️ = 50–79% · ❌ = below 50%

---

## Pattern Findings

### What This Repo Does Well

[List 3–6 concrete positive findings from the scan. Reference specific files or patterns found.]

### Missing Patterns

[List every gap found. For each, name the pattern, why it matters, and what to create. Be specific — name the file path.]

---

## Risk Register

| Risk | Severity | Likely Impact |
|---|---|---|
| [risk] | High / Medium / Low | [what breaks or degrades] |

[Include at minimum: any security findings, any test gaps, any missing intent files for a system this complex]

---

## 30-Day Improvement Plan

### Week 1 — Foundation

[3–5 specific tasks. Name the file to create or change. Ordered by impact.]

### Week 2 — Coverage

[3–5 specific tasks focused on test and documentation gaps.]

### Week 3 — Standards

[3–5 tasks for code health, CI, and evidence standards.]

### Week 4 — Validate

[3–5 tasks: re-run scorecard, fill remaining gaps, document decisions.]

---

## Recommended Next Intent Files

[List 3–5 feature areas that lack intent files and would most benefit from them. For each, suggest the file path and a one-line description of what it should capture.]

| Suggested File | Purpose |
|---|---|
| `/intent/[area].intent.md` | [what it should document] |

---

*Generated by the repo-scorecard Claude Code skill. Re-run `/git-scorecard` after improvements to update this file.*
```

---

## Step 4 — Report to the user

After writing `repo-scorecard.md`, output a short summary:

- Overall score and grade
- Top 3 strengths
- Top 3 gaps
- Tell the user the full report is in `repo-scorecard.md`

Do not repeat the entire file in chat. Keep the summary to under 200 words.
