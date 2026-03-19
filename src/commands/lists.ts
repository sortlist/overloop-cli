import { OverloopAPI } from '../api';
import { getConfig } from '../config';

export async function listLists(args: { page?: number; 'per-page'?: number; sort?: string; search?: string; filter?: string }) {
  const api = new OverloopAPI(getConfig());

  let filter: Record<string, string> | undefined;
  if (args.filter) {
    try { filter = JSON.parse(args.filter); } catch {
      console.error('Failed to parse --filter JSON:', args.filter);
      process.exit(1);
    }
  }

  try {
    const result = await api.listLists({
      page: args.page,
      per_page: args['per-page'],
      sort: args.sort,
      search: args.search,
      filter,
    });
    console.log(JSON.stringify(result, null, 2));
  } catch (error: any) {
    console.error('Failed to list lists:', error.message);
    process.exit(1);
  }
}

export async function getList(args: { id: string }) {
  const api = new OverloopAPI(getConfig());

  if (!args.id) {
    console.error('List ID is required.');
    process.exit(1);
  }

  try {
    const result = await api.getList(args.id);
    console.log(JSON.stringify(result, null, 2));
  } catch (error: any) {
    console.error('Failed to get list:', error.message);
    process.exit(1);
  }
}

export async function createList(args: { name: string }) {
  const api = new OverloopAPI(getConfig());

  if (!args.name) {
    console.error('--name is required.');
    process.exit(1);
  }

  try {
    const result = await api.createList({ name: args.name });
    console.log(JSON.stringify(result, null, 2));
  } catch (error: any) {
    console.error('Failed to create list:', error.message);
    process.exit(1);
  }
}

export async function updateList(args: { id: string; name?: string }) {
  const api = new OverloopAPI(getConfig());

  if (!args.id) {
    console.error('List ID is required.');
    process.exit(1);
  }

  const body: Record<string, any> = {};
  if (args.name) body.name = args.name;

  try {
    const result = await api.updateList(args.id, body);
    console.log(JSON.stringify(result, null, 2));
  } catch (error: any) {
    console.error('Failed to update list:', error.message);
    process.exit(1);
  }
}

export async function deleteList(args: { id: string }) {
  const api = new OverloopAPI(getConfig());

  if (!args.id) {
    console.error('List ID is required.');
    process.exit(1);
  }

  try {
    const result = await api.deleteList(args.id);
    console.log(JSON.stringify(result, null, 2));
  } catch (error: any) {
    console.error('Failed to delete list:', error.message);
    process.exit(1);
  }
}
