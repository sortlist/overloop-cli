import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import type { Argv } from 'yargs';

import { login, logout } from './commands/login';
import { listProspects, getProspect, createProspect, updateProspect, deleteProspect } from './commands/prospects';
import { listOrganizations, getOrganization, createOrganization, updateOrganization, deleteOrganization } from './commands/organizations';
import { listLists, getList, createList, updateList, deleteList } from './commands/lists';
import { listCampaigns, getCampaign, createCampaign, updateCampaign, deleteCampaign } from './commands/campaigns';
import { listSteps, getStep, createStep, updateStep, deleteStep } from './commands/steps';
import { listEnrollments, getEnrollment, createEnrollment, deleteEnrollment } from './commands/enrollments';
import { listStepTypes } from './commands/step-types';
import { listSourcings, getSourcing, createSourcing, updateSourcing, deleteSourcing, startSourcing, pauseSourcing, cloneSourcing, estimateSourcing, searchOptions } from './commands/sourcings';
import { listConversations, getConversation, updateConversation, archiveConversation, unarchiveConversation, assignConversation } from './commands/conversations';
import { getAccount, getMe } from './commands/account';
import { listUsers, getUser } from './commands/users';
import { listCustomFields } from './commands/custom-fields';
import { listSendingAddresses } from './commands/sending-addresses';
import { listExclusionList, createExclusionListItem, deleteExclusionListItem } from './commands/exclusion-list';

const paginationOptions = (y: Argv) =>
  y.option('page', { describe: 'Page number', type: 'number', default: 1 })
   .option('per-page', { describe: 'Results per page (max 1000)', type: 'number', default: 100 })
   .option('sort', { describe: 'Sort field (prefix with - for desc)', type: 'string' })
   .option('search', { describe: 'Search text', type: 'string' })
   .option('filter', { describe: 'Filter as JSON string', type: 'string' });

const expandOption = (y: Argv) =>
  y.option('expand', { describe: 'Expand relationships (comma-separated)', type: 'string' });

const campaignOption = (y: Argv) =>
  y.option('campaign', { describe: 'Campaign ID', type: 'string', demandOption: true, alias: 'c' });

const dataOption = (y: Argv) =>
  y.option('data', { describe: 'Full request body as JSON string', type: 'string' });

