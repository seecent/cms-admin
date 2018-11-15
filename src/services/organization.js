import { stringify } from 'qs';
import request from '@/utils/request';

export async function query(params) {
  return request(`/api/organizations?${stringify(params)}`);
}

export async function getAllOrgs(params) {
  return request(`/api/organizations/getAllOrgs?${stringify(params)}`);
}

export async function syncOrganizations(params) {
  return request(`/api/organizations/syncOrganizations?${stringify(params)}`);
}

export async function get(params) {
  return request(`/api/organizations/${params.id}`, {
    method: 'GET',
  });
}

export async function create(params) {
  return request('/api/organizations', {
    method: 'POST',
    body: params,
  });
}

export async function remove(params) {
  return request(`/api/organizations/${params.id}`, {
    method: 'DELETE',
  });
}

export async function batchRemove(params) {
  return request(`/api/organizations?ids=${params.ids}`, {
    method: 'DELETE',
  });
}

export async function update(params) {
  return request(`/api/organizations/${params.id}`, {
    method: 'PATCH',
    body: params,
  });
}
