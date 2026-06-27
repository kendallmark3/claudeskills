# ide-skills

A shared library of Claude Code skills for Intent-Driven Engineering teams.

Install into any repo with one command. Run as slash commands inside Claude Code.
Works with any stack — React, Python, Java, Go, Node, whatever the repo uses.

---

## Install

From the root of any repo you want to add skills to:

```bash
bash /path/to/ide-skills/install.sh
```

Or once this repo is on GitHub, one-line install from anywhere:

```bash
curl -fsSL https://raw.githubusercontent.com/YOUR_ORG/ide-skills/main/install.sh | bash
```

Then **restart Claude Code**. The slash commands are active.

---

## Options

```bash
# See what skills are available without installing
bash install.sh --list

# Overwrite existing skills (update to latest version)
bash install.sh --force
```

---

## What Gets Installed

```
your-repo/
  .claude/
    skills/
      repo-scorecard/
        SKILL.md       ← /git-scorecard logic
      daily-snapshot/
        SKILL.md       ← /daily-snapshot logic
    commands/
      git-scorecard.md
      create-report-card.md
      daily-snapshot.md
```

---

## Available Commands

| Command | What It Does | Output |
|---|---|---|
| `/git-scorecard` | Score the repo across 9 dimensions | `repo-scorecard.md` |
| `/create-report-card` | Same as `/git-scorecard` | `repo-scorecard.md` |
| `/daily-snapshot` | Daily delivery report for managers | `daily-snapshot.md` |

See [SKILLS.md](SKILLS.md) for full descriptions.

---

## Adding a New Skill

1. Create `.claude/skills/<skill-name>/SKILL.md` — the full step-by-step instructions Claude follows
2. Create `.claude/commands/<command-name>.md` — one paragraph pointing to the skill
3. Add an entry to [SKILLS.md](SKILLS.md)
4. The install script picks it up automatically on next run

---

## Updating an Installed Skill

Pull the latest from this repo, then re-run the installer with `--force`:

```bash
git pull
cd /path/to/your-repo
bash /path/to/ide-skills/install.sh --force
```

Restart Claude Code after updating.

---

## Enterprise Distribution

For teams that want skills available without per-repo installation, this library can be served as an MCP (Model Context Protocol) server. All developers connect to the server once in their Claude Code settings and all skills are available everywhere — no install step, central updates, no drift.

See `mcp/` directory (coming soon) for the server implementation.

---

## Stack

No runtime dependencies. Pure markdown files read by Claude Code.
Works in any repo, any language, any framework.
