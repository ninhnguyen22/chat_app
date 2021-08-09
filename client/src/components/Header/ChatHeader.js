import React from 'react';
import { Avatar, Button, Dropdown, Layout, Menu } from 'antd';
import { LoginOutlined, WechatOutlined } from '@ant-design/icons';
import config from '../../config/app';
import { auth } from '../../services/auth';

const { Header } = Layout;

const logout = () => {
  auth.logout();
  window.location.reload(false);
};

const authMenu = (
  <Menu>
    <Menu.Item onClick={logout}>
      Logout
      <Button size="small" shape="circle" onClick={logout} icon={<LoginOutlined />} />
    </Menu.Item>
  </Menu>
);

const ChatHeader = () => (
  <Header
    className="header"
    style={{
      background: '#fff',
      position: 'fixed',
      zIndex: 1,
      width: '100%',
      boxShadow: '0 4px 6px 0 #d9d9d9',
    }}
  >
    <Menu mode="horizontal" defaultSelectedKeys={['2']}>
      <Menu.Item key="1" icon={<WechatOutlined />}>Chat Room</Menu.Item>
      <Menu.Item key="2">
        <Dropdown overlay={authMenu}>
          <Avatar
            preview="false"
            className="ant-dropdown-link"
            onClick={(e) => e.preventDefault()}
            src={config.API_ENDPOINT + auth.currentUser.avatar}
          />
        </Dropdown>
      </Menu.Item>
    </Menu>
  </Header>
);

export default ChatHeader;
