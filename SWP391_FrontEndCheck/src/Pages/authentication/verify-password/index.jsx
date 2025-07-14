import React from "react";
import AuthenTemplate from "../../../components/authen-template";
import { useLocation } from "react-router-dom";

function VerifyPasswordPage() {
  const location = useLocation();
  const email = location.state?.email;

  return <AuthenTemplate page="verifyPassword" email={email} />;
}

export default VerifyPasswordPage;