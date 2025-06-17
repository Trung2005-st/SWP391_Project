import React from "react";
import "./index.css";
import LoginForm from "../authen-form/LoginForm";
import RegisterForm from "../authen-form/RegisterForm";
import ForgotPasswordForm from "../authen-form/ForgotPasswordForm";
import ResetPasswordForm from "../authen-form/ResetPassword";

function AuthenTemplate({ page }) {
  return (
    <div className="authen-template">
      <div className="authen-template_form">
        {page === "login" && <LoginForm />}
        {page === "register" && <RegisterForm />}
        {page === "forgot-password" && <ForgotPasswordForm />}
        {page === "reset-password" && <ResetPasswordForm />}
      </div>
    </div>
  );
}

export default AuthenTemplate;
