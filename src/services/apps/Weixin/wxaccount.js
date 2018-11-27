import { stringify } from 'qs';
import request from '@/utils/request';

export async function query(params) {
  return request(`/api/wxaccounts?${stringify(params)}`);
}

export async function getAllAccounts(params) {
  return request(`/api/wxaccounts/getAllWxAccounts?${stringify(params)}`);
}

export async function get(params) {
  return request(`/api/wxaccounts/${params.id}`, {
    method: 'GET',
  });
}

export async function create(params) {
  return request('/api/wxaccounts', {
    method: 'POST',
    body: params,
  });
}

export async function remove(params) {
  return request(`/api/wxaccounts/${params.id}`, {
    method: 'DELETE',
  });
}

export async function update(params) {
  return request(`/api/wxaccounts/${params.id}`, {
    method: 'PATCH',
    body: params,
  });
}

export async function syncAccessToken(params) {
  return request(`/api/wxaccounts/syncAccessToken?id=${params.id}`, {
    method: 'GET',
  });
}

export async function list(params) {
  return request(`/api/wxaccounts/list/${params.version}`, {
    method: 'GET',
  });
}
