---
name: outbound
description: End-to-end outbound workflow — source prospects, create campaigns with steps, enroll, and activate. Also manage organizations, lists, sourcings, conversations, exclusion lists, and sending addresses. Use for full outbound sequence setup or account management.
---

# Overloop Outbound & Account Management

You have access to the `overloop` CLI for end-to-end outbound sales automation.

## Prerequisites

The CLI must be installed (`npm install -g overloop-cli`) and authenticated (`overloop login` or `OVERLOOP_API_KEY` env var).

## Sourcing Commands

Find and import prospects matching criteria.

```bash
# Browse search options (locations, industries, company sizes)
overloop sourcings:search-options --field locations -q "Belgium"
overloop sourcings:search-options --field industries -q "tech"

# Create a sourcing
overloop sourcings:create --name "Belgian Sales Directors" \
  --search-criteria '{"keywords":"sales director","locations":["Belgium"],"company_size":["11-50","51-200"]}'

# Start / pause / clone
overloop sourcings:start <id>
overloop sourcings:pause <id>
overloop sourcings:clone <id>

# List sourcings
overloop sourcings:list [--page N] [--per-page N]
```

## Organization Commands

```bash
overloop organizations:list [--page N] [--per-page N] [--search text]
overloop organizations:get <id>
overloop organizations:create --name "Acme Corp" [--website https://acme.com]
overloop organizations:update <id> [--name "New Name"]
overloop organizations:delete <id>
```

## List Commands

```bash
overloop lists:list [--page N] [--search text]
overloop lists:get <id>
overloop lists:create --name "Hot Leads"
overloop lists:update <id> --name "Warm Leads"
overloop lists:delete <id>
```

## Conversation Commands

```bash
overloop conversations:list [--page N] [--search text] [--archived]
overloop conversations:get <id>
overloop conversations:archive <id>
overloop conversations:unarchive <id>
overloop conversations:assign <id> --owner <user_id>
```

## Exclusion List

Block emails or domains from being contacted.

```bash
overloop exclusion-list:list [--search text]
overloop exclusion-list:create --value competitor.com --item-type domain
overloop exclusion-list:create --value ceo@partner.com --item-type email
overloop exclusion-list:delete <id>
```

## Account & Users

```bash
overloop account:get           # Account info
overloop me                    # Current user
overloop users:list            # All team users
overloop users:get <id>        # Specific user
overloop sending-addresses:list  # Email addresses
overloop custom-fields:list [--type prospects]  # Custom fields
```

## Full Outbound Workflow

Here is the end-to-end sequence for launching an outbound campaign:

1. **Define ICP**: Check search options to build criteria
   ```bash
   overloop sourcings:search-options --field locations -q "France"
   overloop sourcings:search-options --field industries -q "SaaS"
   ```

2. **Source prospects**: Create and run sourcing
   ```bash
   overloop sourcings:create --name "French SaaS" --search-criteria '{"keywords":"marketing director","locations":["France"],"industries":["Software"]}'
   overloop sourcings:start <sourcing_id>
   ```

3. **Exclude competitors**: Block domains/emails
   ```bash
   overloop exclusion-list:create --value competitor.com --item-type domain
   ```

4. **Build campaign**: Create with steps
   ```bash
   overloop campaigns:create --name "French SaaS Outreach" --timezone "Europe/Paris"
   overloop steps:create --campaign <id> --type delay --config '{"days_delay":1}'
   overloop steps:create --campaign <id> --type email --config '{"subject":"Quick question about {{company}}","content":"..."}'
   overloop steps:create --campaign <id> --type delay --config '{"days_delay":3}'
   overloop steps:create --campaign <id> --type email --config '{"subject":"Following up","content":"..."}'
   ```

5. **Enroll prospects**: Add sourced prospects to campaign
   ```bash
   overloop enrollments:bulk --campaign <id> --prospect-ids "[id1,id2,...]"
   ```

6. **Activate**: Turn on the campaign
   ```bash
   overloop campaigns:update <id> --status on
   ```

## Guidelines

- Always set up exclusion list before enrolling to avoid contacting wrong people.
- Use `--expand` liberally to reduce API calls.
- Check `overloop sending-addresses:list` to verify sender is configured.
- Rate limit: 600 requests/minute.
- All output is JSON — pipe through `jq` for extraction.
