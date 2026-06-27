# IDE Skills — Claude Code Shared Library

Custom Claude Code skills for Intent-Driven Engineering teams.
Install into any repo. Run as slash commands. Works with any stack — React, .NET, Java, Python, Go, Node.

---

## What This Is

This library adds two slash commands to any repo you work in with Claude Code:

| Command | What It Does | Who Reads It |
|---|---|---|
| `/daily-snapshot` | Daily delivery report — what shipped, what's in flight, velocity, risks, who's moving | Manager, team lead |
| `/git-scorecard` | Enterprise readiness score across 9 dimensions with a 30-day improvement plan | Tech lead, architect |

You run the command inside a Claude Code session. Claude does the analysis and writes a markdown report to your repo root. Every developer runs the same commands, every report looks the same.

---

## Prerequisites

- [Claude Code](https://claude.ai/code) installed and running
- Git repository (the commands analyze your git history)
- That's it — no other dependencies

---

## Install — One Time Per Repo

**Step 1.** Open a terminal and go to the root of the repo you want to add skills to:

```bash
cd /path/to/your-repo
```

**Step 2.** Run the installer:

```bash
curl -fsSL https://raw.githubusercontent.com/YOUR_ORG/ide-skills/main/install.sh | bash
```

You will see:

```
IDE Skills Installer
────────────────────────────────────
Library:  ...
Target:   /path/to/your-repo

Installing skills...
  ✓ installed  daily-snapshot
  ✓ installed  repo-scorecard

Installing commands...
  ✓ installed  /create-report-card
  ✓ installed  /daily-snapshot
  ✓ installed  /git-scorecard

────────────────────────────────────
Done. 5 installed · 0 skipped

Restart Claude Code to activate new commands.
```

**Step 3.** Restart Claude Code (close and reopen the session or reload the window).

**Step 4.** The commands are ready. Type `/daily-snapshot` or `/git-scorecard` in any Claude Code session opened in that repo.

---

## Daily Use

### Running the daily snapshot

Open Claude Code in your repo and type:

```
/daily-snapshot
```

Claude will analyze your git history, active branches, open PRs, contributor activity, and velocity. It writes `daily-snapshot.md` to your repo root and summarizes the findings in chat.

The report covers:
- **Executive summary** — 3–4 sentences, paste-ready for Slack or a standup
- **What shipped** — commits and merged PRs in the last 24 hours
- **What's in flight** — open PRs and active branches
- **Velocity trend** — commits per day for the last 7 days with a visual chart
- **Team activity** — who contributed and bus factor check
- **Risk signals** — stalled work, long-running PRs, no CI, single contributor
- **Hot files** — most changed files this week (where regressions are likely)
- **Needs decision** — anything blocked waiting on a human

Run it every morning. Each run overwrites `daily-snapshot.md` with fresh data.

### Running the scorecard

```
/git-scorecard
```

Claude scans the repo and scores it across 9 dimensions out of 100. It writes `repo-scorecard.md` with the full scorecard, a risk register, and a 30-day improvement plan.

| Dimension | Max Points |
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

Run it monthly or after each sprint to track improvement over time.

---

## What Gets Installed

The installer copies these files into your repo:

```
your-repo/
  .claude/
    skills/
      repo-scorecard/
        SKILL.md          ← full scoring logic for /git-scorecard
      daily-snapshot/
        SKILL.md          ← full analysis logic for /daily-snapshot
    commands/
      git-scorecard.md    ← registers /git-scorecard slash command
      create-report-card.md  ← same as /git-scorecard (alternate name)
      daily-snapshot.md   ← registers /daily-snapshot slash command
```

These files live in your repo. Commit them. They are part of your team's tooling.

---

## Commit the Skills to Your Repo

After installing, add the `.claude/` folder to git so every developer on the team has the same commands:

```bash
git add .claude/
git commit -m "Add IDE skills — /daily-snapshot and /git-scorecard"
git push
```

Now any developer who pulls the repo and opens Claude Code already has the commands. They just need to restart Claude Code once after pulling.

---

## Update to the Latest Skills

When new skills are added to this library, update your repo:

```bash
curl -fsSL https://raw.githubusercontent.com/YOUR_ORG/ide-skills/main/install.sh | bash -- --force
git add .claude/
git commit -m "Update IDE skills to latest"
git push
```

The `--force` flag overwrites existing skill files with the latest versions.

---

## Sharing Reports With Your Manager

After running `/daily-snapshot`, the report is in `daily-snapshot.md` at your repo root.

To share it:
- **Slack**: Copy the Executive Summary section and paste it into your team channel
- **Email**: Open `daily-snapshot.md` and copy the whole file — it reads cleanly as plain text
- **Standup**: Read from the "What Shipped" and "Risk Signals" sections
- **GitHub**: The file is in your repo — link directly to it on GitHub

After running `/git-scorecard`, the report is in `repo-scorecard.md`. Share the Overall Score and Risk Register with your tech lead or architect.

---

## Troubleshooting

**"Unknown command: /daily-snapshot"**
Claude Code needs a restart to pick up new commands. Close and reopen your Claude Code session or reload the window, then try again.

**"No commits found in last 24 hours"**
If the report shows no activity, check that you are running Claude Code from the correct repo root. The commands analyze the git history of the current working directory.

**"GitHub CLI not available"**
The PR sections of the daily snapshot use the `gh` CLI. If it is not installed, the PR sections will show "not available" but everything else will work. Install the [GitHub CLI](https://cli.github.com) and run `gh auth login` to enable PR reporting.

---

## Available Skills

See [SKILLS.md](SKILLS.md) for the full list of available and planned skills.

---

## Questions

Reach out to the Intent-Driven Engineering team or open an issue in this repo.
