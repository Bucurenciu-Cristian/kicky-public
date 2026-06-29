# Kicky public notebook

Owned-stack notes from Bogdan Cristian Bucurenciu — AI consultant, solo operator, Sibiu.

This repo is public source for essays, build notes, and field reports. It feeds my GitHub profile README.

<!-- latest_content starts -->
- [Get out of our heads](content/notes/2026-06-29-get-out-of-our-heads.md) — A small public commitment to ship thinking as artifacts, not keep it private by default. (2026-06-29)
- [Public content cockpit](content/builds/2026-06-29-public-content-cockpit.md) — First public content repo and self-updating profile README scaffold. (2026-06-29)
<!-- latest_content ends -->

## Sections

- `content/essays/` — longer arguments and writeups
- `content/notes/` — shorter observations
- `content/builds/` — shipped systems, public changelog, field reports

## Publishing loop

```bash
node scripts/new-content.mjs note "Short title"
$EDITOR content/notes/YYYY-MM-DD-short-title.md
node scripts/build-index.mjs
git add .
git commit -m "Add public note"
git push
```

## Contract

Build with owned stack. Show work. Keep public boundary clean.
