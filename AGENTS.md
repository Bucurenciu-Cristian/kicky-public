# kicky-public

Public content repo. Write in public. Keep private/client details out.

## Rules

- No secrets, private client names, private URLs, internal tokens, or personal data.
- Publish evidence-backed notes: what changed, what was learned, what exists.
- Keep voice direct: operator notes, not growth-hack sludge.
- Content files live under `content/{essays,notes,builds}/`.
- Every public content file needs frontmatter: `title`, `date`, `type`, `summary`, optional `tags`, optional `status`.
- Run `node scripts/build-index.mjs` after content changes.
