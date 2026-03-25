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

Two sourcing patterns are supported:

**Pattern A — Standalone sourcing as trigger:** Create a sourcing separately, then reference it with `--sourcing-id` and `--auto-enroll`. The sourcing remains independent; the campaign only uses it as an enrollment trigger. `campaign.sourcing_id` is NOT set.

**Pattern B — Embedded sourcing (preferred for new campaigns):** Pass `--search-criteria` (and optionally `--sourcing-limit`) directly to `campaigns:create`. The API creates a sourcing owned by the campaign. Auto-enrollment is enabled automatically. `campaign.sourcing_id` IS set.

```bash
overloop campaigns:list [--filter '{"status":"on"}'] [--expand steps,sourcing]
overloop campaigns:get <id> [--expand steps]
overloop campaigns:create --name "Q1 Outreach" [--timezone "Etc/UTC"] [--sender-id ID]

# Pattern A: use existing standalone sourcing as trigger
overloop campaigns:create --name "Q1" --auto-enroll --sourcing-id <id>

# Pattern B: create embedded sourcing with the campaign (preferred)
overloop campaigns:create --name "Q1" --search-criteria '{"job_titles":["CTO"],"locations":[{"id":22,"name":"Belgium","type":"Country"}]}' --sourcing-limit 100

# Inline steps
overloop campaigns:create --data '{"name":"Q1","steps":[{"type":"delay","config":{"days_delay":5}},{"type":"email","config":{"subject":"Hi","content":"Hello"}}]}'

overloop campaigns:update <id> --status on
overloop campaigns:update <id> --auto-enroll --sourcing-id <id>   # Pattern A on update
overloop campaigns:update <id> --search-criteria '...'            # Pattern B on update
overloop campaigns:update <id> --no-auto-enroll                   # disable auto-enrollment
overloop campaigns:delete <id>
```

### Steps (campaign-scoped, require `--campaign` / `-c`)

```bash
overloop steps:list --campaign <id>
overloop steps:get <step_id> --campaign <id>
overloop steps:create --campaign <id> --type email --config '{"generate_with_ai":true}'
overloop steps:create --campaign <id> --type delay --config '{"days_delay":3}'
overloop steps:create --campaign <id> --type condition --previous-step-id <id> --position 0 --config '{"records_segment":{"filters":{}}}'
overloop steps:update <step_id> --campaign <id> --config '{"subject":"Updated"}'
overloop steps:delete <step_id> --campaign <id>
```

#### Step Config Reference

**Core steps (most commonly used):**

| Step Type | Required Config | Example |
|-----------|----------------|---------|
| `delay` | `days_delay` (int) and/or `hours_delay` (int). Min 10 minutes. | `{"days_delay": 3}` |
| `email` (AI) | `generate_with_ai: true` — AI writes subject+body using campaign pitch_settings | `{"generate_with_ai": true}` |
| `email` (manual) | `subject` + `content` (Liquid templates) | `{"subject": "Hi {{ lead_firstname }}", "content": "Hello {{ lead_firstname }},\n\n..."}` |
| `linkedin_visit_profile` | none | `{}` |
| `linkedin_send_invitation` | none (optional `message`, max 300 chars) | `{"message": "Hi {{ lead_firstname }}, let's connect!"}` or `{}` |
| `linkedin_send_message` (AI) | `generate_with_ai: true` or empty config (defaults to AI) | `{"generate_with_ai": true}` or `{}` |
| `linkedin_send_message` (manual) | `message` (Liquid template) | `{"message": "Hi {{ lead_firstname }}, ..."}` |
| `linkedin_check_connection` | none — branches: connected = yes (position 0), not connected = no (position 1) | `{}` |
| `condition` | `records_segment` with `filters` | `{"records_segment": {"filters": {"groups": [...]}}}` |
| `email_and_linkedin_condition` | none — branches based on whether prospect has LinkedIn | `{}` |

**Action steps:**

| Step Type | Required Config | Example |
|-----------|----------------|---------|
| `add_to_tags` | `tag_ids` (array of tag IDs) | `{"tag_ids": [123, 456]}` |
| `review` | `title` (Liquid template) | `{"title": "Review {{ lead_firstname }}"}` |
| `note` | `content` (Liquid template) | `{"content": "Contacted {{ lead_firstname }}"}` |
| `search_email` | none | `{}` |
| `assign_conversation` | `owner_id` (user ID) | `{"owner_id": 1547}` |
| `archive_conversation` | none | `{}` |
| `enroll_campaign` | `automation_id` (campaign ID to enroll into). Optional: `node_id`, `remove_from_original` | `{"automation_id": 42, "remove_from_original": true}` |
| `goto_step` | `node_id` (step ID to jump to) | `{"node_id": "uuid-of-step"}` |

**Notification steps:**

| Step Type | Required Config | Example |
|-----------|----------------|---------|
| `notification_email` | `recipient_id` (user ID), `subject`, `content` | `{"recipient_id": 1547, "subject": "Alert", "content": "..."}` |
| `notification_sms` | `recipient_id`, `content` | `{"recipient_id": 1547, "content": "..."}` |
| `notification_in_app` | `recipient_id`, `content` | `{"recipient_id": 1547, "content": "..."}` |

**Integration steps:**

| Step Type | Required Config | Example |
|-----------|----------------|---------|
| `salesforce` | CRM-specific config | `{}` |
| `hubspot` | CRM-specific config | `{}` |
| `pipedrive` | CRM-specific config | `{}` |
| `zoho` | CRM-specific config | `{}` |
| `slack` | `slack_id` (channel), `content` | `{"slack_id": "C12345", "content": "..."}` |

#### Branching (condition steps)

