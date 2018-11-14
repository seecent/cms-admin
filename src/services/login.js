import request from '../utils/request';

export async function login(data) {
  return request('/api/auth/token', {
    method: 'POST',
    body: data,
  });
}
