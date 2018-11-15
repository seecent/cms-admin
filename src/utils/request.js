import fetch from 'dva/fetch';
import { notification } from 'antd';
import store from 'store';
import { InternalServerError, UnauthorizedError, isAuthError } from './common';

async function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  if (response.status === 401 || response.status === 403) {
    const error = new UnauthorizedError(response.statusText);
    error.name = response.status;
    error.response = response;
    throw error;
  }
  if (response.status === 500) {
    const error = new InternalServerError(response.statusText);
    error.name = response.status;
    error.response = response;
    error.data = await response.json();
    throw error;
  }
  // notification.error({
  //   message: `请求错误 ${response.status}: ${response.url}`,
  //   description: response.statusText,
  // });
  const error = new Error(response.statusText);
  error.name = response.status;
  error.response = response;
  throw error;
}

async function processData(response) {
  const data = await response.json();
  if (response.headers.get('x-total-count')) {
    const count = response.headers.get('x-total-count');
    return { list: data, headers: { 'x-total-count': count } };
  }
  return data;
}
/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to 'fetch'
 * @return {object}           An object containing either 'data' or 'err'
 */
export default function request(url, options) {
  const defaultOptions = {
    credentials: 'include',
  };
  const newOptions = { ...defaultOptions, ...options };
  if (newOptions.method === 'POST' || newOptions.method === 'PATCH') {
    newOptions.headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json; charset=utf-8',
      ...newOptions.headers,
    };
    newOptions.body = JSON.stringify(newOptions.body);
  }
  const isAuth = url.startsWith('/api/auth/');
  if (!isAuth) {
    const apikey = store.get('token');
    if (apikey) {
      newOptions.headers = {
        apikey: "gAAAAABb7OVyFoUcbDm4k6eD571hVvPiUhWU8pA2vlL4c8pK4ecd1ZU6d5rls-bbG90mR1fvYbLc92rQvusN1CbTNDxVAS-gCw==",
        ...newOptions.headers,
      };
    }
  }
  return (
    fetch(url, newOptions)
      .then(checkStatus)
      // .then(response => response.json())
      .then(processData)
      .catch((error) => {
        if (isAuth) {
          return error;
        }
        if (isAuthError(error)) {
          throw error;
        }
        if (error.code) {
          notification.error({
            message: error.name,
            description: error.message,
          });
        }
        // if ('stack' in error && 'message' in error) {
        //   notification.error({
        //     message: `请求错误: ${url}`,
        //     description: error.message,
        //   });
        // }
        return error;
      })
  );
}
