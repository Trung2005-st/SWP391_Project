import React, { useState, useEffect } from "react";
import "./register.css";
import { Button, Checkbox, Form, Input, Radio } from "antd";
import api from "../../configs/axios";
import { toast } from "react-toastify";
import logo from "../../../image/logo.png";
import { UserOutlined, MailOutlined, LockOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

function RegisterForm() {
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      await api.post("/register", values);
      toast.success("OTP verification sent to your email!");

      sessionStorage.setItem("registerEmail", values.email);
      sessionStorage.setItem("canAccessVerifyUser", "true");
      navigate(`/verifyUser/${values.email}`, {
        state: { from: "register" },
      });
    } catch (e) {
      console.error(e);
      toast.error(
        e.response?.data?.message || e.response?.data || "Registration failed!"
      );
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div>
      <div className="logo">
        <div className="logo-circle">
          <img src={logo} alt="QuitHub Logo" className="logo-icon" />
        </div>
        <span className="logo-text">QuitHub</span>
      </div>
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
          <Input prefix={<UserOutlined />} placeholder="Username" />
        </Form.Item>

        <Form.Item
          name="email"
          rules={[
            { required: true, message: "Please input your email!" },
            { type: "email", message: "The input is not a valid email!" },
          ]}
        >
          <Input prefix={<MailOutlined />} placeholder="Email" />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[{ required: true, message: "Please input your password!" }]}
          hasFeedback
        >
          <Input.Password prefix={<LockOutlined />} placeholder="Password" />
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
            prefix={<LockOutlined />}
            placeholder="Confirm Password"
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Register
          </Button>
        </Form.Item>
        <div style={{ color: "white", textAlign: "center" }}>
          Already have the Account? <a href="/login">Login</a>
        </div>
      </Form>
    </div>
  );
}

export default RegisterForm;
