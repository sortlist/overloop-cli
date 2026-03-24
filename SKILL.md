---
name: overloop-cli
description: Overloop CLI skill — manage prospects, campaigns, sourcings, and outreach via the Overloop API v2 from the terminal.
---

# Overloop CLI Skill

Overloop is an AI-powered sales automation platform for managing prospects, campaigns, and outreach. This CLI lets you manage all resources from the terminal via the Overloop API v2.

## Setup

```bash
npm install -g overloop-cli
overloop login
# Or set env var: export OVERLOOP_API_KEY=your_api_key
```

## Concepts

- **Prospect**: A person you want to reach out to. Has email, name, custom fields, and can belong to an organization.
- **Organization**: A company a prospect belongs to.
- **List**: A group of prospects (tag-based).
- **Campaign**: An automated outreach sequence with steps (emails, delays, conditions, LinkedIn messages).
- **Step**: A single action in a campaign (email, delay, condition, LinkedIn visit/message, etc.).
- **Enrollment**: A prospect enrolled in a campaign.
- **Sourcing**: Automated prospect discovery from a 450M+ contact database using search criteria.
- **Conversation**: An email thread or LinkedIn conversation with a prospect.
- **Exclusion List**: Blocked emails and domains.
- **Custom Field**: User-defined fields on prospects/organizations.
- **Sending Address**: Connected email accounts used for sending.

## All Commands

All output is JSON. Pipe to `jq` for filtering.

### Auth

```bash
overloop login       # Interactive API key prompt
overloop logout      # Remove saved credentials
```

### Prospects

```bash
overloop prospects:list [--page N] [--per-page N] [--sort field] [--search text] [--filter '{"key":"value"}'] [--expand relations]
overloop prospects:get <id>                  # ID or email
overloop prospects:create --email john@example.com [--first-name John] [--last-name Doe] [--organization-id ID]
overloop prospects:create --data '{"email":"john@example.com","first_name":"John","last_name":"Doe"}'
overloop prospects:update <id> --first-name Jane
overloop prospects:update <id> --data '{"phone":"+1234567890"}'
overloop prospects:delete <id>
```

### Organizations

```bash
overloop organizations:list [--search text] [--filter '{"country":"US"}'] [--expand relations]
overloop organizations:get <id>
overloop organizations:create --name "Acme Corp" [--website https://acme.com]
overloop organizations:create --data '{"name":"Acme Corp","website":"https://acme.com"}'
overloop organizations:update <id> --name "New Name"
overloop organizations:delete <id>
```

### Lists

```bash
overloop lists:list [--search text]
overloop lists:get <id>
overloop lists:create --name "Hot Leads"
overloop lists:update <id> --name "Warm Leads"
overloop lists:delete <id>
```

### Campaigns

```bash
overloop campaigns:list [--filter '{"status":"on"}'] [--expand steps,sourcing]
overloop campaigns:get <id> [--expand steps]
overloop campaigns:create --name "Q1 Outreach" [--timezone "Etc/UTC"] [--sender-id ID]
overloop campaigns:create --data '{"name":"Q1","steps":[{"type":"delay","config":{"days_delay":5}},{"type":"email","config":{"subject":"Hi","content":"Hello"}}]}'
overloop campaigns:update <id> --status on
overloop campaigns:update <id> --name "Updated Name"
overloop campaigns:delete <id>
```

### Steps (campaign-scoped, require `--campaign` / `-c`)

Available step types: `delay`, `email`, `condition`, `linkedin_visit_profile`, `linkedin_send_invitation`, `linkedin_send_message`, `linkedin_check_connection`, `email_and_linkedin_condition`, `add_to_tags`, `edit`, `note`, `review`, `enroll`, `enroll_campaign`, `goto_step`, `search_email`, `notification_email`, `notification_sms`, `notification_in_app`, `assign_conversation`, `archive_conversation`, `share`, `salesforce`, `hubspot`, `slack`, `pipedrive`, `zoho`, `reply`.

```bash
overloop steps:list --campaign <id>
overloop steps:get <step_id> --campaign <id>
overloop steps:create --campaign <id> --type email --config '{"subject":"Hello","content":"Hi {{first_name}}"}'
overloop steps:create --campaign <id> --type delay --config '{"days_delay":3}'
overloop steps:create --campaign <id> --type condition --previous-step-id <id> --position 0 --config '{}'
overloop steps:update <step_id> --campaign <id> --config '{"subject":"Updated"}'
overloop steps:delete <step_id> --campaign <id>
```

### Enrollments (campaign-scoped, require `--campaign` / `-c`)

