import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import AdminQuitPlan from "./AdminQuitPlan.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AdminQuitPlan />
    </BrowserRouter>
  </StrictMode>
);
