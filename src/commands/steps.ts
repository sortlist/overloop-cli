import { OverloopAPI } from '../api';
import { getConfig } from '../config';

export async function listSteps(args: { campaign: string; page?: number; 'per-page'?: number; sort?: string }) {
  const api = new OverloopAPI(getConfig());

  try {
    const result = await api.listSteps(args.campaign, {
      page: args.page,
      per_page: args['per-page'],
      sort: args.sort,
    });
    console.log(JSON.stringify(result, null, 2));
  } catch (error: any) {
    console.error('Failed to list steps:', error.message);
    process.exit(1);
  }
}

export async function getStep(args: { campaign: string; id: string }) {
  const api = new OverloopAPI(getConfig());

  if (!args.id) {
    console.error('Step ID is required.');
    process.exit(1);
  }

  try {
    const result = await api.getStep(args.campaign, args.id);
    console.log(JSON.stringify(result, null, 2));
  } catch (error: any) {
    console.error('Failed to get step:', error.message);
    process.exit(1);
  }
}

export async function createStep(args: { campaign: string; type: string; config?: string; 'previous-step-id'?: string; position?: number }) {
  const api = new OverloopAPI(getConfig());

  if (!args.type) {
    console.error('--type is required.');
    process.exit(1);
  }

  const body: Record<string, any> = { type: args.type };
  if (args.config) {
    try { body.config = JSON.parse(args.config); } catch {
      console.error('Failed to parse --config JSON:', args.config);
      process.exit(1);
    }
  }
  if (args['previous-step-id']) body.previous_step_id = args['previous-step-id'];
  if (args.position !== undefined) body.position = args.position;

  try {
    const result = await api.createStep(args.campaign, body);
    console.log(JSON.stringify(result, null, 2));
  } catch (error: any) {
    console.error('Failed to create step:', error.message);
    process.exit(1);
  }
}

export async function updateStep(args: { campaign: string; id: string; type?: string; config?: string; 'previous-step-id'?: string; position?: number }) {
  const api = new OverloopAPI(getConfig());

  if (!args.id) {
    console.error('Step ID is required.');
    process.exit(1);
  }

  const body: Record<string, any> = {};
  if (args.type) body.type = args.type;
  if (args.config) {
    try { body.config = JSON.parse(args.config); } catch {
      console.error('Failed to parse --config JSON:', args.config);
      process.exit(1);
    }
  }
  if (args['previous-step-id']) body.previous_step_id = args['previous-step-id'];
  if (args.position !== undefined) body.position = args.position;

  try {
    const result = await api.updateStep(args.campaign, args.id, body);
    console.log(JSON.stringify(result, null, 2));
  } catch (error: any) {
    console.error('Failed to update step:', error.message);
    process.exit(1);
  }
}

export async function deleteStep(args: { campaign: string; id: string }) {
  const api = new OverloopAPI(getConfig());

  if (!args.id) {
    console.error('Step ID is required.');
    process.exit(1);
  }

  try {
    const result = await api.deleteStep(args.campaign, args.id);
    console.log(JSON.stringify(result, null, 2));
  } catch (error: any) {
    console.error('Failed to delete step:', error.message);
    process.exit(1);
  }
}
