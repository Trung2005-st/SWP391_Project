import React from "react";
import AuthenTemplate from "../../../components/authen-template";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { ROUTES } from "../../../configs/routes";

function VerifyUserPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const email =
    location.state?.email || sessionStorage.getItem("registerEmail");

  if (!email) {
    toast.error("Missing email. Please register again.");
    navigate(ROUTES.REGISTER);
    return null;
  }

  return <AuthenTemplate page="verifyUser" email={email} />;
}

export default VerifyUserPage;
