/**
 * Generates Starlight docs content from the repo's markdown.
 * Keeps the docs site in sync with the study repo (single source of truth).
 */
import { readFileSync, writeFileSync, mkdirSync, readdirSync, rmSync, statSync, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '..', '..');
const OUT = path.resolve(__dirname, '..', 'src', 'content', 'docs');

const FOLDER_MAP = [
  ['01-Fundamentals', '01-fundamentals'],
  ['02-Networking', '02-networking'],
  ['03-Databases', '03-databases'],
  ['04-Caching', '04-caching'],
  ['05-LoadBalancing', '05-load-balancing'],
  ['06-MessageQueues', '06-message-queues'],
  ['07-ConsistentHashing', '07-consistent-hashing'],
  ['08-CAPTheorem', '08-cap-theorem'],
  ['09-Projects', '09-projects'],
  ['10-LargeScale', '10-large-scale'],
  ['11-Advanced', '11-advanced'],
  ['12-InterviewPrep', '12-interview-prep'],
];

const TOP_LEVEL = [
  ['MASTER-PLAN.md', 'master-plan.md'],
  ['PRACTICE.md', 'practice.md'],
  ['PROJECTS.md', 'build-projects.md'],
  ['NOTES-TEMPLATE.md', 'notes-template.md'],
  ['resources.md', 'resources.md'],
];

const FILE_ORDER = ['index.md', 'notes.md', 'practice.md'];

function stripBom(str) {
  return str.charCodeAt(0) === 0xfeff ? str.slice(1) : str;
}

function extractTitle(md) {
  const m = md.match(/^#\s+(.+)$/m);
  return m ? m[1].trim() : 'Untitled';
}

function extractDescription(md) {
  const afterTitle = md.replace(/^#\s+.+\n+/m, '');
  const m = afterTitle.match(/^\s*([^#\n][^\n]{20,180})/);
  return m ? m[1].trim() : '';
}

function frontmatter(title, desc) {
  const lines = ['---'];
  lines.push(`title: ${JSON.stringify(title)}`);
  if (desc) lines.push(`description: ${JSON.stringify(desc)}`);
  lines.push('---\n');
  return lines.join('\n');
}

function readMd(file) {
  if (!existsSync(file)) return null;
  const raw = stripBom(readFileSync(file, 'utf8'));
  if (!raw.trim()) return null;
  return frontmatter(extractTitle(raw), extractDescription(raw)) + raw;
}

function ensureClean() {
  rmSync(OUT, { recursive: true, force: true });
  mkdirSync(OUT, { recursive: true });
}

function writeNestedPages(srcDir, outDir) {
  mkdirSync(outDir, { recursive: true });
  const entries = readdirSync(srcDir, { withFileTypes: true });
  for (const entry of entries.sort((a, b) => a.name.localeCompare(b.name))) {
    if (entry.isDirectory()) {
      const childOut = path.join(outDir, safeSlug(entry.name));
      mkdirSync(childOut, { recursive: true });
      writeFolder(srcDir, entry.name, childOut);
    } else {
      const src = path.join(srcDir, entry.name);
      if (entry.name.endsWith('.md')) {
        writePage(src, outDir, entry.name);
      }
    }
  }
}

function safeSlug(name) {
  return name
    .replace(/[^\w\- ]/g, '')
    .trim()
    .replace(/[ _]+/g, '-')
    .toLowerCase();
}

function writeFolder(srcParent, folderName, outDir) {
  const srcDir = path.join(srcParent, folderName);
  if (!statSync(srcDir).isDirectory()) return;
  const files = readdirSync(srcDir);
  for (const fname of ['README.md', 'notes.md', 'practice.md']) {
    if (files.includes(fname)) {
      const content = readMd(path.join(srcDir, fname));
      if (!content) continue;
      const slug = fname === 'README.md' ? 'index.md' : fname;
      writeFileSync(path.join(outDir, slug), content, 'utf8');
    }
  }
  const subdirs = readdirSync(srcDir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .sort();
  for (const sub of subdirs) {
    writeNestedPages(path.join(srcDir, sub), path.join(outDir, safeSlug(sub)));
  }
}

function writePage(src, outDir, name) {
  const content = readMd(src);
  if (!content) return;
  writeFileSync(path.join(outDir, name), content, 'utf8');
}

function main() {
  ensureClean();

  for (const [top, slug] of TOP_LEVEL) {
    writePage(path.join(REPO_ROOT, top), OUT, slug);
  }

  for (const [src, slug] of FOLDER_MAP) {
    const srcDir = path.join(REPO_ROOT, src);
    if (!existsSync(srcDir)) continue;
    const outDir = path.join(OUT, slug);
    mkdirSync(outDir, { recursive: true });
    writeFolder(REPO_ROOT, src, outDir);
  }

  const home = `---
title: Home
description: The complete, open-source system design study plan with interview prep strategy.
---
# System Design Mastery

**An open-source, complete system design study plan** — from fundamentals to large-scale builds, with a concrete **interview-prep master plan**.

## Start here

- [**Master Plan** — the full strategy, day-by-day](../master-plan) → read this first
- [Practice Problems](../practice) — 16 problems by tier
- [Build Projects](../build-projects) — 10 hands-on projects

## The 6 phases

1. **Foundations** — scaling, networking, databases, caching
2. **Core Concepts** — load balancing, message queues, consistent hashing, CAP
3. **Classic Designs** — URL shortener, rate limiter, chat, notifications
4. **Large-Scale Systems** — news feed, Instagram, YouTube
5. **Advanced Systems** — Google Docs, Maps, Web Crawler, etc.
6. **Interview** — framework, practice platforms, FAQ bank

Browse the sidebar for every topic. Every page is freely editable via GitHub.
`;
  writeFileSync(path.join(OUT, 'index.md'), home, 'utf8');

  console.log('✅ Docs content generated →', OUT);
}

main();