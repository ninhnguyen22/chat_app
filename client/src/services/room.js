import {getApi, postApi} from './api';
import {auth} from './auth';
import config from '../config/app';

/**
 * Get room list
 */
const getRooms = () => getApi('rooms')
  .catch((err) => console.log(err));

/* Create new room */
const createRoom = (name) => postApi('rooms/store', {name})
  .then(({room}) => {
    if (room) {
      const user = auth.currentUser;
      return {
        _id: room._id,
        avatar: `${config.API_ENDPOINT}${user.avatar}`,
        alt: room.name,
        title: room.name,
        subtitle: `Welcome to ${room.name}`,
        unread: 0,
        date: new Date(),
      };
    }
  })
  .catch((err) => console.log(err));

const getMessages = (roomId) => getApi(`rooms/messages/${roomId}`)
  .then(({messages}) => {
    const user = auth.currentUser;
    return messages.map((message) => ({
      avatar: `${config.API_ENDPOINT}${message.user.avatar}`,
      position: message.user._id === user._id ? 'right' : 'left',
      type: message.msgType,
      text: message.text,
      date: new Date(message.date),
    }));
  });

const getDefaultRoom = () => ({
  user: {
    avatar: '',
  },
  title: 'Welcome to room',
  text: 'Welcome to room',
  date: '',
});

export const room = {
  getRooms,
  createRoom,
  getMessages,
  getDefaultRoom,
};

