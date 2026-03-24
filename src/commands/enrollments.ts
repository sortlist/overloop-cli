import { OverloopAPI } from '../api';
import { getConfig } from '../config';

export async function listEnrollments(args: { campaign: string; page?: number; 'per-page'?: number; sort?: string; filter?: string }) {
  const api = new OverloopAPI(getConfig());

  let filter: Record<string, string> | undefined;
  if (args.filter) {
    try { filter = JSON.parse(args.filter); } catch {
      console.error('Failed to parse --filter JSON:', args.filter);
      process.exit(1);
    }
  }

  try {
    const result = await api.listEnrollments(args.campaign, {
      page: args.page,
      per_page: args['per-page'],
      sort: args.sort,
      filter,
    });
    console.log(JSON.stringify(result, null, 2));
  } catch (error: any) {
    console.error('Failed to list enrollments:', error.message);
    process.exit(1);
  }
}

export async function getEnrollment(args: { campaign: string; id: string }) {
  const api = new OverloopAPI(getConfig());

  if (!args.id) {
    console.error('Enrollment ID is required.');
    process.exit(1);
  }

  try {
    const result = await api.getEnrollment(args.campaign, args.id);
    console.log(JSON.stringify(result, null, 2));
  } catch (error: any) {
    console.error('Failed to get enrollment:', error.message);
    process.exit(1);
  }
}

export async function createEnrollment(args: { campaign: string; prospect: string; 'step-id'?: string; reenroll?: boolean; 'start-at'?: string }) {
  const api = new OverloopAPI(getConfig());

  if (!args.prospect) {
    console.error('--prospect is required.');
    process.exit(1);
  }

  const body: Record<string, any> = { prospect_id: args.prospect };
  if (args['step-id']) body.step_id = args['step-id'];
  if (args.reenroll !== undefined) body.reenroll = args.reenroll;
  if (args['start-at']) body.start_at = args['start-at'];

  try {
    const result = await api.createEnrollment(args.campaign, body);
    console.log(JSON.stringify(result, null, 2));
  } catch (error: any) {
    console.error('Failed to create enrollment:', error.message);
    process.exit(1);
  }
}

export async function bulkCreateEnrollments(args: { campaign: string; prospects: string; 'step-id'?: string; reenroll?: boolean; 'start-at'?: string }) {
  const api = new OverloopAPI(getConfig());

  if (!args.prospects) {
    console.error('--prospects is required (comma-separated IDs).');
    process.exit(1);
  }

  const prospectIds = args.prospects.split(',').map((id) => id.trim()).filter(Boolean);
  if (prospectIds.length === 0) {
    console.error('No prospect IDs provided.');
    process.exit(1);
  }

  const body: Record<string, any> = { prospect_ids: prospectIds };
  if (args['step-id']) body.step_id = args['step-id'];
  if (args.reenroll !== undefined) body.reenroll = args.reenroll;
  if (args['start-at']) body.start_at = args['start-at'];

  try {
    const result = await api.bulkCreateEnrollments(args.campaign, body);
    console.log(JSON.stringify(result, null, 2));
  } catch (error: any) {
    console.error('Failed to bulk enroll:', error.message);
    process.exit(1);
  }
}

export async function deleteEnrollment(args: { campaign: string; id: string }) {
  const api = new OverloopAPI(getConfig());

  if (!args.id) {
    console.error('Enrollment ID is required.');
    process.exit(1);
  }

  try {
    const result = await api.deleteEnrollment(args.campaign, args.id);
    console.log(JSON.stringify(result, null, 2));
  } catch (error: any) {
    console.error('Failed to delete enrollment:', error.message);
    process.exit(1);
  }
}
