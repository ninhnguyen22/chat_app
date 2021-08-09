import { LOGIN, LOGOUT } from '../ActionTypes';

const authInit = JSON.parse(localStorage.getItem('currentUser'));

export default (state = authInit, action) => {
  switch (action.type) {
    case LOGIN:
      return action.payload;
    case LOGOUT:
      return {};

    default:
      return state;
  }
};
