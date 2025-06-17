import React, { useEffect, useState } from "react";
import "./reset.css";
import { Button, Form, Input } from "antd";
import api from "../../configs/axios";
import { toast } from "react-toastify";
import { useNavigate, useSearchParams } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import boxicons from "boxicons";
import { ROUTES } from "../../configs/routes";

function ResetPasswordForm() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [token, setToken] = useState("");

  useEffect(() => {
    const tokenFromURL = searchParams.get("token");
    if (tokenFromURL) {
      setToken(tokenFromURL);
    } else {
      toast.error("Invalid or missing token");
      navigate(ROUTES.LOGIN);
    }
  }, [searchParams, navigate]);

  const onFinish = async (values) => {
    console.log("Success:", values);

    try {
      const response = await api.post("reset-password", {
        token: token,
        newPassword: values.password,
      });

      console.log(response.data); // you can inspect response if needed

      toast.success("Password has been reset successfully!");
      navigate(ROUTES.LOGIN);
    } catch (e) {
      console.log(e);
      toast.error(e.response.data);
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div>
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