yargs(hideBin(process.argv))
  .scriptName('overloop')
  .usage('$0 <command> [options]')

  // ── Auth ──

  .command('login', 'Authenticate with your Overloop API key', {}, login as any)
  .command('logout', 'Remove saved API key', {}, logout as any)

  // ── Prospects ──

  .command('prospects:list', 'List prospects', (y: Argv) => expandOption(paginationOptions(y)), listProspects as any)
  .command('prospects:get <id>', 'Get a prospect by ID or email', (y: Argv) =>
    expandOption(y.positional('id', { describe: 'Prospect ID or email', type: 'string' })),
    getProspect as any)
  .command('prospects:create', 'Create a prospect', (y: Argv) =>
    dataOption(y)
      .option('email', { describe: 'Email address', type: 'string' })
      .option('first-name', { describe: 'First name', type: 'string' })
      .option('last-name', { describe: 'Last name', type: 'string' })
      .option('organization-id', { describe: 'Organization ID', type: 'string' }),
    createProspect as any)
  .command('prospects:update <id>', 'Update a prospect', (y: Argv) =>
    dataOption(y.positional('id', { describe: 'Prospect ID', type: 'string' }))
      .option('email', { describe: 'Email address', type: 'string' })
      .option('first-name', { describe: 'First name', type: 'string' })
      .option('last-name', { describe: 'Last name', type: 'string' }),
    updateProspect as any)
  .command('prospects:delete <id>', 'Delete a prospect', (y: Argv) =>
    y.positional('id', { describe: 'Prospect ID', type: 'string' }),
    deleteProspect as any)

  // ── Organizations ──

  .command('organizations:list', 'List organizations', (y: Argv) => expandOption(paginationOptions(y)), listOrganizations as any)
  .command('organizations:get <id>', 'Get an organization', (y: Argv) =>
    expandOption(y.positional('id', { describe: 'Organization ID', type: 'string' })),
    getOrganization as any)
  .command('organizations:create', 'Create an organization', (y: Argv) =>
    dataOption(y)
      .option('name', { describe: 'Organization name', type: 'string' })
      .option('website', { describe: 'Website URL', type: 'string' }),
    createOrganization as any)
  .command('organizations:update <id>', 'Update an organization', (y: Argv) =>
    dataOption(y.positional('id', { describe: 'Organization ID', type: 'string' }))
      .option('name', { describe: 'Organization name', type: 'string' })
      .option('website', { describe: 'Website URL', type: 'string' }),
    updateOrganization as any)
  .command('organizations:delete <id>', 'Delete an organization', (y: Argv) =>
    y.positional('id', { describe: 'Organization ID', type: 'string' }),
    deleteOrganization as any)

  // ── Lists ──

  .command('lists:list', 'List prospect lists', (y: Argv) => paginationOptions(y), listLists as any)
  .command('lists:get <id>', 'Get a list', (y: Argv) =>
    y.positional('id', { describe: 'List ID', type: 'string' }),
    getList as any)
  .command('lists:create', 'Create a list', (y: Argv) =>
    y.option('name', { describe: 'List name', type: 'string', demandOption: true }),
    createList as any)
  .command('lists:update <id>', 'Update a list', (y: Argv) =>
    y.positional('id', { describe: 'List ID', type: 'string' })
     .option('name', { describe: 'List name', type: 'string' }),
    updateList as any)
  .command('lists:delete <id>', 'Delete a list', (y: Argv) =>
    y.positional('id', { describe: 'List ID', type: 'string' }),
    deleteList as any)

  // ── Campaigns ──

  .command('campaigns:list', 'List campaigns', (y: Argv) => expandOption(paginationOptions(y)), listCampaigns as any)
  .command('campaigns:get <id>', 'Get a campaign', (y: Argv) =>
    expandOption(y.positional('id', { describe: 'Campaign ID', type: 'string' })),
    getCampaign as any)
  .command('campaigns:create', 'Create a campaign', (y: Argv) =>
    dataOption(y)
      .option('name', { describe: 'Campaign name', type: 'string' })
      .option('timezone', { describe: 'Timezone', type: 'string' })
      .option('sender-id', { describe: 'Sender user ID', type: 'string' })
      .option('sourcing-id', { describe: 'Link an existing sourcing by ID', type: 'string' })
      .option('auto-enroll', { describe: 'Enable automatic enrollment', type: 'boolean' })
      .option('auto-reenroll', { describe: 'Enable automatic re-enrollment', type: 'boolean' })
      .option('steps', { describe: 'Inline steps as JSON array', type: 'string' }),
    createCampaign as any)
  .command('campaigns:update <id>', 'Update a campaign', (y: Argv) =>
    dataOption(y.positional('id', { describe: 'Campaign ID', type: 'string' }))
      .option('name', { describe: 'Campaign name', type: 'string' })
      .option('status', { describe: 'Campaign status (on/off)', type: 'string' })
      .option('sourcing-id', { describe: 'Link an existing sourcing by ID', type: 'string' })
      .option('auto-enroll', { describe: 'Enable automatic enrollment', type: 'boolean' })
      .option('no-auto-enroll', { describe: 'Disable automatic enrollment', type: 'boolean' })
      .option('auto-reenroll', { describe: 'Enable automatic re-enrollment', type: 'boolean' })
      .option('no-auto-reenroll', { describe: 'Disable automatic re-enrollment', type: 'boolean' }),
    updateCampaign as any)
  .command('campaigns:delete <id>', 'Delete a campaign', (y: Argv) =>
    y.positional('id', { describe: 'Campaign ID', type: 'string' }),
    deleteCampaign as any)

  // ── Steps (campaign-scoped) ──

  .command('steps:list', 'List campaign steps', (y: Argv) =>
    campaignOption(y)
      .option('page', { describe: 'Page number', type: 'number', default: 1 })
      .option('per-page', { describe: 'Results per page', type: 'number', default: 100 })
      .option('sort', { describe: 'Sort field', type: 'string' }),
    listSteps as any)
  .command('steps:get <id>', 'Get a campaign step', (y: Argv) =>
    campaignOption(y.positional('id', { describe: 'Step ID', type: 'string' })),
    getStep as any)
  .command('steps:create', 'Create a campaign step', (y: Argv) =>
    campaignOption(y)
      .option('type', { describe: 'Step type (email, delay, condition, etc.)', type: 'string', demandOption: true })
      .option('config', { describe: 'Step config as JSON string', type: 'string' })
      .option('previous-step-id', { describe: 'Previous step ID', type: 'string' })
      .option('position', { describe: 'Position (0=yes branch, 1=no branch)', type: 'number' }),
    createStep as any)
  .command('steps:update <id>', 'Update a campaign step', (y: Argv) =>
    campaignOption(y.positional('id', { describe: 'Step ID', type: 'string' }))
      .option('type', { describe: 'Step type', type: 'string' })
      .option('config', { describe: 'Step config as JSON string', type: 'string' })
      .option('previous-step-id', { describe: 'Previous step ID', type: 'string' })
      .option('position', { describe: 'Position', type: 'number' }),
    updateStep as any)
  .command('steps:delete <id>', 'Delete a campaign step', (y: Argv) =>
    campaignOption(y.positional('id', { describe: 'Step ID', type: 'string' })),
    deleteStep as any)

  // ── Enrollments (campaign-scoped) ──

  .command('enrollments:list', 'List campaign enrollments', (y: Argv) =>
    campaignOption(y)
      .option('page', { describe: 'Page number', type: 'number', default: 1 })
      .option('per-page', { describe: 'Results per page', type: 'number', default: 100 })
      .option('sort', { describe: 'Sort field', type: 'string' })
      .option('filter', { describe: 'Filter as JSON string', type: 'string' }),
    listEnrollments as any)
  .command('enrollments:get <id>', 'Get a campaign enrollment', (y: Argv) =>
    campaignOption(y.positional('id', { describe: 'Enrollment ID', type: 'string' })),
    getEnrollment as any)
  .command('enrollments:create', 'Enroll a prospect in a campaign', (y: Argv) =>
    campaignOption(y)
      .option('prospect', { describe: 'Prospect ID', type: 'string', demandOption: true })
      .option('step-id', { describe: 'Start at specific step ID', type: 'string' })
      .option('reenroll', { describe: 'Re-enroll if already enrolled', type: 'boolean' })
      .option('start-at', { describe: 'Schedule enrollment (ISO 8601)', type: 'string' }),
    createEnrollment as any)
  .command('enrollments:delete <id>', 'Disenroll a prospect from a campaign', (y: Argv) =>
    campaignOption(y.positional('id', { describe: 'Enrollment ID', type: 'string' })),
    deleteEnrollment as any)

  // ── Step Types ──

  .command('step-types:list', 'List available campaign step types', {}, listStepTypes as any)

  // ── Sourcings ──

  .command('sourcings:list', 'List sourcings', (y: Argv) => paginationOptions(y), listSourcings as any)
  .command('sourcings:get <id>', 'Get a sourcing', (y: Argv) =>
    y.positional('id', { describe: 'Sourcing ID', type: 'string' }),
    getSourcing as any)
  .command('sourcings:create', 'Create a sourcing', (y: Argv) =>
    dataOption(y)
      .option('name', { describe: 'Sourcing name', type: 'string', demandOption: true })
      .option('search-criteria', { describe: 'Search criteria as JSON string', type: 'string' })
      .option('sourcing-limit', { describe: 'Max prospects to source', type: 'number' }),
    createSourcing as any)
  .command('sourcings:update <id>', 'Update a sourcing', (y: Argv) =>
    dataOption(y.positional('id', { describe: 'Sourcing ID', type: 'string' }))
      .option('name', { describe: 'Sourcing name', type: 'string' })
      .option('sourcing-limit', { describe: 'Max prospects to source', type: 'number' }),
    updateSourcing as any)
  .command('sourcings:delete <id>', 'Delete a sourcing', (y: Argv) =>
    y.positional('id', { describe: 'Sourcing ID', type: 'string' }),
    deleteSourcing as any)
  .command('sourcings:start <id>', 'Start a sourcing', (y: Argv) =>
    y.positional('id', { describe: 'Sourcing ID', type: 'string' }),
    startSourcing as any)
  .command('sourcings:pause <id>', 'Pause a sourcing', (y: Argv) =>
    y.positional('id', { describe: 'Sourcing ID', type: 'string' }),
    pauseSourcing as any)
  .command('sourcings:clone <id>', 'Clone a sourcing', (y: Argv) =>
    y.positional('id', { describe: 'Sourcing ID', type: 'string' }),
    cloneSourcing as any)
  .command('sourcings:estimate', 'Estimate prospect match count without creating a sourcing', (y: Argv) =>
    y.option('search-criteria', { describe: 'Search criteria as JSON string', type: 'string', demandOption: true }),
    estimateSourcing as any)
  .command('sourcings:search-options', 'Get available search criteria options', (y: Argv) =>
    y.option('field', { describe: 'Specific field (locations, industries, etc.)', type: 'string' })
     .option('q', { describe: 'Search query for options', type: 'string' }),
    searchOptions as any)

  // ── Conversations ──

  .command('conversations:list', 'List conversations', (y: Argv) =>
    paginationOptions(y).option('archived', { describe: 'Include archived', type: 'boolean' }),
    listConversations as any)
  .command('conversations:get <id>', 'Get a conversation', (y: Argv) =>
    y.positional('id', { describe: 'Conversation ID', type: 'string' }),
    getConversation as any)
  .command('conversations:update <id>', 'Update a conversation', (y: Argv) =>
    dataOption(y.positional('id', { describe: 'Conversation ID', type: 'string' }))
      .option('name', { describe: 'Conversation name', type: 'string' }),
    updateConversation as any)
  .command('conversations:archive <id>', 'Archive a conversation', (y: Argv) =>
    y.positional('id', { describe: 'Conversation ID', type: 'string' }),
    archiveConversation as any)
  .command('conversations:unarchive <id>', 'Unarchive a conversation', (y: Argv) =>
    y.positional('id', { describe: 'Conversation ID', type: 'string' }),
    unarchiveConversation as any)
  .command('conversations:assign <id>', 'Assign a conversation to a user', (y: Argv) =>
    y.positional('id', { describe: 'Conversation ID', type: 'string' })
     .option('owner', { describe: 'User ID to assign to', type: 'string', demandOption: true }),
    assignConversation as any)

  // ── Account & Users ──

  .command('account:get', 'Get account information', {}, getAccount as any)
  .command('me', 'Get current authenticated user', {}, getMe as any)
  .command('users:list', 'List users', (y: Argv) =>
    y.option('page', { describe: 'Page number', type: 'number', default: 1 })
     .option('per-page', { describe: 'Results per page', type: 'number', default: 100 })
     .option('sort', { describe: 'Sort field', type: 'string' })
     .option('search', { describe: 'Search text', type: 'string' }),
    listUsers as any)
  .command('users:get <id>', 'Get a user', (y: Argv) =>
    y.positional('id', { describe: 'User ID', type: 'string' }),
    getUser as any)

  // ── Custom Fields ──

  .command('custom-fields:list', 'List custom field definitions', (y: Argv) =>
    y.option('type', { describe: 'Filter by type (prospects)', type: 'string' }),
    listCustomFields as any)

  // ── Sending Addresses ──

  .command('sending-addresses:list', 'List sending addresses', {}, listSendingAddresses as any)

  // ── Exclusion List ──

  .command('exclusion-list:list', 'List exclusion list items', (y: Argv) => paginationOptions(y), listExclusionList as any)
  .command('exclusion-list:create', 'Add to exclusion list', (y: Argv) =>
    y.option('value', { describe: 'Email or domain to exclude', type: 'string', demandOption: true })
     .option('item-type', { describe: 'Type: email or domain', type: 'string', demandOption: true }),
    createExclusionListItem as any)
  .command('exclusion-list:delete <id>', 'Remove from exclusion list', (y: Argv) =>
    y.positional('id', { describe: 'Exclusion list item ID', type: 'string' }),
    deleteExclusionListItem as any)

  .demandCommand(1, 'You need at least one command. Run overloop --help to see available commands.')
  .help()
  .alias('h', 'help')
  .version()
  .alias('v', 'version')
  .epilogue(
    'For more information, visit: https://github.com/sortlist/overloop-cli\n\n' +
    'Set your API key: export OVERLOOP_API_KEY=your_api_key\n' +
    'Or run: overloop login'
  )
  .parse();
