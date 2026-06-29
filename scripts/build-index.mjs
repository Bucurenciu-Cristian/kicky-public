import { readFile, writeFile, mkdir, readdir } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const contentDir = path.join(root, 'content');
const outDir = path.join(root, 'public');

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...await walk(full));
    else if (entry.isFile() && entry.name.endsWith('.md')) files.push(full);
  }
  return files;
}

function parseFrontmatter(markdown, file) {
  const match = markdown.match(/^---\n([\s\S]*?)\n---\n?/);
  if (!match) throw new Error(`${file} missing frontmatter`);
  const raw = match[1];
  const data = {};
  for (const line of raw.split('\n')) {
    const i = line.indexOf(':');
    if (i === -1) continue;
    const key = line.slice(0, i).trim();
    let value = line.slice(i + 1).trim();
    if (value.startsWith('[') && value.endsWith(']')) {
      value = value.slice(1, -1).split(',').map((v) => v.trim()).filter(Boolean);
    }
    data[key] = value;
  }
  for (const key of ['title', 'date', 'type', 'summary']) {
    if (!data[key]) throw new Error(`${file} missing ${key}`);
  }
  return data;
}

function relUrl(file) {
  return path.relative(root, file).split(path.sep).join('/');
}

function replaceBlock(readme, name, body) {
  const start = `<!-- ${name} starts -->`;
  const end = `<!-- ${name} ends -->`;
  const pattern = new RegExp(`${start}[\\s\\S]*?${end}`);
  if (!pattern.test(readme)) throw new Error(`README missing ${name} block`);
  return readme.replace(pattern, `${start}\n${body}\n${end}`);
}

const files = await walk(contentDir);
const items = [];
for (const file of files) {
  const markdown = await readFile(file, 'utf8');
  const meta = parseFrontmatter(markdown, relUrl(file));
  items.push({
    ...meta,
    path: relUrl(file),
    url: `https://github.com/Bucurenciu-Cristian/kicky-public/blob/main/${relUrl(file)}`,
  });
}
items.sort((a, b) => b.date.localeCompare(a.date) || a.title.localeCompare(b.title));

await mkdir(outDir, { recursive: true });
await writeFile(path.join(outDir, 'content-index.json'), `${JSON.stringify({ items }, null, 2)}\n`);

const list = items.slice(0, 10).map((item) => {
  const status = item.status && item.status !== 'published' ? ` _${item.status}_` : '';
  return `- [${item.title}](${item.path}) — ${item.summary} (${item.date})${status}`;
}).join('\n') || '- Nothing public yet.';

const readmePath = path.join(root, 'README.md');
const readme = await readFile(readmePath, 'utf8');
await writeFile(readmePath, replaceBlock(readme, 'latest_content', list));
console.log(`Indexed ${items.length} public content item(s).`);
