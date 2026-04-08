---
name: campaigns
description: Build and manage Overloop outbound campaigns — create campaigns, add email/delay/condition steps, enroll prospects, and monitor performance. Use when the user wants to set up outbound sequences or manage campaign workflows.
---

# Overloop Campaigns

You have access to the `overloop` CLI to build and manage outbound email campaigns.

## Prerequisites

The CLI must be installed (`npm install -g overloop-cli`) and authenticated (`overloop login` or `OVERLOOP_API_KEY` env var).

## Campaign Commands

### List Campaigns
```bash
overloop campaigns:list [--page N] [--per-page N] [--sort field] [--filter JSON] [--expand steps,sourcing]
```
Filter by status: `--filter '{"status":"on"}'` (on, off, draft, archived)

### Get Campaign Details
```bash
overloop campaigns:get <id> [--expand steps,sourcing]
```

### Create Campaign
```bash
overloop campaigns:create --name "Q1 Outreach" [--timezone "Europe/Brussels"] [--sender-id user_id] [--data JSON]
```

### Update Campaign (e.g. activate)
```bash
overloop campaigns:update <id> --status on
```

### Delete Campaign
```bash
overloop campaigns:delete <id>
```

## Step Commands

Steps define the campaign sequence (emails, delays, conditions).

### List Steps
```bash
overloop steps:list --campaign <campaign_id>
```

### Create Step
```bash
overloop steps:create --campaign <id> --type <type> --config '<JSON>'
```

Step types and configs:
- **email**: `{"subject":"Hello {{first_name}}","content":"<p>Hi {{first_name}},</p>"}`
- **delay**: `{"days_delay":3}`
- **condition**: `{"field":"industry","operator":"equals","value":"Technology"}`

Use `overloop step-types:list` to see all available types.

### Update / Delete Step
```bash
overloop steps:update <step_id> --campaign <id> --config '<JSON>'
overloop steps:delete <step_id> --campaign <id>
```

## Enrollment Commands

### Enroll a Prospect
```bash
overloop enrollments:create --campaign <id> --prospect <prospect_id> [--step-id id] [--reenroll] [--start-at ISO_8601]
```

### Bulk Enroll (up to 100)
```bash
overloop enrollments:bulk --campaign <id> --prospect-ids "[id1,id2,id3]"
```

### List / Get / Remove Enrollments
```bash
overloop enrollments:list --campaign <id> [--page N] [--per-page N]
overloop enrollments:get <enrollment_id> --campaign <id>
overloop enrollments:delete <enrollment_id> --campaign <id>
```

## Typical Workflow

1. Create campaign: `overloop campaigns:create --name "Cold Outreach"`
2. Add delay step: `overloop steps:create --campaign $ID --type delay --config '{"days_delay":1}'`
3. Add email step: `overloop steps:create --campaign $ID --type email --config '{"subject":"Quick question","content":"..."}'`
4. Enroll prospects: `overloop enrollments:bulk --campaign $ID --prospect-ids "[...]"`
5. Activate: `overloop campaigns:update $ID --status on`

## Guidelines

- Always create steps before enrolling prospects.
- Use delay steps between emails (1-5 days is standard).
- Campaigns must be activated (`--status on`) to start sending.
- Use `--expand steps` when getting campaigns to see the full sequence.
- Rate limit: 600 requests/minute.
