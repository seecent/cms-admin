import request from '../utils/request';

export async function logout(data) {
  return request('/api/auth/logout', {
    method: 'POST',
    body: data,
  });
}
