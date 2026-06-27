# Daily Standup Playbook

Use `/daily-snapshot` to run a faster, better-informed standup in under 10 minutes.

---

## Who This Is For

- Team leads running a daily standup
- Engineering managers who want a delivery signal before the call
- Developers who want to share a clear status update without digging through Jira

---

## The Flow

### 1. Before the standup (2 minutes)

Open Claude Code in your repo and type:

```
/daily-snapshot
```

Claude will analyze your git history, open PRs, branches, and contributor activity. In 30–60 seconds it writes `daily-snapshot.md` to your repo root and prints the Executive Summary in chat.

### 2. Open the snapshot

The file is at your repo root: `daily-snapshot.md`

Sections you'll use in standup:

| Section | Use It For |
|---|---|
| **Executive Summary** | Paste into Slack before the call, or read it aloud to open |
| **What Shipped** | "Here's what we closed yesterday" |
| **What's In Flight** | "Here's what's moving right now" |
| **Risk Signals** | "Here's what needs attention" |
| **Needs Decision** | "Here's what's blocked and needs someone to act" |

### 3. Run the standup

Open with the Executive Summary. It's 3–4 sentences written for a VP — it sets context fast.

Then walk the table:

1. **What shipped** — name each item, who closed it, quick win
2. **What's in flight** — for each open item: status, owner, any blockers?
3. **Risk signals** — for each risk: who owns it, what's the plan?
4. **Needs decision** — assign an owner to each blocked item before the call ends

### 4. Post to Slack (optional but recommended)

Copy the Executive Summary from the snapshot and paste it into your team channel. This gives people who missed standup a fast catch-up and creates a daily paper trail.

---

## What Gets Flagged as a Risk

The snapshot automatically surfaces:

- **Stale branch** — no commit in 3+ days
- **Long-running PR** — open more than 5 days with no review
- **Draft stall** — PR marked draft for more than 3 days
- **Bus factor** — one developer owns all activity
- **New tech debt** — TODO/FIXME/HACK added this week
- **Gap day** — a day with zero commits mid-week

If the Risk Signals section is empty, that's a good standup.

---

## Tips

**Run it before the call, not during.** The snapshot takes 30–60 seconds. Running it live adds dead air.

**Don't read the whole file aloud.** Use it as your notes. Hit the highlights.

**Rotate who runs it.** Any developer can run `/daily-snapshot`. Rotating ownership means everyone stays familiar with the team's delivery rhythm.

**Commit the snapshot occasionally.** The file overwrites itself daily, so git history isn't useful. But if you want a record of a particularly important day, commit it by hand:
```bash
git add daily-snapshot.md
git commit -m "Snapshot: sprint kickoff day"
```

---

## Sample Standup (15 minutes)

```
0:00  Lead reads Executive Summary aloud
0:45  Walk "What Shipped" — one sentence per item
3:00  Walk "What's In Flight" — owner gives 10-second status
7:00  Walk "Risk Signals" — assign an owner to each
11:00 Walk "Needs Decision" — assign or defer each item
13:00 Quick announcements
15:00 Done
```

---

## Troubleshooting

**"No commits found in last 24 hours"**
You're probably running Claude Code from the wrong directory. Make sure you opened Claude Code from the repo root, not a subdirectory.

**PR sections show "GitHub CLI not available"**
Install the [GitHub CLI](https://cli.github.com) and run `gh auth login`. Everything else in the snapshot still works without it.

**The snapshot shows the wrong repo**
`/daily-snapshot` analyzes the git repo at the current working directory. Open Claude Code from the correct repo root.
