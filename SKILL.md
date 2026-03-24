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
overloop campaigns:create --name "Q1" --auto-enroll --sourcing-id <id>  # auto-enroll sourced prospects
overloop campaigns:create --name "Q1" --auto-enroll --auto-reenroll     # auto-enroll + re-enroll
overloop campaigns:create --data '{"name":"Q1","steps":[{"type":"delay","config":{"days_delay":5}},{"type":"email","config":{"subject":"Hi","content":"Hello"}}]}'
overloop campaigns:update <id> --status on
overloop campaigns:update <id> --auto-enroll      # enable auto-enrollment
overloop campaigns:update <id> --no-auto-enroll   # disable auto-enrollment
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
overloop enrollments:bulk --campaign <id> --prospects "id1,id2,id3"       # bulk enroll up to 100
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

### Estimate Prospect Match Count

Preview how many prospects match search criteria **before** creating a sourcing (no credits consumed):

```bash
overloop sourcings:estimate --search-criteria '{"job_titles":["CEO"],"locations":[{"id":22,"name":"Belgium","type":"Country"}],"company_sizes":["1-10 employees"]}'
# Returns: { estimated_count: 2450, estimated_count_after_rejection: 1837, preview: [...] }
```

Use this to validate criteria and avoid wasted iterations. The `preview` array contains up to 5 sample prospect profiles.

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

## search_criteria Format Reference

### Locations — MUST be objects

Locations must be objects with `id`, `name`, and `type` fields. **Plain strings silently match nothing.**

```
Correct: {"id": 22, "name": "Belgium", "type": "Country"}
Wrong:   "Belgium"                    ← silently matches nothing
Wrong:   {"name": "Belgium"}          ← missing id and type, rejected
```

Valid `type` values: `Region`, `Country`, `State`, `City`.

Always look up locations first:

```bash
overloop sourcings:search-options --field locations --q "Belgium"
# Returns: [{"id": 22, "name": "Belgium", "type": "Country"}, {"id": 1376, "name": "Brussels-Capital Region", "type": "State"}, ...]
```

### Industries — MUST use API names, not LinkedIn names

Industries must be objects with `id` and `name`. The API uses its own industry names, which differ from LinkedIn names.

```
Correct: {"id": 575, "name": "Information Technology"}
Wrong:   "Information Technology and Services"    ← LinkedIn name, matches nothing
Wrong:   {"name": "Information Technology"}       ← missing id, rejected
```

Common LinkedIn → API name mappings:

| LinkedIn name | API name | ID |
|---|---|---|
| Information Technology and Services | Information Technology | 575 |
| Financial Services | Accounting & Financial Services | 541 |
| Management Consulting | Business Consulting | 552 |
| Computer Software | Software Development | 4 |
| Internet | Internet & Web Services | 577 |
| Marketing and Advertising | Marketing & Advertising | 1 |
| Telecommunications | Telecommunications | 614 |
| Banking | Banking & Lending | 547 |

Always look up industries:

```bash
overloop sourcings:search-options --field industries --q "Information"
# Returns: [{"id": 575, "name": "Information Technology", "alternates": ["Information Technology and Services"]}, ...]
```

### Other search_criteria fields

| Field | Format | Lookup |
|---|---|---|
| `job_titles` | `["CEO", "CTO"]` (free text) | No lookup needed |
| `company_sizes` | `["1-10 employees"]` | `search-options --field company_sizes` |
| `management_level` | `["C-Level", "Director"]` | `search-options --field management_levels` |
| `departments` | `["Sales", "Marketing"]` | `search-options --field departments` |
| `prospect_keywords` | `["saas", "ai"]` (free text) | No lookup needed |
| `technologies` | `["React", "Python"]` | `search-options --field technologies` |

## Message Personalization Settings

When creating or updating campaigns, you can set `message_personalization_settings` and `pitch_settings` to control AI-generated messages.

### message_personalization_settings

| Field | Accepted values | Default |
|---|---|---|
| `language` | `english (United States)`, `english (United Kingdom)`, `french`, `spanish`, `german`, `dutch`, `portuguese (Brazil)`, `portuguese (Portugal)`, `danish`, `finnish`, `swedish`, `italian`, `norwegian`, `romanian`, `hebrew`, `turkish`, `polish` | `english (United States)` |
| `formality` | `formal`, `friendly`, `neutral` | `friendly` |
| `tone_of_voice` | `confident`, `persuasive`, `witty`, `straightforward`, `empathetic` | `persuasive` |
| `length` | `short`, `medium`, `long` | `short` |

### pitch_settings

| Field | Description |
|---|---|
| `website_url` | Your company website |
| `selling_description` | What you sell / your value proposition |
| `pain_points` | Problems your product solves |
| `benefits` | Key benefits for the prospect |
| `proof_points` | Social proof, case studies, numbers |
| `campaign_intent` | What you want from the prospect (e.g. "Book a demo") |

## Common Workflows

### End-to-end: source prospects → create campaign → enroll → activate

```bash
# 1. Look up location and industry IDs
overloop sourcings:search-options --field locations --q "Belgium"
overloop sourcings:search-options --field industries --q "Software"

# 2. Estimate match count (no credits consumed)
overloop sourcings:estimate --search-criteria '{"job_titles":["CTO","VP Engineering"],"locations":[{"id":22,"name":"Belgium","type":"Country"}],"industries":[{"id":4,"name":"Software Development"}],"company_sizes":["11-50 employees","51-200 employees"]}'

# 3. Create the sourcing
overloop sourcings:create --name "Belgian Tech CTOs" --search-criteria '{"job_titles":["CTO","VP Engineering"],"locations":[{"id":22,"name":"Belgium","type":"Country"}],"industries":[{"id":4,"name":"Software Development"}],"company_sizes":["11-50 employees","51-200 employees"]}' --sourcing-limit 200

# 4. Create campaign with auto-enrollment linked to the sourcing
overloop campaigns:create --name "Q1 Tech Outreach" --timezone "Europe/Brussels" --auto-enroll --sourcing-id <sourcing_id>

# 5. Add steps to the campaign
overloop steps:create --campaign <campaign_id> --type delay --config '{"days_delay":2}'
overloop steps:create --campaign <campaign_id> --type email --config '{"subject":"Quick question about {{company_name}}","content":"Hi {{first_name}},\n\nI noticed {{company_name}} is growing fast...","generate_with_ai":true}'
overloop steps:create --campaign <campaign_id> --type delay --config '{"days_delay":3}'
overloop steps:create --campaign <campaign_id> --type email --config '{"subject":"Following up","content":"Hi {{first_name}}, just wanted to follow up...","generate_with_ai":true}'

# 6. Start the sourcing (prospects will auto-enroll into the campaign)
overloop sourcings:start <sourcing_id>

# 7. Activate the campaign
overloop campaigns:update <campaign_id> --status on
```

### Manual enrollment flow

```bash
# 1. Create campaign
overloop campaigns:create --name "Q1 Cold Outreach" --timezone "Europe/Brussels"

# 2. Add steps
overloop steps:create --campaign <campaign_id> --type delay --config '{"days_delay":1}'
overloop steps:create --campaign <campaign_id> --type email --config '{"subject":"Quick question","content":"Hi {{first_name}},\n\nWould love to chat about...\n\nBest"}'

# 3. Enroll prospects (single or bulk)
overloop enrollments:create --campaign <campaign_id> --prospect <prospect_id>
overloop enrollments:bulk --campaign <campaign_id> --prospects "id1,id2,id3"

# 4. Activate
overloop campaigns:update <campaign_id> --status on
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
