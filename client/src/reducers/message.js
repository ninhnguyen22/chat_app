import { MSG_LIST_LOADED, PUSH_MSG } from '../ActionTypes';

export default (state = [], action) => {
  switch (action.type) {
    case MSG_LIST_LOADED:
      return action.payload;
    case PUSH_MSG:
      return [
        ...state,
        action.payload,
      ];

    default:
      return state;
  }
};
