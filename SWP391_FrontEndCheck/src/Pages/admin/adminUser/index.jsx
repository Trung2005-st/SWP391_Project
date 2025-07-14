import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import AdminUser from "./AdminUser.jsx";
import { BrowserRouter } from "react-router-dom";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AdminUser />
    </BrowserRouter>
  </StrictMode>
);
