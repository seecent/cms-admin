import { stringify } from 'qs';
import request from '@/utils/request';

export async function query(params) {
  return request(`/api/roles?${stringify(params)}`);
}

export async function getAllRoles(params) {
  return request(`/api/roles/getAllRoles?${stringify(params)}`);
}

export async function getAllUsers(params) {
  return request(`/api/roles/getAllUsers?${stringify(params)}`);
}

export async function get(params) {
  return request(`/api/roles/${params.id}`, {
    method: 'GET',
  });
}

export async function create(params) {
  return request('/api/roles', {
    method: 'POST',
    body: params,
  });
}

export async function remove(params) {
  return request(`/api/roles/${params.id}`, {
    method: 'DELETE',
  });
}

export async function update(params) {
  return request(`/api/roles/${params.id}`, {
    method: 'PATCH',
    body: params,
  });
}

export async function list(params) {
  return request(`/api/roles/list/${params.version}`, {
    method: 'GET',
  });
}

export async function getMenus(params) {
  return request(`/api/roles/${params.id}/menus`, {
    method: 'GET',
  });
}

export async function updateMenus(params) {
  return request(`/api/roles/${params.id}/menus`, {
    method: 'PATCH',
    body: params,
  });
}
