# Claude Skills

Drop-in Claude Code skills for any engineering team.
Install once, run forever. Stack-agnostic — React, .NET, Java, Python, Go, Node, anything.

---

## What You Get

Three slash commands that work inside any repo you open in Claude Code:

| Command | What It Does | Output | Audience |
|---|---|---|---|
| `/daily-snapshot` | Delivery report — what shipped, what's moving, what's at risk | `daily-snapshot.md` | Manager, team lead, VP |
| `/git-scorecard` | Enterprise readiness score across 9 dimensions + 30-day plan | `repo-scorecard.md` | Tech lead, architect |
| `/create-report-card` | Same as `/git-scorecard` (alternate name) | `repo-scorecard.md` | Tech lead, architect |

You open Claude Code, type the command, Claude does the work, a polished markdown report lands at your repo root. No setup, no config, no API keys.

---

## Install — One Command

Open a terminal in the root of any repo and run:

```bash
npx intentkit init
```

Then **reload your Claude Code window** to activate the commands (VS Code: `Cmd+Shift+P` → `Developer: Reload Window`). The commands are ready once the window reloads.

> **Installing into multiple repos?** Run `npx intentkit init` in each repo root. Takes five seconds per repo.

---

## What the Installer Does

```
your-repo/
  .claude/
    skills/
      daily-snapshot/
        SKILL.md        ← full analysis logic
      repo-scorecard/
        SKILL.md        ← full scoring logic
    commands/
      daily-snapshot.md      ← registers /daily-snapshot
      git-scorecard.md       ← registers /git-scorecard
      create-report-card.md  ← registers /create-report-card
      intentkit.md           ← registers /intentkit
      ide.capture.md         ← registers /ide.capture  ┐
      ide.refine.md          ←          /ide.refine    │
      ide.context.md         ←          /ide.context   │ IntentKit
      ide.plan.md            ←          /ide.plan      │ delivery loop
      ide.tasks.md           ←          /ide.tasks     │
      ide.implement.md       ←          /ide.implement │
      ide.verify.md          ←          /ide.verify    │
      ide.evidence.md        ←          /ide.evidence  │
      ide.impact.md          ←          /ide.impact    ┘
  .intent/
    memory/       ← team principles, architecture rules, standards, DoD
    templates/    ← 8 intent workspace templates
    playbooks/    ← delivery loop guides
    skills/       ← specialist agent skills
```

These files live in your repo. Commit them and every developer on the team gets the commands automatically when they pull.

---

## Commit to Your Repo (Recommended)

After installing, add the `.claude/` and `.intent/` folders to git:

```bash
git add .claude/ .intent/
git commit -m "Add Claude skills and IntentKit delivery loop"
git push
```

Now any developer who clones the repo already has the commands and IntentKit support files. They just need Claude Code installed and a single reload.

---

## The Commands

### `/daily-snapshot`

Runs every morning. Takes 30–60 seconds. Produces a delivery report written for a VP — plain English, no diffs, no code blocks.

The report covers:
- **Executive summary** — 3–4 sentences, paste-ready for Slack or a standup
- **What shipped** — commits and merged PRs in the last 24 hours
- **What's in flight** — open PRs and active branches
- **Velocity trend** — commits per day for the last 7 days with a text chart
- **Team activity** — who contributed and bus factor check
- **Risk signals** — stalled work, long-running PRs, single contributor, new tech debt
- **Hot files** — most-changed files this week (where regressions are most likely)
- **Needs decision** — anything blocked waiting on a human

Run it, copy the Executive Summary to Slack, done.

---

### `/git-scorecard` · `/create-report-card`

Run monthly or after each sprint. Scores the repo across 9 dimensions out of 100 and writes a 30-day improvement plan.

| Dimension | Max |
|---|---|
| Intent Architecture | 20 |
| Test Maturity | 15 |
| Documentation Quality | 15 |
| Code Health | 15 |
| Security Posture | 10 |
| CI/CD Readiness | 10 |
| Dependency Management | 5 |
| Observability | 5 |
| Evidence Standard | 5 |
| **Total** | **100** |

Grade scale: **A** = 85–100 · **B** = 70–84 · **C** = 55–69 · **D** = 40–54 · **F** = below 40

The report includes a risk register, specific gaps with suggested file paths, and a week-by-week 30-day improvement plan.

---

## Updating Skills

When new skills are released:

```bash
npx intentkit init --force
git add .claude/ .intent/
git commit -m "Update Claude skills to latest"
git push
```

---

## Prerequisites

- [Claude Code](https://claude.ai/code) installed
- A git repository
- For PR reporting in `/daily-snapshot`: [GitHub CLI](https://cli.github.com) (`gh`) installed and authenticated

---

## Playbooks

Step-by-step guides for common team workflows:

- [Daily Standup Playbook](docs/playbooks/daily-standup.md) — run `/daily-snapshot` as part of your standup
- [Sprint Review Playbook](docs/playbooks/sprint-review.md) — use `/git-scorecard` for sprint retrospectives
- [Team Onboarding Playbook](docs/playbooks/team-onboarding.md) — roll these skills out to your whole team

---

## Skill Reference

See [SKILLS.md](SKILLS.md) for full detail on each skill, its output format, and planned additions.

---

## Questions or Issues

Open an issue at [github.com/kendallmark3/claudeskills](https://github.com/kendallmark3/claudeskills).
