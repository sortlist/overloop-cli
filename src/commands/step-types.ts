import { OverloopAPI } from '../api';
import { getConfig } from '../config';

export async function listStepTypes() {
  const api = new OverloopAPI(getConfig());

  try {
    const result = await api.listStepTypes();
    console.log(JSON.stringify(result, null, 2));
  } catch (error: any) {
    console.error('Failed to list step types:', error.message);
    process.exit(1);
  }
}
