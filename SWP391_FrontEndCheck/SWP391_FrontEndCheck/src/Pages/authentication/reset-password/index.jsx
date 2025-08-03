import React from "react";
import AuthenTemplate from "../../../components/authen-template";
import { useParams } from "react-router-dom";

function ResetPasswordPage() {
  const { token } = useParams();
  return <AuthenTemplate page="reset-password" token={token} />;
}

export default ResetPasswordPage;
