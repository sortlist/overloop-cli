import { OverloopAPI } from '../api';
import { getConfig } from '../config';

export async function listCustomFields(args: { type?: string }) {
  const api = new OverloopAPI(getConfig());

  try {
    const result = await api.listCustomFields({ type: args.type });
    console.log(JSON.stringify(result, null, 2));
  } catch (error: any) {
    console.error('Failed to list custom fields:', error.message);
    process.exit(1);
  }
}
