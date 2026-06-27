# Sprint Review Playbook

Use `/git-scorecard` to turn your sprint retrospective into a measurable improvement cycle.

---

## Who This Is For

- Tech leads who want data to back up "we need to improve our testing"
- Architects reviewing repo health across multiple teams
- Engineering managers tracking technical debt reduction over time

---

## The Flow

### 1. Run the scorecard at sprint end

Open Claude Code in your repo and type:

```
/git-scorecard
```

Claude scans the repo, scores it across 9 dimensions, writes `repo-scorecard.md`, and prints a summary in chat. Takes about 60 seconds.

### 2. Review the output

Open `repo-scorecard.md`. The key sections for a sprint retro:

| Section | Use It For |
|---|---|
| **Overall Score** | The headline number — trend it sprint over sprint |
| **Scorecard table** | Where specifically you're losing points |
| **Missing Patterns** | Concrete gaps with suggested file paths to create |
| **Risk Register** | What could bite you in production |
| **30-Day Improvement Plan** | Ready-to-use task list for the next sprint |

### 3. Run the retro

**Open with the score.** "We're at 67/100 this sprint, up from 61 last sprint." Numbers focus the conversation.

**Walk the scorecard table.** For each red (❌) or yellow (⚠️) dimension, ask:
- Why are we losing points here?
- What's the minimum action to move this to green?
- Who owns it next sprint?

**Pull tasks from the 30-Day Plan.** The improvement plan is already prioritized and broken into weeks. Use it as your backlog input — copy the Week 1 tasks directly into your sprint planning doc.

**Assign the Risk Register.** Every High severity risk needs an owner and a target sprint to close it.

### 4. Commit the scorecard

```bash
git add repo-scorecard.md
git commit -m "Sprint N scorecard — 67/100"
git push
```

Now you have a git history of scores. Run `git log --oneline -- repo-scorecard.md` to see the trend at a glance.

### 5. Re-run at next sprint end

The Week 1 tasks from this scorecard become next sprint's work. Re-run `/git-scorecard` at the end of that sprint to measure improvement.

---

## Tracking Progress Over Time

Each run overwrites `repo-scorecard.md`. To track scores over time, commit after each run with the score in the commit message:

```bash
# Sprint 12
git commit -m "Scorecard sprint 12 — 67/100 C"

# Sprint 13
git commit -m "Scorecard sprint 13 — 74/100 B"

# Sprint 14
git commit -m "Scorecard sprint 14 — 81/100 A"
```

To review the history:
```bash
git log --oneline -- repo-scorecard.md
```

To see what changed between two sprints:
```bash
git diff HEAD~2 HEAD -- repo-scorecard.md
```

---

## What Moves the Score Fastest

Based on the scoring weights, these improvements give the most points for the least effort:

| Action | Points | Effort |
|---|---|---|
| Add an `INTENT.md` or `intent/` folder | +9 | Low |
| Add a PR template at `.github/PULL_REQUEST_TEMPLATE.md` | +2 | Very low |
| Add a `.env.example` | +3 | Very low |
| Add `.env` to `.gitignore` | +3 | Very low |
| Add a `README.md` with local setup instructions | +7 | Low-medium |
| Add a GitHub Actions workflow | +4 | Medium |
| Add a test directory and first test file | +7 | Medium |
| Add an ESLint or Ruff config | +4 | Low |

If your score is below 60, start with the "Very low" and "Low" items. You can move from F to C in a single afternoon.

---

## Sharing the Scorecard

**With your team:** Commit `repo-scorecard.md` and share the GitHub link. The file is clean markdown — it reads well in GitHub's renderer.

**With your manager:** Share the Overall Score table and Risk Register. Skip the technical detail.

**With leadership:** The Risk Register maps directly to business risk. "Three high-severity risks, all tied to missing tests and no CI — here's the plan to close them in two sprints" is a clear ask for capacity.

---

## Common Scorecard Findings

**"Intent Architecture: 0/20"**
No intent files, no CLAUDE.md. Create an `intent/` folder at the repo root and add one intent file per active feature area. Start with the highest-risk feature.

**"Test Maturity: 3/15"**
Test directory exists but no CI runs tests. Add a GitHub Actions workflow that runs your test suite on every PR. That alone is worth +3 points.

**"Security Posture: 4/10"**
Usually means `.env` is not in `.gitignore`. Fix immediately — this is a real risk, not a paperwork gap.

**"Evidence Standard: 0/5"**
No PR template and commit messages are single words. Add a PR template in 10 minutes. Better commit messages come with team practice.
