# Daily Delivery Snapshot Skill

## Purpose

Produce `daily-snapshot.md` — a plain-English delivery report written for managers and team leads, not engineers. It answers: what shipped, what's in flight, who is moving, what is at risk, and what needs a decision today.

This skill is invoked via `/daily-snapshot`.

No input required. Run it, read the output.

---

## How to Run This Skill

Execute every step below in order. Do not skip steps. Do not ask for input.

---

## Step 1 — Collect delivery data

Run all of these commands and collect the output before writing anything.

```bash
# Today's date and reporting window
echo "TODAY: $(date '+%Y-%m-%d %H:%M')"
echo "WINDOW: last 24 hours and last 7 days"

# What merged / committed in the last 24 hours
echo "=== COMMITS LAST 24H ===" 
git log --oneline --since="24 hours ago" --format="%h %ad %an — %s" --date=short

# What merged in the last 7 days (for velocity)
echo "=== COMMITS LAST 7 DAYS ==="
git log --oneline --since="7 days ago" --format="%ad %an — %s" --date=short

# Commits per day for the last 7 days (velocity trend)
echo "=== COMMITS PER DAY (7d) ==="
for i in 6 5 4 3 2 1 0; do
  day=$(date -v-${i}d '+%Y-%m-%d' 2>/dev/null || date -d "$i days ago" '+%Y-%m-%d' 2>/dev/null)
  count=$(git log --oneline --after="${day} 00:00" --before="${day} 23:59" 2>/dev/null | wc -l | tr -d ' ')
  echo "$day: $count commits"
done

# All active branches (not main/master)
echo "=== ACTIVE BRANCHES ==="
git branch -a --sort=-committerdate 2>/dev/null | grep -v "HEAD\|main\|master" | head -20

# Last commit date per branch (to spot stale branches)
echo "=== BRANCH LAST ACTIVITY ==="
git for-each-ref --sort=-committerdate refs/heads/ \
  --format="%(committerdate:short) %(refname:short) — %(subject)" 2>/dev/null | head -20

# Who committed in the last 7 days
echo "=== CONTRIBUTORS (7d) ==="
git log --since="7 days ago" --format="%an" | sort | uniq -c | sort -rn

# Who committed in the last 24 hours
echo "=== CONTRIBUTORS (24h) ==="
git log --since="24 hours ago" --format="%an" | sort | uniq -c | sort -rn

# Open pull requests (if GitHub CLI is available)
echo "=== OPEN PRs ==="
gh pr list --limit 20 --json number,title,author,createdAt,updatedAt,reviewDecision,isDraft \
  --template '{{range .}}PR #{{.number}} | {{.author.login}} | {{.title}} | created: {{.createdAt}} | updated: {{.updatedAt}} | review: {{.reviewDecision}} | draft: {{.isDraft}}{{"\n"}}{{end}}' 2>/dev/null || echo "GitHub CLI not available or no open PRs"

# Recent PR merges (last 7 days)
echo "=== MERGED PRs (7d) ==="
gh pr list --state merged --limit 20 --json number,title,author,mergedAt \
  --template '{{range .}}PR #{{.number}} | {{.author.login}} | {{.title}} | merged: {{.mergedAt}}{{"\n"}}{{end}}' 2>/dev/null || echo "GitHub CLI not available"

# Files changed most in the last 7 days (hot spots)
echo "=== HOT FILES (7d) ==="
git log --since="7 days ago" --name-only --format="" | grep -v "^$" | sort | uniq -c | sort -rn | head -15

# Intent file coverage check
echo "=== INTENT FILES ==="
find . -name "*.intent.md" -o -name "feature.md" -o -name "intent.md" 2>/dev/null | grep -v node_modules | grep -v ".git" | sort

# Test run (if available)
echo "=== TEST STATUS ==="
cd frontend 2>/dev/null && npm test -- --run 2>&1 | tail -10 && cd .. || echo "No test suite found or not in frontend dir"

# Any TODO / FIXME / HACK added in the last 7 days (new technical debt)
echo "=== NEW TECH DEBT (7d) ==="
git log --since="7 days ago" --patch --unified=0 2>/dev/null | grep "^+" | grep -i "TODO\|FIXME\|HACK\|XXX\|TEMP\|KLUDGE" | grep -v "^+++" | head -10
```

