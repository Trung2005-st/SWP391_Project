import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import AdminCoachRegister from "./AdminCoachRegister.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AdminCoachRegister />
    </BrowserRouter>
  </StrictMode>
);
