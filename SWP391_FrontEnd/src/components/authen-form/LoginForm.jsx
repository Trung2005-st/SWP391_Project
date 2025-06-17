import React from "react";
import { Button, Checkbox, Form, Input } from "antd";
import "./login.css";
import { toast } from "react-toastify";
import api from "../../configs/axios";
import { useDispatch } from "react-redux";
import { login } from "../../redux/features/userSlice";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../configs/routes";

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

      const user = response.data;
      if (user.role === 3) {
        navigate(ROUTES.ADMIN_USER);
      } else if (user.role === 1 || user.role === 2) {
        navigate(ROUTES.HOME);
      }
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
      <h1>Login</h1>
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
            prefix={<box-icon name="user" type="solid" />}
            placeholder="Username"
          />
        </Form.Item>
        <br />
        <Form.Item
          name="password"
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input.Password
            prefix={<box-icon name="lock-alt" type="solid"></box-icon>}
            placeholder="Password"
          />
        </Form.Item>

        <Form.Item>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox>Remember me</Checkbox>
            </Form.Item>
            <a href="/forgot-password">Forgot Password?</a>
          </div>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Login
          </Button>
        </Form.Item>

        <div style={{ textAlign: "center" }}>
          Don’t have an account? <a href="/register">Register</a>
        </div>
      </Form>
    </div>
  );
}

export default LoginForm;
