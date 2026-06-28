# Team Onboarding Playbook

Roll these skills out to your whole team in under 30 minutes.

---

## Prerequisites for Every Developer

Each developer needs:

1. **Claude Code** — install at [claude.ai/code](https://claude.ai/code)
2. **GitHub CLI** (for PR reporting in `/daily-snapshot`) — install at [cli.github.com](https://cli.github.com), then run `gh auth login`

That's it. No API keys, no additional config.

---

## Step 1 — Install Skills Into Each Repo (5 minutes per repo)

Run this from the root of each repo the team works in:

```bash
npx intentkit init
```

Commit the result so every developer gets the commands on their next pull:

```bash
git add .claude/ .intent/
git commit -m "Add Claude skills and IntentKit delivery loop"
git push
```

From this point forward, any developer who pulls the repo and opens Claude Code has the commands. No per-developer setup required beyond installing Claude Code itself.

---

## Step 2 — First Team Run (10 minutes)

Pick your standup day and run `/daily-snapshot` live together so the team sees what it does.

```
/daily-snapshot
```

Walk the output together:
- Point out the Executive Summary — this is what gets pasted to Slack
- Show the Risk Signals section — this is what drives standup conversation
- Show the Velocity chart — baseline for the team

Then run `/git-scorecard` together:

```
/git-scorecard
```

Walk the scorecard table. The first run is always humbling — that's fine. This is the baseline you'll improve from.

---

## Step 3 — Set the Cadence (2 minutes)

Agree on two things:

**Daily snapshot:** Who runs it and when?
- Option A: Lead runs it 5 minutes before standup, pastes the Executive Summary to Slack
- Option B: Rotate — different developer each day
- Option C: Everyone runs it in their own session as they start their day

**Scorecard:** When do you re-run it?
- Monthly on a fixed day
- End of each sprint
- Before and after major refactors

Write the decision in your team's norms doc or standup template so it doesn't rely on any one person's memory.

---

## Step 4 — Add to Team Norms

Add a short section to your team's README or onboarding doc:

```markdown
## Daily Tooling

We use Claude Code skills for daily delivery reporting.

**Before standup:**
Run `/daily-snapshot` in Claude Code and paste the Executive Summary to #team-channel.

**Each sprint:**
Run `/git-scorecard` at sprint end and commit the result.

**Setup:**
1. Install Claude Code: https://claude.ai/code
2. Install GitHub CLI: https://cli.github.com
3. Run `gh auth login`
4. Pull the repo — `.claude/` is already committed, commands are ready
5. Reload Claude Code (VS Code: `Cmd+Shift+P` → `Developer: Reload Window`; CLI: exit and re-run `claude`)
```

---

## Onboarding a New Developer

When a new developer joins the team:

1. They clone the repo — `.claude/` is already there
2. They install Claude Code
3. They install GitHub CLI and run `gh auth login`
4. They reload Claude Code (VS Code: `Cmd+Shift+P` → `Developer: Reload Window`; CLI: exit and re-run `claude`)
5. Commands are ready: `/daily-snapshot`, `/git-scorecard`, `/create-report-card`

No additional setup. The skills travel with the repo.

---

## Rolling Out Across Multiple Repos

If your team works across multiple repos, install skills into each one:

```bash
# Repo 1
cd /path/to/repo-1
npx intentkit init
git add .claude/ .intent/ && git commit -m "Add Claude skills" && git push

# Repo 2
cd /path/to/repo-2
npx intentkit init
git add .claude/ .intent/ && git commit -m "Add Claude skills" && git push
```

Or write a one-liner to hit all repos in a directory:

```bash
for d in ~/repos/*/; do
  cd "$d"
  if [ -d ".git" ]; then
    npx intentkit init
    git add .claude/ .intent/ && git commit -m "Add Claude skills" && git push
  fi
done
```

---

## Keeping Skills Up to Date

When new skills are released, update each repo:

```bash
npx intentkit init --force
git add .claude/ .intent/
git commit -m "Update Claude skills to latest"
git push
```

The `--force` flag overwrites existing skill files with the latest versions. All developers get the update on their next pull.

---

## Troubleshooting

**"Command not found" / "Unknown command"**
Claude Code needs a reload to register new commands. In VS Code/Cursor: `Cmd+Shift+P` → `Developer: Reload Window`. In JetBrains: close and reopen. Claude Code CLI: exit and re-run `claude`. If commands still don't appear after reloading, verify `.claude/commands/` exists in the repo root.

**"GitHub CLI not available" in PR sections**
The developer needs to install GitHub CLI and run `gh auth login`. The rest of the snapshot still works.

**Skills installed but I don't see them in Claude Code**
Open Claude Code from the repo root (the folder that contains `.claude/`). If opened from a subdirectory, Claude Code won't see the commands.

**install.sh fails with permission error**
Run `chmod +x install.sh` if executing locally. For remote installs, use `npx intentkit init` — it does not require cloning the repo.
