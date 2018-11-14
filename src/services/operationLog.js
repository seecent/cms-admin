import { stringify } from 'qs';
import request from '../utils/request';

export async function query(params) {
  return request(`/api/operationlogs?${stringify(params)}`);
}

export async function get(params) {
  return request(`/api/operationlogs/${params.id}`, {
    method: 'GET',
  });
}
