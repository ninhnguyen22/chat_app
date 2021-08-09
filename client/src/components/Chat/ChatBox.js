import React, { useEffect } from 'react';
import { MessageList } from 'react-chat-elements';

import 'react-chat-elements/dist/main.css';
import { Breadcrumb, Button, Form, Input } from 'antd';
import { SendOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';

const { Search } = Input;

const ChatBox = ({ sendMessage }) => {
  /* Redux */
  const messageStore = useSelector((state) => state.message);
  const crRoomStore = useSelector((state) => state.crRoom);

  const [form] = Form.useForm();
  const myRef = React.createRef();

  useEffect(() => {
    myRef.current.focus();
  }, [crRoomStore._id]);

  const submitMessage = (value) => {
    if (value) {
      sendMessage(crRoomStore._id, value);
      form.resetFields();
      myRef.current.focus();
    }
  };

  return (
    <div>
      <Breadcrumb className="chat-header">
        <Breadcrumb.Item style={{ fontWeight: 'bold' }}>{crRoomStore.title}</Breadcrumb.Item>
      </Breadcrumb>
      <div>
        <MessageList
          className="message-list scroll"
          lockable
          toBottomHeight="100%"
          dataSource={messageStore}
        />
      </div>
      <Form form={form}>
        <Form.Item
          name="message"
        >
          <Search
            placeholder=""
            autoFocus
            ref={myRef}
            enterButton={<Button type="primary" shape="circle" icon={<SendOutlined />} />}
            size="large"
            onSearch={submitMessage}
          />
        </Form.Item>
      </Form>
    </div>
  );
};

export default ChatBox;
