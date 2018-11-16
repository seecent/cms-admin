import { stringify } from 'qs';
import request from '@/utils/request';

export async function query(params) {
  return request(`/api/media/folders?${stringify(params)}`);
}

export async function getAllFolders(params) {
  return request(`/api/media/folders/getAllFolders?${stringify(params)}`);
}

export async function get(params) {
  return request(`/api/media/folders/${params.id}`, {
    method: 'GET',
  });
}

export async function create(params) {
  return request('/api/media/folders', {
    method: 'POST',
    body: params,
  });
}

export async function remove(params) {
  return request(`/api/media/folders/${params.id}`, {
    method: 'DELETE',
  });
}

export async function batchRemove(params) {
  return request(`/api/media/folders?ids=${params.ids}`, {
    method: 'DELETE',
  });
}

export async function update(params) {
  return request(`/api/media/folders/${params.id}`, {
    method: 'PATCH',
    body: params,
  });
}
