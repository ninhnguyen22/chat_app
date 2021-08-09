import { SET_CURRENT_ROOM } from '../ActionTypes';

export default (state = {}, action) => {
  switch (action.type) {
    case SET_CURRENT_ROOM:
      return {
        ...state,
        ...action.payload,
      };

    default:
      return state;
  }
};
