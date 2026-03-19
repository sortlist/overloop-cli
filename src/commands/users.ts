import { OverloopAPI } from '../api';
import { getConfig } from '../config';

export async function listUsers(args: { page?: number; 'per-page'?: number; sort?: string; search?: string }) {
  const api = new OverloopAPI(getConfig());

  try {
    const result = await api.listUsers({
      page: args.page,
      per_page: args['per-page'],
      sort: args.sort,
      search: args.search,
    });
    console.log(JSON.stringify(result, null, 2));
  } catch (error: any) {
    console.error('Failed to list users:', error.message);
    process.exit(1);
  }
}

export async function getUser(args: { id: string }) {
  const api = new OverloopAPI(getConfig());

  if (!args.id) {
    console.error('User ID is required.');
    process.exit(1);
  }

  try {
    const result = await api.getUser(args.id);
    console.log(JSON.stringify(result, null, 2));
  } catch (error: any) {
    console.error('Failed to get user:', error.message);
    process.exit(1);
  }
}
