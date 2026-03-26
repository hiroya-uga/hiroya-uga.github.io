#!/usr/bin/env node
/**
 * Update publishedAt and updatedAt in article frontmatter with commit timestamps.
 * - publishedAt (date-only): replaced with the first commit time for that file
 * - updatedAt (date-only): replaced with the latest commit time for that file
 *
 * Usage:
 *   node scripts/update-article-dates.mjs         # staged articles only (pre-commit hook)
 *   node scripts/update-article-dates.mjs --all   # all articles/**\/*.md (migration)
 */

import { execSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { glob } from 'node:fs/promises';

const DATE_ONLY_RE = /^\d{4}-\d{2}-\d{2}$/;
const ALL_MODE = process.argv.includes('--all');

function formatISO(date) {
  const pad = (n) => String(n).padStart(2, '0');
  const offset = -date.getTimezoneOffset();
  const sign = offset >= 0 ? '+' : '-';
  const absOffset = Math.abs(offset);
  const offsetHours = Math.floor(absOffset / 60);
  const offsetMins = absOffset % 60;

  return (
    `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}` +
    `T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}` +
    `${sign}${pad(offsetHours)}:${pad(offsetMins)}`
  );
}

function getStagedArticles() {
  return execSync('git diff --cached --name-only --diff-filter=ACM', { encoding: 'utf8' })
    .trim()
    .split('\n')
    .filter((f) => f.startsWith('articles/') && f.endsWith('.md'));
}

async function getAllArticles() {
  /** @type {string[]} */
  const files = [];
  for await (const f of glob('articles/**/*.md')) {
    files.push(f);
  }
  return files;
}

/** Get commit times for a file. Returns { first, latest } as Date or null. */
function getCommitTimes(file) {
  try {
    const out = execSync(`git log --follow --format="%ai" -- "${file}"`, { encoding: 'utf8' })
      .trim()
      .split('\n')
      .filter(Boolean);
    if (out.length === 0) return { first: null, latest: null };
    const oldest = out.at(-1);
    return {
      first: oldest ? new Date(oldest) : null,
      latest: new Date(out[0]),
    };
  } catch {
    return { first: null, latest: null };
  }
}

const now = new Date();
const nowStr = formatISO(now);

const files = ALL_MODE ? await getAllArticles() : getStagedArticles();
if (files.length === 0) process.exit(0);

for (const file of files) {
  const content = readFileSync(file, 'utf8');

  const fmMatch = content.match(/^---\n([\s\S]*?)\n---/);
  if (!fmMatch) continue;

  let frontmatter = fmMatch[1];
  const rest = content.slice(fmMatch[0].length);
  let changed = false;

  const hasDatOnlyField =
    /^publishedAt:\s*['"](\d{4}-\d{2}-\d{2})['"]$/m.test(frontmatter) ||
    /^updatedAt:\s*['"](\d{4}-\d{2}-\d{2})['"]$/m.test(frontmatter);
  if (!hasDatOnlyField) continue;

  const { first, latest } = getCommitTimes(file);

  // publishedAt: date-only → first commit time (or now for new untracked files)
  frontmatter = frontmatter.replace(/^(publishedAt:\s*)['"](\d{4}-\d{2}-\d{2})['"]$/m, (_, key, val) => {
    if (!DATE_ONLY_RE.test(val)) return _;
    const ts = first ? formatISO(first) : nowStr;
    changed = true;
    return `${key}'${ts}'`;
  });

  // updatedAt: date-only → latest commit time (or now for staged/new files)
  frontmatter = frontmatter.replace(/^(updatedAt:\s*)['"](\d{4}-\d{2}-\d{2})['"]$/m, (_, key, val) => {
    if (!DATE_ONLY_RE.test(val)) return _;
    const ts = ALL_MODE ? (latest ? formatISO(latest) : nowStr) : nowStr;
    changed = true;
    return `${key}'${ts}'`;
  });

  if (changed) {
    writeFileSync(file, `---\n${frontmatter}\n---${rest}`, 'utf8');
    if (!ALL_MODE) execSync(`git add "${file}"`);
    console.log(`[update-article-dates] Updated ${file}`);
  }
}
