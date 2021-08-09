import React, { useState } from 'react';
import { Button, Modal } from 'antd';
import { AppstoreAddOutlined } from '@ant-design/icons';
import { ChatList } from 'react-chat-elements';
import { useSelector, useDispatch } from 'react-redux';
import NewChanel from './NewChanel';
import { PUSH_ROOM } from '../../ActionTypes';

import { room } from '../../services/room';

const Chanel = ({ createRoom, goToRoom }) => {
  /* Redux */
  const roomStore = useSelector((state) => state.room);
  const dispatch = useDispatch();

  const [isModalVisible, setIsModalVisible] = useState(false);

  const addNewRoom = (roomName) => room.createRoom(roomName)
    .then((newRoom) => {
      dispatch({
        type: PUSH_ROOM,
        payload: newRoom,
      });
      return newRoom;
    });

  const submitNewChanel = (RoomName) => {
    if (RoomName) {
      addNewRoom(RoomName)
        .then((room) => {
          setIsModalVisible(false);
          createRoom(room);
        });
    }
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const chanelClick = (event) => {
    goToRoom(event);
  };

  return (
    <div>
      <div style={{ padding: '10px 16px' }}>
        <Button type="primary" shape="circle" onClick={showModal} icon={<AppstoreAddOutlined />} />
        <Modal
          title="Create new Room"
          visible={isModalVisible}
          onOk={handleOk}
          onCancel={handleCancel}
          footer={[
            <Button key="back" onClick={handleCancel}>
              Cancel
            </Button>,
          ]}
        >
          <NewChanel submitNewChanel={submitNewChanel} />
        </Modal>
      </div>
      <ChatList
        className="chat-list scroll"
        dataSource={roomStore}
        onClick={(event) => chanelClick(event)}
      />
    </div>
  );
};

export default Chanel;
