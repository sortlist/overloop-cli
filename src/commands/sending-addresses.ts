import { OverloopAPI } from '../api';
import { getConfig } from '../config';

export async function listSendingAddresses() {
  const api = new OverloopAPI(getConfig());

  try {
    const result = await api.listSendingAddresses();
    console.log(JSON.stringify(result, null, 2));
  } catch (error: any) {
    console.error('Failed to list sending addresses:', error.message);
    process.exit(1);
  }
}
