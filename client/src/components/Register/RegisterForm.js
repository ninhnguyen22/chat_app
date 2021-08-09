import React from 'react';
import { Form, Input, Button, Upload } from 'antd';
import { useHistory } from 'react-router-dom';
import { UserOutlined, LockOutlined, UploadOutlined } from '@ant-design/icons';

import { auth } from '../../services/auth';

export default function RegisterForm() {
  const history = useHistory();
  const [form] = Form.useForm();

  const onFinish = (values) => {
    if (values.avatar && values.avatar.length > 0) {
      values.avatar = values.avatar[0].originFileObj;
    }
    const formData = new FormData();
    formData.append('name', values.name);
    formData.append('password', values.password);
    formData.append('avatar', values.avatar);

    auth.register(formData)
      .then((res) => {
        console.log(res);
        if (res.status) {
          history.replace('/');
        }
      })
      .catch((err) => {
        console.log('Failed:', err);
        form.resetFields();
      });
  };

  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  const dummyRequest = ({ file, onSuccess }) => {
    setTimeout(() => {
      onSuccess('OK');
    }, 0);
  };

  return (
    <Form
      name="basic"
      form={form}
      className="register-form"
      initialValues={{
        remember: true,
      }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
    >
      <Form.Item
        placeholder="Username"
        name="name"
        rules={[
          {
            required: true,
            message: 'Please input your username!',
          },
        ]}
      >
        <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
      </Form.Item>

      <Form.Item
        name="password"
        rules={[
          {
            required: true,
            message: 'Please input your password!',
          },
        ]}
      >
        <Input.Password prefix={<LockOutlined className="site-form-item-icon" />} placeholder="Password" />
      </Form.Item>

      <Form.Item
        name="confirm"
        dependencies={['password']}
        hasFeedback
        rules={[
          {
            required: true,
            message: 'Please confirm your password!',
          },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('password') === value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error('The two passwords that you entered do not match!'));
            },
          }),
        ]}
      >
        <Input.Password prefix={<LockOutlined className="site-form-item-icon" />} placeholder="Confirm Password" />
      </Form.Item>

      <Form.Item
        name="avatar"
        valuePropName="fileList"
        getValueFromEvent={normFile}
        extra=""
      >
        <Upload name="avatar" maxCount="1" customRequest={dummyRequest} listType="picture">
          <Button icon={<UploadOutlined />}>Upload avatar</Button>
        </Upload>
      </Form.Item>

      <Form.Item>
        <a className="register-link" href="/login">
          Login now!
        </a>
      </Form.Item>

      <Form.Item
        wrapperCol={{
          offset: 8,
          span: 16,
        }}
      >
        <Button type="primary" htmlType="submit">
          Register
        </Button>
      </Form.Item>
    </Form>
  );
}

