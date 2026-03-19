import { OverloopAPI } from '../api';
import { getConfig } from '../config';

export async function listExclusionList(args: { page?: number; 'per-page'?: number; sort?: string; search?: string; filter?: string }) {
  const api = new OverloopAPI(getConfig());

  let filter: Record<string, string> | undefined;
  if (args.filter) {
    try { filter = JSON.parse(args.filter); } catch {
      console.error('Failed to parse --filter JSON:', args.filter);
      process.exit(1);
    }
  }

  try {
    const result = await api.listExclusionList({
      page: args.page,
      per_page: args['per-page'],
      sort: args.sort,
      search: args.search,
      filter,
    });
    console.log(JSON.stringify(result, null, 2));
  } catch (error: any) {
    console.error('Failed to list exclusion list:', error.message);
    process.exit(1);
  }
}

export async function createExclusionListItem(args: { value: string; 'item-type': string }) {
  const api = new OverloopAPI(getConfig());

  if (!args.value) {
    console.error('--value is required.');
    process.exit(1);
  }
  if (!args['item-type']) {
    console.error('--item-type is required (email or domain).');
    process.exit(1);
  }

  try {
    const result = await api.createExclusionListItem({
      value: args.value,
      item_type: args['item-type'],
    });
    console.log(JSON.stringify(result, null, 2));
  } catch (error: any) {
    console.error('Failed to create exclusion list item:', error.message);
    process.exit(1);
  }
}

export async function deleteExclusionListItem(args: { id: string }) {
  const api = new OverloopAPI(getConfig());

  if (!args.id) {
    console.error('Exclusion list item ID is required.');
    process.exit(1);
  }

  try {
    const result = await api.deleteExclusionListItem(args.id);
    console.log(JSON.stringify(result, null, 2));
  } catch (error: any) {
    console.error('Failed to delete exclusion list item:', error.message);
    process.exit(1);
  }
}
