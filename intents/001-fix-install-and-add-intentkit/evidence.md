# Evidence: Fix Install and Add IntentKit

## Build Evidence

No build step — pure shell + Node.js. Package integrity verified via `npm pack --dry-run`.

```
npm pack --dry-run | grep intent | wc -l
→ 25   (all .intent/ files present in npm package)
```

Total pack manifest: skills, commands, `.intent/` tree, README, SKILLS.md. No compilation errors.

---

## Test Evidence

No automated test suite exists (documented gap). All verification was manual and scripted inline.

**Fresh install test** (`npx intentkit init` equivalent, run via `node bin/intentkit.js init` in temp dir):
```
Done. 20 installed · 0 skipped

.intent/memory/    ✓
.intent/metrics/   ✓
.intent/playbooks/ ✓
.intent/skills/    ✓
.intent/templates/ ✓
```
29 `.intent/` files confirmed present in fresh target repo.

**Skip logic test** (re-run without `--force`):
```
Done. 0 installed · 20 skipped
```

**Force-overwrite test** (re-run with `--force`):
```
Done. 20 installed · 0 skipped
```

**curl-pipe guard test** (empty `BASH_SOURCE[0]`):
```bash
bash --norc -c 'BASH_SOURCE=(); source install.sh ...'
→ GUARD: would block
```
Guard fires correctly. Local run (`bash install.sh`) unaffected — guard does not trigger.

**Doctor check:**
```
22/22 ✓  (memory × 4, templates × 8, commands × 9, workspace × 1)
```

---

## Screenshot / Demo Evidence

No UI. Terminal output from fresh install (stripped of ANSI codes):

```
intentkit init
────────────────────────────────────
Target: /tmp/fresh-install-test

Installing skills...
  ✓ installed  daily-snapshot
  ✓ installed  repo-scorecard

Installing commands...
  ✓ installed  /create-report-card
  ✓ installed  /daily-snapshot
  ✓ installed  /git-scorecard
  ✓ installed  /ide.capture
  ✓ installed  /ide.context
  ✓ installed  /ide.evidence
  ✓ installed  /ide.impact
  ✓ installed  /ide.implement
  ✓ installed  /ide.plan
  ✓ installed  /ide.refine
  ✓ installed  /ide.tasks
  ✓ installed  /ide.verify
  ✓ installed  /intentkit

Installing IntentKit support files (.intent/)...
  ✓ installed  .intent/memory/
  ✓ installed  .intent/metrics/
  ✓ installed  .intent/playbooks/
  ✓ installed  .intent/skills/
  ✓ installed  .intent/templates/

────────────────────────────────────
Done. 20 installed · 0 skipped
```

---

## Code Review Evidence

No PR created — direct push to `master` per existing repo workflow (no CI pipeline, single maintainer).

**Commits on master for this feature:**

| Commit | Description |
|---|---|
| `b7449a6` | Fix branch name main→master and clarify post-install reload instructions |
| `cca3c0d` | Add IntentKit delivery loop — commands, templates, memory, and CLAUDE.md |
| `4f235ed` | Fix installer to copy .intent/ and block broken curl-pipe path ← primary implementation |
| `5e161b4` | Add verification.md and mark all tasks complete for 001 |

**Files changed in primary commit (`4f235ed`):** 10 files, 420 insertions, 19 deletions.

---

## Acceptance Evidence

| Acceptance Item | Status | Evidence |
|---|---|---|
| `npx intentkit init` in a fresh repo copies `.intent/` | ✓ | 29 `.intent/` files in temp dir; `Done. 20 installed` output |
| `npm pack --dry-run` includes `.intent/` | ✓ | 25 `.intent/` entries in pack manifest |
| All 9 IntentKit commands in `.claude/commands/` | ✓ | Doctor 22/22; `intentkit list` shows all 9 |
| All 8 templates in `.intent/templates/` | ✓ | Fresh install output + file listing |
| All 4 memory files in `.intent/memory/` | ✓ | Fresh install output + doctor check |
| `/intentkit doctor` 22/22 ✓ | ✓ | Run output: all 22 checks pass |
| curl-pipe guard redirects to `npx intentkit init` | ✓ | Guard test: empty `BASH_SOURCE[0]` → blocks with clear error + redirect |
| Local `bash install.sh` unaffected by guard | ✓ | Ran from source dir: executes normally |
| README uses `npx intentkit init` as primary install | ✓ | README updated; curl-pipe removed from primary path |
| README directory tree includes `.intent/` | ✓ | Full tree with all commands + `.intent/` subdirs |
| `team-onboarding.md` uses `npx intentkit init` throughout | ✓ | All 5 curl-pipe references replaced |
| Changes pushed to `master` | ✓ | `5e161b4` on `origin/master` |

---

## PR Summary

**Intent:** Two install bugs blocked developer adoption. (1) All install URLs pointed to `main` but the branch is `master` — curl returned 404. (2) After a successful install, developers couldn't use the commands because no clear reload instruction existed. A third gap was found during refinement: neither installer copied `.intent/`, so IntentKit commands installed but their required templates and memory files did not, causing failures on first use.

**Implementation:**
- `package.json` — added `.intent/` to `files` array so npm distributes it
- `bin/intentkit.js` — added `.intent/` copy block (skip/force) + shown in `list` output
- `install.sh` — added `.intent/` copy block; added curl-pipe guard that blocks broken SCRIPT_DIR resolution and redirects to `npx intentkit init`
- `README.md` — updated directory tree to show full command set + `.intent/`; updated commit instructions to include `.intent/`
- `docs/playbooks/team-onboarding.md` — replaced all curl-pipe install references with `npx intentkit init`

**Evidence:** 12/12 tasks complete. 12/12 acceptance items pass. Fresh install verified in isolated temp directory. Doctor 22/22.

---

## Evidence Summary

**Ready for merge:** Yes — already on `master`.

Reason: All acceptance criteria met and verified manually. The critical gap (`.intent/` not installed) is fixed in both installers and the npm package. The curl-pipe SCRIPT_DIR bug is blocked with a clear error and redirect. No regressions in existing skill installs (skip/force logic unchanged).
