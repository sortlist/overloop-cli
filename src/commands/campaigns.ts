import { OverloopAPI } from '../api';
import { getConfig } from '../config';

export async function listCampaigns(args: { page?: number; 'per-page'?: number; sort?: string; search?: string; expand?: string; filter?: string }) {
  const api = new OverloopAPI(getConfig());

  let filter: Record<string, string> | undefined;
  if (args.filter) {
    try { filter = JSON.parse(args.filter); } catch {
      console.error('Failed to parse --filter JSON:', args.filter);
      process.exit(1);
    }
  }

  try {
    const result = await api.listCampaigns({
      page: args.page,
      per_page: args['per-page'],
      sort: args.sort,
      search: args.search,
      expand: args.expand,
      filter,
    });
    console.log(JSON.stringify(result, null, 2));
  } catch (error: any) {
    console.error('Failed to list campaigns:', error.message);
    process.exit(1);
  }
}

export async function getCampaign(args: { id: string; expand?: string }) {
  const api = new OverloopAPI(getConfig());

  if (!args.id) {
    console.error('Campaign ID is required.');
    process.exit(1);
  }

  try {
    const result = await api.getCampaign(args.id, { expand: args.expand });
    console.log(JSON.stringify(result, null, 2));
  } catch (error: any) {
    console.error('Failed to get campaign:', error.message);
    process.exit(1);
  }
}

export async function createCampaign(args: { name: string; data?: string; timezone?: string; 'sender-id'?: string; 'sourcing-id'?: string; steps?: string }) {
  const api = new OverloopAPI(getConfig());

  if (!args.name && !args.data) {
    console.error('--name or --data is required.');
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
  if (args.timezone) body.timezone = args.timezone;
  if (args['sender-id']) body.sender_id = args['sender-id'];
  if (args['sourcing-id']) body.sourcing_id = args['sourcing-id'];
  if (args.steps) {
    try { body.steps = JSON.parse(args.steps); } catch {
      console.error('Failed to parse --steps JSON:', args.steps);
      process.exit(1);
    }
  }

  try {
    const result = await api.createCampaign(body);
    console.log(JSON.stringify(result, null, 2));
  } catch (error: any) {
    console.error('Failed to create campaign:', error.message);
    process.exit(1);
  }
}

export async function updateCampaign(args: { id: string; name?: string; status?: string; 'sourcing-id'?: string; data?: string }) {
  const api = new OverloopAPI(getConfig());

  if (!args.id) {
    console.error('Campaign ID is required.');
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
  if (args.status) body.status = args.status;
  if (args['sourcing-id']) body.sourcing_id = args['sourcing-id'];

  try {
    const result = await api.updateCampaign(args.id, body);
    console.log(JSON.stringify(result, null, 2));
  } catch (error: any) {
    console.error('Failed to update campaign:', error.message);
    process.exit(1);
  }
}

export async function deleteCampaign(args: { id: string }) {
  const api = new OverloopAPI(getConfig());

  if (!args.id) {
    console.error('Campaign ID is required.');
    process.exit(1);
  }

  try {
    const result = await api.deleteCampaign(args.id);
    console.log(JSON.stringify(result, null, 2));
  } catch (error: any) {
    console.error('Failed to delete campaign:', error.message);
    process.exit(1);
  }
}
