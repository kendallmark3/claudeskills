# Implementation Plan: Fix Install and Add IntentKit

## Strategy

Three targeted changes, each in a single file. No new abstractions, no restructuring. Apply existing copy patterns to `.intent/`, update the npm manifest, and document the curl-pipe limitation clearly.

## Phases

### Phase 1 — Fix npm distribution
Add `.intent/` to `package.json` `files` array so it is included in the published npm package and available to `npx intentkit init`.

### Phase 2 — Fix Node.js installer
Extend `bin/intentkit.js` to copy `.intent/` using the existing `copyDir()` helper, with the same skip/force logic already applied to `.claude/skills/` and `.claude/commands/`.

### Phase 3 — Fix bash installer + document curl-pipe limitation
Extend `install.sh` to copy `.intent/` using the existing `cp -r` pattern. Add a clear warning that `curl | bash` does not work (SCRIPT_DIR resolves to PWD, not the source) and recommend `npx intentkit init` as the reliable remote install path.

### Phase 4 — Update README and docs
- Replace curl-pipe as the primary install recommendation with `npx intentkit init`
- Keep curl-pipe documented but clearly labelled as local-only
- Update the "What the Installer Does" section to include `.intent/`
- Update team-onboarding.md accordingly

### Phase 5 — Verify
Run `/intentkit doctor` confirms 22/22. Manually verify that a simulated fresh install (copying to a temp directory) includes `.intent/` files.

## Files Expected to Change

| File | Change Type | Reason |
|---|---|---|
| `package.json` | Edit — add `.intent/` to `files` array | npm package must include `.intent/` for `npx intentkit init` to copy it |
| `bin/intentkit.js` | Edit — add `.intent/` copy block after commands block | Node.js installer must copy `.intent/` with skip/force logic |
| `install.sh` | Edit — add `.intent/` copy block; add curl-pipe warning | bash installer must copy `.intent/`; document SCRIPT_DIR limitation |
| `README.md` | Edit — promote `npx intentkit init` as primary; demote curl-pipe | curl-pipe is unreliable for remote install |
| `docs/playbooks/team-onboarding.md` | Edit — update install step to use `npx intentkit init` | Consistent with README |

## Dependencies

- No new packages
- No environment variables
- No external services
- Requires Node.js ≥16 (already declared in `package.json` engines)

## Rollback Plan

All changes are additive (adding a copy block, adding an entry to `files`). To roll back:
- Remove the `.intent/` entry from `package.json` `files`
- Remove the `.intent/` copy block from `intentkit.js`
- Remove the `.intent/` copy block from `install.sh`
- Revert README and docs to previous curl-pipe-first wording

Git revert of the commit is sufficient — no data migration, no schema change, no deployed service to roll back.

## Human Review Points

- **Before merging:** Confirm the decision to demote curl-pipe in README — this is a visible UX change that affects the primary install flow in all public docs
- **Before publishing to npm:** Verify `.intent/` is present in a dry-run: `npm pack --dry-run` should list `.intent/` files
