import { auth } from './auth';
import config from '../config/app';

const handleErrors = (response) => {
  if (!response.ok) {
    throw Error(response.statusText);
  }
  return response;
};

const getApiPath = (path, params = {}) => {
  const url = config.API_ENDPOINT + path;
  const urlSearchParams = new URLSearchParams();

  if (params) {
    for (const key in params) {
      urlSearchParams.append(key, params.key);
    }
  }

  const user = auth.currentUser;
  if (user) {
    urlSearchParams.append('token', user.token);
  }
  return `${url}?${urlSearchParams.toString()}`;
};

// function
const encodeFormData = (data) => Object.keys(data)
  .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`)
  .join('&');

export const getApi = (path, queryParams = {}) => fetch(getApiPath(path, queryParams), {
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
}).then((response) => handleErrors(response))
  .then((response) => response.json());

export const postApiFormData = (path, data) => fetch(getApiPath(path), {
  method: 'POST',
  body: data,
}).then((response) => handleErrors(response))
  .then((response) => response.json());

export const postApi = (path, data) => fetch(getApiPath(path), {
  method: 'POST',
  headers: {
    Accept: '*/*',
    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
  },
  body: encodeFormData(data),
}).then((response) => handleErrors(response))
  .then((response) => response.json());
