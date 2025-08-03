import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import AdminCoachProfile from "./AdminCoachProfile.jsx";
import { BrowserRouter } from "react-router-dom";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AdminCoachProfile />
    </BrowserRouter>
  </StrictMode>
);
