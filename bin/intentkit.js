#!/usr/bin/env node

const fs   = require('fs')
const path = require('path')

const COMMAND = process.argv[2]
const FORCE   = process.argv.includes('--force')

const PKG_DIR    = path.join(__dirname, '..')
const TARGET_DIR = process.cwd()

const GREEN  = '\x1b[32m'
const YELLOW = '\x1b[33m'
const BLUE   = '\x1b[34m'
const BOLD   = '\x1b[1m'
const RESET  = '\x1b[0m'

function log(msg = '') { process.stdout.write(msg + '\n') }

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true })
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, entry.name)
    const d = path.join(dest, entry.name)
    entry.isDirectory() ? copyDir(s, d) : fs.copyFileSync(s, d)
  }
}

// ── help ──────────────────────────────────────────────────────────────────────
if (!COMMAND || COMMAND === 'help' || COMMAND === '--help' || COMMAND === '-h') {
  log()
  log(`${BOLD}${BLUE}intentkit${RESET} — Claude Code skills for engineering teams`)
  log()
  log('Usage:')
  log('  intentkit init            Install skills into the current repo')
  log('  intentkit init --force    Overwrite existing skills with latest')
  log('  intentkit list            Show available skills and commands')
  log('  intentkit help            Show this help')
  log()
  log('After install, reload your Claude Code window to activate the commands:')
  log('  VS Code / Cursor:  Cmd+Shift+P → Developer: Reload Window')
  log('  Claude Code CLI:   exit and re-run claude')
  log()
  process.exit(0)
}

// ── list ──────────────────────────────────────────────────────────────────────
if (COMMAND === 'list') {
  const skillsDir   = path.join(PKG_DIR, '.claude', 'skills')
  const commandsDir = path.join(PKG_DIR, '.claude', 'commands')
  log()
  log(`${BOLD}Available skills:${RESET}`)
  for (const name of fs.readdirSync(skillsDir)) {
    log(`  ${GREEN}✓${RESET}  ${name}`)
  }
  log()
  log(`${BOLD}Available commands:${RESET}`)
  for (const file of fs.readdirSync(commandsDir)) {
    log(`  ${BLUE}/${RESET}${path.basename(file, '.md')}`)
  }
  log()
  process.exit(0)
}

// ── init ──────────────────────────────────────────────────────────────────────
if (COMMAND === 'init') {
  const srcSkills   = path.join(PKG_DIR, '.claude', 'skills')
  const srcCommands = path.join(PKG_DIR, '.claude', 'commands')
  const destSkills   = path.join(TARGET_DIR, '.claude', 'skills')
  const destCommands = path.join(TARGET_DIR, '.claude', 'commands')

  log()
  log(`${BOLD}${BLUE}intentkit init${RESET}`)
  log('────────────────────────────────────')
  log(`Target: ${TARGET_DIR}`)
  log()

  if (!fs.existsSync(path.join(TARGET_DIR, '.git'))) {
    log('⚠️  Warning: current directory is not a git repo.')
    log('   Skills will install but are designed to run from a repo root.')
    log()
  }

  let installed = 0
  let skipped   = 0

  // Install skills
  log('Installing skills...')
  for (const skill of fs.readdirSync(srcSkills)) {
    const dest = path.join(destSkills, skill)
    if (fs.existsSync(dest) && !FORCE) {
      log(`  ${YELLOW}⟳ skipped${RESET}   ${skill}  (already installed — use --force to update)`)
      skipped++
    } else {
      copyDir(path.join(srcSkills, skill), dest)
      log(`  ${GREEN}✓ installed${RESET}  ${skill}`)
      installed++
    }
  }

  log()
  log('Installing commands...')
  fs.mkdirSync(destCommands, { recursive: true })
  for (const file of fs.readdirSync(srcCommands)) {
    const dest = path.join(destCommands, file)
    const name = path.basename(file, '.md')
    if (fs.existsSync(dest) && !FORCE) {
      log(`  ${YELLOW}⟳ skipped${RESET}   /${name}  (already installed — use --force to update)`)
      skipped++
    } else {
      fs.copyFileSync(path.join(srcCommands, file), dest)
      log(`  ${GREEN}✓ installed${RESET}  /${name}`)
      installed++
    }
  }

  log()
  log('────────────────────────────────────')
  log(`${GREEN}${BOLD}Done.${RESET} ${installed} installed · ${skipped} skipped`)
  log()

  if (installed > 0) {
    log('Commit the skills to your repo so every developer gets them:')
    log()
    log('  git add .claude/')
    log('  git commit -m "Add Claude skills — /daily-snapshot and /git-scorecard"')
    log('  git push')
    log()
  }

  log('────────────────────────────────────')
  log(`${YELLOW}${BOLD}Reload Claude Code to activate the commands:${RESET}`)
  log()
  log('  VS Code / Cursor:  Cmd+Shift+P → Developer: Reload Window')
  log('  JetBrains:         Close and reopen the IDE')
  log('  Claude Code CLI:   Exit and re-run claude')
  log()
  log('Then type /daily-snapshot or /git-scorecard in any Claude Code session.')
  log('────────────────────────────────────')
  log()

  process.exit(0)
}

log(`Unknown command: "${COMMAND}". Run 'intentkit help' for usage.`)
process.exit(1)
