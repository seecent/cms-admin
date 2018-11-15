import request from '@/utils/request';

export async function auth(data) {
  return request('/api/ssoauth/token', {
    method: 'POST',
    body: data,
  });
}

export async function logout(data) {
  return request('/api/ssoauth/logout', {
    method: 'POST',
    body: data,
  });
}

export async function queryCurrent() {
  return request('/api/ssoauth/current-info');
}

export async function getMenus() {
  return request('/api/ssoauth/usermenus', {
    method: 'GET',
  });
}