Condition steps create branches. Child steps use `--position` to specify which branch:
- `--position 0` = **yes** branch (condition met)
- `--position 1` = **no** branch (condition not met)

```bash
# Create a condition step
overloop steps:create --campaign <id> --type condition --config '{"records_segment":{"filters":{}}}'

# Add step on yes branch
overloop steps:create --campaign <id> --type email --config '{"generate_with_ai":true}' --previous-step-id <condition_id> --position 0

# Add step on no branch  
overloop steps:create --campaign <id> --type linkedin_send_message --config '{"generate_with_ai":true}' --previous-step-id <condition_id> --position 1
```

#### AI-Generated Content (`generate_with_ai`)

Supported on: `email`, `linkedin_send_message`, `linkedin_send_invitation`.

When `generate_with_ai: true`:
- Subject and content are generated at send time using the campaign's `pitch_settings` and `message_personalization_settings`.
- First outreach gets a unique cold message; follow-ups get contextual follow-up messages.
- You do NOT need to provide `subject`/`content`/`message` — they are generated automatically.
- Step-level `message_personalization_settings` can override campaign defaults (e.g. different language for a specific step).

**For AI to work well, ensure campaign `pitch_settings` are filled** (especially `selling_description` and `campaign_intent`).

#### Merge Tags (Liquid Templates)

Used in `subject`, `content`, and `message` fields for manual (non-AI) steps. Uses Liquid syntax.

**Prospect:**
`{{ lead_firstname }}`, `{{ lead_lastname }}`, `{{ lead_name }}`, `{{ lead_email }}`, `{{ lead_jobtitle }}`, `{{ lead_phone }}`, `{{ lead_city }}`, `{{ lead_company_name }}`, `{{ lead_linkedin_profile }}`

Aliases: `{{ prospect_firstname }}`, `{{ prospect_lastname }}`, etc.

**Organization:**
`{{ organization_name }}`, `{{ organization_website }}`

**Sender:**
`{{ sender_name }}`, `{{ sender_firstname }}`, `{{ sender_lastname }}`, `{{ sender_email }}`, `{{ sender_phone }}`, `{{ sender_jobtitle }}`

**Email threading:**
`{{ thread_subject }}` — subject of the previous email in the thread (for follow-ups using `Re: {{ thread_subject }}`)

**Custom fields:**
`{{ lead_c_<field_code> }}`, `{{ organization_c_<field_code> }}`

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

**Required fields for create:** `--name`, `--search-criteria`, `--sourcing-limit` (max prospects to source).

**Naming:** Use only ASCII characters in names — avoid em dashes (—), curly quotes, or other special Unicode characters that can break shell escaping.

```bash
overloop sourcings:list
overloop sourcings:get <id>
overloop sourcings:create --name "Sales Belgium" --sourcing-limit 100 --search-criteria '{"job_titles":["sales"],"locations":[{"id":22,"name":"Belgium","type":"Country"}],"company_sizes":["1-10 employees"]}'
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

**Important:** Industry names in the API differ from LinkedIn names (e.g. LinkedIn's "Information Technology and Services" is "Information Technology" in the API). Never guess — always look up the correct name and ID first:

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

### Pattern B (preferred): embedded sourcing campaign

Use this when creating a new campaign that should source its own prospects.

```bash
# 1. Look up location and industry IDs
overloop sourcings:search-options --field locations --q "Belgium"
overloop sourcings:search-options --field industries --q "Software"

# 2. Estimate match count (no credits consumed)
overloop sourcings:estimate --search-criteria '{"job_titles":["CTO","VP Engineering"],"locations":[{"id":22,"name":"Belgium","type":"Country"}],"industries":[{"id":4,"name":"Software Development"}],"company_sizes":["11-50 employees","51-200 employees"]}'

# 3. Create campaign with embedded sourcing — auto-enrollment is enabled automatically
overloop campaigns:create --name "Q1 Tech Outreach" --timezone "Europe/Brussels" --search-criteria '{"job_titles":["CTO","VP Engineering"],"locations":[{"id":22,"name":"Belgium","type":"Country"}],"industries":[{"id":4,"name":"Software Development"}],"company_sizes":["11-50 employees","51-200 employees"]}' --sourcing-limit 200

# 4. Add steps to the campaign
overloop steps:create --campaign <campaign_id> --type delay --config '{"days_delay":2}'
overloop steps:create --campaign <campaign_id> --type email --config '{"subject":"Quick question about {{company_name}}","content":"Hi {{first_name}},\n\nI noticed {{company_name}} is growing fast...","generate_with_ai":true}'
overloop steps:create --campaign <campaign_id> --type delay --config '{"days_delay":3}'
overloop steps:create --campaign <campaign_id> --type email --config '{"subject":"Following up","content":"Hi {{first_name}}, just wanted to follow up...","generate_with_ai":true}'

# 5. Start the embedded sourcing (get sourcing_id from the campaign response)
overloop sourcings:start <sourcing_id>

# 6. Activate the campaign
overloop campaigns:update <campaign_id> --status on
```

### Pattern A: standalone sourcing as trigger

Use this when you have an existing sourcing you want to wire as an enrollment trigger for a campaign.

```bash
# 1. Create a standalone sourcing
overloop sourcings:create --name "Belgian Tech CTOs" --search-criteria '{"job_titles":["CTO"],"locations":[{"id":22,"name":"Belgium","type":"Country"}]}' --sourcing-limit 200

# 2. Create campaign, linking the existing sourcing as trigger
overloop campaigns:create --name "Q1 Tech Outreach" --timezone "Europe/Brussels" --auto-enroll --sourcing-id <sourcing_id>

# 3. Add steps, start sourcing, activate campaign (same as Pattern B steps 4-6)
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
