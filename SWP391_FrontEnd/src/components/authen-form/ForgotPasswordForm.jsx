import React from "react";
import "./forgot.css";
import { Button, Form, Input } from "antd";
import api from "../../configs/axios";
import { toast } from "react-toastify";
// eslint-disable-next-line no-unused-vars
import boxicons from "boxicons";

function ForgotPasswordForm() {
  const onFinish = async (values) => {
    console.log("Success:", values);
    try {
      const response = await api.post("forgot-password", {
        email: values.email,
      });

      console.log(response.data);
      toast.success("Reset password link has been sent to your email!");
    } catch (e) {
      console.log(e);
      toast.error(e.response.data);
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div className="forgot-password-page">
      <h1>Password Reset Request</h1>
      <p>
        Enter your email address below and we will send you a link to reset your
        password.
      </p>
      <Form
        name="forgot"
        layout="vertical"
        wrapperCol={{ span: 24 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item
          name="email"
          rules={[
            { required: true, message: "Please input your email!" },
            { type: "email", message: "The input is not a valid email!" },
          ]}
        >
          <Input
            prefix={<box-icon name="envelope"></box-icon>}
            placeholder="Email"
          />
        </Form.Item>

        <br />
        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Send Password Rest Email
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default ForgotPasswordForm;
