import { ROOM_LIST_LOADED, PUSH_ROOM, UPDATE_ROOM, SET_ACTIVE_ROOM } from '../ActionTypes';

export default (state = [], action) => {
  switch (action.type) {
    case ROOM_LIST_LOADED:
      return action.payload;
    case PUSH_ROOM:
      return [
        ...state,
        action.payload,
      ];
    case UPDATE_ROOM:
      const roomUpdateId = action.payload._id;
      const roomUpdateIndex = state.findIndex((room) => room._id === roomUpdateId);
      return [
        ...state.slice(0, roomUpdateIndex),
        {
          ...state[roomUpdateIndex],
          ...action.payload,
        },
        ...state.slice(roomUpdateIndex + 1),
      ];
    case SET_ACTIVE_ROOM:
      const roomListenId = action._id;
      return state.map((room) => {
        if (room._id === roomListenId) {
          return {
            ...room,
            ...{
              className: 'chat-active',
              unread: 0,
            },
          };
        }
        if (room.hasOwnProperty('className')) {
          delete room.className;
        }
        return room;
      });

    default:
      return state;
  }
};
