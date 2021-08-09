import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import io from 'socket.io-client';
import { createStore } from 'redux';
import { Layout } from 'antd';

/* Config */
import config from '../../config/app';
/* Css */
import 'react-chat-elements/dist/main.css';
import './ChatContainer.css';
/* Service */
import { room } from '../../services/room';
import { auth } from '../../services/auth';
/* Redux */
import rootReducer from '../../reducers/rootReducer';
import {
  ROOM_LIST_LOADED,
  UPDATE_ROOM,
  SET_ACTIVE_ROOM,
  SET_CURRENT_ROOM,
  MSG_LIST_LOADED,
  PUSH_MSG,
  PUSH_ROOM,
} from '../../ActionTypes';
/* Component */
import ChatHeader from '../Header/ChatHeader';
import ChatBox from './ChatBox';
import Chanel from '../Chanel/Chanel';
/* Create store */
const store = createStore(rootReducer);
let socket;
const { Content, Sider } = Layout;

export default function ChatContainer() {
  /* Socket connect */
  const createSocketConnect = (_id, isCreate = false) => {
    /* Check connected */
    socket.emit('join', { roomId: _id, isCreate }, (error) => {
      if (error) {
        console.log(error);
      }
    });
  };

  /* Room */
  const updateRoom = (roomUdId, msgInRoom) => {
    const roomByMsg = {
      _id: roomUdId,
      avatar: `${config.API_ENDPOINT}${msgInRoom.avatar}`,
      date: new Date(msgInRoom.date),
      subtitle: msgInRoom.text,
    };
    store.dispatch({
      type: UPDATE_ROOM,
      payload: roomByMsg,
    });
  };

  const getMessagesForRoom = (targetRoomId) => {
    room.getMessages(targetRoomId)
      .then((msgs) => {
        store.dispatch({
          type: MSG_LIST_LOADED,
          payload: msgs,
        });
      })
      .catch((err) => console.log(err));
  };

  const goToRoom = (roomTarget) => {
    store.dispatch({
      type: SET_CURRENT_ROOM,
      payload: roomTarget,
    });

    getMessagesForRoom(roomTarget._id);
    store.dispatch({
      type: SET_ACTIVE_ROOM,
      _id: roomTarget._id,
    });
  };

  /* Message */
  const listenMessage = (roomId) => {
    socket.on(`message:${roomId}`, (messageOn) => {
      const { crRoom } = store.getState();
      if (crRoom._id === roomId) {
        store.dispatch({
          type: PUSH_MSG,
          payload: {
            avatar: `${config.API_ENDPOINT}${messageOn.avatar}`,
            position: messageOn._id === auth.currentUser._id ? 'right' : 'left',
            type: messageOn.type,
            text: messageOn.text,
            date: new Date(messageOn.date),
          },
        });
      }
      updateRoom(roomId, messageOn);
    });
  };

  const listenRoom = () => {
    socket.on('rooms', (roomOn) => {
      const message = roomOn.messages[0] || {
        avatar: '',
        text: '',
      };
      store.dispatch({
        type: PUSH_ROOM,
        payload: {
          _id: roomOn._id,
          avatar: `${config.API_ENDPOINT}${message.user.avatar}`,
          alt: roomOn.name,
          title: roomOn.name,
          subtitle: message.text,
          unread: 1,
          date: new Date(),
        },
      });
      /* Create socket connect */
      createSocketConnect(roomOn._id);
      /* Listen message */
      listenMessage(roomOn._id);
    });
  };

  const sendMessage = (roomId, message) => {
    if (message) {
      socket.emit('sendMessage', { roomId, message });
    }
  };

  useEffect(() => {
    // Create socket
    const user = auth.currentUser;
    socket = io(config.API_ENDPOINT, {
      query: {
        token: user.token,
      },
    });

    /* Room */
    room.getRooms()
      .then(({ rooms }) => rooms.map((roomData) => {
        /* Create socket connect */
        createSocketConnect(roomData._id);

        /* Listen message */
        listenMessage(roomData._id);

        const message = roomData.messages[0] || room.getDefaultRoom;
        return {
          _id: roomData._id,
          avatar: `${config.API_ENDPOINT}${message.user.avatar}`,
          alt: roomData.name,
          title: roomData.name,
          subtitle: message.text,
          unread: 0,
          date: new Date(message.date),
        };
      }))
      .then((rooms) => {
        /* Dispatch to room reducer */
        store.dispatch({
          type: ROOM_LIST_LOADED,
          payload: rooms,
        });
        if (rooms && rooms.length > 0) {
          const firstRoom = rooms[0];
          goToRoom(firstRoom);
        }
        listenRoom();
      });
  }, []);

  const createRoom = (room) => {
    /* Create socket connect */
    createSocketConnect(room._id, true);
    /* Listen message */
    listenMessage(room._id);

    goToRoom(room);
  };

  return (
    <Provider store={store}>
      <Layout>
        <ChatHeader />
        <Content className="chat_content">
          <Layout className="site-layout-background" style={{ padding: '80px 24px 0' }}>
            <Sider
              breakpoint="lg"
              collapsedWidth="0"
              onBreakpoint={(broken) => {
                console.log(broken);
              }}
              onCollapse={(collapsed, type) => {
                console.log(collapsed, type);
              }}
              className="site-layout-background"
              width={400}
              style={{ borderRight: '1px solid #aaa' }}
            >
              <Chanel createRoom={createRoom} goToRoom={goToRoom} />
            </Sider>
            <Content className="chat-box">
              <ChatBox sendMessage={sendMessage} />
            </Content>
          </Layout>
        </Content>
      </Layout>
    </Provider>
  );
}
