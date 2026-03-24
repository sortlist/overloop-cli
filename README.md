# Overloop CLI

[![npm version](https://img.shields.io/npm/v/overloop-cli.svg)](https://www.npmjs.com/package/overloop-cli) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> ⚠️ **Beta Notice:** This CLI is currently in beta. APIs and tool interfaces may change between versions. Please report any issues on [GitHub](https://github.com/sortlist/overloop-cli/issues).

**Sales automation CLI for developers and AI agents** — Manage prospects, campaigns, sourcings, and more from the terminal.

The Overloop CLI provides a command-line interface to the Overloop API v2, enabling developers and AI agents to automate sales outreach workflows programmatically.

---

## Installation

```bash
npm install -g overloop-cli
```

### For AI Agents

Install the Overloop skill for your AI agent (Cursor, Claude Code, etc.):

```bash
npx skills add sortlist/overloop-cli
```

This installs the SKILL.md which gives your agent full knowledge of the CLI commands, patterns, and workflows.

---

## Authentication

The recommended way to authenticate is the interactive login command:

```bash
overloop login
```

This prompts for your API key (get it from **Settings > API Keys** in your Overloop dashboard), validates it, and saves it to `~/.overloop/config.json`.

Alternatively, set the `OVERLOOP_API_KEY` environment variable (takes priority over saved config):

```bash
export OVERLOOP_API_KEY=your_api_key
```

To remove saved credentials:

```bash
overloop logout
```

---

## Commands

### Prospects

```bash
overloop prospects:list [--page N] [--per-page N] [--sort field] [--search text] [--filter '{"key":"value"}'] [--expand relations]
overloop prospects:get <id>                  # ID or email address
overloop prospects:create --email john@example.com --first-name John --last-name Doe
overloop prospects:create --data '{"email":"john@example.com","first_name":"John"}'
overloop prospects:update <id> --first-name Jane
overloop prospects:delete <id>
```

### Organizations

```bash
overloop organizations:list [--search text] [--filter '{"country":"US"}']
overloop organizations:get <id>
overloop organizations:create --name "Acme Corp" --website https://acme.com
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
overloop campaigns:list [--filter '{"status":"on"}']
overloop campaigns:get <id> [--expand steps,sourcing]
overloop campaigns:create --name "Q1 Outreach" --timezone "Etc/UTC"
overloop campaigns:create --data '{"name":"Q1 Outreach","steps":[{"type":"delay","config":{"days_delay":5}}]}'
overloop campaigns:update <id> --status on
overloop campaigns:delete <id>
```

### Campaign Steps (require `--campaign`)

```bash
overloop steps:list --campaign <id>
overloop steps:get <step_id> --campaign <id>
overloop steps:create --campaign <id> --type email --config '{"subject":"Hello","content":"Hi there"}'
overloop steps:update <step_id> --campaign <id> --config '{"subject":"Updated"}'
overloop steps:delete <step_id> --campaign <id>
```

### Campaign Enrollments (require `--campaign`)

```bash
overloop enrollments:list --campaign <id>
overloop enrollments:get <enrollment_id> --campaign <id>
overloop enrollments:create --campaign <id> --prospect <prospect_id>
overloop enrollments:create --campaign <id> --prospect <prospect_id> --reenroll
overloop enrollments:delete <enrollment_id> --campaign <id>
```

### Step Types

```bash
overloop step-types:list     # List all available step types for building campaigns
```

### Sourcings

```bash
overloop sourcings:list
overloop sourcings:get <id>
overloop sourcings:create --name "Sales in Belgium" --search-criteria '{"keywords":"sales","locations":["Belgium"]}'
overloop sourcings:update <id> --name "Updated Name"
overloop sourcings:delete <id>
overloop sourcings:start <id>
overloop sourcings:pause <id>
overloop sourcings:clone <id>
overloop sourcings:estimate --search-criteria '{"job_titles":["CEO"]}'   # Preview match count
overloop sourcings:search-options                          # Get all available search criteria
overloop sourcings:search-options --field locations --q "Bel"   # Search specific field options
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
overloop account:get          # Get account information
overloop me                   # Get current authenticated user
overloop users:list
overloop users:get <id>
```

### Custom Fields

```bash
overloop custom-fields:list                 # List all custom fields
overloop custom-fields:list --type prospects # Filter by type
```

### Sending Addresses

```bash
overloop sending-addresses:list
```

### Exclusion List

```bash
overloop exclusion-list:list [--search text]
overloop exclusion-list:create --value spam@example.com --item-type email
overloop exclusion-list:create --value baddomain.com --item-type domain
overloop exclusion-list:delete <id>
```

---

## All Output is JSON

Every command outputs JSON for easy parsing with `jq` or consumption by AI agents:

```bash
# Get all prospect emails
overloop prospects:list --per-page 100 | jq '.data[] | .email'

# Get active campaign names
overloop campaigns:list --filter '{"status":"on"}' | jq '.data[] | .name'

# Count total prospects
overloop prospects:list | jq '.pagination.total'

# List all step types
overloop step-types:list | jq '.data[] | .type'
```

---

## Common Workflows

### Create a campaign with steps and enroll prospects

```bash
# 1. Create the campaign
overloop campaigns:create --name "Q1 Cold Outreach" --timezone "Europe/Brussels"

# 2. Add steps (note the campaign ID from step 1)
overloop steps:create --campaign <id> --type delay --config '{"days_delay":1}'
overloop steps:create --campaign <id> --type email --config '{"subject":"Hello","content":"Hi {{first_name}}"}'

# 3. Enroll a prospect
overloop enrollments:create --campaign <id> --prospect <prospect_id>

# 4. Activate the campaign
overloop campaigns:update <id> --status on
```

### Source prospects and add to a campaign

```bash
# 1. Check available search options
overloop sourcings:search-options --field locations --q "Belgium"

# 2. Estimate match count before creating (no credits used)
overloop sourcings:estimate --search-criteria '{"job_titles":["Sales"],"locations":[{"id":22,"name":"Belgium","type":"Country"}]}'

# 3. Create a sourcing
overloop sourcings:create --name "Belgian Sales" --search-criteria '{"job_titles":["Sales"],"locations":[{"id":22,"name":"Belgium","type":"Country"}],"company_sizes":["1-10 employees"]}'

# 4. Start sourcing
overloop sourcings:start <id>
```

### Manage the exclusion list

```bash
# Block a domain
overloop exclusion-list:create --value competitor.com --item-type domain

# Block a specific email
overloop exclusion-list:create --value ceo@partner.com --item-type email

# Review and clean up
overloop exclusion-list:list --search competitor
overloop exclusion-list:delete <id>
```

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `OVERLOOP_API_KEY` | No | Your Overloop API key (overrides saved config from `overloop login`) |
| `OVERLOOP_API_URL` | No | Override API base URL (default: `https://api.overloop.ai`) |

---

## Error Handling

| Exit Code | Meaning |
|---|---|
| 0 | Success |
| 1 | Error (message on stderr) |

| HTTP Status | Meaning |
|---|---|
| 401 | Missing or invalid API key |
| 403 | Insufficient permissions |
| 404 | Resource not found |
| 422 | Validation error |
| 429 | Rate limited (600 req/min per key) |

---

## Development

```bash
git clone https://github.com/sortlist/overloop-cli.git
cd overloop-cli
npm install
npm run dev    # Watch mode
npm run build  # Production build
```

---

## License

MIT

---

## Links

- **Website:** [overloop.ai](https://overloop.ai)
- **API Docs:** [apidoc-v2.overloop.ai](https://apidoc-v2.overloop.ai)
- **GitHub:** [sortlist/overloop-cli](https://github.com/sortlist/overloop-cli)
- **Issues:** [Report bugs](https://github.com/sortlist/overloop-cli/issues)
