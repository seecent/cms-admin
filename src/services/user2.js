import { stringify } from 'qs';
import request from '@/utils/request';

export async function query(params) {
  return request(`/api/users?${stringify(params)}`);
}

export async function queryCurrent() {
  return request('/api/notification/current-info');
}

export async function get(params) {
  return request(`/api/users/${params.id}`, {
    method: 'GET',
  });
}

export async function preference(params) {
  return request(`/api/users/${params.id}/preference`, {
    method: 'GET',
  });
}

export async function getRoles(params) {
  return request(`/api/users/${params.id}/roles`, {
    method: 'GET',
  });
}

export async function getMenus(params) {
  return request(`/api/users/${params.id}/menus`, {
    method: 'GET',
  });
}

export async function create(params) {
  return request('/api/users', {
    method: 'POST',
    body: params,
  });
}

export async function remove(params) {
  return request(`/api/users/${params.id}`, {
    method: 'DELETE',
  });
}

export async function update(params) {
  return request(`/api/users/${params.id}`, {
    method: 'PATCH',
    body: params,
  });
}

export async function updatePassword(params) {
  return request('/api/users/update_password', {
    method: 'POST',
    body: params,
  });
}

export async function updatePreference(params) {
  return request(`/api/users/${params.id}/preference`, {
    method: 'PATCH',
    body: params,
  });
}


export async function updateRoles(params) {
  return request(`/api/users/${params.id}/roles`, {
    method: 'PATCH',
    body: params,
  });
}
