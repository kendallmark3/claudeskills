# intentkit

Manage IntentKit feature workspaces in this repository.

Read what the user wants to do, then execute the matching operation below.
If no operation is specified, show the available commands.

---

## feature <name>

Create a new feature workspace under `intents/`.

1. List directories in `intents/` to find the highest existing number. The new number is that + 1, zero-padded to 3 digits (start at 001 if none exist).
2. Slugify the name: lowercase, replace spaces and special characters with hyphens, trim leading/trailing hyphens.
3. Create `intents/NNN-slug/` and populate 8 files by reading the corresponding template from `.intent/templates/` and replacing placeholders:
   - `intent.md` ← `feature-intent-template.md`
   - `repo-context.md` ← `repo-context-template.md`
   - `architecture.md` ← `architecture-intent-template.md`
   - `plan.md` ← `implementation-plan-template.md`
   - `tasks.md` ← `tasks-template.md`
   - `verification.md` ← `verification-template.md`
   - `evidence.md` ← `evidence-template.md`
   - `impact.md` ← `impact-template.md`
4. Placeholder values: `{{FEATURE_NAME}}` = the name, `{{FEATURE_SLUG}}` = the slug, `{{INTENT_NUMBER}}` = the number, `{{DATE}}` = today's date in YYYY-MM-DD format.
5. Confirm what was created. Tell the user: open `intent.md` and run `/ide.capture` to start the delivery loop.

---

## status

Show artifact completion for all intent workspaces.

1. List all numbered directories under `intents/` (format `NNN-slug`), sorted.
2. For each workspace, check which of the 8 artifact files exist:
   `intent.md`, `repo-context.md`, `architecture.md`, `plan.md`,
   `tasks.md`, `verification.md`, `evidence.md`, `impact.md`
3. Print: workspace name, completion count (N/8), then each file with ✓ (exists) or ✗ (missing).

---

## doctor

Verify all IntentKit files are installed correctly.

Check each path and print ✓ or ✗:

**Memory**
- `.intent/memory/principles.md`
- `.intent/memory/architecture-rules.md`
- `.intent/memory/team-standards.md`
- `.intent/memory/definition-of-done.md`

**Templates**
- `.intent/templates/feature-intent-template.md`
- `.intent/templates/repo-context-template.md`
- `.intent/templates/architecture-intent-template.md`
- `.intent/templates/implementation-plan-template.md`
- `.intent/templates/tasks-template.md`
- `.intent/templates/verification-template.md`
- `.intent/templates/evidence-template.md`
- `.intent/templates/impact-template.md`

**Claude Code commands**
- `.claude/commands/ide.capture.md`
- `.claude/commands/ide.refine.md`
- `.claude/commands/ide.context.md`
- `.claude/commands/ide.plan.md`
- `.claude/commands/ide.tasks.md`
- `.claude/commands/ide.implement.md`
- `.claude/commands/ide.verify.md`
- `.claude/commands/ide.evidence.md`
- `.claude/commands/ide.impact.md`

**Workspace**
- `intents/` directory exists

If anything is missing: tell the user to re-run the installer:
`curl -fsSL https://raw.githubusercontent.com/kendallmark3/intentkit/main/intent-kit/install.sh | bash`