```bash
overloop enrollments:list --campaign <id>
overloop enrollments:get <enrollment_id> --campaign <id>
overloop enrollments:create --campaign <id> --prospect <prospect_id>
overloop enrollments:create --campaign <id> --prospect <prospect_id> --reenroll --start-at "2026-04-01T09:00:00Z"
overloop enrollments:delete <enrollment_id> --campaign <id>
```

### Step Types

```bash
overloop step-types:list     # List all available step types
```

### Sourcings

```bash
overloop sourcings:list
overloop sourcings:get <id>
overloop sourcings:create --name "Sales Belgium" --search-criteria '{"job_titles":["sales"],"locations":[{"id":22,"name":"Belgium","type":"Country"}],"size":["1-10 employees"]}'
overloop sourcings:create --data '{"name":"DevOps EU","search_criteria":{"job_titles":["devops"],"locations":[{"id":75,"name":"France","type":"Country"},{"id":56,"name":"Germany","type":"Country"}]},"sourcing_limit":100}'
overloop sourcings:update <id> --name "Updated" --sourcing-limit 200
overloop sourcings:delete <id>
overloop sourcings:start <id>
overloop sourcings:pause <id>
overloop sourcings:clone <id>
```

### Sourcing Search Options

**Important:** `locations` and `industries` must be objects (not plain strings). Use `search-options` to find valid values with their IDs.

Discover available values for sourcing search criteria fields:

```bash
overloop sourcings:search-options                             # All fields
overloop sourcings:search-options --field locations            # Location options
overloop sourcings:search-options --field locations --q "Bel"  # Search locations
overloop sourcings:search-options --field industries
overloop sourcings:search-options --field company_size
overloop sourcings:search-options --field management_level
overloop sourcings:search-options --field department
overloop sourcings:search-options --field technologies --q "React"
```

### Conversations

```bash
overloop conversations:list [--archived]
overloop conversations:get <id>
overloop conversations:update <id> --name "New Subject"
overloop conversations:archive <id>
overloop conversations:unarchive <id>
overloop conversations:assign <id> --owner <user_id>
```

### Account & Users

```bash
overloop account:get          # Account details
overloop me                   # Current authenticated user
overloop users:list
overloop users:get <id>
```

### Custom Fields

```bash
overloop custom-fields:list
overloop custom-fields:list --type prospects
```

### Sending Addresses

```bash
overloop sending-addresses:list
```

### Exclusion List

```bash
overloop exclusion-list:list [--search text] [--filter '{"item_type":"domain"}']
overloop exclusion-list:create --value spam@example.com --item-type email
overloop exclusion-list:create --value baddomain.com --item-type domain
overloop exclusion-list:delete <id>
```

## Common Workflows

### Create a full campaign with steps

```bash
# 1. Create campaign
overloop campaigns:create --name "Q1 Cold Outreach" --timezone "Europe/Brussels"

# 2. Add a delay step
overloop steps:create --campaign <campaign_id> --type delay --config '{"days_delay":1}'

# 3. Add an email step
overloop steps:create --campaign <campaign_id> --type email --config '{"subject":"Quick question","content":"Hi {{first_name}},\n\nWould love to chat about...\n\nBest"}'

# 4. Enroll prospects
overloop enrollments:create --campaign <campaign_id> --prospect <prospect_id>

# 5. Activate
overloop campaigns:update <campaign_id> --status on
```

### Source prospects and enroll

```bash
# Find location IDs first
overloop sourcings:search-options --field locations --q "Belgium"
# Returns: [{"id": 22, "name": "Belgium", "type": "Country"}, ...]

# Create sourcing with object-format locations
overloop sourcings:create --name "Belgian CTOs" --search-criteria '{"job_titles":["CTO"],"locations":[{"id":22,"name":"Belgium","type":"Country"}],"size":["11-50 employees","51-200 employees"]}'

# Start it
overloop sourcings:start <id>
```

### Export prospect data

```bash
overloop prospects:list --per-page 1000 | jq '.data[] | {email, first_name, last_name, company: .organization_name}'
```

## Error Handling

- **Exit code 0**: Success. Output is JSON on stdout.
- **Exit code 1**: Error. Message is printed to stderr.
- **401**: Invalid or missing API key.
- **403**: Insufficient permissions or account restrictions.
- **404**: Resource not found.
- **422**: Validation error.
- **429**: Rate limited (600 requests/minute per key).

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `OVERLOOP_API_KEY` | No | API key (overrides saved config from `overloop login`) |
| `OVERLOOP_API_URL` | No | Override base URL (default: `https://api.overloop.ai`) |
