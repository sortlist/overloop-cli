import { OverloopAPI } from '../api';
import { getConfig } from '../config';

export async function listOrganizations(args: { page?: number; 'per-page'?: number; sort?: string; search?: string; expand?: string; filter?: string }) {
  const api = new OverloopAPI(getConfig());

  let filter: Record<string, string> | undefined;
  if (args.filter) {
    try { filter = JSON.parse(args.filter); } catch {
      console.error('Failed to parse --filter JSON:', args.filter);
      process.exit(1);
    }
  }

  try {
    const result = await api.listOrganizations({
      page: args.page,
      per_page: args['per-page'],
      sort: args.sort,
      search: args.search,
      expand: args.expand,
      filter,
    });
    console.log(JSON.stringify(result, null, 2));
  } catch (error: any) {
    console.error('Failed to list organizations:', error.message);
    process.exit(1);
  }
}

export async function getOrganization(args: { id: string; expand?: string }) {
  const api = new OverloopAPI(getConfig());

  if (!args.id) {
    console.error('Organization ID is required.');
    process.exit(1);
  }

  try {
    const result = await api.getOrganization(args.id, { expand: args.expand });
    console.log(JSON.stringify(result, null, 2));
  } catch (error: any) {
    console.error('Failed to get organization:', error.message);
    process.exit(1);
  }
}

export async function createOrganization(args: { name?: string; website?: string; data?: string }) {
  const api = new OverloopAPI(getConfig());

  let body: Record<string, any> = {};
  if (args.data) {
    try { body = JSON.parse(args.data); } catch {
      console.error('Failed to parse --data JSON:', args.data);
      process.exit(1);
    }
  }
  if (args.name) body.name = args.name;
  if (args.website) body.website = args.website;

  try {
    const result = await api.createOrganization(body);
    console.log(JSON.stringify(result, null, 2));
  } catch (error: any) {
    console.error('Failed to create organization:', error.message);
    process.exit(1);
  }
}

export async function updateOrganization(args: { id: string; name?: string; website?: string; data?: string }) {
  const api = new OverloopAPI(getConfig());

  if (!args.id) {
    console.error('Organization ID is required.');
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
  if (args.website) body.website = args.website;

  try {
    const result = await api.updateOrganization(args.id, body);
    console.log(JSON.stringify(result, null, 2));
  } catch (error: any) {
    console.error('Failed to update organization:', error.message);
    process.exit(1);
  }
}

export async function deleteOrganization(args: { id: string }) {
  const api = new OverloopAPI(getConfig());

  if (!args.id) {
    console.error('Organization ID is required.');
    process.exit(1);
  }

  try {
    const result = await api.deleteOrganization(args.id);
    console.log(JSON.stringify(result, null, 2));
  } catch (error: any) {
    console.error('Failed to delete organization:', error.message);
    process.exit(1);
  }
}
