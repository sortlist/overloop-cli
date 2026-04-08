---
name: prospects
description: Manage Overloop prospects — search, create, update, delete, and bulk operations. Use when the user wants to find prospects, add contacts, or manage their prospect database.
---

# Overloop Prospects

You have access to the `overloop` CLI to manage prospects in the Overloop sales platform.

## Prerequisites

The CLI must be installed (`npm install -g overloop-cli`) and authenticated (`overloop login` or `OVERLOOP_API_KEY` env var).

## Available Commands

### List & Search Prospects
```bash
overloop prospects:list [--page N] [--per-page N] [--sort field] [--search text] [--filter JSON] [--expand relations]
```
- `--search` free-text search across all fields
- `--filter` JSON object for field-level filtering
- `--sort` field name, prefix `-` for descending (e.g. `-created_at`)
- `--expand` comma-separated relations to include
- Max 1000 per page

### Get a Single Prospect
```bash
overloop prospects:get <id_or_email>
```
Accepts a prospect ID or email address.

### Create a Prospect
```bash
overloop prospects:create --email john@example.com [--first-name John] [--last-name Doe] [--organization-id org_id] [--data JSON]
```
- `--email` is required
- Use `--data` for custom fields: `--data '{"custom_fields":{"source":"linkedin"}}'`

### Update a Prospect
```bash
overloop prospects:update <id> [--first-name Jane] [--last-name Doe] [--email new@email.com] [--organization-id org_id]
```

### Delete a Prospect
```bash
overloop prospects:delete <id>
```

## Output

All commands return JSON. Use `jq` to extract fields:
```bash
overloop prospects:list --search "acme" | jq '.data[] | {id, email, first_name}'
```

## Guidelines

- Always check if a prospect exists before creating (search by email) to avoid duplicates.
- When creating many prospects, batch operations are more efficient.
- Use `--expand` to get related data (organizations, enrollments) in a single call.
- Rate limit: 600 requests/minute.
