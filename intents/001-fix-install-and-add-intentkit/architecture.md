# Architecture Intent: Fix Install and Add IntentKit

## Architecture Summary

This repo is a file-distribution library — no runtime, no server, no database. The "architecture" is two copy scripts (bash + Node.js) that mirror the same source directories into a target repo. The remaining work is adding `.intent/` to what both scripts copy, and fixing `install.sh`'s `SCRIPT_DIR` resolution under `curl | bash`.

No new components, services, or layers are introduced. All changes are confined to copy-script logic and the `package.json` files manifest.

## Impact Map

| Area | Impact | Files / Components | Risk |
|---|---|---|---|
| Frontend | None | — | None |
| API / Backend | None | — | None |
| Data | None | — | None |
| Auth | None | — | None |
| Deployment / Distribution | **High** — `package.json` controls what ships via `npx intentkit init`; `.intent/` must be added to `files` array | `package.json` | Excluding `.intent/` means npm installs silently miss it — already the current bug |
| Installer — bash | **High** — `install.sh` must be extended to copy `.intent/`; `SCRIPT_DIR` resolution must be fixed for curl-pipe use | `install.sh` | `SCRIPT_DIR` bug means curl-pipe installs currently copy nothing from source |
| Installer — Node.js | **High** — `bin/intentkit.js` must be extended to copy `.intent/` | `bin/intentkit.js` | Straightforward — `copyDir()` helper already exists |
| Observability | None — no logging or metrics exist | — | None |
| Security | Low — installer writes only to `$TARGET_DIR/.claude/` and `.intent/`; no credentials or network calls at runtime | — | Ensure installer does not follow symlinks outside target |

## Design Decisions

| Decision | Options Considered | Chosen Approach | Why |
|---|---|---|---|
| Fix `install.sh` SCRIPT_DIR under curl-pipe | (A) Embed source files inline in the script; (B) Have script fetch files from GitHub API; (C) Document that curl-pipe doesn't work, recommend npm path | (C) Document limitation, recommend `npx intentkit init` | The npm path already works correctly; fixing curl-pipe would require embedding or a second network call — adds complexity for a flow that already has a working alternative |
| Copy `.intent/` in both installers | (A) Copy full `.intent/` tree; (B) Copy only `templates/` and `memory/` (required by commands); (C) Make it opt-in via a flag | (A) Copy full `.intent/` tree | Playbooks, skills, and metrics files are referenced by the delivery loop; omitting them creates partial installs that are harder to debug |
| Update `package.json` files array | Add `.intent/` to the `files` array | Add `.intent/` | Without this, `npx intentkit init` cannot copy `.intent/` because it isn't included in the published package |
| Skip logic for `.intent/` | Same skip-if-exists / `--force` pattern as `.claude/` | Consistent with existing pattern | No reason to diverge; developers may have customised their `.intent/memory/` and should not have it silently overwritten |

## Agent Guardrails

- Do not create new architecture where existing patterns already exist.
- Do not change public contracts without documenting compatibility.
- Do not modify unrelated code.
- Ask for human decision when architecture tradeoff is material.
- The `copyDir()` function in `intentkit.js` is the established pattern — reuse it, do not rewrite it.
- The skip/force pattern in both installers is the established pattern — apply it consistently to `.intent/`.
