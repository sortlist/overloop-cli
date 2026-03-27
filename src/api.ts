import fetch from 'node-fetch';
import { OverloopConfig } from './config';

export class OverloopAPI {
  private apiKey: string;
  private baseUrl: string;

  constructor(config: OverloopConfig) {
    this.apiKey = config.apiKey;
    this.baseUrl = (process.env.OVERLOOP_API_URL || 'https://api.overloop.ai').replace(/\/$/, '');
  }

  private async request(endpoint: string, options: any = {}) {
    const url = `${this.baseUrl}/public/v2${endpoint}`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Authorization: this.apiKey,
      ...options.headers,
    };

    const response = await fetch(url, { ...options, headers });

    if (response.status === 204) {
      return null;
    }

    if (!response.ok) {
      const body = await response.text();
      let message: string;
      try {
        const json = JSON.parse(body);
        message = json.error?.message || json.errors?.map((e: any) => `${e.field}: ${e.message}`).join(', ') || body;
      } catch {
        message = body;
      }
      throw new Error(`API Error (${response.status}): ${message}`);
    }

    return await response.json();
  }

  private buildQuery(params: Record<string, any>): string {
    const query = new URLSearchParams();

    for (const [key, value] of Object.entries(params)) {
      if (value === undefined || value === null) continue;

      if (key === 'filter' && typeof value === 'object') {
        for (const [fk, fv] of Object.entries(value)) {
          query.set(`filter[${fk}]`, String(fv));
        }
      } else {
        query.set(key, String(value));
      }
    }

    const qs = query.toString();
    return qs ? `?${qs}` : '';
  }

  // -- Prospects --

  async listProspects(params: { page?: number; per_page?: number; sort?: string; search?: string; expand?: string; filter?: Record<string, string> } = {}) {
    return this.request(`/prospects${this.buildQuery(params)}`);
  }

  async getProspect(id: string, params: { expand?: string } = {}) {
    return this.request(`/prospects/${encodeURIComponent(id)}${this.buildQuery(params)}`);
  }

  async createProspect(data: Record<string, any>) {
    return this.request('/prospects', { method: 'POST', body: JSON.stringify(data) });
  }

  async updateProspect(id: string, data: Record<string, any>) {
    return this.request(`/prospects/${encodeURIComponent(id)}`, { method: 'PATCH', body: JSON.stringify(data) });
  }

  async deleteProspect(id: string) {
    return this.request(`/prospects/${encodeURIComponent(id)}`, { method: 'DELETE' });
  }

  // -- Organizations --

  async listOrganizations(params: { page?: number; per_page?: number; sort?: string; search?: string; expand?: string; filter?: Record<string, string> } = {}) {
    return this.request(`/organizations${this.buildQuery(params)}`);
  }

  async getOrganization(id: string, params: { expand?: string } = {}) {
    return this.request(`/organizations/${id}${this.buildQuery(params)}`);
  }

  async createOrganization(data: Record<string, any>) {
    return this.request('/organizations', { method: 'POST', body: JSON.stringify(data) });
  }

  async updateOrganization(id: string, data: Record<string, any>) {
    return this.request(`/organizations/${id}`, { method: 'PATCH', body: JSON.stringify(data) });
  }

  async deleteOrganization(id: string) {
    return this.request(`/organizations/${id}`, { method: 'DELETE' });
  }

  // -- Lists --

  async listLists(params: { page?: number; per_page?: number; sort?: string; search?: string; filter?: Record<string, string> } = {}) {
    return this.request(`/lists${this.buildQuery(params)}`);
  }

  async getList(id: string) {
    return this.request(`/lists/${id}`);
  }

  async createList(data: Record<string, any>) {
    return this.request('/lists', { method: 'POST', body: JSON.stringify(data) });
  }

  async updateList(id: string, data: Record<string, any>) {
    return this.request(`/lists/${id}`, { method: 'PATCH', body: JSON.stringify(data) });
  }

  async deleteList(id: string) {
    return this.request(`/lists/${id}`, { method: 'DELETE' });
  }

  // -- Campaigns --

  async listCampaigns(params: { page?: number; per_page?: number; sort?: string; search?: string; expand?: string; filter?: Record<string, string> } = {}) {
    return this.request(`/campaigns${this.buildQuery(params)}`);
  }

  async getCampaign(id: string, params: { expand?: string } = {}) {
    return this.request(`/campaigns/${id}${this.buildQuery(params)}`);
  }

  async createCampaign(data: Record<string, any>) {
    return this.request('/campaigns', { method: 'POST', body: JSON.stringify(data) });
  }

  async updateCampaign(id: string, data: Record<string, any>) {
    return this.request(`/campaigns/${id}`, { method: 'PATCH', body: JSON.stringify(data) });
  }

  async deleteCampaign(id: string) {
    return this.request(`/campaigns/${id}`, { method: 'DELETE' });
  }

  async getCampaignStats(id: string) {
    return this.request(`/campaigns/${id}/stats`);
  }

  // -- Campaign Steps --

  async listSteps(campaignId: string, params: { page?: number; per_page?: number; sort?: string } = {}) {
    return this.request(`/campaigns/${campaignId}/steps${this.buildQuery(params)}`);
  }

  async getStep(campaignId: string, id: string) {
    return this.request(`/campaigns/${campaignId}/steps/${id}`);
  }

  async createStep(campaignId: string, data: Record<string, any>) {
    return this.request(`/campaigns/${campaignId}/steps`, { method: 'POST', body: JSON.stringify(data) });
  }

  async updateStep(campaignId: string, id: string, data: Record<string, any>) {
    return this.request(`/campaigns/${campaignId}/steps/${id}`, { method: 'PATCH', body: JSON.stringify(data) });
  }

  async deleteStep(campaignId: string, id: string) {
    return this.request(`/campaigns/${campaignId}/steps/${id}`, { method: 'DELETE' });
  }

  // -- Campaign Enrollments --

  async listEnrollments(campaignId: string, params: { page?: number; per_page?: number; sort?: string; filter?: Record<string, string> } = {}) {
    return this.request(`/campaigns/${campaignId}/enrollments${this.buildQuery(params)}`);
  }

  async getEnrollment(campaignId: string, id: string) {
    return this.request(`/campaigns/${campaignId}/enrollments/${id}`);
  }

  async createEnrollment(campaignId: string, data: Record<string, any>) {
    return this.request(`/campaigns/${campaignId}/enrollments`, { method: 'POST', body: JSON.stringify(data) });
  }

  async deleteEnrollment(campaignId: string, id: string) {
    return this.request(`/campaigns/${campaignId}/enrollments/${id}`, { method: 'DELETE' });
  }

  async bulkCreateEnrollments(campaignId: string, data: Record<string, any>) {
    return this.request(`/campaigns/${campaignId}/enrollments/bulk`, { method: 'POST', body: JSON.stringify(data) });
  }

  // -- Step Types --

  async listStepTypes() {
    return this.request('/campaigns/step_types');
  }

  // -- Sourcings --

  async listSourcings(params: { page?: number; per_page?: number; sort?: string; search?: string; filter?: Record<string, string> } = {}) {
    return this.request(`/sourcings${this.buildQuery(params)}`);
  }

  async getSourcing(id: string) {
    return this.request(`/sourcings/${id}`);
  }

  async createSourcing(data: Record<string, any>) {
    return this.request('/sourcings', { method: 'POST', body: JSON.stringify(data) });
  }

  async updateSourcing(id: string, data: Record<string, any>) {
    return this.request(`/sourcings/${id}`, { method: 'PATCH', body: JSON.stringify(data) });
  }

  async deleteSourcing(id: string) {
    return this.request(`/sourcings/${id}`, { method: 'DELETE' });
  }

  async startSourcing(id: string) {
    return this.request(`/sourcings/${id}/start`, { method: 'POST' });
  }

  async pauseSourcing(id: string) {
    return this.request(`/sourcings/${id}/pause`, { method: 'POST' });
  }

  async cloneSourcing(id: string) {
    return this.request(`/sourcings/${id}/clone`, { method: 'POST' });
  }

  async estimateSourcing(data: { search_criteria: Record<string, any> }) {
    return this.request('/sourcings/estimate', { method: 'POST', body: JSON.stringify(data) });
  }

  async getSourcingSearchOptions(params: { field?: string; q?: string } = {}) {
    return this.request(`/sourcings/search_options${this.buildQuery(params)}`);
  }

  // -- Conversations --

  async listConversations(params: { page?: number; per_page?: number; sort?: string; search?: string; filter?: Record<string, string>; archived?: boolean } = {}) {
    return this.request(`/conversations${this.buildQuery(params)}`);
  }

  async getConversation(id: string) {
    return this.request(`/conversations/${id}`);
  }

  async updateConversation(id: string, data: Record<string, any>) {
    return this.request(`/conversations/${id}`, { method: 'PATCH', body: JSON.stringify(data) });
  }

  async archiveConversation(id: string) {
    return this.request(`/conversations/${id}/archive`, { method: 'POST' });
  }

  async unarchiveConversation(id: string) {
    return this.request(`/conversations/${id}/unarchive`, { method: 'POST' });
  }

  async assignConversation(id: string, ownerId: string) {
    return this.request(`/conversations/${id}/assign`, { method: 'POST', body: JSON.stringify({ owner_id: ownerId }) });
  }

  // -- Account --

  async getAccount() {
    return this.request('/account');
  }

  async getMe() {
    return this.request('/me');
  }

  // -- Users --

  async listUsers(params: { page?: number; per_page?: number; sort?: string; search?: string } = {}) {
    return this.request(`/users${this.buildQuery(params)}`);
  }

  async getUser(id: string) {
    return this.request(`/users/${id}`);
  }

  // -- Custom Fields --

  async listCustomFields(params: { type?: string } = {}) {
    return this.request(`/custom_fields${this.buildQuery(params)}`);
  }

  // -- Merge Tags --

  async listMergeTags() {
    return this.request('/merge_tags');
  }

  // -- Sending Addresses --

  async listSendingAddresses() {
    return this.request('/sending_addresses');
  }

  // -- Exclusion List --

  async listExclusionList(params: { page?: number; per_page?: number; sort?: string; search?: string; filter?: Record<string, string> } = {}) {
    return this.request(`/exclusion_list${this.buildQuery(params)}`);
  }

  async createExclusionListItem(data: { value: string; item_type: string }) {
    return this.request('/exclusion_list', { method: 'POST', body: JSON.stringify(data) });
  }

  async deleteExclusionListItem(id: string) {
    return this.request(`/exclusion_list/${id}`, { method: 'DELETE' });
  }
}
