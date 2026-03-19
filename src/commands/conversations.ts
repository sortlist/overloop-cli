import { OverloopAPI } from '../api';
import { getConfig } from '../config';

export async function listConversations(args: { page?: number; 'per-page'?: number; sort?: string; search?: string; filter?: string; archived?: boolean }) {
  const api = new OverloopAPI(getConfig());

  let filter: Record<string, string> | undefined;
  if (args.filter) {
    try { filter = JSON.parse(args.filter); } catch {
      console.error('Failed to parse --filter JSON:', args.filter);
      process.exit(1);
    }
  }

  try {
    const result = await api.listConversations({
      page: args.page,
      per_page: args['per-page'],
      sort: args.sort,
      search: args.search,
      filter,
      archived: args.archived,
    });
    console.log(JSON.stringify(result, null, 2));
  } catch (error: any) {
    console.error('Failed to list conversations:', error.message);
    process.exit(1);
  }
}

export async function getConversation(args: { id: string }) {
  const api = new OverloopAPI(getConfig());

  if (!args.id) {
    console.error('Conversation ID is required.');
    process.exit(1);
  }

  try {
    const result = await api.getConversation(args.id);
    console.log(JSON.stringify(result, null, 2));
  } catch (error: any) {
    console.error('Failed to get conversation:', error.message);
    process.exit(1);
  }
}

export async function updateConversation(args: { id: string; name?: string; data?: string }) {
  const api = new OverloopAPI(getConfig());

  if (!args.id) {
    console.error('Conversation ID is required.');
    process.exit(1);
  }

  let body: Record<string, any> = {};
  if (args.data) {
    try { body = JSON.parse(args.data); } catch {
      console.error('Failed to parse --data JSON:', args.data);
      process.exit(1);
    }
  }
  if (args.name) body.name = args.name;

  try {
    const result = await api.updateConversation(args.id, body);
    console.log(JSON.stringify(result, null, 2));
  } catch (error: any) {
    console.error('Failed to update conversation:', error.message);
    process.exit(1);
  }
}

export async function archiveConversation(args: { id: string }) {
  const api = new OverloopAPI(getConfig());

  if (!args.id) {
    console.error('Conversation ID is required.');
    process.exit(1);
  }

  try {
    const result = await api.archiveConversation(args.id);
    console.log(JSON.stringify(result, null, 2));
  } catch (error: any) {
    console.error('Failed to archive conversation:', error.message);
    process.exit(1);
  }
}

export async function unarchiveConversation(args: { id: string }) {
  const api = new OverloopAPI(getConfig());

  if (!args.id) {
    console.error('Conversation ID is required.');
    process.exit(1);
  }

  try {
    const result = await api.unarchiveConversation(args.id);
    console.log(JSON.stringify(result, null, 2));
  } catch (error: any) {
    console.error('Failed to unarchive conversation:', error.message);
    process.exit(1);
  }
}

export async function assignConversation(args: { id: string; owner: string }) {
  const api = new OverloopAPI(getConfig());

  if (!args.id) {
    console.error('Conversation ID is required.');
    process.exit(1);
  }
  if (!args.owner) {
    console.error('--owner (user ID) is required.');
    process.exit(1);
  }

  try {
    const result = await api.assignConversation(args.id, args.owner);
    console.log(JSON.stringify(result, null, 2));
  } catch (error: any) {
    console.error('Failed to assign conversation:', error.message);
    process.exit(1);
  }
}
