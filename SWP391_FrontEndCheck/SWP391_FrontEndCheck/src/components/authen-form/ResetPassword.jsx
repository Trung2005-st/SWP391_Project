import React, { useEffect, useState, useRef } from "react";
import "./reset.css";
import { Button, Form, Input } from "antd";
import api from "../../configs/axios";
import { toast } from "react-toastify";
import { useNavigate, useSearchParams } from "react-router-dom";
import logo from "../../../image/logo.png";
// eslint-disable-next-line no-unused-vars
import boxicons from "boxicons";
import { useParams } from "react-router-dom";
import { ROUTES } from "../../configs/routes";

function ResetPasswordForm() {
  const { token } = useParams();
  const navigate = useNavigate();
  const hasRedirected = useRef(false);

  useEffect(() => {
    if (!token && !hasRedirected.current) {
      toast.error("Missing or invalid token.");
      navigate(ROUTES.LOGIN);
      hasRedirected.current = true;
    }
  }, [token, navigate]);

  if (!token) return null;

  const onFinish = async (values) => {
    try {
      const payload = {
        password: values.password,
        resetToken: token, // ✅ add token from URL
      };

      await api.post("/reset-password", payload);

      toast.success("Password reset successfully!");
      navigate(ROUTES.LOGIN);
    } catch (error) {
      toast.error(error.response?.data || "Failed to reset password.");
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
      <h1>Create New Password</h1>
      <Form
        name="reset"
        layout="vertical"
        wrapperCol={{ span: 24 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item
          name="password"
          rules={[
            { required: true, message: "Please input your new password!" },
          ]}
          hasFeedback
        >
          <Input.Password
            prefix={<box-icon name="lock-alt"></box-icon>}
            placeholder="New Password"
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
            placeholder="Confirm Password"
          />
        </Form.Item>

        <br />
        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Create
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default ResetPasswordForm;
