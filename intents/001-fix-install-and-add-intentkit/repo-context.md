# Repo Context: Fix Install and Add IntentKit

## Repo Summary

A pure shell + Node.js skill library for Claude Code. No frontend, no backend, no database. Two delivery mechanisms ship the same set of files into a target repo:

1. **`install.sh`** — bash script, intended for local execution (`bash /path/to/install.sh`) or curl-pipe
2. **`bin/intentkit.js`** — Node.js CLI, published as `intentkit` on npm, invoked via `npx intentkit init`

No build step. No compilation. No test framework. No CI/CD pipeline.

---

## Relevant Files / Folders

| Path | Why it matters | Evidence |
|---|---|---|
| `install.sh` | Primary installer — copies `.claude/skills/` and `.claude/commands/` to `TARGET_DIR` | Lines 77–108; only these two directories are copied |
| `bin/intentkit.js` | npm CLI installer — mirrors install.sh logic in Node.js | Lines 66–143; same two directories, same skip/force logic |
| `package.json` | npm package config — `files` array controls what ships with `npx intentkit init` | `"files": ["bin/", ".claude/", "README.md", "SKILLS.md"]` — `.intent/` excluded |
| `.claude/commands/` | 12 command files — 3 original skills + 9 IntentKit ide.* commands + intentkit.md | Confirmed by `find` output |
| `.claude/skills/` | 2 skill directories: `daily-snapshot/SKILL.md`, `repo-scorecard/SKILL.md` | Confirmed by `find` output |
| `.intent/` | IntentKit support files — templates, memory, playbooks, skills, metrics | Present in source repo; NOT copied by either installer |
| `.github/prompts/` | 9 GitHub Copilot prompt files mirroring the ide.* commands | Present in source repo; not referenced by installer |
| `intents/` | Feature workspace directory — created by `/intentkit feature` | `intents/001-fix-install-and-add-intentkit/` is the first workspace |
| `CLAUDE.md` | IntentKit instructions for Claude Code in this repo | Instructs Claude to read active intent and use the delivery loop |

---

## Existing Patterns

**install.sh copy pattern (bash):**
```bash
# Skills: directory-level copy
cp -r "$skill_dir"* "$target_skill/"

# Commands: file-level copy
cp "$cmd_file" "$target_cmd"
```
Skip-if-exists is the default; `--force` overwrites. No merge logic.

**intentkit.js copy pattern (Node.js):**
```js
function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true })
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    entry.isDirectory() ? copyDir(s, d) : fs.copyFileSync(s, d)
  }
}
```
Same skip/force logic as install.sh.

**SCRIPT_DIR behavior in install.sh:**
When run via `curl | bash`, `BASH_SOURCE[0]` resolves to the current directory, making `SCRIPT_DIR = TARGET_DIR = PWD`. This means install.sh only works correctly when invoked locally from the source repo root. The npm CLI (`npx intentkit init`) does not have this problem — `PKG_DIR = path.join(__dirname, '..')` always resolves to the installed package location.

---

## API / Data Context

None. No network calls at runtime. The only external dependency is GitHub raw content for the curl install URL:
```
https://raw.githubusercontent.com/kendallmark3/claudeskills/master/install.sh
```

---

## Auth / Security Context

None. No credentials, no tokens, no secrets. Installer writes only to `$TARGET_DIR/.claude/` and (if added) `.intent/`.

---

## Testing Context

No test framework exists. No `test/` directory. No `npm test` script in `package.json`. Verification is manual: run `/intentkit doctor` inside Claude Code.

---

## Build / Run Commands

```bash
# Install into a target repo (local, from source root)
bash install.sh
bash install.sh --force
bash install.sh --list

# Install via npm CLI (works from any directory)
npx intentkit init
npx intentkit init --force
npx intentkit list

# Verify install
# (run inside Claude Code)
/intentkit doctor
```

---

## Risks From Repo Evidence

1. **`.intent/` not copied by either installer** — `install.sh` only touches `.claude/skills/` and `.claude/commands/`. `intentkit.js` only touches `.claude/skills/` and `.claude/commands/`. `package.json` `files` array excludes `.intent/`. Any developer who installs claudeskills into a fresh repo and runs `/ide.capture` will hit missing file errors for templates and memory files.

2. **`install.sh` SCRIPT_DIR breaks under curl | bash** — `BASH_SOURCE[0]` resolves to current directory when piped from stdin, so the script tries to copy skills from the target repo rather than the source. The script only works reliably when cloned locally and run as `bash /path/to/install.sh`. The npm CLI path (`npx intentkit init`) does not have this bug.

3. **`package.json` name is `intentkit` but repo describes itself as `claudeskills`** — the npm package name and GitHub repo name differ. The `repository.url` points to `claudeskills.git`. This will confuse developers who install via npm vs curl.

4. **No tests** — correctness of the installer is verified only by running it manually. Any regression in copy logic or file listing would go undetected until a user reports it.

5. **Hardcoded branch `master` in all URLs** — one rename breaks all existing install commands in external documentation and any user's copy-pasted scripts.
