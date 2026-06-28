# Feature Intent: Fix Install and Add IntentKit

- Intent ID: 001-fix-install-and-add-intentkit
- Created: 2026-06-28
- Status: Refined

## 1. Business Intent

Make the claudeskills installer work reliably on the first try for any developer, and ship IntentKit — the intent-driven delivery loop — as part of the skill library so teams can run structured feature delivery inside any repo.

Two problems were blocking successful installs:
1. The installer URL referenced `main` but the repo branch is `master`, causing a 404 on curl.
2. After a successful install, developers didn't know they had to reload Claude Code to register the commands, so skills appeared broken.

## 2. User / Customer Intent

**Developers installing claudeskills into a new repo.** They run a one-line curl command and expect to type `/daily-snapshot` or `/git-scorecard` immediately after. The current experience silently fails (wrong branch) or leaves them stuck (commands not registered, no clear next step).

**Teams adopting IntentKit.** Engineering teams who want a structured, repeatable delivery loop — capture → refine → context → plan → tasks → implement → verify → evidence → impact — available as slash commands inside their repo.

## 3. Scope

### In scope
- Fix branch name in all installer URLs (`main` → `master`)
- Improve post-install output to give explicit reload instructions per environment (VS Code, JetBrains, CLI)
- Add IntentKit delivery loop: 9 Claude Code commands, 8 templates, 4 memory files, 5 skills, 4 playbooks, CLAUDE.md
- **[GAP — needs fix]** Update `install.sh` to also copy `.intent/` directory so IntentKit templates and memory files are installed alongside the commands

### Out of scope
- Changes to skill logic (daily-snapshot, git-scorecard)
- Auto-registration of commands without a reload
- CI/CD for the installer
- Branch auto-detection in installer URLs (deferred — hardcode `master` is the fix for now)

## 4. Inputs

- User report: install failed at Tolata because curl fetched from `main` (404); branch is `master`
- User report: after successful install, commands weren't usable — no reload instruction was clear enough
- IntentKit source: `kendallmark3/intentkit` — 43 files installed via `npx intentkit init`

## 5. Acceptance Intent

- [x] `curl -fsSL https://raw.githubusercontent.com/kendallmark3/claudeskills/master/install.sh | bash` resolves without 404
- [x] Post-install output includes environment-specific reload instructions (VS Code, JetBrains, CLI)
- [x] All 9 IntentKit commands present under `.claude/commands/` in this repo
- [x] All 8 templates present under `.intent/templates/` in this repo
- [x] All 4 memory files present under `.intent/memory/` in this repo
- [x] `/intentkit doctor` reports 22/22 ✓ in this repo
- [x] Changes pushed to `master`
- [ ] **[OPEN]** Running the installer in a fresh repo copies `.intent/` (templates + memory) so IntentKit commands actually work after install

## 6. Non-Functional Intent

- Installer must work without any local credentials or AWS setup
- Post-install instructions must be legible in a plain terminal (no assumed color support for the key message)
- **[RISK]** `install.sh` uses ANSI color codes in the NEXT STEP block — on terminals without color support these render as escape sequences, making the most important message the hardest to read. The critical text should not rely on color alone.

## 7. Assumptions

- The GitHub repo will remain at `kendallmark3/claudeskills` on the `master` branch — **[RISK]** hardcoded branch name burned one user already; any future rename breaks all existing install commands in external docs
- Claude Code picks up `.claude/commands/*.md` automatically on window reload — no separate registration step exists — **[VERIFIED]** confirmed by doctor output 22/22
- IntentKit files from `kendallmark3/intentkit` are stable enough to commit directly
- **[NEW RISK]** install.sh currently copies only `.claude/skills/` and `.claude/commands/`; it does NOT copy `.intent/` — IntentKit templates and memory files are absent in a freshly installed repo, so ide.* commands will fail on first use

## 8. Open Questions

- ~~Should the installer auto-detect the branch?~~ **Deferred** — hardcode `master` is the immediate fix; auto-detect is a future hardening item
- Should the README install section link to a stable release tag rather than a branch tip? **Unresolved** — using a tag would prevent branch-rename failures but adds a release process burden
- **[CRITICAL]** Does `install.sh` need to copy `.intent/` for IntentKit to work in a fresh repo? **Yes — this is a gap that must be fixed**

## 9. Decisions

| Date | Decision | Rationale | Owner |
|---|---|---|---|
| 2026-06-28 | Hardcode `master` in all URLs | That is the actual branch; `main` was wrong | mark kendall |
| 2026-06-28 | Add reload instructions per environment, not just "restart" | "Restart" was ambiguous — VS Code users need `Developer: Reload Window`, not a full app restart | mark kendall |
| 2026-06-28 | Ship IntentKit as committed files, not a runtime fetch | Skills travel with the repo; developers get them on `git pull` | mark kendall |
| 2026-06-28 | Defer branch auto-detection | Pragmatic fix now; auto-detect is a follow-on hardening | mark kendall |
| 2026-06-28 | **[PENDING]** Update install.sh to copy `.intent/` directory | IntentKit commands depend on templates/memory that the current installer does not copy — fresh installs break | mark kendall |
