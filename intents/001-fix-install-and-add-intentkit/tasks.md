# Tasks: Fix Install and Add IntentKit

## Ordered Delivery Tasks

### Phase 1 — npm distribution
- [x] T001 Add `.intent/` to `package.json` `files` array so it is included in the published npm package
- [x] T002 Verify with `npm pack --dry-run` that `.intent/` files appear in the pack manifest

### Phase 2 — Node.js installer
- [x] T003 Add `.intent/` copy block to `bin/intentkit.js` after the commands block, using existing `copyDir()` helper and skip/force logic
- [x] T004 Add `.intent/` to the `list` command output in `bin/intentkit.js` so developers can see it is available

### Phase 3 — bash installer
- [x] T005 Add `.intent/` copy block to `install.sh` after the commands block, using existing `cp -r` pattern and skip/force logic
- [x] T006 Add a visible warning to `install.sh` that `curl | bash` does not reliably install from the remote source (SCRIPT_DIR caveat) and recommend `npx intentkit init` for remote installs

### Phase 4 — Documentation
- [x] T007 Update `README.md` install section: promote `npx intentkit init` as the primary one-line install; keep curl-pipe but label it "local only"
- [x] T008 Update `README.md` "What the Installer Does" directory tree to include `.intent/`
- [x] T009 Update `docs/playbooks/team-onboarding.md` install step to use `npx intentkit init`

### Phase 5 — Verify
- [x] T010 Run `/intentkit doctor` in this repo — confirm 22/22 ✓
- [x] T011 Simulate a fresh install into a temp directory and confirm `.intent/` files are present
- [x] T012 Commit and push all changes to `master`

## Task Traceability

| Task | Acceptance Intent / Risk | Evidence |
|---|---|---|
| T001 | AC: fresh `npx intentkit init` copies `.intent/`; Risk: npm `files` excludes `.intent/` | `package.json` diff |
| T002 | AC: same — verifies T001 before any user is affected | `npm pack --dry-run` output |
| T003 | AC: `npx intentkit init` in a fresh repo copies `.intent/templates/` and `.intent/memory/` | `intentkit.js` diff + manual install test |
| T004 | AC: `intentkit list` shows `.intent/` so developers know it's included | `intentkit.js` diff |
| T005 | AC: `bash install.sh` in a fresh local clone copies `.intent/` | `install.sh` diff + manual test |
| T006 | Risk: curl-pipe SCRIPT_DIR bug burns users who follow README instructions | `install.sh` warning text |
| T007 | Risk: README currently recommends curl-pipe as primary — misleads users | `README.md` diff |
| T008 | AC: directory tree in README accurately reflects what gets installed | `README.md` diff |
| T009 | Risk: team-onboarding.md still shows curl-pipe as install step | `team-onboarding.md` diff |
| T010 | AC: `/intentkit doctor` reports 22/22 ✓ | Doctor output screenshot / paste |
| T011 | AC: IntentKit commands work in a fresh repo after install | Temp dir install output |
| T012 | AC: changes pushed to `master` | `git push` confirmation |
