import { stringify } from 'qs';
import request from '@/utils/request';

export async function query(params) {
  return request(`/api/wxusers?${stringify(params)}`);
}

export async function get(params) {
  return request(`/api/wxusers/${params.id}`, {
    method: 'GET',
  });
}

export async function create(params) {
  return request('/api/wxusers', {
    method: 'POST',
    body: params,
  });
}

export async function remove(params) {
  return request(`/api/wxusers/${params.id}`, {
    method: 'DELETE',
  });
}

export async function update(params) {
  return request(`/api/wxusers/${params.id}`, {
    method: 'PATCH',
    body: params,
  });
}

export async function list(params) {
  return request(`/api/wxusers/list/${params.version}`, {
    method: 'GET',
  });
}

export async function syncAllWxUsers(data) {
  return request('/api/wxusers/syncAllWxUsers', {
    method: 'POST',
    body: data,
  });
}

export async function syncWxUser(data) {
  return request('/api/wxusers/syncWxUser', {
    method: 'POST',
    body: data,
  });
}