---

## Step 2 — Analyze and classify

Before writing the report, classify what you found into these buckets:

**Shipped** — commits or merged PRs from the last 24 hours. These are wins.

**In Flight** — open PRs or active branches with recent commits (last 3 days). Work is moving.

**At Risk** — any of these signals:
- Branch or PR with no commit in 3+ days
- PR open for more than 5 days with no review decision
- PR marked draft for more than 3 days
- A single developer owning all activity (bus factor risk)
- New TODO/FIXME/HACK added this week

**Needs Decision** — PRs waiting on review, blocked branches, or anything where the next action requires a manager or stakeholder.

**Velocity** — is the 7-day commit trend increasing, flat, or declining? Compare first 3 days to last 3 days.

---

## Step 3 — Write daily-snapshot.md

Write `daily-snapshot.md` at the repo root using this template. Fill every section with real data. Write in plain English — no code, no diffs, no technical jargon unless necessary. A VP of Engineering should be able to read this in 90 seconds.

```markdown
# Daily Delivery Snapshot
**Repo:** [repo name]
**Date:** [today's date and time]
**Period:** Last 24 hours · Trend: Last 7 days

---

## Executive Summary

[2–4 sentences. State: what shipped today, whether velocity is healthy, any risks worth flagging, and whether the team needs anything from leadership. No jargon. Write like a clear Slack update.]

---

## What Shipped (Last 24 Hours)

[If commits or merged PRs exist in the last 24h, list them clearly. Use plain language — not commit hashes. Group related commits. If nothing shipped in 24h, say so and note the last merge date.]

| What | Who | When |
|---|---|---|
| [feature or fix description] | [author] | [time/date] |

---

## What's In Flight

[List active branches or open PRs with meaningful work. For each, state: what it is, who owns it, how long it has been open, and whether it is moving.]

| Work Item | Owner | Open Since | Status |
|---|---|---|---|
| [PR title or branch purpose] | [author] | [X days] | Moving / Stalled / Waiting on review |

*If no open PRs found, note that all current work is in local branches or has been merged.*

---

## Velocity (7-Day Trend)

[Show commits per day for the last 7 days as a simple text chart. State whether velocity is rising, flat, or declining. Note any zero-activity days.]

```
[date]: ████████ 8 commits
[date]: █████ 5 commits
[date]: ██ 2 commits
[date]: 0 commits ← gap
[date]: ████ 4 commits
[date]: ███████ 7 commits
[date]: ████████████ 12 commits
```

Trend: [Rising / Flat / Declining] — [1 sentence interpretation]

---

## Team Activity

[Who contributed in the last 7 days and 24 hours. If only one person is active, call it out as a bus factor note.]

| Contributor | Commits (7d) | Commits (24h) |
|---|---|---|
| [name] | X | X |

---

## Risk Signals

[List anything that needs attention. Be direct. If there are no risks, say "No active risks identified."]

| Signal | Detail | Recommended Action |
|---|---|---|
| [risk type] | [specific finding] | [what should happen] |

*Risk types: Stale branch · Long-running PR · No review · Single contributor · New tech debt · Zero activity · Test failure*

---

## Hot Files (Most Changed This Week)

[Top 5–8 files changed most in the last 7 days. This tells managers where the active churn is and where regressions are most likely.]

| File | Changes | Why It Matters |
|---|---|---|
| [filepath] | X commits | [brief: is this expected churn? a hot spot?] |

---

## Needs Decision / Action

[Anything that is blocked waiting on a human decision. If nothing is blocked, say so.]

- [ ] [specific action needed, who should take it]

---

## Yesterday vs. Today

| Metric | Value |
|---|---|
| Commits today | X |
| Commits yesterday | X |
| Open PRs | X |
| Stale branches (3d+) | X |
| Active contributors (7d) | X |
| Tests passing | Yes / No / Unknown |

---

*Re-run `/daily-snapshot` anytime. Each run overwrites this file with fresh data.*
```

---

## Step 4 — Report to the user

After writing `daily-snapshot.md`, output:

- The executive summary paragraph (copy it verbatim from the report)
- A one-line velocity verdict: Rising / Flat / Declining
- Any risk signals found — one bullet per risk
- Tell the user the full report is in `daily-snapshot.md`

Keep the response under 150 words.
