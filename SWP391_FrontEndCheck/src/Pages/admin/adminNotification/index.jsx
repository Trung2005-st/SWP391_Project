import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import AdminMembership from "./AdminMembership";
import AdminNotificationPage from "./AdminNotification";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AdminNotificationPage />
    </BrowserRouter>
  </StrictMode>
);
