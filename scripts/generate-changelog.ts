#!/usr/bin/env ts-node
/*
 * Script: generate-changelog.ts
 * Purpose: Regenerate CHANGELOG.md from git history using Conventional Commit prefixes.
 * Behavior:
 *  - Preserves existing Unreleased section content (if present)
 *  - Groups commits by date (YYYY-MM-DD) then by type (feat, fix, perf, docs, chore, refactor, test, build, ci, other)
 *  - Skips merge commits (subjects starting with 'Merge ')
 */
import { execSync } from 'node:child_process';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

interface Commit {
  hash: string;
  date: string; // YYYY-MM-DD
  subject: string;
  type: string;
  scope?: string;
}

const REPO_ROOT = join(__dirname, '..');
const CHANGELOG_PATH = join(REPO_ROOT, 'CHANGELOG.md');

function getGitCommits(): Commit[] {
  const raw = execSync("git log --pretty=format:'%H\t%ad\t%s' --date=short", { cwd: REPO_ROOT, encoding: 'utf8' });
  const lines = raw.split(/\n/).filter(Boolean);
  return lines.map(line => {
    const [hash, date, subject] = line.split(/\t/);
    let type = 'other';
    let scope: string | undefined;
    const m = subject.match(/^(\w+)(?:\(([^)]+)\))?!?:/);
    if (m) {
      type = m[1];
      scope = m[2];
    }
    return { hash: hash.trim(), date: date.trim(), subject: subject.trim(), type, scope };
  }).filter(c => !c.subject.startsWith('Merge '));
}

const TYPE_ORDER = ['feat','fix','perf','docs','refactor','test','build','ci','chore','other'];
const TYPE_TITLES: Record<string,string> = {
  feat: 'Features',
  fix: 'Bug Fixes',
  perf: 'Performance',
  docs: 'Documentation',
  refactor: 'Refactoring',
  test: 'Tests',
  build: 'Build',
  ci: 'CI',
  chore: 'Chores',
  other: 'Other'
};

function group(commits: Commit[]) {
  const byDate: Record<string, Commit[]> = {};
  commits.forEach(c => {
    byDate[c.date] = byDate[c.date] || [];
    byDate[c.date].push(c);
  });
  return Object.entries(byDate)
    .sort((a,b) => a[0] < b[0] ? 1 : -1); // newest first
}

function formatCommit(c: Commit): string {
  const short = c.hash.substring(0,7);
  return `- ${c.subject} (\`${short}\`)`;
}

function buildBody(commits: Commit[]) {
  const grouped = group(commits);
  const lines: string[] = [];
  for (const [date, list] of grouped) {
    lines.push(`## ${date}`);    
    const byType: Record<string, Commit[]> = {};
    list.forEach(c => {
      const t = TYPE_ORDER.includes(c.type) ? c.type : 'other';
      byType[t] = byType[t] || [];
      byType[t].push(c);
    });
    TYPE_ORDER.forEach(t => {
      if (!byType[t] || byType[t].length === 0) return;
      lines.push(`\n### ${TYPE_TITLES[t]}`);
      byType[t].forEach(c => {
        lines.push(formatCommit(c));
      });
    });
    lines.push('');
  }
  return lines.join('\n');
}

function extractUnreleased(existing: string): string {
  const m = existing.match(/## Unreleased([\s\S]*?)(?=\n## \d{4}-\d{2}-\d{2}|$)/);
  return m ? m[1].trim() : '';
}

function main() {
  const commits = getGitCommits();
  const existing = existsSync(CHANGELOG_PATH) ? readFileSync(CHANGELOG_PATH,'utf8') : '';
  const unreleasedBody = extractUnreleased(existing);

  const body = buildBody(commits);
  const header = '# Changelog\n\nAll notable changes to this project will be documented in this file.\n\nThe format follows Conventional Commits.\n\n## Unreleased\n' + (unreleasedBody ? unreleasedBody + '\n' : '\n');
  const finalContent = header + '\n' + body.trim() + '\n';
  writeFileSync(CHANGELOG_PATH, finalContent);
  // eslint-disable-next-line no-console
  console.log('CHANGELOG.md regenerated');
}

main();
