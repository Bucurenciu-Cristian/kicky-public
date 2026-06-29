import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const [, , typeArg, ...titleParts] = process.argv;
const type = typeArg || '';
const title = titleParts.join(' ').trim();
const validTypes = new Set(['essay', 'note', 'build']);

if (!validTypes.has(type) || !title) {
  console.error('Usage: node scripts/new-content.mjs <essay|note|build> "Title"');
  process.exit(1);
}

const today = new Date().toISOString().slice(0, 10);
const slug = title
  .toLowerCase()
  .normalize('NFKD')
  .replace(/[\u0300-\u036f]/g, '')
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-|-$/g, '')
  .slice(0, 80);
const dirs = { essay: 'essays', note: 'notes', build: 'builds' };
const file = path.join('content', dirs[type], `${today}-${slug}.md`);

const body = `---
title: ${title}
date: ${today}
type: ${type}
summary: One sentence summary goes here.
tags: []
status: draft
---

# ${title}

`;

await mkdir(path.dirname(file), { recursive: true });
await writeFile(file, body, { flag: 'wx' });
console.log(file);
