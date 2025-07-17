import { StrictMode } from "react";
import { BrowserRouter } from "react-router-dom";
import ProfilePage from "../profile";
import NotificationPage from "./notification";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <NotificationPage />
    </BrowserRouter>
  </StrictMode>
);
