import React from "react";
import { Button, Checkbox, Form, Input } from "antd";
import "./login.css";
import { toast } from "react-toastify";
import api from "../../configs/axios";
import { useDispatch } from "react-redux";
import { login } from "../../redux/features/userSlice";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../configs/routes";
import logo from "../../../image/logo.png";
import { UserOutlined, LockOutlined } from "@ant-design/icons";

function LoginForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onFinish = async (values) => {
    console.log("Success:", values);
    try {
      // values: thông tin người dùng nhập
      const response = await api.post("/login", values);

      // lưu thông tin đăng nhập của ng dùng vào 1 chỗ nào đó mà bất kì đâu cũng có thể sử dụng
      // cái đó dc gọi redux == sesstion bên môn prj

      // dispatch: gửi action đến redux store
      // action: là 1 object có type và payload
      dispatch(login(response.data));
      localStorage.setItem("token", response.data.token);

      const user = response.data;
      if (user.role === 3) {
        navigate(ROUTES.ADMIN_USER);
      } else if (user.role === 1 || user.role === 2) {
        navigate(ROUTES.HOME);
      }
    } catch (e) {
      const message =
        e?.response?.data?.message || e?.response?.data || "Login failed";

      toast.error(message);
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
      <h1>Login to Github</h1>
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
          name="password"
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input.Password prefix={<LockOutlined />} placeholder="Password" />
        </Form.Item>

        <Form.Item>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
            }}
          >
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox style={{ color: "#fff" }}>Remember me</Checkbox>
            </Form.Item>
            <a href="/forgot-password">Forgot Password?</a>
          </div>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Login
          </Button>
        </Form.Item>

        <div style={{ textAlign: "center", color: "white" }}>
          Don’t have an account? <a href="/register">Register</a>
        </div>
      </Form>
    </div>
  );
}

export default LoginForm;
