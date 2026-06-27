#!/bin/bash
# Claude Skills Installer
# Copies .claude/skills/ and .claude/commands/ from this library into a target repo.
#
# Usage:
#   From the target repo root:
#     bash /path/to/claudeskills/install.sh
#
#   Or via curl (recommended):
#     curl -fsSL https://raw.githubusercontent.com/kendallmark3/claudeskills/main/install.sh | bash
#
#   Options:
#     --force    Overwrite existing skills (default: skip if already present)
#     --list     Show available skills without installing

set -e

# ── Config ────────────────────────────────────────────────────────────────────
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TARGET_DIR="${PWD}"
FORCE=false
LIST_ONLY=false
INSTALLED=()
SKIPPED=()

# ── Args ──────────────────────────────────────────────────────────────────────
for arg in "$@"; do
  case $arg in
    --force) FORCE=true ;;
    --list)  LIST_ONLY=true ;;
  esac
done

# ── Colors ────────────────────────────────────────────────────────────────────
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RESET='\033[0m'

echo ""
echo -e "${BLUE}Claude Skills Installer${RESET}"
echo "────────────────────────────────────"
echo "Library:  $SCRIPT_DIR"
echo "Target:   $TARGET_DIR"
echo ""

# ── List mode ─────────────────────────────────────────────────────────────────
if [ "$LIST_ONLY" = true ]; then
  echo "Available skills:"
  echo ""
  for skill_dir in "$SCRIPT_DIR/.claude/skills"/*/; do
    skill_name=$(basename "$skill_dir")
    echo -e "  ${GREEN}✓${RESET} $skill_name"
  done
  echo ""
  echo "Available commands:"
  echo ""
  for cmd_file in "$SCRIPT_DIR/.claude/commands"/*.md; do
    cmd_name=$(basename "$cmd_file" .md)
    echo -e "  ${BLUE}/${RESET}$cmd_name"
  done
  echo ""
  exit 0
fi

# ── Verify target is a repo ───────────────────────────────────────────────────
if [ ! -d "$TARGET_DIR/.git" ]; then
  echo "⚠️  Warning: $TARGET_DIR does not appear to be a git repo."
  echo "   Skills will still be installed but are designed to run from a repo root."
  echo ""
fi

# ── Create target .claude structure ───────────────────────────────────────────
mkdir -p "$TARGET_DIR/.claude/skills"
mkdir -p "$TARGET_DIR/.claude/commands"

# ── Install skills ─────────────────────────────────────────────────────────────
echo "Installing skills..."
for skill_dir in "$SCRIPT_DIR/.claude/skills"/*/; do
  skill_name=$(basename "$skill_dir")
  target_skill="$TARGET_DIR/.claude/skills/$skill_name"

  if [ -d "$target_skill" ] && [ "$FORCE" = false ]; then
    echo -e "  ${YELLOW}⟳ skipped${RESET}  $skill_name (already exists — use --force to overwrite)"
    SKIPPED+=("$skill_name")
  else
    mkdir -p "$target_skill"
    cp -r "$skill_dir"* "$target_skill/"
    echo -e "  ${GREEN}✓ installed${RESET} $skill_name"
    INSTALLED+=("$skill_name")
  fi
done

echo ""
echo "Installing commands..."
for cmd_file in "$SCRIPT_DIR/.claude/commands"/*.md; do
  cmd_name=$(basename "$cmd_file" .md)
  target_cmd="$TARGET_DIR/.claude/commands/$cmd_name.md"

  if [ -f "$target_cmd" ] && [ "$FORCE" = false ]; then
    echo -e "  ${YELLOW}⟳ skipped${RESET}  /$cmd_name (already exists — use --force to overwrite)"
    SKIPPED+=("/$cmd_name")
  else
    cp "$cmd_file" "$target_cmd"
    echo -e "  ${GREEN}✓ installed${RESET} /$cmd_name"
    INSTALLED+=("/$cmd_name")
  fi
done

# ── Summary ───────────────────────────────────────────────────────────────────
echo ""
echo "────────────────────────────────────"
echo -e "${GREEN}Done.${RESET} ${#INSTALLED[@]} installed · ${#SKIPPED[@]} skipped"
echo ""
echo "Restart Claude Code to activate new commands."
echo ""
echo "Available commands after restart:"
for cmd_file in "$SCRIPT_DIR/.claude/commands"/*.md; do
  cmd_name=$(basename "$cmd_file" .md)
  echo "  /$cmd_name"
done
echo ""
