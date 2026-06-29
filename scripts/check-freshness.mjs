import { readFile } from 'node:fs/promises';

const args = new Map(process.argv.slice(2).map((arg) => {
  const [key, value = ''] = arg.split('=');
  return [key.replace(/^--/, ''), value];
}));

const maxAgeDays = Number(args.get('max-age-days') || 1);
const indexPath = args.get('index') || 'public/content-index.json';

if (!Number.isFinite(maxAgeDays) || maxAgeDays <= 0) {
  console.error('--max-age-days must be positive number');
  process.exit(2);
}

const index = JSON.parse(await readFile(indexPath, 'utf8'));
const items = Array.isArray(index.items) ? index.items : [];
if (!items.length) {
  console.error('No public content items found.');
  process.exit(1);
}

items.sort((a, b) => String(b.date).localeCompare(String(a.date)) || String(a.title).localeCompare(String(b.title)));
const latest = items[0];
const latestDate = new Date(`${latest.date}T00:00:00Z`);
if (Number.isNaN(latestDate.getTime())) {
  console.error(`Invalid latest date: ${latest.date}`);
  process.exit(1);
}

const now = new Date();
const todayUtc = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
const ageDays = Math.floor((todayUtc.getTime() - latestDate.getTime()) / 86_400_000);

if (ageDays > maxAgeDays) {
  console.error(`Public content stale: latest item is ${ageDays} day(s) old. Latest: ${latest.title} (${latest.date})`);
  process.exit(1);
}

console.log(`Public content fresh: ${latest.title} (${latest.date}), ${ageDays} day(s) old.`);
