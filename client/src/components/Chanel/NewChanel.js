import React from 'react';
import { Form, Input } from 'antd';

const NewChanel = ({ submitNewChanel }) => {
  const [form] = Form.useForm();

  const onFinish = (values) => {
    submitNewChanel(values.name);
    form.resetFields();
  };

  return (
    <Form onFinish={onFinish}>
      <Form.Item
        label="Room Name"
        name="name"
      >
        <Input />
      </Form.Item>
    </Form>
  );
};
export default NewChanel;
