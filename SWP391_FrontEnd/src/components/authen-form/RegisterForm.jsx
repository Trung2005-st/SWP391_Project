import React from "react";
import "./register.css";
import { Button, Checkbox, Form, Input, Radio } from "antd";
import api from "../../configs/axios";
import { toast } from "react-toastify";
// eslint-disable-next-line no-unused-vars
import boxicons from "boxicons";
import { Navigate, useNavigate } from "react-router-dom";
import { ROUTES } from "../../configs/routes";

function RegisterForm() {
  const navigate = useNavigate();
  const onFinish = async (values) => {
    console.log("Success:", values);

    // 400: bad request
    // 200: success
    try {
      // values: thông tin người dùng nhập
      await api.post("/register", values);
      toast.success("Successfully create new account!");
      navigate(ROUTES.LOGIN);
    } catch (e) {
      console.log(e);
      // show ra màn hình cho người dùng biết lỗi
      toast.error(e.response.data);
    }
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div>
      <h1>Register</h1>
      <Form
        name="basic"
        layout="vertical"
        wrapperCol={{ span: 24 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item
          name="username"
          rules={[{ required: true, message: "Please input your username!" }]}
        >
          <Input
            prefix={<box-icon name="user"></box-icon>}
            placeholder="Username"
          />
        </Form.Item>

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

        <Form.Item
          name="gender"
          label="Gender"
          required={false}
          rules={[{ required: true, message: "Please select your gender!" }]}
        >
          <Radio.Group>
            <Radio value="MALE">Male</Radio>
            <Radio value="FEMALE">Female</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item
          name="password"
          rules={[{ required: true, message: "Please input your password!" }]}
          hasFeedback
        >
          <Input.Password
            prefix={<box-icon name="lock-alt"></box-icon>}
            placeholder="Password"
          />
        </Form.Item>

        <Form.Item
          name="confirm"
          dependencies={["password"]}
          hasFeedback
          rules={[
            { required: true, message: "Please confirm your password!" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error("Passwords do not match!"));
              },
            }),
          ]}
        >
          <Input.Password
            prefix={<box-icon name="lock-alt"></box-icon>}
            placeholder="Password"
          />
        </Form.Item>

        <Form.Item name="remember" valuePropName="checked">
          <Checkbox>Remember me</Checkbox>
        </Form.Item>

        <Form.Item
          name="agreement"
          valuePropName="checked"
          rules={[
            {
              validator: (_, value) =>
                value
                  ? Promise.resolve()
                  : Promise.reject(new Error("You must accept the agreement")),
            },
          ]}
        >
          <Checkbox>
            I confirm that I have carefully read, understood, and agree to abide
            by the
            <a href="/agreement" target="_blank" rel="noopener noreferrer">
              {" "}
              agreement
            </a>
            .
          </Checkbox>
        </Form.Item>
        <br />
        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Register
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default RegisterForm;
