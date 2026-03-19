import { OverloopAPI } from '../api';
import { getConfig } from '../config';

export async function getAccount() {
  const api = new OverloopAPI(getConfig());

  try {
    const result = await api.getAccount();
    console.log(JSON.stringify(result, null, 2));
  } catch (error: any) {
    console.error('Failed to get account:', error.message);
    process.exit(1);
  }
}

export async function getMe() {
  const api = new OverloopAPI(getConfig());

  try {
    const result = await api.getMe();
    console.log(JSON.stringify(result, null, 2));
  } catch (error: any) {
    console.error('Failed to get current user:', error.message);
    process.exit(1);
  }
}
