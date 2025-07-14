import React, { useState, useEffect } from "react";
import "./register.css";
import { Button, Form, Input } from "antd";
import api from "../../configs/axios";
import { toast } from "react-toastify";
import logo from "../../../image/logo.png";
import { useNavigate, useLocation } from "react-router-dom";
import { ROUTES } from "../../configs/routes";

function VerifyUser() {
  const navigate = useNavigate();
  const location = useLocation();
  const email =
    location.state?.email || sessionStorage.getItem("registerEmail");

  const cameFromRegister = location.state?.from === "register";
  const sessionAllowed =
    sessionStorage.getItem("canAccessVerifyUser") === "true";

  useEffect(() => {
    if (!email || !cameFromRegister || !sessionAllowed) {
      toast.error("Access denied. Please register first.");
      navigate(ROUTES.REGISTER);
    }
  }, [email, cameFromRegister, sessionAllowed, navigate]);

  if (!email || !cameFromRegister || !sessionAllowed) return null;

  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const payload = { email, otp: values.otp };
      const res = await api.post("register/verify", payload);
      toast.success(res.data || "Account verified successfully!");
      sessionStorage.removeItem("canAccessVerifyUser"); // ✅ remove after success
      navigate(ROUTES.LOGIN);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data || "Verification failed!");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email) {
      toast.error("Missing email. Please register again.");
      return;
    }

    setResending(true);
    try {
      await api.post(`/register/resend-otp?email=${encodeURIComponent(email)}`);
      toast.success("OTP resent successfully!");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data || "Failed to resend OTP.");
    } finally {
      setResending(false);
    }
  };

  return (
    <div>
      <div className="logo">
        <div className="logo-circle">
          <img src={logo} alt="QuitHub Logo" className="logo-icon" />
        </div>
        <span className="logo-text">QuitHub</span>
      </div>

      <h1>Verify Account</h1>
      <p style={{ color: "white", textAlign: "center" }}>
        We’ve sent a verification code to <b>{email}</b>
      </p>
      <br />
      <Form
        form={form}
        name="verify"
        layout="vertical"
        onFinish={onFinish}
        autoComplete="off"
      >
        <Form.Item
          name="otp"
          rules={[
            { required: true, message: "Please enter the verification code!" },
          ]}
        >
          <Input
            prefix={<i className="bx bx-lock-alt"></i>}
            placeholder="Verification Code"
          />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block loading={loading}>
            Verify
          </Button>
        </Form.Item>

        <div style={{ color: "white", textAlign: "center" }}>
          Didn’t receive a code?{" "}
          <Button
            type="link"
            onClick={handleResend}
            loading={resending}
            className="resend-button"
            style={{ padding: 0 }}
          >
            Resend
          </Button>
        </div>
      </Form>
    </div>
  );
}

export default VerifyUser;
