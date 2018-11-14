import { stringify } from 'qs';
import request from '../utils/request';

export async function query(params) {
  return request(`/api/menus?${stringify(params)}`);
}

export async function get(params) {
  return request(`/api/menus/${params.id}`, {
    method: 'GET',
  });
}

export async function create(params) {
  return request('/api/menus', {
    method: 'POST',
    body: params,
  });
}

export async function remove(params) {
  return request(`/api/menus/${params.id}`, {
    method: 'DELETE',
  });
}

export async function update(params) {
  return request(`/api/menus/${params.id}`, {
    method: 'PATCH',
    body: params,
  });
}
