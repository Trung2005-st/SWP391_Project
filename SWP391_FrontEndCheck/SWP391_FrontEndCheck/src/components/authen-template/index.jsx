import React from "react";
import "./index.css";
import LoginForm from "../authen-form/LoginForm";
import RegisterForm from "../authen-form/RegisterForm";
import ForgotPasswordForm from "../authen-form/ForgotPasswordForm";
import ResetPasswordForm from "../authen-form/ResetPassword";
import VerifyUser from "../authen-form/VerifyUser";
import VerifyPassword from "../authen-form/VerifyPassword";

function AuthenTemplate({ page }) {
  return (
    <div className="authen-template">
      <div className="authen-template_form">
        {page === "login" && <LoginForm />}
        {page === "register" && <RegisterForm />}
        {page === "verifyUser" && <VerifyUser />}
        {page === "verifyPassword" && <VerifyPassword />}
        {page === "forgot-password" && <ForgotPasswordForm />}
        {page === "reset-password" && <ResetPasswordForm />}
      </div>
    </div>
  );
}

export default AuthenTemplate;
