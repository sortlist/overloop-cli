import { OverloopAPI } from '../api';
import { getConfig } from '../config';

export async function listProspects(args: { page?: number; 'per-page'?: number; sort?: string; search?: string; expand?: string; filter?: string; 'sourcing-id'?: string }) {
  const api = new OverloopAPI(getConfig());

  let filter: Record<string, string> | undefined;
  if (args.filter) {
    try { filter = JSON.parse(args.filter); } catch {
      console.error('Failed to parse --filter JSON:', args.filter);
      process.exit(1);
    }
  }
  if (args['sourcing-id']) {
    filter = filter || {};
    filter.sourcing_id = args['sourcing-id'];
  }

  try {
    const result = await api.listProspects({
      page: args.page,
      per_page: args['per-page'],
      sort: args.sort,
      search: args.search,
      expand: args.expand,
      filter,
    });
    console.log(JSON.stringify(result, null, 2));
  } catch (error: any) {
    console.error('Failed to list prospects:', error.message);
    process.exit(1);
  }
}

export async function getProspect(args: { id: string; expand?: string }) {
  const api = new OverloopAPI(getConfig());

  if (!args.id) {
    console.error('Prospect ID or email is required.');
    process.exit(1);
  }

  try {
    const result = await api.getProspect(args.id, { expand: args.expand });
    console.log(JSON.stringify(result, null, 2));
  } catch (error: any) {
    console.error('Failed to get prospect:', error.message);
    process.exit(1);
  }
}

export async function createProspect(args: { email?: string; 'first-name'?: string; 'last-name'?: string; 'organization-id'?: string; data?: string }) {
  const api = new OverloopAPI(getConfig());

  let body: Record<string, any> = {};
  if (args.data) {
    try { body = JSON.parse(args.data); } catch {
      console.error('Failed to parse --data JSON:', args.data);
      process.exit(1);
    }
  }
  if (args.email) body.email = args.email;
  if (args['first-name']) body.first_name = args['first-name'];
  if (args['last-name']) body.last_name = args['last-name'];
  if (args['organization-id']) body.organization_id = args['organization-id'];

  try {
    const result = await api.createProspect(body);
    console.log(JSON.stringify(result, null, 2));
  } catch (error: any) {
    console.error('Failed to create prospect:', error.message);
    process.exit(1);
  }
}

export async function updateProspect(args: { id: string; data?: string; email?: string; 'first-name'?: string; 'last-name'?: string }) {
  const api = new OverloopAPI(getConfig());

  if (!args.id) {
    console.error('Prospect ID is required.');
    process.exit(1);
  }

  let body: Record<string, any> = {};
  if (args.data) {
    try { body = JSON.parse(args.data); } catch {
      console.error('Failed to parse --data JSON:', args.data);
      process.exit(1);
    }
  }
  if (args.email) body.email = args.email;
  if (args['first-name']) body.first_name = args['first-name'];
  if (args['last-name']) body.last_name = args['last-name'];

  try {
    const result = await api.updateProspect(args.id, body);
    console.log(JSON.stringify(result, null, 2));
  } catch (error: any) {
    console.error('Failed to update prospect:', error.message);
    process.exit(1);
  }
}

export async function deleteProspect(args: { id: string }) {
  const api = new OverloopAPI(getConfig());

  if (!args.id) {
    console.error('Prospect ID is required.');
    process.exit(1);
  }

  try {
    const result = await api.deleteProspect(args.id);
    console.log(JSON.stringify(result, null, 2));
  } catch (error: any) {
    console.error('Failed to delete prospect:', error.message);
    process.exit(1);
  }
}
