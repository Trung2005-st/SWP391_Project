import React, { useState, useEffect } from "react";
import "./register.css";
import { Button, Form, Input } from "antd";
import api from "../../configs/axios";
import { toast } from "react-toastify";
import logo from "../../../image/logo.png";
import { useNavigate, useLocation } from "react-router-dom";
import { ROUTES } from "../../configs/routes";

function VerifyPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;
  const cameFromForgot = location.state?.from === "forgot-password";
  const sessionAllowed = sessionStorage.getItem("resetEmail") === email;
  useEffect(() => {
    if (!email || !cameFromForgot || !sessionAllowed) {
      toast.error("Access denied. Please start from Forgot Password.");
      navigate(ROUTES.FORGOT_PASSWORD);
    }
  }, [email, cameFromForgot, sessionAllowed]);

  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const payload = { email, otp: values.otp };
      const res = await api.post("/verify-otp", payload);
      const resetToken = res.data
        .replace("OTP Verified successfully, Reset Token: ", "")
        .trim();

      toast.success("OTP verified! Proceed to reset password.");
      navigate(`/reset-password/${resetToken}`);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data || "OTP verification failed!");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email) {
      toast.error("Missing email. Please start from Forgot Password.");
      return;
    }

    setResending(true);
    try {
      await api.post("/forgot-password", { email });
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

      <h1>Verify OTP for Password Reset</h1>
      <p style={{ color: "white", textAlign: "center" }}>
        We've sent a verification code to <b>{email}</b>
      </p>

      <br />
      <Form
        form={form}
        name="verify-password"
        layout="vertical"
        onFinish={onFinish}
        autoComplete="off"
      >
        <Form.Item
          name="otp"
          rules={[{ required: true, message: "Please input your OTP!" }]}
        >
          <Input
            prefix={<i className="bx bx-lock-alt"></i>}
            placeholder="OTP Code"
          />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block loading={loading}>
            Verify OTP
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

export default VerifyPassword;
