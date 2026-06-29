import { mkdir, writeFile, access } from 'node:fs/promises';
import path from 'node:path';

const title = process.argv.slice(2).join(' ').trim() || 'Daily field note';
const today = new Date().toISOString().slice(0, 10);
const slug = title
  .toLowerCase()
  .normalize('NFKD')
  .replace(/[\u0300-\u036f]/g, '')
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-|-$/g, '')
  .slice(0, 80) || 'daily-field-note';
const file = path.join('content', 'notes', `${today}-${slug}.md`);

try {
  await access(file);
  console.log(file);
  process.exit(0);
} catch {}

const body = `---
title: ${title}
date: ${today}
type: note
summary: One concrete thing learned, shipped, or clarified today.
tags: [daily]
status: draft
---

# ${title}

What changed today?

- Shipped:
- Learned:
- Next:

Keep private details out. Keep artifact useful.
`;

await mkdir(path.dirname(file), { recursive: true });
await writeFile(file, body, { flag: 'wx' });
console.log(file);
