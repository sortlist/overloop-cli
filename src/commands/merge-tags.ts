import { OverloopAPI } from '../api';
import { getConfig } from '../config';

export async function listMergeTags(args: { group?: string }) {
  const api = new OverloopAPI(getConfig());

  try {
    const result = await api.listMergeTags();
    let tags = result.data;

    if (args.group) {
      tags = tags.filter((t: any) => t.group === args.group);
    }

    console.log(JSON.stringify({ data: tags }, null, 2));
  } catch (error: any) {
    console.error('Failed to list merge tags:', error.message);
    process.exit(1);
  }
}
