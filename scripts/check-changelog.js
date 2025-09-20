#!/usr/bin/env node
/* Simple verification script: ensures CHANGELOG.md regenerated matches current commit history */
const { execSync } = require('node:child_process');
const { readFileSync } = require('node:fs');
const { join } = require('node:path');

const root = join(__dirname, '..');
const changelogPath = join(root, 'CHANGELOG.md');

function getCurrentLog() {
  return readFileSync(changelogPath, 'utf8');
}

function generateTemp() {
  const script = join(root, 'scripts', 'generate-changelog.ts');
  // run ts-node inline; if not installed globally it uses workspace dep
  return execSync(`npx ts-node ${script}`, { cwd: root, env: process.env, stdio: 'pipe' }).toString();
}

try {
  const before = getCurrentLog();
  execSync('npx ts-node scripts/generate-changelog.ts', { cwd: root, stdio: 'pipe' });
  const after = getCurrentLog();
  if (before !== after) {
    console.error('CHANGELOG.md is out of date. Run: npm run changelog:generate');
    process.exit(1);
  }
  console.log('CHANGELOG up to date.');
} catch (e) {
  console.error('Changelog check failed:', e.message);
  process.exit(1);
}
