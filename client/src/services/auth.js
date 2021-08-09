import { createStore } from 'redux';
import { LOGIN, LOGOUT } from '../ActionTypes';

import authReducer from '../reducers/auth';
import { postApi, postApiFormData } from './api';

// Create store
const authStore = createStore(authReducer);

const login = (data) => postApi('login', data).then((userData) => {
  localStorage.setItem('currentUser', JSON.stringify(userData));

  authStore.dispatch({
    type: LOGIN,
    payload: userData,
  });

  return userData;
});

const register = (data) => postApiFormData('register', data);

const logout = () => {
  localStorage.removeItem('currentUser');
  authStore.dispatch({
    type: LOGOUT,
  });
};

export const auth = {
  login,
  register,
  logout,
  get currentUser() { return authStore.getState(); },
};
