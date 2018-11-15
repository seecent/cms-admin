import { stringify } from 'qs';
import request from '@/utils/request';

export async function query(params) {
  return request(`/api/departments?${stringify(params)}`);
}

export async function getAllDepartments(params) {
  return request(`/api/departments/getAllDepartments?${stringify(params)}`);
}

export async function create(params) {
  return request('/api/departments', {
    method: 'POST',
    body: params,
  });
}

export async function remove(params) {
  return request(`/api/departments/${params.id}`, {
    method: 'DELETE',
  });
}

export async function batchRemove(params) {
  return request(`/api/departments?ids=${params.ids}`, {
    method: 'DELETE',
  });
}

export async function update(params) {
  return request(`/api/departments/${params.id}`, {
    method: 'PATCH',
    body: params,
  });
}
