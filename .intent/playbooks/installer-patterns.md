# Installer Patterns

Reusable patterns for bash and Node.js file-distribution installers.

---

## curl-pipe SCRIPT_DIR Guard (bash)

When a bash script is piped via `curl | bash`, `BASH_SOURCE[0]` is empty or resolves to `bash`, making `SCRIPT_DIR` resolve to `$PWD` rather than the script source. Add this guard at the top of any bash installer:

```bash
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

if [ -z "${BASH_SOURCE[0]}" ] || [ "${BASH_SOURCE[0]}" = "bash" ] || [ ! -d "$SCRIPT_DIR/.expected-dir" ]; then
  echo "ERROR: install.sh cannot find its source files."
  echo "Run this script locally from a cloned copy, or use the npm CLI:"
  echo "  npx your-package init"
  exit 1
fi
```

Replace `.expected-dir` with a directory that is always present in the source repo (e.g. `.claude`, `src`).

---

## npm CLI as the Reliable Remote Install Path

For remote one-line installs, the npm CLI is more reliable than `curl | bash`:

```bash
npx your-package init
```

- `__dirname` in Node.js always resolves to the installed package location, regardless of how the process was started
- No SCRIPT_DIR ambiguity
- Works with `--force` flag naturally
- Users don't need to clone the repo

**Prefer `npx` over `curl | bash` in all public documentation.**

---

## Standard Skip/Force Copy Loop (bash)

```bash
for subdir in "$SCRIPT_DIR/source-dir"/*/; do
  name=$(basename "$subdir")
  target="$TARGET_DIR/dest-dir/$name"

  if [ -d "$target" ] && [ "$FORCE" = false ]; then
    echo "  ⟳ skipped  $name (already exists — use --force to overwrite)"
    SKIPPED+=("$name")
  else
    mkdir -p "$target"
    cp -r "$subdir"* "$target/"
    echo "  ✓ installed $name"
    INSTALLED+=("$name")
  fi
done
```

---

## Standard Skip/Force Copy Loop (Node.js)

```js
for (const name of fs.readdirSync(srcDir)) {
  const dest = path.join(destDir, name)
  if (fs.existsSync(dest) && !FORCE) {
    log(`  ⟳ skipped  ${name}  (already installed — use --force to update)`)
    skipped++
  } else {
    copyDir(path.join(srcDir, name), dest)
    log(`  ✓ installed  ${name}`)
    installed++
  }
}
```

---

## Fresh Install Verification

After any installer change, verify by running the installer in an isolated temp directory:

```bash
TMPDIR=$(mktemp -d)
cd "$TMPDIR" && git init
node /path/to/bin/your-cli.js init
find . | sort   # confirm all expected files are present
```

This catches silent omissions (missing files, wrong `files` array in `package.json`) before they reach users.
