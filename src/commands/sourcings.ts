import { OverloopAPI } from '../api';
import { getConfig } from '../config';

export async function listSourcings(args: { page?: number; 'per-page'?: number; sort?: string; search?: string; filter?: string }) {
  const api = new OverloopAPI(getConfig());

  let filter: Record<string, string> | undefined;
  if (args.filter) {
    try { filter = JSON.parse(args.filter); } catch {
      console.error('Failed to parse --filter JSON:', args.filter);
      process.exit(1);
    }
  }

  try {
    const result = await api.listSourcings({
      page: args.page,
      per_page: args['per-page'],
      sort: args.sort,
      search: args.search,
      filter,
    });
    console.log(JSON.stringify(result, null, 2));
  } catch (error: any) {
    console.error('Failed to list sourcings:', error.message);
    process.exit(1);
  }
}

export async function getSourcing(args: { id: string }) {
  const api = new OverloopAPI(getConfig());

  if (!args.id) {
    console.error('Sourcing ID is required.');
    process.exit(1);
  }

  try {
    const result = await api.getSourcing(args.id);
    console.log(JSON.stringify(result, null, 2));
  } catch (error: any) {
    console.error('Failed to get sourcing:', error.message);
    process.exit(1);
  }
}

export async function createSourcing(args: { name: string; data?: string; 'search-criteria'?: string; 'sourcing-limit'?: number }) {
  const api = new OverloopAPI(getConfig());

  let body: Record<string, any> = {};
  if (args.data) {
    try { body = JSON.parse(args.data); } catch {
      console.error('Failed to parse --data JSON:', args.data);
      process.exit(1);
    }
  }
  if (args.name) body.name = args.name;
  if (args['sourcing-limit'] !== undefined) body.sourcing_limit = args['sourcing-limit'];
  if (args['search-criteria']) {
    try { body.search_criteria = JSON.parse(args['search-criteria']); } catch {
      console.error('Failed to parse --search-criteria JSON:', args['search-criteria']);
      process.exit(1);
    }
  }

  try {
    const result = await api.createSourcing(body);
    console.log(JSON.stringify(result, null, 2));
  } catch (error: any) {
    console.error('Failed to create sourcing:', error.message);
    process.exit(1);
  }
}

export async function updateSourcing(args: { id: string; name?: string; data?: string; 'sourcing-limit'?: number }) {
  const api = new OverloopAPI(getConfig());

  if (!args.id) {
    console.error('Sourcing ID is required.');
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
  if (args['sourcing-limit'] !== undefined) body.sourcing_limit = args['sourcing-limit'];

  try {
    const result = await api.updateSourcing(args.id, body);
    console.log(JSON.stringify(result, null, 2));
  } catch (error: any) {
    console.error('Failed to update sourcing:', error.message);
    process.exit(1);
  }
}

export async function deleteSourcing(args: { id: string }) {
  const api = new OverloopAPI(getConfig());

  if (!args.id) {
    console.error('Sourcing ID is required.');
    process.exit(1);
  }

  try {
    const result = await api.deleteSourcing(args.id);
    console.log(JSON.stringify(result, null, 2));
  } catch (error: any) {
    console.error('Failed to delete sourcing:', error.message);
    process.exit(1);
  }
}

export async function startSourcing(args: { id: string }) {
  const api = new OverloopAPI(getConfig());

  if (!args.id) {
    console.error('Sourcing ID is required.');
    process.exit(1);
  }

  try {
    const result = await api.startSourcing(args.id);
    console.log(JSON.stringify(result, null, 2));
  } catch (error: any) {
    console.error('Failed to start sourcing:', error.message);
    process.exit(1);
  }
}

export async function pauseSourcing(args: { id: string }) {
  const api = new OverloopAPI(getConfig());

  if (!args.id) {
    console.error('Sourcing ID is required.');
    process.exit(1);
  }

  try {
    const result = await api.pauseSourcing(args.id);
    console.log(JSON.stringify(result, null, 2));
  } catch (error: any) {
    console.error('Failed to pause sourcing:', error.message);
    process.exit(1);
  }
}

export async function cloneSourcing(args: { id: string }) {
  const api = new OverloopAPI(getConfig());

  if (!args.id) {
    console.error('Sourcing ID is required.');
    process.exit(1);
  }

  try {
    const result = await api.cloneSourcing(args.id);
    console.log(JSON.stringify(result, null, 2));
  } catch (error: any) {
    console.error('Failed to clone sourcing:', error.message);
    process.exit(1);
  }
}

export async function searchOptions(args: { field?: string; q?: string }) {
  const api = new OverloopAPI(getConfig());

  try {
    const result = await api.getSourcingSearchOptions({
      field: args.field,
      q: args.q,
    });
    console.log(JSON.stringify(result, null, 2));
  } catch (error: any) {
    console.error('Failed to get search options:', error.message);
    process.exit(1);
  }
}
