# Impact: Fix Install and Add IntentKit

## Intended Impact

**Developer adoption:** Any developer who runs `npx intentkit init` in a repo now gets a complete, working install — skills, commands, and IntentKit support files — in one step. The previous experience silently failed (404 on curl) or left commands unregistered and templates missing.

**IntentKit usability:** The delivery loop (`/ide.capture` → `/ide.impact`) is now fully functional in any repo after a single install. Previously, ide.* commands installed but `.intent/templates/` and `.intent/memory/` were absent, so the first command run would error.

**Install reliability:** The curl-pipe SCRIPT_DIR bug is now surfaced as a clear error with a redirect to `npx intentkit init`, rather than silently producing an empty install.

---

## Delivery Metrics

| Metric | Baseline | Target | Actual |
|---|---:|---:|---:|
| Install success rate (user reports) | ~0% (Tolata failed) | 100% | Pending — next install attempt |
| Time from `npx intentkit init` to first `/ide.capture` | Unknown | < 2 min | Pending |
| Files installed in fresh repo | 0 `.intent/` files | 29 `.intent/` files | **29** ✓ (verified) |
| Doctor pass rate | Unknown | 22/22 | **22/22** ✓ (verified) |
| Cycle time (intent capture → push) | First feature — no baseline | — | **1 session** (same day) |
| Tasks completed | 0/12 | 12/12 | **12/12** ✓ |
| Rework during implementation | — | 0 | **0** — all tasks implemented in first pass |
| Defects escaped to master | — | 0 | **0** — all acceptance items passed before push |

---

## Learning Loop

### What we learned

**1. Installer gap: file-distribution tools need end-to-end install testing**
The `.intent/` omission from both installers was not caught until the refine step because there was no test that ran the installer in a fresh directory and validated the full file tree. This class of bug — "tool installs itself but not its dependencies" — should be caught by a standard acceptance check.

**Recommended update:** Add to `.intent/memory/definition-of-done.md`:
> For any installer or file-distribution change: verify by running the installer in an isolated directory and confirming all dependent files are present.

**2. curl-pipe installers need a SCRIPT_DIR guard**
The `BASH_SOURCE[0]` resolution failure under `curl | bash` is a well-known bash footgun. Any bash installer distributed via curl should either embed its sources or detect and block the broken code path.

**Recommended update:** Add to `.intent/playbooks/` a new `installer-patterns.md` playbook covering: (a) curl-pipe SCRIPT_DIR guard pattern, (b) npm CLI as the reliable remote install path, (c) standard skip/force copy loop.

**3. Branch name hardcoding is a fragile distribution pattern**
One branch rename broke all install commands across user docs, README, and playbooks simultaneously. The fix (hardcoding `master`) is correct but repeats the same fragility. A redirect URL or versioned release tag would decouple the install URL from the branch name.

**Recommended update:** Add to `.intent/memory/architecture-rules.md`:
> Do not hardcode branch names in public-facing install URLs. Prefer a redirect endpoint or release tag that survives branch renames.

**4. The delivery loop surfaces gaps that code review alone would miss**
The `.intent/` omission was not caught by looking at the diff — it required the ide.refine and ide.context steps to trace the dependency from "commands are installed" to "the files those commands read are also installed." This validates the loop structure.

**No template change needed** — the loop worked as intended.

**5. `package.json` files array is a silent distribution gate**
Files not in `files` are silently excluded from `npm pack`. This is easy to miss when adding new directories to a repo. It should be an explicit acceptance check for any npm-distributed tool.

**Recommended update:** Add to `.intent/templates/verification-template.md`:
> For npm packages: run `npm pack --dry-run` and confirm all expected directories appear in the manifest.

---

## Recommended Memory / Template Updates

| File | Change | Reason |
|---|---|---|
| `.intent/memory/definition-of-done.md` | Add: installer changes require isolated fresh-install verification | Caught a gap that code review missed |
| `.intent/memory/architecture-rules.md` | Add: no hardcoded branch names in public install URLs | Tolata failure + potential future renames |
| `.intent/templates/verification-template.md` | Add: npm pack --dry-run check for npm-distributed tools | Silent exclusion of `.intent/` almost shipped |
| `.intent/playbooks/installer-patterns.md` | New file: curl-pipe guard, npm CLI pattern, skip/force loop | Reusable patterns for future installer work |
