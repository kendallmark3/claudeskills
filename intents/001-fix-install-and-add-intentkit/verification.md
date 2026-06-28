# Verification: Fix Install and Add IntentKit

## Commands Run

| Command | Result | Notes |
|---|---|---|
| `npm pack --dry-run \| grep intent \| wc -l` | 25 `.intent/` files in pack | Confirms `package.json` files array change is effective |
| `node bin/intentkit.js list` | Shows 5 `.intent/` subdirs under "IntentKit support directories" | T004 confirmed |
| `node bin/intentkit.js init` (fresh repo) | 20 installed · 0 skipped; `.intent/memory/`, `.intent/metrics/`, `.intent/playbooks/`, `.intent/skills/`, `.intent/templates/` all ✓ | T003 + T011 confirmed |
| `node bin/intentkit.js init` (re-run, no --force) | 0 installed · 20 skipped | Skip logic works correctly |
| `node bin/intentkit.js init --force` (re-run) | 20 installed · 0 skipped | Force-overwrite works correctly |
| `bash install.sh` (local from source) | Runs normally; 0 installed, 20 skipped (already present); guard does not block | Local use unaffected by curl-pipe guard |
| `bash -c 'BASH_SOURCE=()...' guard test` | Empty `BASH_SOURCE[0]` → guard triggers → "would block" | curl-pipe condition correctly intercepted |
| `/intentkit doctor` check (22 files) | 22/22 ✓ | T010 confirmed |
| `git status` | Clean on `master`, up to date with `origin/master` | T012 confirmed |

## Acceptance Checks

| Acceptance Item | Status | Evidence |
|---|---|---|
| `npx intentkit init` in a fresh repo copies `.intent/` templates and memory | ✓ Pass | 29 `.intent/` files found in temp dir after install |
| `npm pack --dry-run` shows `.intent/` files | ✓ Pass | 25 `.intent/` entries in pack manifest |
| `intentkit list` shows `.intent/` subdirs | ✓ Pass | 5 dirs listed under "IntentKit support directories" |
| Skip logic preserved for `.intent/` (no `--force`) | ✓ Pass | 0 installed · 20 skipped on re-run |
| Force-overwrite works for `.intent/` | ✓ Pass | 20 installed on `--force` re-run |
| `install.sh` guard blocks curl-pipe SCRIPT_DIR | ✓ Pass | Empty `BASH_SOURCE[0]` triggers guard |
| `install.sh` local run unaffected by guard | ✓ Pass | Runs normally from source dir |
| `/intentkit doctor` 22/22 | ✓ Pass | All memory, template, command, and workspace files present |
| Changes pushed to `master` | ✓ Pass | Commit `4f235ed` on `origin/master` |
| README install section uses `npx intentkit init` as primary | ✓ Pass | README updated in prior commit; verified in current state |
| README directory tree includes `.intent/` | ✓ Pass | Full tree with all 9 commands + `.intent/` subdirs |
| `team-onboarding.md` uses `npx intentkit init` | ✓ Pass | All curl-pipe references replaced |

## Regression Checks

**Could `install.sh` local runs have broken?**
No. The guard uses `[ -z "${BASH_SOURCE[0]}" ]` which is false when the script is invoked as `bash install.sh` — `BASH_SOURCE[0]` is set to the script path. Confirmed by running `bash install.sh` from source dir: executed normally.

**Could skip/force logic for existing `.claude/` installs have broken?**
No. The `.intent/` copy block was added after the existing `.claude/commands/` block and follows the identical pattern. The existing blocks were not modified.

**Could `intentkit.js` list or init break for repos without `.intent/` in source?**
Unlikely — `fs.readdirSync` on a missing dir would throw, but `.intent/` is always present in the package since it's in the `files` array. Confirmed by `npm pack --dry-run`.

**Could the commit instructions change confuse users updating existing installs?**
Low risk. The change from `git add .claude/` to `git add .claude/ .intent/` is additive — running the old command still works, it just misses `.intent/`. The new command is correct.

## Security / Compliance Checks

- Installer writes only to `$TARGET_DIR/.claude/` and `$TARGET_DIR/.intent/` — no writes outside the target repo
- No credentials, tokens, or secrets in any installed file
- No network calls at runtime
- No `eval`, no dynamic code execution in either installer
- `cp -r` in `install.sh` does not follow symlinks by default on macOS (`cp` without `-P` copies symlink targets, but source files are plain markdown — no symlinks in `.intent/`)

## Known Gaps

- **`install.sh` curl-pipe guard relies on `BASH_SOURCE[0]` being empty** — this is the typical curl-pipe behavior but not guaranteed across all bash versions; the third condition (`[ ! -d "$SCRIPT_DIR/.claude" ]`) provides a fallback safety net for edge cases
- **No automated tests** — all verification is manual; a regression in copy logic would require a human to re-run these checks
- **`install.sh` still listed in README as a local-only option** — the wording is clear but some users may still attempt curl-pipe; the guard handles this gracefully with an error message and redirect
- **tasks.md checkbox update not yet committed** — pending final push after verification
